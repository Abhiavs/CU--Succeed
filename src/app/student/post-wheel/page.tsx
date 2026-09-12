"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

import {
  Compass,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
  BarChart3,
  Award,
} from "lucide-react";

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

type WheelDimension = {
  id: string;
  name: string;
  description?: string;
  benchmark?: number;
};

export default function PostAssessmentWheelPage() {
  const router = useRouter();

  /*
   * ============================================================
   * STATE
   * ============================================================
   */

  const [dimensions, setDimensions] = useState<WheelDimension[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [activeDimension, setActiveDimension] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  /*
   * ============================================================
   * LOAD POST DIMENSIONS
   * ============================================================
   */

  useEffect(() => {
    const loadWheelData = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        /*
         * Load POST dimensions configured by administrator
         */
        const dimensionResponse = await fetch("/api/wheel/dimensions?type=POST");
        const dimensionData = await dimensionResponse.json();

        if (!dimensionResponse.ok) {
          throw new Error(
            dimensionData.error || "Unable to load post assessment wheel dimensions."
          );
        }

        let loadedDimensions: WheelDimension[] = dimensionData.dimensions || [];

        // If no POST-specific dimensions exist yet, fallback to PRE dimensions so students always have a functional wheel
        if (!Array.isArray(loadedDimensions) || loadedDimensions.length === 0) {
          const fallbackRes = await fetch("/api/wheel/dimensions?type=PRE");
          const fallbackData = await fallbackRes.json();
          if (fallbackRes.ok && Array.isArray(fallbackData.dimensions) && fallbackData.dimensions.length > 0) {
            loadedDimensions = fallbackData.dimensions;
          }
        }

        setDimensions(loadedDimensions);

        /*
         * Create initial ratings (default score = 1 or benchmark baseline)
         */
        const initialRatings: Record<string, number> = {};
        loadedDimensions.forEach((dimension: WheelDimension) => {
          initialRatings[dimension.id] = 1;
        });

        /*
         * Load previous POST wheel data if student already submitted
         */
        try {
          const wheelResponse = await fetch("/api/wheel?type=POST");
          const wheelData = await wheelResponse.json();

          if (
            wheelResponse.ok &&
            wheelData.dimensions &&
            typeof wheelData.dimensions === "object"
          ) {
            Object.entries(wheelData.dimensions).forEach(([key, value]) => {
              initialRatings[key] = Number(value) || 1;
            });
          }
        } catch {
          // Ignore existing score load error
        }

        setRatings(initialRatings);

        if (loadedDimensions.length > 0) {
          setActiveDimension(loadedDimensions[0].id);
        }
      } catch (error) {
        console.error("Failed to load post wheel:", error);
        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load post competency wheel."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWheelData();
  }, []);

  /*
   * ============================================================
   * UPDATE RATING
   * ============================================================
   */

  const handleSliderChange = (dimensionId: string, value: number[]) => {
    setRatings((previous) => ({
      ...previous,
      [dimensionId]: value[0],
    }));
    setActiveDimension(dimensionId);
  };

  /*
   * ============================================================
   * SCORE CALCULATIONS
   * ============================================================
   */

  const totalScore = dimensions.reduce(
    (total, dimension) => total + (ratings[dimension.id] || 0),
    0
  );

  const averageScore =
    dimensions.length > 0
      ? (totalScore / dimensions.length).toFixed(1)
      : "0.0";

  const completedDimensions = dimensions.filter(
    (dimension) => ratings[dimension.id] > 0
  ).length;

  const completionPercentage =
    dimensions.length > 0
      ? Math.round((completedDimensions / dimensions.length) * 100)
      : 0;

  /*
   * ============================================================
   * RADAR SETTINGS & MATH
   * ============================================================
   */

  const center = 160;
  const maxRadius = 108;
  const numPoints = dimensions.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = ((Math.PI * 2) / numPoints) * index - Math.PI / 2;
    const radius = (value / 10) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  /*
   * ============================================================
   * RADAR POLYGONS
   * ============================================================
   */

  const studentPoints = dimensions
    .map((dimension, index) => {
      const value = ratings[dimension.id] || 1;
      const { x, y } = getCoordinates(index, value);
      return `${x},${y}`;
    })
    .join(" ");

  const benchmarkPoints = dimensions
    .map((dimension, index) => {
      const value = dimension.benchmark || 8.5;
      const { x, y } = getCoordinates(index, value);
      return `${x},${y}`;
    })
    .join(" ");

  /*
   * ============================================================
   * ACTIVE DIMENSION
   * ============================================================
   */

  const selectedDimension =
    dimensions.find((dimension) => dimension.id === activeDimension) ||
    dimensions[0];

  /*
   * ============================================================
   * SUBMIT POST WHEEL
   * ============================================================
   */

  const handleSubmitWheel = async () => {
    if (dimensions.length === 0) return;

    setIsSaving(true);

    try {
      const response = await fetch("/api/wheel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dimensions: ratings,
          type: "POST",
          year: new Date().getFullYear().toString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Post Wheel submission failed:", data);
        alert(data.error || "Unable to save your post assessment competency wheel.");
        setIsSaving(false);
        return;
      }

      setSaveSuccess(true);

      // Navigate to assessment completion / results
      router.replace(data.redirectUrl || "/student/assessment-complete");
      router.refresh();
    } catch (error) {
      console.error("Post Wheel submission error:", error);
      alert("Something went wrong while saving your post assessment.");
      setIsSaving(false);
    }
  };

  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-100">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Preparing Your Post-Assessment Wheel
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Loading outcome competency dimensions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * ERROR STATE
   * ============================================================
   */

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center px-4 text-slate-100">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900">
          <CardContent className="p-8 text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Compass className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Unable to Load Post Assessment Wheel
              </h2>
              <p className="text-sm text-slate-400 mt-2">{loadError}</p>
            </div>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * ============================================================
   * NO DIMENSIONS STATE
   * ============================================================
   */

  if (dimensions.length === 0) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center px-4 text-slate-100">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900">
          <CardContent className="p-8 text-center space-y-4">
            <Compass className="w-10 h-10 mx-auto text-slate-600" />
            <h2 className="text-lg font-bold text-white">
              No Dimensions Available
            </h2>
            <p className="text-sm text-slate-400">
              The administrator has not configured any competency dimensions for the Post Assessment wheel yet.
            </p>
            <Button onClick={() => router.push("/student")} variant="outline">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * ============================================================
   * MAIN PAGE RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100">
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[140px]" />
      </div>

      {/* HEADER */}
      <header className="relative border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-sky-400" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-white">CU Succeed</h1>
                <Badge className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  POST-ASSESSMENT
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Outcome Competency Wheel Evaluation
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <div className="px-3 py-2 rounded-lg border border-slate-800 bg-slate-900">
              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Post-Assessment Average
              </div>
              <div className="text-sm font-bold text-sky-400">
                {averageScore}
                <span className="text-slate-500 text-xs"> / 10</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* INTRO TITLE */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sky-400 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-4 h-4" />
            Post-Program Skill Mastery & Growth
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Rate Your Post-Program Competencies
          </h2>

          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Evaluate your demonstrated growth and current capability across each
            competency dimension. Your responses establish your final outcome competency profile.
          </p>
        </div>

        {/* TWO-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* RADAR SECTION */}
          <div className="lg:col-span-5 space-y-5">
            <Card className="border-slate-800 bg-slate-900/90 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-sky-400" />
                      <h3 className="font-semibold text-white">
                        Post-Assessment Radar
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Your outcome wheel updates in real time.
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-sky-400 border-sky-500/30">
                    LIVE RADAR
                  </Badge>
                </div>

                {/* RADAR SVG */}
                <div className="max-w-[360px] mx-auto">
                  <svg viewBox="0 0 320 320" className="w-full h-full">
                    {/* GRID RINGS */}
                    {[2, 4, 6, 8, 10].map((value) => {
                      const radius = (value / 10) * maxRadius;
                      return (
                        <circle
                          key={value}
                          cx={center}
                          cy={center}
                          r={radius}
                          fill="none"
                          stroke="rgba(148,163,184,0.14)"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* SPOKES */}
                    {dimensions.map((_, index) => {
                      const { x, y } = getCoordinates(index, 10);
                      return (
                        <line
                          key={index}
                          x1={center}
                          y1={center}
                          x2={x}
                          y2={y}
                          stroke="rgba(148,163,184,0.14)"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* BENCHMARK TARGET POLYGON */}
                    <polygon
                      points={benchmarkPoints}
                      fill="rgba(59,130,246,0.05)"
                      stroke="rgba(96,165,250,0.8)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />

                    {/* STUDENT RATING POLYGON */}
                    <polygon
                      points={studentPoints}
                      fill="rgba(6,182,212,0.20)"
                      stroke="#22d3ee"
                      strokeWidth="2"
                    />

                    {/* INTERACTIVE POINTS */}
                    {dimensions.map((dimension, index) => {
                      const score = ratings[dimension.id] || 1;
                      const { x, y } = getCoordinates(index, score);
                      const selected = activeDimension === dimension.id;

                      return (
                        <circle
                          key={dimension.id}
                          cx={x}
                          cy={y}
                          r={selected ? 5 : 3.5}
                          fill={selected ? "#22d3ee" : "#f8fafc"}
                          stroke="#0f172a"
                          strokeWidth="2"
                          className="cursor-pointer transition-transform hover:scale-125"
                          onClick={() => setActiveDimension(dimension.id)}
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* LEGEND */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <span className="text-slate-300">Your Post Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 border-t border-dashed border-blue-400" />
                    <span className="text-slate-400">Target Benchmark</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SELECTED DIMENSION CARD */}
            {selectedDimension && (
              <Card className="border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-transparent">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-sky-400" />
                        <h3 className="font-semibold text-white">
                          {selectedDimension.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {selectedDimension.description ||
                          "Rate your current level of confidence, capability, and mastery in this dimension."}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-center">
                      <div className="text-2xl font-bold text-sky-400">
                        {ratings[selectedDimension.id] || 1}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">
                        Score
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* SLIDERS SECTION */}
          <div className="lg:col-span-7">
            <Card className="border-slate-800 bg-slate-900/90 shadow-xl">
              <CardContent className="p-6 sm:p-7">
                {/* SLIDERS HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-lg text-white">
                      Post-Assessment Ratings
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Move each slider from{" "}
                      <strong className="text-slate-300">1</strong> to{" "}
                      <strong className="text-slate-300">10</strong> to capture
                      your post-program competency level.
                    </p>
                  </div>

                  <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-right">
                    <div className="text-[10px] uppercase text-slate-500">
                      Overall Average
                    </div>
                    <div className="text-lg font-bold text-sky-400">
                      {averageScore}
                      <span className="text-xs text-slate-500"> / 10</span>
                    </div>
                  </div>
                </div>

                {/* DIMENSIONS SLIDERS LIST */}
                <div className="mt-5 space-y-3">
                  {dimensions.map((dimension, index) => {
                    const score = ratings[dimension.id] || 1;
                    const selected = activeDimension === dimension.id;

                    return (
                      <div
                        key={dimension.id}
                        onMouseEnter={() => setActiveDimension(dimension.id)}
                        onClick={() => setActiveDimension(dimension.id)}
                        className={`rounded-xl border p-4 transition-all cursor-pointer ${
                          selected
                            ? "border-sky-500/40 bg-sky-500/5"
                            : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                                  selected
                                    ? "bg-sky-500 text-slate-950"
                                    : "bg-slate-800 text-slate-400"
                                }`}
                              >
                                {index + 1}
                              </span>

                              <div>
                                <h4 className="text-sm font-semibold text-white">
                                  {dimension.name}
                                </h4>
                                {dimension.description && (
                                  <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[350px]">
                                    {dimension.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <div className="text-sm font-bold text-white">
                              {score}
                              <span className="text-slate-500">/10</span>
                            </div>
                            {dimension.benchmark && (
                              <div className="text-[10px] text-blue-400 mt-1">
                                Target {dimension.benchmark}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* SLIDER COMPONENT */}
                        <div className="mt-4 px-1">
                          <Slider
                            value={[score]}
                            min={1}
                            max={10}
                            step={1}
                            onValueChange={(value) =>
                              handleSliderChange(dimension.id, value)
                            }
                          />

                          <div className="flex justify-between text-[9px] text-slate-600 mt-2">
                            <span>Foundational</span>
                            <span>Developing</span>
                            <span>Mastery</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SUBMIT BUTTON */}
                <div className="mt-7 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      <span>
                        {dimensions.length} post competency dimensions configured.
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmitWheel}
                    disabled={isSaving}
                    className="h-11 px-7 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Post Assessment...
                      </>
                    ) : saveSuccess ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Post Assessment Completed
                      </>
                    ) : (
                      <>
                        Complete Post-Assessment
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative border-t border-slate-800/60 py-5 text-center text-[10px] text-slate-600">
        CU Succeed • Post-Assessment Competency System
      </footer>
    </div>
  );
}

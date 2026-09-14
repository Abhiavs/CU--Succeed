"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useIsDark } from "@/lib/useIsDark";

import {
  Compass,
  CheckCircle2,
  Loader2,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react";
import { Logo } from "@/components/Logo";

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

export default function WheelOfCompetenciesPage() {
  const isDark = useIsDark();
  const router = useRouter();

  /*
   * ============================================================
   * STATE
   * ============================================================
   */

  const [dimensions, setDimensions] =
    useState<WheelDimension[]>([]);

  const [ratings, setRatings] =
    useState<Record<string, number>>({});

  const [activeDimension, setActiveDimension] =
    useState<string>("");

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveSuccess, setSaveSuccess] =
    useState(false);

  /*
   * ============================================================
   * LOAD DIMENSIONS
   * ============================================================
   */

  useEffect(() => {
    const loadWheelData = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        /*
         * Load dimensions managed by admin
         */

        const dimensionResponse =
          await fetch(
            "/api/wheel/dimensions?type=PRE"
          );

        const dimensionData =
          await dimensionResponse.json();

        if (!dimensionResponse.ok) {
          throw new Error(
            dimensionData.error ||
              "Unable to load wheel dimensions."
          );
        }

        const loadedDimensions =
          dimensionData.dimensions || [];

        if (
          !Array.isArray(
            loadedDimensions
          )
        ) {
          throw new Error(
            "Invalid wheel dimensions."
          );
        }

        setDimensions(
          loadedDimensions
        );

        /*
         * Create initial ratings
         */

        const initialRatings:
          Record<string, number> = {};

        loadedDimensions.forEach(
          (dimension: WheelDimension) => {
            initialRatings[
              dimension.id
            ] = 1;
          }
        );

        /*
         * Load previous wheel data
         */

        try {
          const wheelResponse =
            await fetch("/api/wheel");

          const wheelData =
            await wheelResponse.json();

          if (
            wheelResponse.ok &&
            wheelData.dimensions &&
            typeof wheelData.dimensions ===
              "object"
          ) {
            Object.entries(
              wheelData.dimensions
            ).forEach(
              ([key, value]) => {
                initialRatings[key] =
                  Number(value) || 1;
              }
            );
          }
        } catch {
          /*
           * Ignore existing score errors.
           */
        }

        setRatings(
          initialRatings
        );

        if (
          loadedDimensions.length > 0
        ) {
          setActiveDimension(
            loadedDimensions[0].id
          );
        }
      } catch (error) {
        console.error(
          "Failed to load wheel:",
          error
        );

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load competency wheel."
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

  const handleSliderChange = (
    dimensionId: string,
    value: number[]
  ) => {
    setRatings((previous) => ({
      ...previous,

      [dimensionId]:
        value[0],
    }));

    setActiveDimension(
      dimensionId
    );
  };

  /*
   * ============================================================
   * SCORE CALCULATIONS
   * ============================================================
   */

  const totalScore =
    dimensions.reduce(
      (total, dimension) =>
        total +
        (ratings[
          dimension.id
        ] || 0),
      0
    );

  const averageScore =
    dimensions.length > 0
      ? (
          totalScore /
          dimensions.length
        ).toFixed(1)
      : "0.0";

  const completedDimensions =
    dimensions.filter(
      (dimension) =>
        ratings[dimension.id] > 0
    ).length;

  const completionPercentage =
    dimensions.length > 0
      ? Math.round(
          (completedDimensions /
            dimensions.length) *
            100
        )
      : 0;

  /*
   * ============================================================
   * RADAR SETTINGS
   * ============================================================
   */

  const center = 160;

  const maxRadius = 108;

  const numPoints =
    dimensions.length;

  const getCoordinates = (
    index: number,
    value: number
  ) => {
    const angle =
      (
        (Math.PI * 2) /
        numPoints
      ) *
        index -
      Math.PI / 2;

    const radius =
      (value / 10) *
      maxRadius;

    return {
      x:
        center +
        radius *
          Math.cos(angle),

      y:
        center +
        radius *
          Math.sin(angle),
    };
  };

  /*
   * ============================================================
   * RADAR POLYGONS
   * ============================================================
   */

  const studentPoints =
    dimensions
      .map(
        (
          dimension,
          index
        ) => {
          const value =
            ratings[
              dimension.id
            ] || 1;

          const { x, y } =
            getCoordinates(
              index,
              value
            );

          return `${x},${y}`;
        }
      )
      .join(" ");

  const benchmarkPoints =
    dimensions
      .map(
        (
          dimension,
          index
        ) => {
          const value =
            dimension.benchmark || 8;

          const { x, y } =
            getCoordinates(
              index,
              value
            );

          return `${x},${y}`;
        }
      )
      .join(" ");

  /*
   * ============================================================
   * ACTIVE DIMENSION
   * ============================================================
   */

  const selectedDimension =
    dimensions.find(
      (dimension) =>
        dimension.id ===
        activeDimension
    ) || dimensions[0];

  /*
   * ============================================================
   * SUBMIT WHEEL
   * ============================================================
   */

  const handleSubmitWheel =
    async () => {
      if (
        dimensions.length === 0
      ) {
        return;
      }

      setIsSaving(true);

      try {
        const response =
          await fetch(
            "/api/wheel",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  dimensions:
                    ratings,

                  type:
                    "PRE",

                  year:
                    new Date()
                      .getFullYear()
                      .toString(),
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          console.error(
            "Wheel submission failed:",
            data
          );

          alert(
            data.error ||
              "Unable to save your competency wheel."
          );

          setIsSaving(false);

          return;
        }

        setSaveSuccess(true);

        /*
         * Prevent returning to the wheel
         */

        router.replace(
          data.redirectUrl ||
            "/student/assessment-complete"
        );

        router.refresh();
      } catch (error) {
        console.error(
          "Wheel submission error:",
          error
        );

        alert(
          "Something went wrong while saving your assessment."
        );

        setIsSaving(false);
      }
    };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">

        <div className="text-center space-y-4">

          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">

            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />

          </div>

          <div>

            <h2 className="text-lg font-bold text-white">
              Preparing Your Competency Wheel
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Loading your assessment dimensions...
            </p>

          </div>

        </div>

      </div>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-slate-100">

        <Card className="w-full max-w-md border-slate-800 bg-slate-900">

          <CardContent className="p-8 text-center space-y-5">

            <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">

              <Compass className="w-6 h-6 text-red-400" />

            </div>

            <div>

              <h2 className="text-lg font-bold text-white">
                Unable to Load Wheel
              </h2>

              <p className="text-sm text-slate-400 mt-2">
                {loadError}
              </p>

            </div>

            <Button
              onClick={() =>
                window.location.reload()
              }
            >
              Try Again
            </Button>

          </CardContent>

        </Card>

      </div>
    );
  }

  /*
   * ============================================================
   * NO DIMENSIONS
   * ============================================================
   */

  if (
    dimensions.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 text-slate-100">

        <Card className="w-full max-w-md border-slate-800 bg-slate-900">

          <CardContent className="p-8 text-center space-y-4">

            <Compass className="w-10 h-10 mx-auto text-slate-600" />

            <h2 className="text-lg font-bold text-white">
              No Dimensions Available
            </h2>

            <p className="text-sm text-slate-400">
              The administrator has not configured
              any competency dimensions for this
              wheel yet.
            </p>

          </CardContent>

        </Card>

      </div>
    );
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">

        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px]" />

        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-sky-500/5 rounded-full blur-[140px]" />

      </div>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="relative border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <Logo size="md" showText={false} />

            <div>

              <div className="flex items-center gap-2">

                <h1 className="font-bold text-white">
                  CU-SUCCEED
                </h1>

                <Badge className="text-[10px] bg-indigo-500/10 text-blue-400 border border-indigo-500/20">
                  PRE-ASSESSMENT
                </Badge>

              </div>

              <p className="text-xs text-slate-500">
                Competency Self-Assessment Wheel
              </p>

            </div>

          </div>

          <div className="hidden sm:flex items-center gap-3">

            <div className="px-3 py-2 rounded-lg border border-slate-800 bg-slate-900">

              <div className="text-[10px] uppercase tracking-wider text-slate-500">
                Average Score
              </div>

              <div className="text-sm font-bold text-blue-400">
                {averageScore}
                <span className="text-slate-500 text-xs">
                  {" "}
                  / 10
                </span>
              </div>

            </div>

          </div>

        </div>

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ====================================================
            INTRO
        ==================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-widest mb-3">

            <Sparkles className="w-4 h-4" />

            Personal Competency Mapping

          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">

            Rate Your Current Competencies

          </h2>

          <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">

            Evaluate your current capability across each
            competency dimension. Your responses create a
            personalized competency profile.

          </p>

        </div>

        {/* ====================================================
            GRID
        ==================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ==================================================
              RADAR SECTION
          ================================================== */}

          <div className="lg:col-span-5 space-y-5">

            <Card className="border-slate-800 bg-slate-900/90 shadow-xl">

              <CardContent className="p-6">

                <div className="flex items-start justify-between mb-5">

                  <div>

                    <div className="flex items-center gap-2">

                      <BarChart3 className="w-4 h-4 text-blue-400" />

                      <h3 className="font-semibold text-white">
                        Competency Profile
                      </h3>

                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      Your wheel updates in real time.
                    </p>

                  </div>

                  <Badge
                    variant="outline"
                    className="text-[10px]"
                  >

                    LIVE

                  </Badge>

                </div>

                {/* ============================================
                    RADAR
                ============================================ */}

                <div className="max-w-[360px] mx-auto">

                  <svg
                    viewBox="0 0 320 320"
                    className="w-full h-full"
                  >

                    {/* GRID RINGS */}

                    {[2, 4, 6, 8, 10].map(
                      (value) => {

                        const radius =
                          (value / 10) *
                          maxRadius;

                        return (
                          <circle
                            key={value}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke={isDark ? "rgba(202, 236, 226, 0.12)" : "rgba(27, 75, 81, 0.14)"}
                            strokeWidth="1"
                          />
                        );
                      }
                    )}

                    {/* SPOKES */}

                    {dimensions.map(
                      (_, index) => {

                        const { x, y } =
                          getCoordinates(
                            index,
                            10
                          );

                        return (
                          <line
                            key={index}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke={isDark ? "rgba(202, 236, 226, 0.12)" : "rgba(27, 75, 81, 0.14)"}
                            strokeWidth="1"
                          />
                        );
                      }
                    )}

                    {/* BENCHMARK */}

                    <polygon
                      points={
                        benchmarkPoints
                      }
                      fill={isDark ? "rgba(137, 182, 166, 0.12)" : "rgba(25, 115, 104, 0.08)"}
                      stroke={isDark ? "#89b6a6" : "#6d8a8a"}
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />

                    {/* STUDENT */}

                    <polygon
                      points={
                        studentPoints
                      }
                      fill={isDark ? "rgba(64, 157, 120, 0.3)" : "rgba(64, 157, 120, 0.22)"}
                      stroke="#409d78"
                      strokeWidth="2"
                    />

                    {/* POINTS */}

                    {dimensions.map(
                      (
                        dimension,
                        index
                      ) => {

                        const score =
                          ratings[
                            dimension.id
                          ] || 1;

                        const {
                          x,
                          y,
                        } =
                          getCoordinates(
                            index,
                            score
                          );

                        const selected =
                          activeDimension ===
                          dimension.id;

                        return (
                          <circle
                            key={
                              dimension.id
                            }
                            cx={x}
                            cy={y}
                            r={
                              selected
                                ? 5
                                : 3.5
                            }
                            fill={
                              selected
                                ? "#409d78"
                                : (isDark ? "#caece2" : "#ffffff")
                            }
                            stroke={isDark ? "#0b2227" : "#1b4b51"}
                            strokeWidth="1.5"
                            className="cursor-pointer"
                            onClick={() =>
                              setActiveDimension(
                                dimension.id
                              )
                            }
                          />
                        );
                      }
                    )}

                  </svg>

                </div>

                {/* LEGEND */}

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-5 text-[11px]">

                  <div className="flex items-center gap-2">

                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />

                    <span className="text-slate-300">
                      Your Rating
                    </span>

                  </div>

                  <div className="flex items-center gap-2">

                    <span className="w-5 border-t border-dashed border-blue-400" />

                    <span className="text-slate-400">
                      Benchmark
                    </span>

                  </div>

                </div>

              </CardContent>

            </Card>

            {/* ================================================
                ACTIVE DIMENSION
            ================================================ */}

            {selectedDimension && (

              <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">

                <CardContent className="p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <div className="flex items-center gap-2 mb-2">

                        <Target className="w-4 h-4 text-blue-400" />

                        <h3 className="font-semibold text-white">

                          {selectedDimension.name}

                        </h3>

                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">

                        {selectedDimension.description ||
                          "Rate your current level of confidence and capability in this competency."}

                      </p>

                    </div>

                    <div className="flex-shrink-0 text-center">

                      <div className="text-2xl font-bold text-blue-400">

                        {ratings[
                          selectedDimension.id
                        ] || 1}

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

          {/* ==================================================
              SLIDERS
          ================================================== */}

          <div className="lg:col-span-7">

            <Card className="border-slate-800 bg-slate-900/90 shadow-xl">

              <CardContent className="p-6 sm:p-7">

                {/* HEADER */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">

                  <div>

                    <h3 className="font-bold text-lg text-white">

                      Your Competency Ratings

                    </h3>

                    <p className="text-xs text-slate-400 mt-1">

                      Move each slider from
                      <strong className="text-slate-300">
                        {" "}
                        1
                      </strong>
                      {" "}
                      to
                      {" "}
                      <strong className="text-slate-300">
                        10
                      </strong>
                      .

                    </p>

                  </div>

                  <div className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-right">

                    <div className="text-[10px] uppercase text-slate-500">

                      Overall Average

                    </div>

                    <div className="text-lg font-bold text-blue-400">

                      {averageScore}
                      <span className="text-xs text-slate-500">
                        {" "}
                        / 10
                      </span>

                    </div>

                  </div>

                </div>

                {/* ============================================
                    DIMENSIONS
                ============================================ */}

                <div className="mt-5 space-y-3">

                  {dimensions.map(
                    (
                      dimension,
                      index
                    ) => {

                      const score =
                        ratings[
                          dimension.id
                        ] || 1;

                      const selected =
                        activeDimension ===
                        dimension.id;

                      return (

                        <div
                          key={
                            dimension.id
                          }
                          onMouseEnter={() =>
                            setActiveDimension(
                              dimension.id
                            )
                          }
                          onClick={() =>
                            setActiveDimension(
                              dimension.id
                            )
                          }
                          className={`rounded-xl border p-4 transition-all cursor-pointer ${
                            selected
                              ? "border-indigo-500/40 bg-indigo-500/5"
                              : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
                          }`}
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <div className="flex items-center gap-3">

                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                                  selected
                                    ? "bg-indigo-500 text-slate-950"
                                    : "bg-slate-800 text-slate-400"
                                }`}>

                                  {index + 1}

                                </span>

                                <div>

                                  <h4 className="text-sm font-semibold text-white">

                                    {dimension.name}

                                  </h4>

                                  {dimension.description && (

                                    <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[350px]">

                                      {
                                        dimension.description
                                      }

                                    </p>

                                  )}

                                </div>

                              </div>

                            </div>

                            <div className="flex-shrink-0 text-right">

                              <div className="text-sm font-bold text-white">

                                {score}
                                <span className="text-slate-500">
                                  /10
                                </span>

                              </div>

                              {dimension.benchmark && (

                                <div className="text-[10px] text-blue-400 mt-1">

                                  Target{" "}
                                  {
                                    dimension.benchmark
                                  }

                                </div>

                              )}

                            </div>

                          </div>

                          {/* SLIDER */}

                          <div className="mt-4 px-1">

                            <Slider
                              value={[
                                score,
                              ]}
                              min={1}
                              max={10}
                              step={1}
                              onValueChange={(
                                value
                              ) =>
                                handleSliderChange(
                                  dimension.id,
                                  value
                                )
                              }
                            />

                            <div className="flex justify-between text-[9px] text-slate-600 mt-2">

                              <span>
                                Foundational
                              </span>

                              <span>
                                Developing
                              </span>

                              <span>
                                Mastery
                              </span>

                            </div>

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

                {/* ============================================
                    SUBMIT
                ============================================ */}

                <div className="mt-7 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  <div className="text-xs text-slate-400">

                    <div className="flex items-center gap-2">

                      <CheckCircle2 className="w-4 h-4 text-blue-400" />

                      <span>

                        {dimensions.length} competency dimensions ready.

                      </span>

                    </div>

                  </div>

                  <Button
                    onClick={
                      handleSubmitWheel
                    }
                    disabled={
                      isSaving
                    }
                    className="h-11 px-7 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500"
                  >

                    {isSaving ? (

                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />

                        Saving Assessment...

                      </>

                    ) : saveSuccess ? (

                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />

                        Completed

                      </>

                    ) : (

                      <>
                        Complete Assessment

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

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="relative border-t border-slate-800/60 py-5 text-center text-[10px] text-slate-600">

        CU-SUCCEED • Competency Assessment System

      </footer>

    </div>
  );
}
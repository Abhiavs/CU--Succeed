"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WHEEL_DIMENSIONS } from "@/lib/assessmentData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

export default function WheelOfCompetenciesPage() {
  const router = useRouter();

  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    WHEEL_DIMENSIONS.forEach((dim) => {
      initial[dim.id] = Math.round(dim.benchmark);
    });
    return initial;
  });

  const [activeDimension, setActiveDimension] = useState<string>(WHEEL_DIMENSIONS[0].id);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/wheel")
      .then((res) => res.json())
      .then((data) => {
        if (data.dimensions && typeof data.dimensions === "object") {
          setRatings((prev) => ({ ...prev, ...data.dimensions }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSliderChange = (dimId: string, value: number[]) => {
    setRatings((prev) => ({
      ...prev,
      [dimId]: value[0],
    }));
  };

  const dimensionKeys = Object.keys(ratings);
  const averageScore =
    dimensionKeys.length > 0
      ? (dimensionKeys.reduce((acc, k) => acc + (ratings[k] || 0), 0) / dimensionKeys.length).toFixed(1)
      : "7.5";

  // Coordinates for SVG Radar
  const center = 160;
  const maxRadius = 110;
  const numPoints = WHEEL_DIMENSIONS.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const r = (value / 10) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const studentPoints = WHEEL_DIMENSIONS.map((dim, i) => {
    const val = ratings[dim.id] || 7;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(" ");

  const benchmarkPoints = WHEEL_DIMENSIONS.map((dim, i) => {
    const { x, y } = getCoordinates(i, dim.benchmark);
    return `${x},${y}`;
  }).join(" ");

  const handleSubmitWheel = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/wheel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dimensions: ratings,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push("/student/results");
        }, 600);
      } else {
        router.push("/student");
      }
    } catch (err) {
      console.error(err);
      router.push("/student");
    }
  };

  const selectedDimObj =
    WHEEL_DIMENSIONS.find((d) => d.id === activeDimension) || WHEEL_DIMENSIONS[0];

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-between py-6 px-4 sm:px-6 text-slate-100">
      {/* Top Bar */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/student"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            <Compass className="w-3.5 h-3.5 mr-1" />
            Track 03: Wheel of Competencies
          </Badge>
          <div className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-emerald-400">
            Average: {averageScore} / 10
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto w-full my-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 5 Cols: Clean SVG Radar */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-800 bg-slate-900 p-5 flex flex-col items-center justify-center">
            <div className="text-xs font-mono font-semibold text-slate-400 mb-2">
              COMPETENCY RADAR VISUALIZER
            </div>

            <div className="w-full max-w-[320px] aspect-square relative my-2">
              <svg viewBox="0 0 320 320" className="w-full h-full">
                {/* Concentric grid rings */}
                {[2, 4, 6, 8, 10].map((ringVal) => {
                  const r = (ringVal / 10) * maxRadius;
                  return (
                    <circle
                      key={ringVal}
                      cx={center}
                      cy={center}
                      r={r}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Radial spokes */}
                {WHEEL_DIMENSIONS.map((_, i) => {
                  const { x, y } = getCoordinates(i, 10);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Benchmark Polygon */}
                <polygon
                  points={benchmarkPoints}
                  fill="rgba(59, 130, 246, 0.08)"
                  stroke="#3B82F6"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Student Score Polygon */}
                <polygon
                  points={studentPoints}
                  fill="rgba(16, 185, 129, 0.2)"
                  stroke="#10B981"
                  strokeWidth="2"
                />

                {/* Vertex handles */}
                {WHEEL_DIMENSIONS.map((dim, i) => {
                  const val = ratings[dim.id] || 7;
                  const { x, y } = getCoordinates(i, val);
                  const isSelected = activeDimension === dim.id;

                  return (
                    <circle
                      key={dim.id}
                      cx={x}
                      cy={y}
                      r={isSelected ? 5 : 3.5}
                      fill={isSelected ? "#10B981" : "#ffffff"}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                      onClick={() => setActiveDimension(dim.id)}
                      className="cursor-pointer"
                    />
                  );
                })}

                {/* Labels */}
                {WHEEL_DIMENSIONS.map((dim, i) => {
                  const { x, y } = getCoordinates(i, 11.8);
                  const isSelected = activeDimension === dim.id;

                  return (
                    <text
                      key={dim.id}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      onClick={() => setActiveDimension(dim.id)}
                      className={`text-[9px] font-mono cursor-pointer ${
                        isSelected ? "fill-emerald-400 font-bold" : "fill-slate-400 hover:fill-white"
                      }`}
                    >
                      {dim.shortName}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Radar Legend */}
            <div className="flex items-center gap-5 text-[11px] text-slate-400 pt-2 border-t border-slate-800 w-full justify-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-200">Self-Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 border-t border-dashed border-blue-400" />
                <span>Industry Benchmark</span>
              </div>
            </div>
          </Card>

          {/* Dimension Details Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between font-semibold text-white">
              <span>{selectedDimObj.name}</span>
              <span className="text-emerald-400 font-mono font-bold">
                {ratings[selectedDimObj.id]} / 10
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              {selectedDimObj.description}
            </p>
          </div>
        </div>

        {/* Right 7 Cols: Sliders */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-6 space-y-5">
              <div>
                <h3 className="font-bold text-base text-white">
                  Rate Competency Dimensions
                </h3>
                <p className="text-xs text-slate-400">
                  Slide from 1 (Foundational) to 10 (Mastery). The visualizer will update live.
                </p>
              </div>

              {/* Dimension Sliders */}
              <div className="space-y-3">
                {WHEEL_DIMENSIONS.map((dim) => {
                  const score = ratings[dim.id] || 7;
                  const isSelected = activeDimension === dim.id;

                  return (
                    <div
                      key={dim.id}
                      onMouseEnter={() => setActiveDimension(dim.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "border-slate-700 bg-slate-950"
                          : "border-slate-800/80 bg-slate-900/60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-white">{dim.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            (Target: {dim.benchmark})
                          </span>
                        </div>
                        <span className="font-mono font-bold text-xs text-white px-2 py-0.5 rounded bg-slate-800">
                          {score} / 10
                        </span>
                      </div>

                      <Slider
                        value={[score]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={(val) => handleSliderChange(dim.id, val)}
                        className="my-2"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Composite Average: <strong className="text-emerald-400">{averageScore} / 10</strong>
                </div>

                <Button
                  onClick={handleSubmitWheel}
                  disabled={isSaving}
                  className="h-9 px-5 text-xs font-semibold"
                >
                  {isSaving ? "Saving Wheel..." : saveSuccess ? "Saved!" : "Save & View Results"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

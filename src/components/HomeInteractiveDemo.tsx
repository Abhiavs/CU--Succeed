"use client";

import * as React from "react";
import { useState } from "react";
import { WHEEL_DIMENSIONS } from "@/lib/assessmentData";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsDark } from "@/lib/useIsDark";
import Link from "next/link";
import {
  Compass,
  BrainCircuit,
  Zap,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export function HomeInteractiveDemo() {
  const isDark = useIsDark();
  const [activeTab, setActiveTab] = useState<"wheel" | "question" | "certificate">("wheel");

  // Wheel demo state
  const [demoRatings, setDemoRatings] = useState<Record<string, number>>({
    technical: 8,
    problemSolving: 9,
    communication: 7,
    emotionalIntelligence: 8,
    leadership: 7,
    timeManagement: 8,
    careerClarity: 8,
    adaptability: 9,
  });

  const [selectedDim, setSelectedDim] = useState<string>("problemSolving");

  // Sample question demo state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>("B");

  // Radar SVG computation
  const center = 140;
  const maxRadius = 90;
  const numPoints = WHEEL_DIMENSIONS.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const r = (value / 10) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const studentPolygon = WHEEL_DIMENSIONS.map((dim, i) => {
    const val = demoRatings[dim.id] || 7;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(" ");

  const benchmarkPolygon = WHEEL_DIMENSIONS.map((dim, i) => {
    const { x, y } = getCoordinates(i, dim.benchmark);
    return `${x},${y}`;
  }).join(" ");

  const demoAvg = (
    Object.values(demoRatings).reduce((a, b) => a + b, 0) / WHEEL_DIMENSIONS.length
  ).toFixed(1);

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden text-left">
      {/* Demo Top Bar with Interactive Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80 inline-block" />
          <span className="text-xs font-mono text-slate-400 ml-2">live-interactive-preview</span>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("wheel")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "wheel"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Interactive Wheel
          </button>
          <button
            onClick={() => setActiveTab("question")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "question"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sample Diagnostic
          </button>
          <button
            onClick={() => setActiveTab("certificate")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "certificate"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Digital Credential
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Wheel Playground */}
      {activeTab === "wheel" && (
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Radar Visualization */}
          <div className="md:col-span-6 flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between w-full">
              <span>DYNAMIC SVG RADAR</span>
              <span className="text-blue-400 font-bold">Average: {demoAvg}/10</span>
            </div>

            <div className="w-full max-w-[260px] aspect-square relative">
              <svg viewBox="0 0 280 280" className="w-full h-full">
                {[2, 4, 6, 8, 10].map((ringVal) => {
                  const r = (ringVal / 10) * maxRadius;
                  return (
                    <circle
                      key={ringVal}
                      cx={center}
                      cy={center}
                      r={r}
                      fill="none"
                      stroke={isDark ? "rgba(202, 236, 226, 0.12)" : "rgba(27, 75, 81, 0.14)"}
                      strokeWidth="1"
                    />
                  );
                })}
                {WHEEL_DIMENSIONS.map((_, i) => {
                  const { x, y } = getCoordinates(i, 10);
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={x}
                      y2={y}
                      stroke={isDark ? "rgba(202, 236, 226, 0.12)" : "rgba(27, 75, 81, 0.14)"}
                      strokeWidth="1"
                    />
                  );
                })}
                <polygon
                  points={benchmarkPolygon}
                  fill={isDark ? "rgba(137, 182, 166, 0.12)" : "rgba(25, 115, 104, 0.08)"}
                  stroke={isDark ? "#89b6a6" : "#6d8a8a"}
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
                <polygon
                  points={studentPolygon}
                  fill={isDark ? "rgba(64, 157, 120, 0.3)" : "rgba(64, 157, 120, 0.22)"}
                  stroke="#409d78"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                {WHEEL_DIMENSIONS.map((dim, i) => {
                  const val = demoRatings[dim.id] || 7;
                  const { x, y } = getCoordinates(i, val);
                  const isSelected = selectedDim === dim.id;

                  return (
                    <circle
                      key={dim.id}
                      cx={x}
                      cy={y}
                      r={isSelected ? 5 : 3.5}
                      fill={isSelected ? "#409d78" : (isDark ? "#caece2" : "#ffffff")}
                      stroke={isDark ? "#0b2227" : "#1b4b51"}
                      strokeWidth="1.5"
                      onClick={() => setSelectedDim(dim.id)}
                      className="cursor-pointer"
                    />
                  );
                })}
                {WHEEL_DIMENSIONS.map((dim, i) => {
                  const { x, y } = getCoordinates(i, 11.8);
                  const isSelected = selectedDim === dim.id;
                  return (
                    <text
                      key={dim.id}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      onClick={() => setSelectedDim(dim.id)}
                      className={`text-[8px] font-mono cursor-pointer transition-colors ${
                        isSelected ? "fill-emerald-600 dark:fill-emerald-400 font-bold" : "fill-slate-600 dark:fill-slate-400"
                      }`}
                    >
                      {dim.shortName}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Live Candidate Rating
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-0.5 border-t border-dashed border-blue-400" /> Industry Benchmark
              </span>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white">Adjust Dimension Ratings</h4>
              <Badge variant="outline" className="text-[10px]">
                Interactive Demo
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Drag the sliders below to see the radar polygon adapt in real-time.
            </p>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {WHEEL_DIMENSIONS.map((dim) => {
                const val = demoRatings[dim.id] || 7;
                const isSelected = selectedDim === dim.id;

                return (
                  <div
                    key={dim.id}
                    onMouseEnter={() => setSelectedDim(dim.id)}
                    className={`p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? "border-slate-700 bg-slate-950"
                        : "border-slate-800/80 bg-slate-900/60"
                    }`}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-200">{dim.name}</span>
                      <span className="font-mono font-bold text-blue-400">{val} / 10</span>
                    </div>
                    <Slider
                      value={[val]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(newVal) =>
                        setDemoRatings((prev) => ({ ...prev, [dim.id]: newVal[0] }))
                      }
                      className="my-1"
                    />
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <Link href="/start">
                <Button size="sm" className="w-full text-xs font-semibold">
                  Launch Full Assessment Wheel <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sample Diagnostic Question */}
      {activeTab === "question" && (
        <div className="p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              Sample Situational Judgment Item
            </Badge>
            <span className="text-xs text-slate-400 font-mono">Dimension: Emotional Resilience</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white block mb-1 text-[11px] uppercase font-mono">Scenario:</strong>
            "Two hours before an executive milestone demo, an unexpected integration bug surfaces in your component. How do you respond?"
          </div>

          <div className="space-y-2">
            {[
              { id: "A", text: "Stay calm, isolate root causes systematically, and communicate transparent mitigation timelines." },
              { id: "B", text: "Deploy a quick workaround to satisfy demo requirements while logging technical debt for later." },
              { id: "C", text: "Attempt multiple quick patches simultaneously in a rush to meet the deadline." },
              { id: "D", text: "Feel overwhelmed and step back until team leads address the issue." },
            ].map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedAnswer(opt.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    isSelected
                      ? "border-indigo-500 bg-slate-950 ring-1 ring-indigo-500"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                      isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {opt.id}
                  </div>
                  <span className="text-xs text-slate-200">{opt.text}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 ml-auto" />}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-slate-400">
              Evaluated trait: <strong className="text-blue-400">Strategic Crisis Mitigation</strong>
            </span>
            <Link href="/start">
              <Button size="sm" className="text-xs">
                Take Full Exam <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Tab 3: Digital Credential Preview */}
      {activeTab === "certificate" && (
        <div className="p-6 sm:p-8 space-y-4">
          <div className="p-6 rounded-xl border border-slate-700 bg-slate-950 text-center space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold">
              CU-SUCCEED OFFICIAL CREDENTIAL
            </div>
            <h4 className="text-lg font-serif font-bold text-white">
              Certificate of Employability & Competency
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Issued to candidates demonstrating proven readiness across Psychometric, Aptitude, and 8-Dimension Competency standards.
            </p>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
              <span>Verification ID: SUC-EMP-2026-DEMO</span>
              <span className="text-blue-400 font-mono font-bold">Status: Accredited</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

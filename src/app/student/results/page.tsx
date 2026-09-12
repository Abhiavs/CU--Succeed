"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { WHEEL_DIMENSIONS } from "@/lib/assessmentData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Award,
  BrainCircuit,
  Zap,
  Compass,
  CheckCircle2,
  Printer,
  ChevronLeft,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function StudentResultsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"scorecard" | "radar" | "certificate">("scorecard");

  useEffect(() => {
    fetch("/api/student/state")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono">Synthesizing Candidate Results...</p>
        </div>
      </div>
    );
  }

  const { student, state, composite } = data;
  const certificateId = `SUC-EMP-2026-${(student.id || "STU").slice(-4).toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`;

  // Radar coordinates
  const center = 150;
  const maxRadius = 100;
  const numPoints = WHEEL_DIMENSIONS.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / numPoints) * index - Math.PI / 2;
    const r = (value / 10) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const studentPolygon = WHEEL_DIMENSIONS.map((dim, i) => {
    const val = state?.wheelScores?.[dim.id] || 7.5;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(" ");

  const benchmarkPolygon = WHEEL_DIMENSIONS.map((dim, i) => {
    const { x, y } = getCoordinates(i, dim.benchmark);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col py-8 px-4 sm:px-6 text-slate-100 print:bg-white print:text-black">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800 print:hidden">
        <Link
          href="/student"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab("scorecard")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "scorecard" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Scorecard Summary
          </button>
          <button
            onClick={() => setActiveTab("radar")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "radar" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Competency Radar Figure
          </button>
          <button
            onClick={() => setActiveTab("certificate")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === "certificate" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Verified Certificate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs gap-1.5 border-slate-700">
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </Button>
        </div>
      </header>

      {/* Main Results Body */}
      <main className="max-w-6xl mx-auto w-full my-6 space-y-6 flex-1">
        {/* Executive Header Banner */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm print:border print:bg-white print:text-black">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="text-xs">
                  {student.assessmentType === "PRE" ? "PRE-ASSESSMENT REPORT" : "POST-ASSESSMENT REPORT"}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {student.year} YEAR • {student.branch}
                </Badge>
                <span className="text-xs font-mono text-slate-400">ID: {certificateId}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight print:text-black">
                Multidimensional Assessment Scorecard
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Candidate: <strong className="text-white print:text-black">{student.name}</strong> • Roll:{" "}
                <strong className="text-white print:text-black">{student.rollNumber}</strong> • College:{" "}
                <strong className="text-white print:text-black">{student.collegeName}</strong>
              </p>
            </div>

            {/* Overall Composite Score */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-center w-full lg:w-60 flex-shrink-0 print:border-gray-300">
              <div className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider mb-0.5">
                Composite Readiness
              </div>
              <div className="text-4xl font-extrabold text-white mb-0.5 print:text-black">
                {composite.overallReadiness}%
              </div>
              <div className="text-xs text-slate-400 font-medium print:text-gray-700">
                {composite.percentile}th Percentile • {composite.tier}
              </div>
            </div>
          </div>
        </div>

        {/* View 1: Scorecard Summary */}
        {activeTab === "scorecard" && (
          <div className="space-y-6 text-left">
            {/* 3 Pillar Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-slate-800 bg-slate-900/90 print:border">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-blue-400 font-bold">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {state.psychometricScore || composite.psychometricScore}%
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Psychometric Matrix</h4>
                    <p className="text-xs text-slate-400">
                      Archetype: <strong className="text-blue-400">{composite.psychometricArchetype.title}</strong>
                    </p>
                  </div>
                  <Progress value={state.psychometricScore || composite.psychometricScore} className="h-1" />
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {composite.psychometricArchetype.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/90 print:border">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {state.aptitudeScore || composite.aptitudeScore}%
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Aptitude Precision</h4>
                    <p className="text-xs text-slate-400">
                      Quantitative & Logical Reasoning Speed
                    </p>
                  </div>
                  <Progress value={state.aptitudeScore || composite.aptitudeScore} className="h-1" />
                  <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-slate-400 pt-1">
                    <div className="p-1 rounded bg-slate-950">Quant: {composite.aptitudeSectionBreakdown.quantitative}%</div>
                    <div className="p-1 rounded bg-slate-950">Logic: {composite.aptitudeSectionBreakdown.logical}%</div>
                    <div className="p-1 rounded bg-slate-950">Verbal: {composite.aptitudeSectionBreakdown.verbal}%</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/90 print:border">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {state.wheelAverage || composite.wheelAverage} / 10
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Competency Wheel</h4>
                    <p className="text-xs text-slate-400">
                      8-Dimension Evaluation Average
                    </p>
                  </div>
                  <Progress value={(state.wheelAverage || composite.wheelAverage) * 10} className="h-1" />
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Top Dimension: <strong>Problem Solving & Logic</strong>. High benchmark synergy.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Growth Roadmap */}
            <Card className="border-slate-800 bg-slate-900">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">Actionable Next Steps for Placement Readiness</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {composite.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{rec.title}</span>
                        <Badge variant="outline" className="text-[9px] py-0">
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* View 2: High-Fidelity Radar Figure */}
        {activeTab === "radar" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left">
            <Card className="md:col-span-6 border-slate-800 bg-slate-900 p-6 flex flex-col items-center justify-center">
              <div className="text-xs font-mono font-semibold text-slate-400 mb-3 w-full flex justify-between">
                <span>FIGURE 2.1 • RADAR ANALYSIS</span>
                <span className="text-blue-400">Average: {state.wheelAverage || composite.wheelAverage}/10</span>
              </div>

              <div className="w-full max-w-[300px] aspect-square relative">
                <svg viewBox="0 0 300 300" className="w-full h-full">
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
                  <polygon
                    points={benchmarkPolygon}
                    fill="rgba(59, 130, 246, 0.08)"
                    stroke="#3B82F6"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <polygon
                    points={studentPolygon}
                    fill="rgba(16, 185, 129, 0.25)"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  {WHEEL_DIMENSIONS.map((dim, i) => {
                    const { x, y } = getCoordinates(i, 11.8);
                    return (
                      <text
                        key={dim.id}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-[9px] font-mono fill-slate-400"
                      >
                        {dim.shortName}
                      </text>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center gap-5 text-xs text-slate-400 pt-3 border-t border-slate-800 w-full justify-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span>Candidate Profile</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-blue-400" />
                  <span>Industry Benchmark</span>
                </div>
              </div>
            </Card>

            {/* Dimension Breakdown Table */}
            <div className="md:col-span-6 space-y-3">
              <Card className="border-slate-800 bg-slate-900 p-5 space-y-3">
                <h4 className="font-bold text-sm text-white">Dimension Scores vs Benchmarks</h4>
                <div className="space-y-2">
                  {WHEEL_DIMENSIONS.map((dim) => {
                    const score = state?.wheelScores?.[dim.id] || 7.5;
                    return (
                      <div key={dim.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-semibold text-slate-200">{dim.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Benchmark: {dim.benchmark}/10</div>
                        </div>
                        <span className="font-mono font-bold text-blue-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {score} / 10
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* View 3: Verified Certificate */}
        {activeTab === "certificate" && (
          <div className="pt-2">
            <div className="p-8 sm:p-12 rounded-xl border border-slate-700 bg-slate-900 text-center max-w-3xl mx-auto space-y-6 print:border-2 print:border-black print:bg-white print:text-black">
              <div className="space-y-1">
                <div className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold print:text-black">
                  CU SUCCEED DIGITAL CREDENTIAL
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white print:text-black">
                  Certificate of Employability Assessment
                </h3>
                <p className="text-xs text-slate-400 print:text-gray-600">
                  This is to certify that
                </p>
              </div>

              <div>
                <div className="text-3xl sm:text-4xl font-bold text-white print:text-black">
                  {student.name}
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1 print:text-gray-700">
                  Roll No: {student.rollNumber} • {student.branch} • {student.collegeName}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed print:text-gray-800">
                has completed the{" "}
                <strong>
                  {student.assessmentType === "PRE" ? "Pre-Assessment" : "Post-Assessment"}
                </strong>{" "}
                program evaluating Psychometric traits, Aptitude precision, and 8-Dimension Competency standards with a composite score of{" "}
                <strong className="text-blue-400 print:text-black">{composite.overallReadiness}%</strong>.
              </p>

              <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-left text-xs print:border-gray-400">
                <div className="text-slate-400 print:text-gray-600">
                  <div>Issue Date: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
                  <div className="font-mono text-[10px] text-blue-400 print:text-black mt-0.5">
                    Verification ID: {certificateId}
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-serif font-bold text-white print:text-black">
                    Director of Assessment
                  </div>
                  <div className="text-[10px] text-slate-400 print:text-gray-600 font-mono">
                    CU Succeed Board
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

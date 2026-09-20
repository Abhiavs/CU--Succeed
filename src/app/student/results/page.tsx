"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  WheelComparisonChart,
  type WheelComparisonRow,
} from "@/components/WheelComparisonChart";
import {
  BrainCircuit,
  Compass,
  Printer,
  ChevronLeft,
  TrendingUp,
} from "lucide-react";

export default function StudentResultsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pre" | "post">("pre");

  // Real PRE vs POST wheel scores from the WheelScore table.
  const [comparison, setComparison] = useState<{
    hasPre: boolean;
    hasPost: boolean;
    preAverage: number | null;
    postAverage: number | null;
    rows: WheelComparisonRow[];
  } | null>(null);

  // Psychometric section scores + insights, reconstructed from DB.
  const [psyResult, setPsyResult] = useState<any>(null);

  /*
   * Honour ?view=post so the dashboard's completed-POST button can
   * land directly on the post report. Read from window.location
   * rather than useSearchParams to avoid a Suspense boundary.
   */
  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    if (view === "post") {
      setActiveTab("post");
    }
  }, []);

  useEffect(() => {
    fetch("/api/student/state")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    fetch("/api/student/wheel-comparison")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setComparison(json);
      })
      .catch(() => {});

    fetch("/api/student/psychometric-result")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setPsyResult(json);
      })
      .catch(() => {});
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono">Synthesizing Candidate Results...</p>
        </div>
      </div>
    );
  }

  const { student, state, composite } = data;

  // Real PRE/POST wheel averages from the comparison endpoint, falling
  // back to the state/composite figure when the API has nothing yet.
  const preAvg =
    comparison?.preAverage ?? state?.wheelAverage ?? composite?.wheelAverage ?? null;

  const postAvg = comparison?.postAverage ?? null;

  const wheelChange =
    typeof preAvg === "number" && typeof postAvg === "number"
      ? postAvg - preAvg
      : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col py-8 px-4 sm:px-6 text-slate-100 print:bg-white print:text-black">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800 print:hidden">
        <Link
          href="/student"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 flex-wrap">
          {(
            [
              { id: "pre", label: "PRE Assessment" },
              { id: "post", label: "POST Assessment" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === t.id ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
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
          <div className="space-y-1.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="text-xs">
                {student.assessmentType === "PRE" ? "PRE-ASSESSMENT REPORT" : "POST-ASSESSMENT REPORT"}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {student.year} YEAR • {student.branch}
              </Badge>
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
        </div>

        {/* View 1: PRE Assessment */}
        {activeTab === "pre" && (
          <div className="space-y-6 text-left">
            {/* Pre-Training summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-slate-800 bg-slate-900/90 print:border">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-blue-400 font-bold">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {psyResult?.completed
                        ? `${psyResult.totalRawScore} / ${psyResult.maxPossible}`
                        : `${state.psychometricScore || composite.psychometricScore}%`}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Psychometric Confidence Assessment</h4>
                    {psyResult?.completed && (
                      <p className="text-xs text-blue-400 font-semibold">
                        {psyResult.overall.label} ({psyResult.overall.range})
                      </p>
                    )}
                    {!psyResult?.completed && (
                      <p className="text-xs text-slate-400">
                        Archetype: <strong className="text-blue-400">{composite.psychometricArchetype.title}</strong>
                      </p>
                    )}
                  </div>
                  <Progress
                    value={
                      psyResult?.completed
                        ? psyResult.scorePercentage
                        : (state.psychometricScore || composite.psychometricScore)
                    }
                    className="h-1"
                  />
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {psyResult?.completed
                      ? `Scored ${psyResult.totalRawScore} out of ${psyResult.maxPossible}. ${psyResult.answeredCount} questions answered.`
                      : composite.psychometricArchetype.description}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/90 print:border">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {typeof preAvg === "number" ? preAvg.toFixed(1) : "—"} / 10
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Competency Wheel — Pre-Training</h4>
                    <p className="text-xs text-slate-400">
                      Self-assessed parameters before training
                    </p>
                  </div>
                  <Progress value={(typeof preAvg === "number" ? preAvg : 0) * 10} className="h-1" />
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {comparison?.hasPost
                      ? "Compare each dimension against your post-training self-ratings below."
                      : "Complete the POST competency wheel to unlock the pre vs post comparison."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Psychometric Section Scores */}
            {psyResult?.completed && psyResult.sections.length > 0 && (
              <div className="space-y-4">
                <Card className="border-slate-800 bg-slate-900 print:border">
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="font-bold text-sm text-white">Confidence Scorecard — Psychometric</h3>
                      <p className="text-xs text-slate-400">
                        Section-by-section breakdown. Each section scores 0–40 from 10 questions on a 4-point scale.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {psyResult.sections.map((section: any, idx: number) => {
                        const tierColour =
                          section.rawScore >= 31
                            ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                            : section.rawScore >= 21
                            ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
                            : section.rawScore >= 11
                            ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                            : "text-red-400 bg-red-500/10 border-red-500/20";
                        return (
                          <div key={section.sectionId} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-slate-500 uppercase">
                                Section {idx + 1} • {section.questionRange}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tierColour}`}>
                                {section.tier.label}
                              </span>
                            </div>
                            <h4 className="font-bold text-sm text-white">{section.name}</h4>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-extrabold text-white">{section.rawScore}</span>
                              <span className="text-xs text-slate-400">/ {section.maxScore}</span>
                            </div>
                            <Progress value={section.percentage} className="h-1" />
                            <p className="text-[10px] text-slate-500 font-mono">
                              {section.answeredCount} of {Math.round(section.maxPossible / 4)} answered • {section.tier.range}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Section Insights */}
                {psyResult.sections.map((section: any, idx: number) => (
                  <Card key={section.sectionId} className="border-slate-800 bg-slate-900 print:border">
                    <CardContent className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-[10px]">
                          Section {idx + 1}
                        </Badge>
                        <h4 className="font-bold text-sm text-white">{section.name}</h4>
                        <span className="text-xs font-mono text-slate-400 ml-auto">
                          {section.rawScore} / {section.maxScore} — {section.tier.label}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Your Confidence Insights</p>
                        {section.tier.paragraphs.map((para: string, pIdx: number) => (
                          <p key={pIdx} className="text-[11px] text-slate-400 leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pre vs Post wheel comparison */}
            <Card className="border-slate-800 bg-slate-900 print:border">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Competency Wheel — Pre vs Post
                  </h3>
                  <p className="text-xs text-slate-400">
                    Self-assessed parameters, scored 0–10 before and after training.
                  </p>
                </div>
                <WheelComparisonChart
                  rows={comparison?.rows ?? []}
                  hasPost={comparison?.hasPost ?? false}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* View 2: POST Assessment */}
        {activeTab === "post" && (
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-slate-800 bg-slate-900/90 print:border">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                      <Compass className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {typeof postAvg === "number" ? postAvg.toFixed(1) : "—"} / 10
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Competency Wheel — Post-Training</h4>
                    <p className="text-xs text-slate-400">
                      Self-assessed parameters after training
                    </p>
                  </div>
                  <Progress value={(typeof postAvg === "number" ? postAvg : 0) * 10} className="h-1" />
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {typeof postAvg === "number"
                      ? "Your post-training self-rating average across all dimensions."
                      : "No post-training wheel submitted yet."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-800 bg-slate-900/90 print:border">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xl font-bold text-white">
                      {wheelChange === null
                        ? "—"
                        : `${wheelChange >= 0 ? "+" : ""}${wheelChange.toFixed(1)}`}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Growth vs Pre-Training</h4>
                    <p className="text-xs text-slate-400">
                      Change in wheel average
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {wheelChange === null
                      ? "Available once both PRE and POST wheels are submitted."
                      : wheelChange >= 0
                        ? "Positive movement across your self-assessed parameters."
                        : "Scores dipped — review the dimension breakdown below."}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pre vs Post wheel comparison */}
            <Card className="border-slate-800 bg-slate-900 print:border">
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Competency Wheel — Post vs Pre
                  </h3>
                  <p className="text-xs text-slate-400">
                    Where you started against where you are now, dimension by dimension.
                  </p>
                </div>
                <WheelComparisonChart
                  rows={comparison?.rows ?? []}
                  hasPost={comparison?.hasPost ?? false}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

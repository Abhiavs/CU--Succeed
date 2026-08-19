"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PSYCHOMETRIC_QUESTIONS } from "@/lib/assessmentData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";

export default function PsychometricAssessmentPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = PSYCHOMETRIC_QUESTIONS.length;
  const currentQuestion = PSYCHOMETRIC_QUESTIONS[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "PSYCHOMETRIC",
          answers,
        }),
      });

      if (res.ok) {
        router.push("/student/results");
      } else {
        router.push("/student");
      }
    } catch (err) {
      console.error(err);
      router.push("/student");
    }
  };

  const isCurrentAnswered = !!answers[currentQuestion.id];
  const allAnswered = Object.keys(answers).length === totalQuestions;

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-between py-6 px-4 sm:px-6 text-slate-100">
      {/* Top Bar */}
      <header className="max-w-3xl mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/student"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs">
            <BrainCircuit className="w-3.5 h-3.5 mr-1" />
            Psychometric Matrix
          </Badge>
          <span className="text-xs text-slate-400 font-mono">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full my-6 flex-1 flex flex-col justify-center space-y-4">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Progress</span>
            <span className="text-emerald-400 font-mono font-bold">{progressPct}%</span>
          </div>
          <Progress value={progressPct} className="h-1.5" />
        </div>

        {/* Card */}
        <Card className="border-slate-800 bg-slate-900 shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Dimension Tag & Scenario Box */}
            <div className="space-y-3">
              <div className="text-[11px] font-mono font-semibold text-emerald-400 uppercase">
                DIMENSION: {currentQuestion.dimension}
              </div>

              {/* Scenario Context */}
              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
                  Scenario:
                </span>
                "{currentQuestion.scenario}"
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? "border-emerald-500 bg-slate-950 ring-1 ring-emerald-500"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                        isSelected
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {opt.id}
                    </div>

                    <div className="flex-1 text-xs sm:text-sm text-slate-300 pt-0.5">
                      {opt.text}
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="text-xs text-slate-400"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
              </Button>

              {currentIndex < totalQuestions - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isCurrentAnswered}
                  className="h-9 px-5 text-xs font-semibold"
                >
                  Next Scenario <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered || isSubmitting}
                  className="h-9 px-6 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500"
                >
                  {isSubmitting ? "Scoring..." : "Complete & View Results"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="max-w-3xl mx-auto w-full text-center text-xs text-slate-500 pt-4">
        Psychometric Behavioral Matrix • SucceedAcademy
      </footer>
    </div>
  );
}

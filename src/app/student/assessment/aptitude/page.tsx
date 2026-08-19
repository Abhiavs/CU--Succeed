"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { APTITUDE_QUESTIONS } from "@/lib/assessmentData";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Bookmark,
  ChevronLeft,
} from "lucide-react";

export default function AptitudeAssessmentPage() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalQuestions = APTITUDE_QUESTIONS.length;
  const currentQuestion = APTITUDE_QUESTIONS[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleToggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
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
          category: "APTITUDE",
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

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-between py-6 px-4 sm:px-6 text-slate-100">
      {/* Top Bar with Timer */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800">
        <Link
          href="/student"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Exit
        </Link>

        {/* Live Timer */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-md border text-xs font-mono font-semibold ${
            secondsRemaining < 120
              ? "border-red-500/50 bg-red-500/10 text-red-400"
              : "border-slate-700 bg-slate-900 text-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(secondsRemaining)}</span>
        </div>
      </header>

      {/* Main Grid: Question Body & Navigator */}
      <main className="max-w-5xl mx-auto w-full my-6 flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-slate-800 bg-slate-900 shadow-sm">
            <CardContent className="p-6 sm:p-8 space-y-6">
              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {currentQuestion.section}
                  </Badge>
                  <span className="text-xs text-slate-400 font-mono">
                    Diff: {currentQuestion.difficulty}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleReview}
                  className={`h-7 px-2.5 rounded-md text-xs gap-1 ${
                    markedForReview[currentQuestion.id]
                      ? "text-blue-400 bg-blue-500/10 border border-blue-500/30"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Bookmark className="w-3 h-3" />
                  {markedForReview[currentQuestion.id] ? "Marked" : "Mark Review"}
                </Button>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-mono font-semibold text-blue-400">
                  QUESTION {currentIndex + 1} OF {totalQuestions}
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed whitespace-pre-line">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-2.5 pt-1">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? "border-blue-500 bg-slate-950 ring-1 ring-blue-500"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {opt.id}
                      </div>

                      <div className="flex-1 text-xs sm:text-sm text-slate-300">
                        {opt.text}
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="text-xs text-slate-400"
                >
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Prev
                </Button>

                {currentIndex < totalQuestions - 1 ? (
                  <Button
                    onClick={handleNext}
                    className="h-9 px-5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Next Question <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="h-9 px-6 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    {isSubmitting ? "Scoring..." : "Submit Aptitude Exam"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigator Palette */}
        <div className="space-y-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-4 space-y-3">
              <h4 className="font-semibold text-white text-xs">Question Palette</h4>

              <div className="grid grid-cols-4 gap-1.5">
                {APTITUDE_QUESTIONS.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = !!answers[q.id];
                  const isReviewed = !!markedForReview[q.id];

                  let btnClass = "border-slate-800 bg-slate-950 text-slate-400";
                  if (isAnswered) {
                    btnClass = "border-blue-500/40 bg-blue-500/20 text-blue-300 font-bold";
                  }
                  if (isReviewed) {
                    btnClass = "border-indigo-500/40 bg-indigo-500/20 text-indigo-300 font-bold";
                  }
                  if (isCurrent) {
                    btnClass += " ring-1 ring-white";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-8 rounded-md border text-xs font-mono transition-all flex items-center justify-center cursor-pointer ${btnClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500/30 border border-blue-400" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700" />
                  <span>Unanswered ({totalQuestions - answeredCount})</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSubmit}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs text-slate-300 border-slate-700"
                >
                  Finalize & Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

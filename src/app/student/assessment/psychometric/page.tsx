"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

/*
 * ============================================================
 * QUESTION TYPE
 * ============================================================
 */

type PsychometricQuestion = {
  id: string;
  text: string;
  type: string;
  parameter: string | null;
  options: {
    id: string;
    text: string;
  }[];
};

/*
 * ============================================================
 * PAGE
 * ============================================================
 */

export default function PsychometricAssessmentPage() {
  const router = useRouter();

  /*
   * ============================================================
   * QUESTION STATE
   * ============================================================
   */

  const [questions, setQuestions] =
    useState<PsychometricQuestion[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  /*
   * ============================================================
   * ASSESSMENT STATE
   * ============================================================
   */

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showExitConfirm, setShowExitConfirm] =
    useState(false);

  const allowNavigation =
    useRef(false);

  /*
   * ============================================================
   * LOAD QUESTIONS FROM DATABASE
   * ============================================================
   */

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setLoadError(null);

       const response = await fetch(
  "/api/assessments/questions?category=PSYCHOMETRIC"
);

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load assessment questions."
          );
        }

        console.log(
          "PSYCHOMETRIC QUESTIONS FROM DATABASE:",
          data.questions
        );

        setQuestions(
          data.questions || []
        );
      } catch (error) {
        console.error(
          "Failed to load psychometric questions:",
          error
        );

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load assessment questions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  /*
   * ============================================================
   * PREVENT BROWSER BACK WITHOUT CONFIRMATION
   * ============================================================
   */

  useEffect(() => {
    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handlePopState = () => {
      if (allowNavigation.current) {
        return;
      }

      /*
       * Stay on assessment page.
       */

      window.history.pushState(
        null,
        "",
        window.location.href
      );

      /*
       * Show exit confirmation.
       */

      setShowExitConfirm(true);
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, []);

  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-100">
        <div className="text-center">
          <BrainCircuit className="w-8 h-8 mx-auto mb-4 text-blue-400 animate-pulse" />

          <p className="text-sm text-slate-400">
            Loading psychometric assessment...
          </p>
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
        <Card className="max-w-md w-full bg-slate-900 border-slate-800">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-lg font-bold">
              Unable to Load Assessment
            </h2>

            <p className="text-sm text-slate-400">
              {loadError}
            </p>

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
   * NO QUESTIONS STATE
   * ============================================================
   */

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center px-4 text-slate-100">
        <Card className="max-w-md w-full bg-slate-900 border-slate-800">
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-lg font-bold">
              No Questions Available
            </h2>

            <p className="text-sm text-slate-400">
              The administrator has not added any
              psychometric questions yet.
            </p>

            <Button
              onClick={() =>
                router.push("/student")
              }
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * ============================================================
   * CURRENT QUESTION
   * ============================================================
   */

  const totalQuestions =
    questions.length;

  const currentQuestion =
    questions[currentIndex];

  /*
   * ============================================================
   * SAFETY CHECK
   * ============================================================
   */

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-100">
        Unable to load current question.
      </div>
    );
  }

  /*
   * ============================================================
   * PROGRESS
   * ============================================================
   */

  const progressPct =
    totalQuestions > 0
      ? Math.round(
          ((currentIndex + 1) /
            totalQuestions) *
            100
        )
      : 0;

  /*
   * ============================================================
   * SELECT ANSWER
   *
   * IMPORTANT:
   * The answer key is now the REAL DATABASE QUESTION ID.
   *
   * Example:
   *
   * answers = {
   *   "cmt9jzr5v000ls14rk9f45dcb": "A"
   * }
   *
   * This fixes the previous psy-1 / database ID mismatch.
   * ============================================================
   */

  const handleSelectOption = (
    optionId: string
  ) => {
    setAnswers((previousAnswers) => ({
      ...previousAnswers,

      [currentQuestion.id]:
        optionId,
    }));
  };

  /*
   * ============================================================
   * NEXT QUESTION
   * ============================================================
   */

  const handleNext = () => {
    if (
      currentIndex <
      totalQuestions - 1
    ) {
      setCurrentIndex(
        (previousIndex) =>
          previousIndex + 1
      );
    }
  };

  /*
   * ============================================================
   * PREVIOUS QUESTION
   * ============================================================
   */

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(
        (previousIndex) =>
          previousIndex - 1
      );
    }
  };

  /*
   * ============================================================
   * EXIT HANDLING
   * ============================================================
   */

  const handleCancelExit = () => {
    setShowExitConfirm(false);
  };

  const handleConfirmExit = () => {
    allowNavigation.current = true;

    /*
     * Clear current assessment selection.
     */

    sessionStorage.removeItem(
      "selectedAssessment"
    );

    setShowExitConfirm(false);

    router.replace("/");
  };

  /*
   * ============================================================
   * SUBMIT ASSESSMENT
   * ============================================================
   */

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      console.log(
        "SUBMITTING PSYCHOMETRIC ANSWERS:",
        answers
      );

      const response = await fetch(
        "/api/assessments/submit",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            category:
              "PSYCHOMETRIC",

            answers,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "ASSESSMENT SUBMIT RESPONSE:",
        data
      );

      if (!response.ok) {
        console.error(
          "Assessment submission failed:",
          data
        );

        alert(
          data.error ||
            "Unable to submit assessment."
        );

        setIsSubmitting(false);

        return;
      }

      /*
       * Successful submission.
       */

      router.replace(
        data.redirectUrl ||
          "/student/wheel"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Assessment submission error:",
        error
      );

      alert(
        "Something went wrong while submitting the assessment."
      );

      setIsSubmitting(false);
    }
  };

  /*
   * ============================================================
   * ANSWER STATUS
   * ============================================================
   */

  const isCurrentAnswered =
    !!answers[currentQuestion.id];

  const allAnswered =
    questions.every(
      (question) =>
        !!answers[question.id]
    );

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-between py-6 px-4 sm:px-6 text-slate-100">

      {/* ======================================================
          TOP BAR
      ====================================================== */}

      <header className="max-w-3xl mx-auto w-full flex items-center justify-between pb-4 border-b border-slate-800">

        <Link
          href="/student"
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />

          Dashboard
        </Link>

        <div className="flex items-center gap-2">

          <Badge
            variant="default"
            className="text-xs"
          >
            <BrainCircuit className="w-3.5 h-3.5 mr-1" />

            Psychometric Matrix
          </Badge>

          <span className="text-xs text-slate-400 font-mono">
            {currentIndex + 1} /
            {" "}
            {totalQuestions}
          </span>

        </div>

      </header>

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}

      <main className="max-w-3xl mx-auto w-full my-6 flex-1 flex flex-col justify-center space-y-4">

        {/* ==================================================
            PROGRESS BAR
        ================================================== */}

        <div className="space-y-1.5">

          <div className="flex justify-between items-center text-xs text-slate-400">

            <span>
              Progress
            </span>

            <span className="text-blue-400 font-mono font-bold">
              {progressPct}%
            </span>

          </div>

          <Progress
            value={progressPct}
            className="h-1.5"
          />

        </div>

        {/* ==================================================
            QUESTION CARD
        ================================================== */}

        <Card className="border-slate-800 bg-slate-900 shadow-sm">

          <CardContent className="p-6 sm:p-8 space-y-6">

            {/* ==============================================
                DIMENSION + SCENARIO
            ============================================== */}

      <div className="space-y-3">
  {currentQuestion.parameter && (
    <div className="text-[11px] font-mono font-semibold text-blue-400 uppercase">
      DIMENSION: {currentQuestion.parameter}
    </div>
  )}

  {/* QUESTION */}
  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
    {currentQuestion.text}
  </h2>
</div>
            {/* ==============================================
                OPTIONS
            ============================================== */}

            <div className="space-y-2.5">

              {currentQuestion.options.map(
                (option) => {
                  const isSelected =
                    answers[
                      currentQuestion.id
                    ] === option.id;

                  return (

                    <div
                      key={option.id}
                      onClick={() =>
                        handleSelectOption(
                          option.id
                        )
                      }
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-indigo-500 bg-slate-950 ring-1 ring-indigo-500"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >

                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >

                        {option.id}

                      </div>

                      <div className="flex-1 text-xs sm:text-sm text-slate-300 pt-0.5">

                        {option.text}

                      </div>

                      {isSelected && (

                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />

                      )}

                    </div>

                  );
                }
              )}

            </div>

            {/* ==============================================
                NAVIGATION
            ============================================== */}

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">

              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={
                  currentIndex === 0
                }
                className="text-xs text-slate-400"
              >

                <ArrowLeft className="w-3.5 h-3.5 mr-1" />

                Previous

              </Button>

              {currentIndex <
              totalQuestions - 1 ? (

                <Button
                  onClick={handleNext}
                  disabled={
                    !isCurrentAnswered
                  }
                  className="h-9 px-5 text-xs font-semibold"
                >

                  Next Scenario

                  <ArrowRight className="w-3.5 h-3.5 ml-1" />

                </Button>

              ) : (

                <Button
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    !allAnswered ||
                    isSubmitting
                  }
                  className="h-9 px-6 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500"
                >

                  {isSubmitting
                    ? "Saving..."
                    : "Continue to Competency Wheel"}

                </Button>

              )}

            </div>

          </CardContent>

        </Card>

      </main>

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="max-w-3xl mx-auto w-full text-center text-xs text-slate-500 pt-4">

        Psychometric Behavioral Matrix
        {" • "}
        CU Succeed

      </footer>

      {/* ======================================================
          EXIT CONFIRMATION
      ====================================================== */}

      {showExitConfirm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">

          <Card className="w-full max-w-md border-slate-700 bg-slate-900 shadow-2xl">

            <CardContent className="p-6 space-y-5">

              <div className="space-y-2">

                <h2 className="text-lg font-bold text-white">

                  Leave Assessment?

                </h2>

                <p className="text-sm text-slate-400">

                  Your assessment has not been submitted yet.
                  If you leave now, your current assessment
                  session will end and you will return to the
                  starting page.

                </p>

              </div>

              <div className="flex gap-3 justify-end">

                <Button
                  variant="outline"
                  onClick={
                    handleCancelExit
                  }
                >

                  Continue Assessment

                </Button>

                <Button
                  onClick={
                    handleConfirmExit
                  }
                  className="bg-red-600 hover:bg-red-500"
                >

                  End Assessment

                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>
  );
}
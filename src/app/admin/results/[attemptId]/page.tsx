import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  ClipboardList,
  Trophy,
  MessageSquareText,
  CircleCheck,
  Compass,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function AttemptDetailsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  /*
   * ============================================================
   * GET ATTEMPT
   * ============================================================
   */

  const attempt = await prisma.attempt.findUnique({
    where: {
      id: attemptId,
    },

    include: {
      student: true,

      assessment: true,

      answers: {
        include: {
          question: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  /*
   * ============================================================
   * ATTEMPT NOT FOUND
   * ============================================================
   */

  if (!attempt) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-10 text-center">
            <XCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Attempt Not Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The assessment attempt you are looking for does not exist.
            </p>

            <Link href="/admin/results">
              <Button className="mt-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * ============================================================
   * DETERMINE ATTEMPT TYPE
   * ============================================================
   */

  const isWheelAttempt =
    String(attempt.category || "").toUpperCase() ===
    "WHEEL";

  /*
   * ============================================================
   * GET WHEEL SCORE
   *
   * Wheel responses are stored separately in WheelScore.
   * ============================================================
   */

  const wheelScore = isWheelAttempt
    ? await prisma.wheelScore.findFirst({
        where: {
          studentId: attempt.studentId,
        },

        orderBy: {
          createdAt: "desc",
        },
      })
    : null;

  /*
   * ============================================================
   * CONVERT WHEEL DIMENSIONS
   *
   * Prisma Json type needs to be safely converted.
   * ============================================================
   */

  const wheelDimensions =
    wheelScore &&
    wheelScore.dimensions &&
    typeof wheelScore.dimensions === "object" &&
    !Array.isArray(wheelScore.dimensions)
      ? Object.entries(
          wheelScore.dimensions as Record<
            string,
            unknown
          >
        )
      : [];

  /*
   * ============================================================
   * ANSWER STATISTICS
   * ============================================================
   */

  const correctAnswers = attempt.answers.filter(
    (answer) => answer.isCorrect === true
  ).length;

  const incorrectAnswers = attempt.answers.filter(
    (answer) => answer.isCorrect === false
  ).length;

  /*
   * ============================================================
   * DISPLAY SCORE
   *
   * Wheel Attempt.score stores average × 10.
   *
   * Example:
   * 75 = 7.5
   * 82 = 8.2
   * ============================================================
   */

  const displayScore = isWheelAttempt
    ? wheelScore?.averageScore ??
      (attempt.score !== null &&
      attempt.score !== undefined
        ? attempt.score / 10
        : null)
    : attempt.score;

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-left text-slate-900 dark:text-slate-100">

      {/* ======================================================
          BACK BUTTON
      ====================================================== */}

      <div>
        <Link href="/admin/results">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />

            Back to Results
          </Button>
        </Link>
      </div>

      {/* ======================================================
          STUDENT HEADER
      ====================================================== */}

      <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5 dark:border-slate-800 dark:bg-slate-950/40">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <User className="h-7 w-7 text-emerald-500" />
              </div>

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {attempt.student.name}
                </h1>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {attempt.student.email}
                </p>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

                  {attempt.student.rollNumber ||
                    "No Roll Number"}

                  <span className="mx-1">•</span>

                  {attempt.student.branch ||
                    "No Branch"}

                  <span className="mx-1">•</span>

                  {attempt.student.year ||
                    "No Year"}

                </p>

              </div>

            </div>

            <div>

              <Badge
                className={
                  attempt.status === "COMPLETED"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/10"
                }
              >
                {attempt.status}
              </Badge>

            </div>

          </div>

        </div>

        {/* ====================================================
            SUMMARY CARDS
        ==================================================== */}

        <CardContent className="p-6">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* ASSESSMENT */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <ClipboardList className="h-4 w-4 text-blue-500" />
                </div>

                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Assessment
                </p>

              </div>

              <p className="font-semibold text-slate-900 dark:text-white">

                {isWheelAttempt
                  ? "Wheel of Competencies"
                  : attempt.assessment?.title ||
                    attempt.category ||
                    "Unknown Assessment"}

              </p>

            </div>

            {/* SCORE */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Trophy className="h-4 w-4 text-amber-500" />
                </div>

                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">

                  {isWheelAttempt
                    ? "Average Score"
                    : "Score"}

                </p>

              </div>

              <p className="text-2xl font-bold text-slate-900 dark:text-white">

                {displayScore !== null &&
                displayScore !== undefined
                  ? isWheelAttempt
                    ? `${Number(
                        displayScore
                      ).toFixed(1)} / 10`
                    : displayScore
                  : "N/A"}

              </p>

            </div>

            {/* SUBMITTED */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10">

                  {isWheelAttempt ? (
                    <Compass className="h-4 w-4 text-indigo-500" />
                  ) : (
                    <MessageSquareText className="h-4 w-4 text-indigo-500" />
                  )}

                </div>

                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">

                  {isWheelAttempt
                    ? "Dimensions"
                    : "Submitted"}

                </p>

              </div>

              <p className="text-2xl font-bold text-slate-900 dark:text-white">

                {isWheelAttempt
                  ? wheelDimensions.length
                  : attempt.answers.length}

              </p>

              <p className="mt-1 text-xs text-slate-500">

                {isWheelAttempt
                  ? "Competencies rated"
                  : "Questions answered"}

              </p>

            </div>

            {/* RESULT / CORRECT */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/40">

              <div className="mb-3 flex items-center gap-2">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">

                  <CircleCheck className="h-4 w-4 text-emerald-500" />

                </div>

                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">

                  {isWheelAttempt
                    ? "Total Score"
                    : "Correct"}

                </p>

              </div>

              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">

                {isWheelAttempt
                  ? wheelScore?.totalScore ??
                    "N/A"
                  : correctAnswers}

              </p>

              <p className="mt-1 text-xs text-slate-500">

                {isWheelAttempt
                  ? "Across all dimensions"
                  : `Incorrect: ${incorrectAnswers}`}

              </p>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ======================================================
          WHEEL RESULTS
      ====================================================== */}

      {isWheelAttempt ? (

        <>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Wheel Dimension Ratings
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review the competency ratings submitted by the student.
              </p>

            </div>

            {wheelDimensions.length > 0 && (

              <Badge
                variant="outline"
                className="w-fit px-3 py-1 text-xs"
              >
                {wheelDimensions.length} Dimensions
              </Badge>

            )}

          </div>

          {wheelScore &&
          wheelDimensions.length > 0 ? (

            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="overflow-x-auto">

                <table className="w-full border-collapse text-left">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">

                      <th className="w-20 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        #
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Dimension
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Student Rating
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {wheelDimensions.map(
                      ([dimension, value], index) => (

                        <tr
                          key={dimension}
                          className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/30"
                        >

                          <td className="px-5 py-5">

                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                              {index + 1}
                            </div>

                          </td>

                          <td className="px-5 py-5">

                            <p className="font-medium text-slate-900 dark:text-white">
                              {dimension}
                            </p>

                          </td>

                          <td className="px-5 py-5 text-center">

                            <Badge className="bg-indigo-600 hover:bg-indigo-600">

                              {String(value)} / 10

                            </Badge>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </Card>

          ) : (

            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

              <CardContent className="flex flex-col items-center justify-center p-14 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">

                  <Compass className="h-6 w-6 text-slate-400" />

                </div>

                <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">
                  No Wheel Ratings Available
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">

                  The Wheel attempt exists, but the individual
                  competency ratings could not be found.

                </p>

              </CardContent>

            </Card>

          )}

        </>

      ) : (

        /*
         * ====================================================
         * NORMAL ASSESSMENT ANSWERS
         * ====================================================
         */

        <>

          {/* ANSWERS HEADER */}

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">

            <div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Submitted Answers
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Review each question and the candidate's submitted response.
              </p>

            </div>

            {attempt.answers.length > 0 && (

              <Badge
                variant="outline"
                className="w-fit px-3 py-1 text-xs"
              >
                {attempt.answers.length} Responses
              </Badge>

            )}

          </div>

          {/* ANSWERS TABLE */}

          {attempt.answers.length > 0 ? (

            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="overflow-x-auto">

                <table className="w-full border-collapse text-left">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/60">

                      <th className="w-16 px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        #
                      </th>

                      <th className="min-w-[300px] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Question
                      </th>

                      <th className="min-w-[180px] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Student Answer
                      </th>

                      <th className="min-w-[180px] px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Correct Answer
                      </th>

                      <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Result
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {attempt.answers.map(
                      (answer, index) => {

                        const isCorrect =
                          answer.isCorrect === true;

                        const isIncorrect =
                          answer.isCorrect === false;

                        return (

                          <tr
                            key={answer.id}
                            className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-slate-800/60 dark:hover:bg-slate-800/30"
                          >

                            <td className="px-5 py-5 align-top">

                              <div
                                className={
                                  isCorrect
                                    ? "flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-600 dark:text-emerald-400"
                                    : isIncorrect
                                    ? "flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-sm font-bold text-red-600 dark:text-red-400"
                                    : "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-500/10 text-sm font-bold text-slate-600 dark:text-slate-400"
                                }
                              >
                                {index + 1}
                              </div>

                            </td>

                            <td className="px-5 py-5 align-top">

                              <p className="font-medium leading-relaxed text-slate-900 dark:text-white">
                                {answer.question.text}
                              </p>

                            </td>

                            <td className="px-5 py-5 align-top">

                              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950/40">

                                {answer.selectedAnswer ? (

                                  <span className="font-medium text-slate-900 dark:text-white">
                                    {answer.selectedAnswer}
                                  </span>

                                ) : (

                                  <span className="italic text-slate-500">
                                    No answer submitted
                                  </span>

                                )}

                              </div>

                            </td>

                            <td className="px-5 py-5 align-top">

                              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm">

                                <span className="font-medium text-emerald-700 dark:text-emerald-400">

                                  {answer.question.correctAnswer ||
                                    "N/A"}

                                </span>

                              </div>

                            </td>

                            <td className="px-5 py-5 align-top text-center">

                              {isCorrect ? (

                                <Badge className="bg-emerald-600 hover:bg-emerald-600">

                                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />

                                  Correct

                                </Badge>

                              ) : isIncorrect ? (

                                <Badge variant="destructive">

                                  <XCircle className="mr-1 h-3.5 w-3.5" />

                                  Incorrect

                                </Badge>

                              ) : (

                                <Badge
                                  variant="outline"
                                  className="text-slate-500"
                                >
                                  Submitted
                                </Badge>

                              )}

                            </td>

                          </tr>

                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            </Card>

          ) : (

            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

              <CardContent className="flex flex-col items-center justify-center p-14 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">

                  <MessageSquareText className="h-6 w-6 text-slate-400" />

                </div>

                <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">
                  No Individual Answers Available
                </h3>

                <p className="mt-2 max-w-md text-sm text-slate-500">

                  This attempt contains the assessment result, but individual
                  question answers were not saved to the database.

                </p>

              </CardContent>

            </Card>

          )}

        </>

      )}

    </div>
  );
}
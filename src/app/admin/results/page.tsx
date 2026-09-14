import { prisma } from "@/lib/prisma";
import Link from "next/link";

import {
  CheckCircle2,
  BarChart3,
  BrainCircuit,
  Zap,
  Compass,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Badge,
} from "@/components/ui/badge";

import AdminResultsBarChart from "@/components/AdminResultsBarChart";

/*
 * ============================================================
 * TYPES
 * ============================================================
 */

type TabType =
  | "PSYCHOMETRIC"
  | "WHEEL"
  | "POST";

/*
 * ============================================================
 * DETERMINE ATTEMPT TYPE
 * ============================================================
 */

function getAttemptType(
  attempt: any
): TabType | "OTHER" {
  if (!attempt) {
    return "OTHER";
  }

  /*
   * Category is used first because some assessment
   * types may be stored separately from the Assessment model.
   */

  const category = String(
    attempt.category || ""
  ).toUpperCase();

  const assessmentType = String(
    attempt.assessment?.type || ""
  ).toUpperCase();

  const type =
    category || assessmentType;

  /*
   * PSYCHOMETRIC
   */

  if (
    type === "PSYCHOMETRIC"
  ) {
    return "PSYCHOMETRIC";
  }

  /*
   * WHEEL
   */

  if (
    type === "WHEEL"
  ) {
    return "WHEEL";
  }

  /*
   * POST ASSESSMENT
   *
   * APTITUDE is treated as POST because your
   * application uses aptitude for the post assessment.
   */

  if (
    type === "POST" ||
    type === "POST_ASSESSMENT" ||
    type === "APTITUDE"
  ) {
    return "POST";
  }

  return "OTHER";
}

/*
 * ============================================================
 * TAB TITLE
 * ============================================================
 */

function getTabTitle(
  tab: TabType
) {
  switch (tab) {
    case "PSYCHOMETRIC":
      return "Psychometric Assessment";

    case "WHEEL":
      return "Wheel of Competencies";

    case "POST":
      return "Post Assessment";

    default:
      return "Assessment";
  }
}

/*
 * ============================================================
 * PAGE
 * ============================================================
 */

export default async function ResultGenerationPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    batch?: string;
  }>;
}) {

  /*
   * ==========================================================
   * GET CURRENT TAB
   * ==========================================================
   */

  const params =
    await searchParams;

  const currentTab: TabType =
    params.tab === "wheel"
      ? "WHEEL"
      : params.tab === "post"
      ? "POST"
      : "PSYCHOMETRIC";

  /*
   * ==========================================================
   * GET BATCH FILTER
   *
   * "" (or "all") means every batch.
   * ==========================================================
   */

  const BATCHES = ["Batch 1", "Batch 2"];

  const batchFilter =
    params.batch && BATCHES.includes(params.batch)
      ? params.batch
      : "";

  /*
   * URL-safe tab name used to preserve the active tab
   * when switching batches or exporting.
   */

  const tabQuery =
    currentTab === "WHEEL"
      ? "wheel"
      : currentTab === "POST"
      ? "post"
      : "psychometric";

  const batchQuerySuffix = batchFilter
    ? `&batch=${encodeURIComponent(batchFilter)}`
    : "";

  const exportHref = `/api/admin/results/export?tab=${tabQuery}${batchQuerySuffix}`;

  /*
   * ==========================================================
   * LOAD COMPLETED ATTEMPTS
   *
   * IMPORTANT:
   *
   * We only load attempts that are actually marked COMPLETED.
   * Therefore they should NOT be judged using score >= 50.
   * ==========================================================
   */

  const attempts =
    await prisma.attempt.findMany({

      where: {
        status: "COMPLETED",
      },

      include: {

        /*
         * STUDENT
         */

        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNumber: true,
            branch: true,
            year: true,
            assessmentType: true,
            collegeName: true,
            batch: true,
          },
        },

        /*
         * ASSESSMENT
         */

        assessment: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },

      },

      orderBy: {
        updatedAt: "desc",
      },

    });

  /*
   * ==========================================================
   * APPLY BATCH FILTER
   *
   * Everything below (tab counts, averages, table) uses the
   * batch-scoped list, so "Batch 1" shows only Batch 1 data.
   * ==========================================================
   */

  const scopedAttempts =
    batchFilter === ""
      ? attempts
      : attempts.filter(
          (attempt) =>
            attempt.student?.batch ===
            batchFilter
        );

  /*
   * ==========================================================
   * FILTER ATTEMPTS BY CURRENT TAB
   * ==========================================================
   */

  const currentAttempts =
    scopedAttempts.filter(
      (attempt) =>
        getAttemptType(attempt) ===
        currentTab
    );

  /*
   * ==========================================================
   * CHART ROWS
   *
   * One bar per candidate for the active tab + batch. Values are
   * the real persisted Attempt.score — nothing is derived.
   * ==========================================================
   */

  const chartRows = currentAttempts.map(
    (attempt) => ({
      id: attempt.id,
      name:
        attempt.student?.name ||
        "Unknown Student",
      score:
        attempt.score === null ||
        attempt.score === undefined
          ? null
          : Number(attempt.score),
    })
  );

  /*
   * ==========================================================
   * PSYCHOMETRIC ATTEMPTS
   * ==========================================================
   */

  const psychometricAttempts =
    scopedAttempts.filter(
      (attempt) =>
        getAttemptType(attempt) ===
        "PSYCHOMETRIC"
    );

  /*
   * ==========================================================
   * WHEEL ATTEMPTS
   * ==========================================================
   */

  const wheelAttempts =
    scopedAttempts.filter(
      (attempt) =>
        getAttemptType(attempt) ===
        "WHEEL"
    );

  /*
   * ==========================================================
   * POST ATTEMPTS
   * ==========================================================
   */

  const postAttempts =
    scopedAttempts.filter(
      (attempt) =>
        getAttemptType(attempt) ===
        "POST"
    );

  /*
   * ==========================================================
   * CALCULATE AVERAGE
   *
   * Ignore null/undefined scores.
   * ==========================================================
   */

  const getAverageScore = (
    items: any[]
  ) => {

    const validScores =
      items
        .map(
          (attempt) => {

            if (
              attempt.score === null ||
              attempt.score === undefined
            ) {
              return null;
            }

            const numericScore =
              Number(attempt.score);

            return Number.isNaN(
              numericScore
            )
              ? null
              : numericScore;
          }
        )
        .filter(
          (
            score
          ): score is number =>
            score !== null
        );

    /*
     * No valid scores.
     */

    if (
      validScores.length === 0
    ) {
      return null;
    }

    const total =
      validScores.reduce(
        (sum, score) =>
          sum + score,
        0
      );

    return (
      total /
      validScores.length
    );
  };

  /*
   * ==========================================================
   * CALCULATE AVERAGES
   * ==========================================================
   */

  const psychometricAverage =
    getAverageScore(
      psychometricAttempts
    );

  const postAverage =
    getAverageScore(
      postAttempts
    );

  const wheelAverage =
    getAverageScore(
      wheelAttempts
    );

  /*
   * ==========================================================
   * PAGE
   * ==========================================================
   */

  return (

    <div className="space-y-6 text-left text-slate-900 dark:text-slate-100">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">

          Candidate Results & Analytics

        </h1>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">

          View completed Psychometric, Wheel, and Post Assessment attempts separately.

        </p>

      </div>

      {/* ======================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* ====================================================
            PSYCHOMETRIC
        ==================================================== */}

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <CardContent className="p-5 flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-blue-400">

              <BrainCircuit size={20} />

            </div>

            <div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">

                Psychometric Average

              </div>

              <div className="text-2xl font-bold text-slate-900 dark:text-white">

                {psychometricAverage === null
                  ? "—"
                  : `${psychometricAverage.toFixed(
                      1
                    )}%`}

              </div>

              <div className="text-[10px] text-slate-500 mt-1">

                {psychometricAttempts.length} completed attempts

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ====================================================
            POST
        ==================================================== */}

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <CardContent className="p-5 flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">

              <Zap size={20} />

            </div>

            <div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">

                Post Assessment Average

              </div>

              <div className="text-2xl font-bold text-slate-900 dark:text-white">

                {postAverage === null
                  ? "—"
                  : `${postAverage.toFixed(
                      1
                    )}%`}

              </div>

              <div className="text-[10px] text-slate-500 mt-1">

                {postAttempts.length} completed attempts

              </div>

            </div>

          </CardContent>

        </Card>

        {/* ====================================================
            WHEEL
        ==================================================== */}

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <CardContent className="p-5 flex items-center gap-4">

            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">

              <Compass size={20} />

            </div>

            <div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">

                Wheel Assessment Average

              </div>

              <div className="text-2xl font-bold text-slate-900 dark:text-white">

                {wheelAverage === null
                  ? "—"
                  : wheelAverage.toFixed(1)}

              </div>

              <div className="text-[10px] text-slate-500 mt-1">

                {wheelAttempts.length} completed attempts

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ======================================================
          MAIN RESULTS CARD
      ====================================================== */}

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

        <CardContent className="p-6">

          {/* ==================================================
              TABS
          ================================================== */}

          <div className="flex flex-wrap gap-3 mb-6">

            {/* PSYCHOMETRIC */}

            <Link
              href="/admin/results?tab=psychometric"
            >

              <div
                className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  currentTab ===
                  "PSYCHOMETRIC"
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >

                <BrainCircuit className="inline-block w-4 h-4 mr-2" />

                Psychometric

                <span className="ml-2 text-xs opacity-80">

                  (
                  {
                    psychometricAttempts.length
                  }
                  )

                </span>

              </div>

            </Link>

            {/* WHEEL */}

            <Link
              href="/admin/results?tab=wheel"
            >

              <div
                className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  currentTab ===
                  "WHEEL"
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >

                <Compass className="inline-block w-4 h-4 mr-2" />

                Wheel

                <span className="ml-2 text-xs opacity-80">

                  (
                  {
                    wheelAttempts.length
                  }
                  )

                </span>

              </div>

            </Link>

            {/* POST */}

            <Link
              href="/admin/results?tab=post"
            >

              <div
                className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  currentTab ===
                  "POST"
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-transparent border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >

                <Zap className="inline-block w-4 h-4 mr-2" />

                Post Assessment

                <span className="ml-2 text-xs opacity-80">

                  (
                  {
                    postAttempts.length
                  }
                  )

                </span>

              </div>

            </Link>

          </div>

          {/* ==================================================
              BATCH FILTER + EXCEL EXPORT
          ================================================== */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">

            {/* BATCH CHIPS */}

            <div className="flex flex-wrap items-center gap-2">

              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mr-1">
                Batch
              </span>

              <Link
                href={`/admin/results?tab=${tabQuery}`}
                className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                  batchFilter === ""
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                All
              </Link>

              {BATCHES.map((batchOption) => (
                <Link
                  key={batchOption}
                  href={`/admin/results?tab=${tabQuery}&batch=${encodeURIComponent(
                    batchOption
                  )}`}
                  className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                    batchFilter === batchOption
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {batchOption}
                </Link>
              ))}

            </div>

            {/* DOWNLOAD */}

            <a
              href={exportHref}
              className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />

              Download Excel

              {batchFilter ? ` (${batchFilter})` : " (All Batches)"}
            </a>

          </div>

          {/* ==================================================
              BAR CHART + DOWNLOAD
          ================================================== */}

          <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">

            <AdminResultsBarChart
              rows={chartRows}
              tab={currentTab}
              batchLabel={
                batchFilter || "All Batches"
              }
            />

          </div>

          {/* ==================================================
              TABLE TITLE
          ================================================== */}

          <div className="mb-4">

            <h2 className="font-bold text-lg text-slate-900 dark:text-white">

              {
                getTabTitle(
                  currentTab
                )
              }

            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">

              Each row represents one individual completed assessment attempt.
              Click a candidate to view their submitted answers.

            </p>

          </div>

          {/* ==================================================
              RESULTS TABLE
          ================================================== */}

          <div className="overflow-x-auto">

            <table className="w-full text-left border-collapse text-xs">

              <thead>

                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">

                  <th className="py-3.5 px-4 font-mono uppercase text-slate-500">

                    Candidate

                  </th>

                  <th className="py-3.5 px-4 font-mono uppercase text-slate-500">

                    Batch

                  </th>

                  <th className="py-3.5 px-4 font-mono uppercase text-slate-500">

                    Assessment

                  </th>

                  <th className="py-3.5 px-4 font-mono uppercase text-slate-500">

                    Branch

                  </th>

                  <th className="py-3.5 px-4 font-mono uppercase text-slate-500">

                    Score

                  </th>

                  <th className="py-3.5 px-4 font-mono uppercase text-slate-500">

                    Completed

                  </th>

                  <th className="py-3.5 px-4 font-mono uppercase text-slate-500 text-right">

                    Result

                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  currentAttempts.map(
                    (attempt) => {

                      /*
                       * Preserve null score.
                       *
                       * Do NOT convert null into zero.
                       */

                      const score =
                        attempt.score === null ||
                        attempt.score ===
                          undefined
                          ? null
                          : Number(
                              attempt.score
                            );

                      return (

                        <tr
                          key={attempt.id}
                          className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                        >

                          {/* ================================
                              CANDIDATE
                          ================================ */}

                          <td className="py-3.5 px-4">

                            <Link
                              href={`/admin/results/${attempt.id}`}
                            >

                              <div className="cursor-pointer group">

                                <div className="font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-500 transition-colors">

                                  {
                                    attempt.student
                                      ?.name ||
                                    "Unknown Student"
                                  }

                                </div>

                                <div className="text-[10px] text-slate-500 font-mono mt-1">

                                  {
                                    attempt.student
                                      ?.rollNumber ||
                                    "No Roll Number"
                                  }

                                  {
                                    attempt.student
                                      ?.collegeName && (
                                      <>
                                        {" "}
                                        •{" "}
                                        {
                                          attempt
                                            .student
                                            .collegeName
                                        }
                                      </>
                                    )
                                  }

                                </div>

                              </div>

                            </Link>

                          </td>

                          {/* ================================
                              BATCH
                          ================================ */}

                          <td className="py-3.5 px-4">

                            {attempt.student?.batch ? (
                              <Badge
                                variant="secondary"
                                className="text-[10px]"
                              >
                                {attempt.student.batch}
                              </Badge>
                            ) : (
                              <span className="text-slate-500">
                                —
                              </span>
                            )}

                          </td>

                          {/* ================================
                              ASSESSMENT
                          ================================ */}

                          <td className="py-3.5 px-4">

                            <Badge
                              variant="outline"
                              className="text-[10px]"
                            >

                              {
                                getAttemptType(
                                  attempt
                                )
                              }

                            </Badge>

                            <div className="text-[10px] text-slate-500 mt-1">

                              {
                                attempt.assessment
                                  ?.title ||
                                getTabTitle(
                                  currentTab
                                )
                              }

                            </div>

                          </td>

                          {/* ================================
                              BRANCH
                          ================================ */}

                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">

                            {
                              attempt.student
                                ?.branch ||
                              "-"
                            }

                            {
                              attempt.student
                                ?.year && (

                                <div className="text-[10px] text-slate-500 mt-1">

                                  {
                                    attempt
                                      .student
                                      .year
                                  }
                                  {" "}
                                  Year

                                </div>

                              )
                            }

                          </td>

                          {/* ================================
                              SCORE
                          ================================ */}

                          <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">

                            {
                              score === null ||
                              Number.isNaN(
                                score
                              )
                                ? "—"
                                : currentTab ===
                                  "WHEEL"
                                ? score
                                : `${score}%`
                            }

                          </td>

                          {/* ================================
                              COMPLETED DATE
                          ================================ */}

                          <td className="py-3.5 px-4 text-slate-500">

                            {
                              attempt.endTime
                                ? new Date(
                                    attempt.endTime
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                                : new Date(
                                    attempt.updatedAt
                                  ).toLocaleDateString(
                                    "en-IN"
                                  )
                            }

                          </td>

                          {/* ================================
                              RESULT
                              
                              IMPORTANT:
                              Every record on this page
                              already has status COMPLETED.
                              
                              Therefore do not use
                              score >= 50 to determine
                              completion.
                          ================================ */}

                          <td className="py-3.5 px-4 text-right">

                            <Badge
                              variant="default"
                              className="text-[10px]"
                            >

                              <CheckCircle2
                                size={11}
                                className="mr-1"
                              />

                              Completed

                            </Badge>

                          </td>

                        </tr>

                      );
                    }
                  )
                }

                {/* ==========================================
                    EMPTY STATE
                ========================================== */}

                {
                  currentAttempts.length ===
                    0 && (

                    <tr>

                      <td
                        colSpan={7}
                        className="py-12 text-center text-slate-500"
                      >

                        <BarChart3 className="w-8 h-8 mx-auto mb-3 text-slate-400" />

                        <div className="font-medium">

                          No completed{" "}

                          {
                            getTabTitle(
                              currentTab
                            )
                          }

                          {" "}
                          attempts found.

                        </div>

                        <div className="text-[11px] mt-1">

                          Completed attempts will appear here automatically.

                        </div>

                      </td>

                    </tr>

                  )
                }

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

    </div>

  );
}
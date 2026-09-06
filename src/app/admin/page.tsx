import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PostPublishToggle from "./PostPublishToggle";

import {
  Users2,
  BrainCircuit,
  Compass,
  ClipboardList,
  TrendingUp,
  RotateCcw,
  CircleDot,
} from "lucide-react";

type SearchParams = {
  tab?: string;
};

type AdminTab =
  | "psychometric"
  | "pre-wheel"
  | "post-wheel"
  | "post";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  /*
   * =====================================================
   * ADMIN AUTHORIZATION
   * =====================================================
   */

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin-login");
  }

  if (session.user.role !== "OFFICIAL") {
    redirect("/login");
  }

  /*
   * =====================================================
   * ACTIVE TAB
   * =====================================================
   */

  const params = await searchParams;

  const validTabs: AdminTab[] = [
    "psychometric",
    "pre-wheel",
    "post-wheel",
    "post",
  ];

  const activeTab: AdminTab = validTabs.includes(
    params.tab as AdminTab
  )
    ? (params.tab as AdminTab)
    : "psychometric";

  /*
   * =====================================================
   * LOAD STUDENTS
   * =====================================================
   */

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
    },

    include: {
      attempts: {
        include: {
          assessment: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      },

      wheelScores: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  /*
   * =====================================================
   * FIND PSYCHOMETRIC ATTEMPT
   * =====================================================
   */

  const getPsychometricAttempt = (
    student: any
  ) => {
    return (
      student.attempts.find(
        (attempt: any) => {
          const assessmentType =
            attempt.assessment?.type?.toUpperCase();

          const category =
            attempt.category?.toUpperCase();

          return (
            assessmentType === "PSYCHOMETRIC" ||
            category === "PSYCHOMETRIC"
          );
        }
      ) || null
    );
  };

  /*
   * =====================================================
   * FIND POST ASSESSMENT ATTEMPT
   * =====================================================
   */

  const getPostAttempt = (
    student: any
  ) => {
    return (
      student.attempts.find(
        (attempt: any) => {
          const assessmentType =
            attempt.assessment?.type?.toUpperCase();

          const category =
            attempt.category?.toUpperCase();

          return (
            assessmentType === "POST" ||
            category === "POST" ||
            assessmentType === "POST_ASSESSMENT" ||
            category === "POST_ASSESSMENT" ||
            assessmentType === "APTITUDE" ||
            category === "APTITUDE"
          );
        }
      ) || null
    );
  };

  /*
   * =====================================================
   * FIND WHEEL SCORE BY TYPE
   * =====================================================
   */

  const getWheelScore = (
    student: any,
    type: "PRE" | "POST"
  ) => {
    return (
      student.wheelScores.find(
        (score: any) =>
          score.type?.toUpperCase() === type
      ) || null
    );
  };

  /*
   * =====================================================
   * STUDENT ROW DATA
   * =====================================================
   */

  const studentRows = students.map(
    (student: any) => {
      const psychometricAttempt =
        getPsychometricAttempt(student);

      const postAttempt =
        getPostAttempt(student);

      const preWheelScore =
        getWheelScore(student, "PRE");

      const postWheelScore =
        getWheelScore(student, "POST");

      return {
        id: student.id,

        name:
          student.name ||
          "Unnamed Student",

        email:
          student.email ||
          "—",

        rollNumber:
          student.rollNumber ||
          "—",

        branch:
          student.branch ||
          "—",

        year:
          student.year ||
          "—",

        collegeName:
          student.collegeName ||
          "—",

        /*
         * PSYCHOMETRIC
         */

        psychometric: {
          recordType: "ATTEMPT",

          attempt: psychometricAttempt,

          attempted:
            !!psychometricAttempt,

          completed:
            psychometricAttempt?.status ===
              "COMPLETED" ||
            !!psychometricAttempt?.endTime,

          score:
            psychometricAttempt?.score !== null &&
            psychometricAttempt?.score !== undefined
              ? psychometricAttempt.score
              : null,

          reattemptAllowed:
            psychometricAttempt?.reattemptAllowed ===
            true,
        },

        /*
         * PRE WHEEL
         */

        preWheel: {
          recordType: "WHEEL",

          attempt: preWheelScore,

          attempted:
            !!preWheelScore,

          completed:
            !!preWheelScore,

          score:
            preWheelScore?.averageScore !== null &&
            preWheelScore?.averageScore !== undefined
              ? preWheelScore.averageScore
              : null,

          reattemptAllowed:
            preWheelScore?.reattemptAllowed ===
            true,
        },

        /*
         * POST WHEEL
         */

        postWheel: {
          recordType: "WHEEL",

          attempt: postWheelScore,

          attempted:
            !!postWheelScore,

          completed:
            !!postWheelScore,

          score:
            postWheelScore?.averageScore !== null &&
            postWheelScore?.averageScore !== undefined
              ? postWheelScore.averageScore
              : null,

          reattemptAllowed:
            postWheelScore?.reattemptAllowed ===
            true,
        },

        /*
         * POST ASSESSMENT
         */

        post: {
          recordType: "ATTEMPT",

          attempt: postAttempt,

          attempted:
            !!postAttempt,

          completed:
            postAttempt?.status === "COMPLETED" ||
            !!postAttempt?.endTime,

          score:
            postAttempt?.score !== null &&
            postAttempt?.score !== undefined
              ? postAttempt.score
              : null,

          reattemptAllowed:
            postAttempt?.reattemptAllowed ===
            true,
        },
      };
    }
  );

  /*
   * =====================================================
   * STATISTICS
   * =====================================================
   */

  const totalStudents =
    studentRows.length;

  const psychometricCompleted =
    studentRows.filter(
      (student) =>
        student.psychometric.completed
    ).length;

  const preWheelCompleted =
    studentRows.filter(
      (student) =>
        student.preWheel.completed
    ).length;

  const postWheelCompleted =
    studentRows.filter(
      (student) =>
        student.postWheel.completed
    ).length;

  const postCompleted =
    studentRows.filter(
      (student) =>
        student.post.completed
    ).length;

  /*
   * =====================================================
   * OVERALL COMPLETION
   * =====================================================
   */

  const completedTotal =
    psychometricCompleted +
    preWheelCompleted +
    postWheelCompleted +
    postCompleted;

  const possibleTotal =
    totalStudents * 4;

  const completionRate =
    possibleTotal > 0
      ? Math.round(
          (completedTotal /
            possibleTotal) *
            100
        )
      : 0;

  /*
   * =====================================================
   * GET ACTIVE ASSESSMENT
   * =====================================================
   */

  const getAssessmentData = (
    student: any
  ) => {
    switch (activeTab) {
      case "pre-wheel":
        return student.preWheel;

      case "post-wheel":
        return student.postWheel;

      case "post":
        return student.post;

      default:
        return student.psychometric;
    }
  };

  /*
   * =====================================================
   * TAB TITLE
   * =====================================================
   */

  const tabTitle =
    activeTab === "psychometric"
      ? "Psychometric Assessment"
      : activeTab === "pre-wheel"
      ? "Pre-Assessment Wheel"
      : activeTab === "post-wheel"
      ? "Post-Assessment Wheel"
      : "Post Assessment";

  /*
   * =====================================================
   * PAGE
   * =====================================================
   */

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Assessment Administration
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Monitor student progress across all
            assessment stages and manage reattempt
            permissions.
          </p>
        </div>

        <PostPublishToggle />

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500">
                Students
              </span>

              <Users2 className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="mt-3 text-3xl font-bold">
              {totalStudents}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Registered
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500">
                Psychometric
              </span>

              <BrainCircuit className="h-5 w-5 text-purple-500" />
            </div>

            <div className="mt-3 text-3xl font-bold">
              {psychometricCompleted}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Completed
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500">
                Pre Wheel
              </span>

              <Compass className="h-5 w-5 text-blue-500" />
            </div>

            <div className="mt-3 text-3xl font-bold">
              {preWheelCompleted}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Completed
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500">
                Post Wheel
              </span>

              <CircleDot className="h-5 w-5 text-cyan-500" />
            </div>

            <div className="mt-3 text-3xl font-bold">
              {postWheelCompleted}
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Completed
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-500">
                Completion
              </span>

              <TrendingUp className="h-5 w-5 text-amber-500" />
            </div>

            <div className="mt-3 text-3xl font-bold">
              {completionRate}%
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Overall progress
            </p>

          </CardContent>
        </Card>

      </div>

      {/* STUDENT ASSESSMENT RECORDS */}

      <Card>

        <CardContent className="p-6">

          <div className="mb-6">

            <h2 className="text-xl font-bold">
              Student Assessment Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View student performance and manage
              assessment reattempt permissions.
            </p>

          </div>

          {/* TABS */}

          <div className="mb-6 flex flex-wrap gap-3">

            <Link href="/admin?tab=psychometric">
              <Button
                variant={
                  activeTab === "psychometric"
                    ? "default"
                    : "outline"
                }
              >
                <BrainCircuit className="mr-2 h-4 w-4" />
                Psychometric
              </Button>
            </Link>

            <Link href="/admin?tab=pre-wheel">
              <Button
                variant={
                  activeTab === "pre-wheel"
                    ? "default"
                    : "outline"
                }
              >
                <Compass className="mr-2 h-4 w-4" />
                Pre Wheel
              </Button>
            </Link>

            <Link href="/admin?tab=post-wheel">
              <Button
                variant={
                  activeTab === "post-wheel"
                    ? "default"
                    : "outline"
                }
              >
                <CircleDot className="mr-2 h-4 w-4" />
                Post Wheel
              </Button>
            </Link>

            <Link href="/admin?tab=post">
              <Button
                variant={
                  activeTab === "post"
                    ? "default"
                    : "outline"
                }
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Post Assessment
              </Button>
            </Link>

          </div>

          {/* TABLE TITLE */}

          <div className="mb-4">

            <h3 className="font-semibold">
              {tabTitle}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Student records for the selected assessment.
            </p>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm">

              <thead>

                <tr className="border-b bg-slate-50 dark:bg-slate-900">

                  <th className="px-4 py-3">
                    Student
                  </th>

                  <th className="px-4 py-3">
                    Roll Number
                  </th>

                  <th className="px-4 py-3">
                    Branch
                  </th>

                  <th className="px-4 py-3">
                    Score
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3 text-right">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {studentRows.map(
                  (student) => {
                    const assessment =
                      getAssessmentData(student);

                    const isWheel =
                      assessment.recordType ===
                      "WHEEL";

                    return (
                      <tr
                        key={student.id}
                        className="border-b transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                      >

                        {/* STUDENT */}

                        <td className="px-4 py-4">

                          <div className="font-semibold">
                            {student.name}
                          </div>

                          <div className="text-xs text-slate-500">
                            {student.email}
                          </div>

                        </td>

                        {/* ROLL NUMBER */}

                        <td className="px-4 py-4">
                          {student.rollNumber}
                        </td>

                        {/* BRANCH */}

                        <td className="px-4 py-4">
                          {student.branch}
                        </td>

                        {/* SCORE */}

                        <td className="px-4 py-4 font-medium">

                          {assessment.score !== null
                            ? isWheel
                              ? `${Number(
                                  assessment.score
                                ).toFixed(1)} / 10`
                              : assessment.score
                            : "—"}

                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">

                          {!assessment.attempted && (
                            <Badge variant="outline">
                              Not Attempted
                            </Badge>
                          )}

                          {assessment.attempted &&
                            !assessment.completed && (
                              <Badge variant="secondary">
                                In Progress
                              </Badge>
                            )}

                          {assessment.completed && (
                            <Badge>
                              Completed
                            </Badge>
                          )}

                        </td>

                        {/* ACTION */}

                        <td className="px-4 py-4 text-right">

                          {!assessment.attempted && (
                            <span className="text-xs text-slate-400">
                              No attempt yet
                            </span>
                          )}

                          {assessment.attempted &&
                            assessment.reattemptAllowed && (
                              <Badge
                                variant="outline"
                                className="border-emerald-500 text-emerald-600"
                              >
                                Reattempt Allowed
                              </Badge>
                            )}

                          {assessment.attempted &&
                            !assessment.reattemptAllowed && (
                              <form
                                action="/api/admin/reattempt"
                                method="POST"
                              >

                                {isWheel ? (
                                  <input
                                    type="hidden"
                                    name="wheelScoreId"
                                    value={
                                      assessment.attempt?.id || ""
                                    }
                                  />
                                ) : (
                                  <input
                                    type="hidden"
                                    name="attemptId"
                                    value={
                                      assessment.attempt?.id || ""
                                    }
                                  />
                                )}

                                <input
                                  type="hidden"
                                  name="allowed"
                                  value="true"
                                />

                                <Button
                                  size="sm"
                                  type="submit"
                                >
                                  <RotateCcw className="mr-2 h-4 w-4" />
                                  Allow Reattempt
                                </Button>

                              </form>
                            )}

                        </td>

                      </tr>
                    );
                  }
                )}

                {/* EMPTY STATE */}

                {studentRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-slate-500"
                    >
                      No students found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}
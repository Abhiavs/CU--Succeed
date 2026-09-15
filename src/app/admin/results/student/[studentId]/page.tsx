import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  ArrowLeft,
  XCircle,
  User,
  Hash,
  BookOpen,
  Building2,
  Layers,
  BrainCircuit,
  ClipboardList,
  Compass,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WheelComparisonChart } from "@/components/WheelComparisonChart";
import { getAttemptType } from "@/lib/attemptType";
import { buildWheelComparisonRows } from "@/lib/wheelComparison";

/*
 * ============================================================
 * PER-STUDENT COMPARISON GRAPH
 *
 * /admin/results/student/[studentId]
 *
 * The page the Excel export's "Comparison" column links to:
 * one student's PRE vs POST competency wheel, plotted with the
 * same grouped-bar chart the student sees on their own results
 * page. Auth is enforced by the /admin layout (OFFICIAL only).
 * ============================================================
 */

export default async function StudentComparisonPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  const student = await prisma.user.findUnique({
    where: { id: studentId },

    include: {
      attempts: {
        where: { status: "COMPLETED" },
        include: { assessment: true },
        orderBy: { createdAt: "desc" },
      },

      wheelScores: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!student || student.role !== "STUDENT") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-10 text-center">
            <XCircle className="mx-auto mb-4 h-10 w-10 text-red-500" />

            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Student Not Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The student record you are looking for does not exist.
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
   * Latest PRE / POST wheel scores for this student.
   */
  const preScore =
    student.wheelScores.find((s) => s.type === "PRE") || null;
  const postScore =
    student.wheelScores.find((s) => s.type === "POST") || null;

  const [preDims, postDims] = await Promise.all([
    prisma.wheelDimension.findMany({
      where: { assessmentType: "PRE", isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.wheelDimension.findMany({
      where: { assessmentType: "POST", isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const rows = buildWheelComparisonRows(
    preScore,
    postScore,
    preDims,
    postDims
  );

  /*
   * Assessment attempt scores for the summary strip.
   */
  const psychometric = student.attempts.find(
    (a) => getAttemptType(a) === "PSYCHOMETRIC"
  );
  const post = student.attempts.find(
    (a) => getAttemptType(a) === "POST"
  );

  const infoItems = [
    {
      icon: Hash,
      label: "Roll Number",
      value: student.rollNumber || "—",
    },
    {
      icon: BookOpen,
      label: "Branch",
      value: student.branch || "—",
    },
    {
      icon: Layers,
      label: "Batch",
      value: student.batch || "—",
    },
    {
      icon: Building2,
      label: "College",
      value: student.collegeName || "—",
    },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link
              href="/admin/results"
              className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Results
            </Link>
            <span>/</span>
            <span>Comparison Graph</span>
          </div>

          <h1 className="mt-2 flex items-center gap-2.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            <User className="h-6 w-6 text-indigo-500" />
            {student.name}
          </h1>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
            {student.email}
          </p>
        </div>

        {student.attempts.length > 0 && (
          <Link
            href={`/admin/results/${
              psychometric?.id || student.attempts[0].id
            }`}
          >
            <Button variant="outline" size="sm">
              View Attempt Details
            </Button>
          </Link>
        )}
      </div>

      {/* STUDENT INFO + SCORE SUMMARY */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {infoItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-500">
                  <Icon className="h-3 w-3" />
                  {item.label}
                </div>
                <div className="mt-1.5 truncate text-xs font-semibold text-slate-900 dark:text-slate-200">
                  {item.value}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-500">
              <BrainCircuit className="h-3 w-3" />
              Psychometric
            </div>
            <div className="mt-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200">
              {psychometric?.score !== null &&
              psychometric?.score !== undefined
                ? `${psychometric.score}%`
                : "—"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-slate-500">
              <ClipboardList className="h-3 w-3" />
              Post Assessment
            </div>
            <div className="mt-1.5 text-xs font-semibold text-slate-900 dark:text-slate-200">
              {post?.score !== null && post?.score !== undefined
                ? `${post.score}%`
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* WHEEL AVERAGES */}
      {(preScore || postScore) && (
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-xs">
            <Compass className="mr-1.5 h-3.5 w-3.5 text-[#409d78]" />
            Pre Wheel Avg:{" "}
            <span className="ml-1 font-mono font-bold">
              {preScore?.averageScore !== null &&
              preScore?.averageScore !== undefined
                ? Number(preScore.averageScore).toFixed(1)
                : "—"}
              /10
            </span>
          </Badge>

          <Badge variant="outline" className="text-xs">
            <Compass className="mr-1.5 h-3.5 w-3.5 text-[#eb6834]" />
            Post Wheel Avg:{" "}
            <span className="ml-1 font-mono font-bold">
              {postScore?.averageScore !== null &&
              postScore?.averageScore !== undefined
                ? Number(postScore.averageScore).toFixed(1)
                : "—"}
              /10
            </span>
          </Badge>
        </div>
      )}

      {/* COMPARISON CHART */}
      <Card>
        <CardContent className="p-6">
          <h2 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
            Competency Wheel — Pre vs Post
          </h2>

          {rows.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              No wheel dimensions configured.
            </p>
          ) : !preScore && !postScore ? (
            <p className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
              This student has not completed either wheel assessment yet.
            </p>
          ) : (
            <WheelComparisonChart
              rows={rows}
              hasPost={!!postScore}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

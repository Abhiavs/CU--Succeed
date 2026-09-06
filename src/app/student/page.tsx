import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BrainCircuit,
  Zap,
  CheckCircle2,
  Clock,
  Hash,
  BookOpen,
  Building2,
  Lock,
  CircleDot,
} from "lucide-react";

const CORE_PROGRAM_ID = "prog_succeed_core";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const studentId = session.user.id;
  const studentName = session.user.name || "Student";
  const rollNumber = session.user.rollNumber || "SUC-2026-042";
  const branch = session.user.branch || "Computer Science & Engineering";
  const year = session.user.year || "3rd";
  const collegeName = session.user.collegeName || "CU-SUCCEED of Technology";

  // Check if POST assessment is published
  const program = await prisma.program.findUnique({
    where: { id: CORE_PROGRAM_ID },
    select: { postAssessmentPublished: true },
  });

  const postPublished = program?.postAssessmentPublished ?? false;

  // Get all permanently completed modules from the database
  const completedAttempts = await prisma.attempt.findMany({
    where: {
      studentId,
      status: "COMPLETED",
    },
  });

  const psychometricAttempt = completedAttempts.find(
    (attempt) => attempt.category === "PSYCHOMETRIC"
  );

  // Get PRE and POST wheel scores
  const wheelScores = await prisma.wheelScore.findMany({
    where: { studentId },
    orderBy: { createdAt: "desc" },
  });

  const preWheelScore = wheelScores.find((score) => score.type === "PRE");
  const postWheelScore = wheelScores.find((score) => score.type === "POST");

  // Dashboard state comes from the database
  const state = {
    psychometricCompleted: !!psychometricAttempt,
    psychometricScore: psychometricAttempt?.score ?? 0,

    preWheelCompleted: !!preWheelScore,
    preWheelAverage: preWheelScore?.averageScore ?? 0,

    postWheelCompleted: !!postWheelScore,
    postWheelAverage: postWheelScore?.averageScore ?? 0,
  };

  // Count completion (PRE assessment + PRE wheel as one unit, POST wheel separate if published)
  let completedCount = 0;
  const preStageCompleted = state.psychometricCompleted && state.preWheelCompleted;

  if (preStageCompleted) completedCount++;
  if (postPublished && state.postWheelCompleted) completedCount++;

  const totalModules = postPublished ? 2 : 1; // PRE stage + POST wheel (if published)
  const completionPct = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6 text-slate-100">
      {/* Candidate Profile Header Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="text-xs">
                STUDENT ASSESSMENT JOURNEY
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {year} YEAR COHORT
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {studentName}
            </h1>

            {/* Candidate Metadata Strip */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Roll: <strong className="text-slate-200">{rollNumber}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                Branch: <strong className="text-slate-200">{branch}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                College: <strong className="text-slate-200">{collegeName}</strong>
              </span>
            </div>
          </div>

          {/* Overall Progress Widget */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 w-full lg:w-60 space-y-2 flex-shrink-0">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Overall Completion</span>
              <span className="font-bold text-emerald-400 font-mono">{completionPct}%</span>
            </div>
            <Progress value={completionPct} className="h-1.5" />
            <div className="text-[11px] text-slate-400">
              {completedCount} of {totalModules} Stage{totalModules > 1 ? 's' : ''} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Modules Section */}
      <div className="space-y-4 text-left">
        <div>
          <h2 className="text-lg font-bold text-white">Assessment Stages</h2>
          <p className="text-xs text-slate-400">
            Complete the PRE assessment stage before training, then POST assessment after development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* PRE Stage: Psychometric + Wheel combined */}
          <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between">
            <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  {preStageCompleted ? (
                    <Badge variant="default" className="text-xs">
                      Completed
                    </Badge>
                  ) : state.psychometricCompleted ? (
                    <Badge variant="secondary" className="text-xs">
                      In Progress
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                      Pending
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-mono font-semibold text-emerald-400 uppercase mb-0.5">
                    PRE Assessment
                  </div>
                  <h3 className="font-bold text-base text-white">Psychometric + Competency Wheel</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Baseline assessment: situational judgment questions + 8-dimension self-rating before training.
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3 h-3 ${state.psychometricCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={state.psychometricCompleted ? '' : 'text-slate-500'}>Psychometric: {state.psychometricCompleted ? `${state.psychometricScore}%` : 'Not started'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className={`w-3 h-3 ${state.preWheelCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={state.preWheelCompleted ? '' : 'text-slate-500'}>Wheel: {state.preWheelCompleted ? `${state.preWheelAverage.toFixed(1)}/10` : 'Not started'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {!state.psychometricCompleted && (
                  <Link href="/student/assessment/psychometric" className="flex-1">
                    <Button size="sm" className="w-full h-9 text-xs">
                      Start Psychometric
                    </Button>
                  </Link>
                )}
                {state.psychometricCompleted && !state.preWheelCompleted && (
                  <Link href="/student/wheel" className="flex-1">
                    <Button size="sm" className="w-full h-9 text-xs">
                      Complete Wheel
                    </Button>
                  </Link>
                )}
                {preStageCompleted && (
                  <Link href="/student/wheel" className="flex-1">
                    <Button size="sm" variant="outline" className="w-full h-9 text-xs">
                      View PRE Wheel
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Aptitude - Disabled */}
          <Card className="border-slate-800 bg-slate-900/50 opacity-60 flex flex-col justify-between relative">
            <div className="absolute top-3 right-3">
              <Lock className="w-4 h-4 text-slate-500" />
            </div>
            <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-slate-700/10 border border-slate-700/20 flex items-center justify-center text-slate-600 font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <Badge variant="outline" className="text-xs text-slate-500 border-slate-700/30">
                    Coming Soon
                  </Badge>
                </div>

                <div>
                  <div className="text-[10px] font-mono font-semibold text-slate-600 uppercase mb-0.5">
                    Track 02
                  </div>
                  <h3 className="font-bold text-base text-slate-500">Aptitude Precision</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Timed problem solving evaluating quantitative computation, logical deduction, and verbal correction.
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span>15-Minute Timed Environment</span>
                  </div>
                </div>
              </div>

              <Button size="sm" className="w-full h-9 text-xs" disabled>
                Not Available
              </Button>
            </CardContent>
          </Card>

          {/* POST Wheel - Only show if published */}
          {postPublished && (
            <Card className="border-cyan-900/50 bg-slate-900/90 flex flex-col justify-between">
              <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                      <CircleDot className="w-5 h-5" />
                    </div>
                    {state.postWheelCompleted ? (
                      <Badge className="text-xs bg-cyan-500">
                        Completed • {state.postWheelAverage.toFixed(1)}/10
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                        Pending
                      </Badge>
                    )}
                  </div>

                  <div>
                    <div className="text-[10px] font-mono font-semibold text-cyan-400 uppercase mb-0.5">
                      POST Assessment
                    </div>
                    <h3 className="font-bold text-base text-white">POST Competency Wheel</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Post-training evaluation: re-rate yourself across the same 8 dimensions to measure growth.
                    </p>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      <span>Compare PRE vs POST</span>
                    </div>
                  </div>
                </div>

                <Link href="/student/post-wheel" className="flex-1">
                  <Button size="sm" className="w-full h-9 text-xs bg-cyan-600 hover:bg-cyan-700">
                    {state.postWheelCompleted ? 'View POST Wheel' : 'Start POST Wheel'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      </div>
  );
}

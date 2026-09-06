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
  Compass,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  Hash,
  BookOpen,
  Building2,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

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
  const assessmentType = session.user.assessmentType || "PRE";
  const collegeName = session.user.collegeName || "CU-SUCCEED of Technology";

// Get temporary state as fallback
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

const aptitudeAttempt = completedAttempts.find(
  (attempt) => attempt.category === "APTITUDE"
);

const wheelAttempt = completedAttempts.find(
  (attempt) => attempt.category === "WHEEL"
);

// Dashboard state comes from the database
const state = {
  psychometricCompleted: !!psychometricAttempt,
  psychometricScore: psychometricAttempt?.score ?? 0,

  aptitudeCompleted: !!aptitudeAttempt,
  aptitudeScore: aptitudeAttempt?.score ?? 0,

  wheelCompleted: !!wheelAttempt,
  wheelAverage:
  wheelAttempt?.score != null
    ? wheelAttempt.score / 10
    : 0,
};

let completedCount = 0;

if (state.psychometricCompleted) completedCount++;
if (state.aptitudeCompleted) completedCount++;
if (state.wheelCompleted) completedCount++;

const completionPct = Math.round((completedCount / 3) * 100);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6 text-slate-100">
      {/* Candidate Profile Header Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="text-xs">
                {assessmentType === "PRE" ? "PRE-ASSESSMENT TRACK" : "POST-ASSESSMENT TRACK"}
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
              {completedCount} of 3 Modules Completed
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Modules Section */}
      <div className="space-y-4 text-left">
        <div>
          <h2 className="text-lg font-bold text-white">Assessment Modules</h2>
          <p className="text-xs text-slate-400">
            Complete each of the three evaluation pillars to unlock your comprehensive scorecard and verified digital certificate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Module 1: Psychometric */}
          <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between">
            <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  {state.psychometricCompleted ? (
                    <Badge variant="default" className="text-xs">
                      Completed • {state.psychometricScore}%
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                      Pending
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-mono font-semibold text-emerald-400 uppercase mb-0.5">
                    Track 01
                  </div>
                  <h3 className="font-bold text-base text-white">Psychometric Matrix</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Scenario-based evaluation measuring emotional resilience, leadership tendencies, teamwork synergy, and ethics.
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>6 Situational Judgment Items</span>
                  </div>
                </div>
              </div>

              
            </CardContent>
          </Card>

          {/* Module 2: Aptitude */}
          <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between">
            <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  {state.aptitudeCompleted ? (
                    <Badge variant="secondary" className="text-xs">
                      Completed • {state.aptitudeScore}%
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                      Pending
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-mono font-semibold text-blue-400 uppercase mb-0.5">
                    Track 02
                  </div>
                  <h3 className="font-bold text-base text-white">Aptitude Precision</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Timed problem solving evaluating quantitative computation, logical deduction, and verbal sentence correction.
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>15-Minute Timed Environment</span>
                  </div>
                </div>
              </div>

              
            </CardContent>
          </Card>

          {/* Module 3: Wheel of Competencies */}
          <Card className="border-slate-800 bg-slate-900/90 flex flex-col justify-between">
            <CardContent className="p-5 flex flex-col h-full justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  {state.wheelCompleted ? (
                    <Badge variant="accent" className="text-xs">
                      Generated • {state.wheelAverage}/10
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-amber-400 border-amber-500/30">
                      Pending
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="text-[10px] font-mono font-semibold text-indigo-400 uppercase mb-0.5">
                    Track 03
                  </div>
                  <h3 className="font-bold text-base text-white">Wheel of Competencies</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Interactive 8-dimension self-rating radar chart covering technical depth, time discipline, EQ, and vision.
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    <span>Dynamic SVG Radar Polygon</span>
                  </div>
                </div>
              </div>

             
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Hub Action Strip */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> Multidimensional Scorecard & Verified Certificate
          </h3>
          <p className="text-xs text-slate-400">
            Inspect your overall readiness index, dimensional radar comparison, archetype insights, and download your certificate.
          </p>
        </div>

        <Link href="/student/results">
          <Button size="sm" className="h-9 px-5 text-xs font-semibold whitespace-nowrap">
            View Results Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

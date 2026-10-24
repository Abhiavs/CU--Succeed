import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users2,
  BrainCircuit,
  Compass,
  Building2,
  Download,
  Award,
} from "lucide-react";

export default async function TpoDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "TPO") {
    redirect("/tpo-login");
  }

  const collegeName = session.user.collegeName || "";
  const tpoEmail = session.user.email || "";

  // Find all students belonging to this college name or matching email domain
  const emailDomain = tpoEmail.split("@")[1] || "";

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      OR: [
        collegeName ? { collegeName: { contains: collegeName, mode: "insensitive" } } : {},
        emailDomain ? { email: { endsWith: `@${emailDomain}` } } : {},
      ],
    },
    include: {
      attempts: {
        where: { status: "COMPLETED" },
        include: { assessment: true },
      },
      wheelScores: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Calculate stats & badges distribution
  let tier1Count = 0;
  let placementReadyCount = 0;
  let developingCount = 0;

  const studentSummaries = students.map((st) => {
    const psychAttempt = st.attempts.find((a) => a.category === "PSYCHOMETRIC" || a.assessment?.type === "PSYCHOMETRIC");
    const preWheel = st.wheelScores.find((w) => w.type === "PRE");
    const postWheel = st.wheelScores.find((w) => w.type === "POST");

    const psyScore = psychAttempt?.score ? Number(psychAttempt.score) : 0;
    const wheelAvg = preWheel ? preWheel.averageScore : 7.8;

    // Composite tier badge calculation
    const composite = Math.round((psyScore * 0.4) + (wheelAvg * 6 * 0.6));
    let badge = "Core Developing";
    if (composite >= 85) {
      badge = "Industry Ready (Tier 1)";
      tier1Count++;
    } else if (composite >= 70) {
      badge = "Placement Ready (Proficient)";
      placementReadyCount++;
    } else {
      developingCount++;
    }

    return {
      ...st,
      psyScore,
      preWheelAvg: preWheel?.averageScore ?? null,
      postWheelAvg: postWheel?.averageScore ?? null,
      composite,
      badge,
    };
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Logo href="/tpo" size="md" subtitle="TPO & College Head Portal" />

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-slate-200">{session.user.name} ({session.user.collegeName || emailDomain})</span>
            </div>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-8 flex-1">
        {/* Header Banner */}
        <div className="rounded-xl border border-emerald-900/50 bg-slate-900/90 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs">
                COLLEGE HEAD / TPO DASHBOARD
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {session.user.collegeName || "Institution"} Assessment Results
              </h1>
              <p className="text-xs text-slate-400">
                Viewing verified placement readiness & assessment performance for students under your domain.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href="/api/admin/results/export">
                <Button variant="outline" size="sm" className="h-9 text-xs gap-1.5 border-emerald-700/50 text-emerald-300 hover:bg-emerald-950">
                  <Download className="w-3.5 h-3.5" /> Export All College Results
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Users2 size={20} />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Total Students Registered</div>
                <div className="text-2xl font-bold text-white">{students.length}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Award size={20} />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Tier 1 Industry Ready</div>
                <div className="text-2xl font-bold text-blue-400">{tier1Count}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <BrainCircuit size={20} />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Placement Proficient</div>
                <div className="text-2xl font-bold text-indigo-400">{placementReadyCount}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Compass size={20} />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Core Developing</div>
                <div className="text-2xl font-bold text-amber-400">{developingCount}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white">Student Roster & Performance</h2>
              <p className="text-xs text-slate-400">
                Detailed breakdown of PRE/POST assessment scores and badge categorization for your college students.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Branch</th>
                    <th className="py-3 px-4">Batch</th>
                    <th className="py-3 px-4">Psychometric</th>
                    <th className="py-3 px-4">PRE Wheel</th>
                    <th className="py-3 px-4">POST Wheel</th>
                    <th className="py-3 px-4">Readiness Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {studentSummaries.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        No students found registered under your college domain or name.
                      </td>
                    </tr>
                  ) : (
                    studentSummaries.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-medium text-white">{st.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{st.rollNumber || "—"}</td>
                        <td className="py-3 px-4">{st.branch || "—"}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-[10px]">
                            {st.batch || "—"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-blue-400">
                          {st.psyScore > 0 ? `${st.psyScore}%` : "—"}
                        </td>
                        <td className="py-3 px-4 font-mono text-indigo-400">
                          {st.preWheelAvg !== null ? `${st.preWheelAvg.toFixed(1)}/10` : "—"}
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-400">
                          {st.postWheelAvg !== null ? `${st.postWheelAvg.toFixed(1)}/10` : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`text-[10px] ${
                              st.badge.includes("Tier 1")
                                ? "bg-emerald-600 text-white"
                                : st.badge.includes("Placement")
                                ? "bg-blue-600 text-white"
                                : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {st.badge}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

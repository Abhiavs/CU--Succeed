import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";
import { CheckCircle2, XCircle, BarChart3, BrainCircuit, Zap, Compass, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ResultGenerationPage({
  searchParams,
}: {
  searchParams: Promise<{ assessmentId?: string }>;
}) {
  const params = await searchParams;
  const assessmentId = params.assessmentId;

  const storeProfiles = inMemoryStore.getAllProfiles();

  // Combine store profiles with default mock data if empty
  const studentResults = storeProfiles.map((p) => {
    const st = inMemoryStore.getState(p.id);
    const compositeScore = Math.round(
      (st.psychometricScore || 78) * 0.35 +
      (st.aptitudeScore || 82) * 0.35 +
      ((st.wheelAverage || 7.8) * 10) * 0.30
    );

    return {
      id: `att-${p.id}`,
      name: p.name,
      email: p.email,
      rollNumber: p.rollNumber,
      branch: p.branch,
      college: p.collegeName,
      year: p.year,
      type: p.assessmentType,
      psychometricScore: st.psychometricCompleted ? st.psychometricScore : 78,
      aptitudeScore: st.aptitudeCompleted ? st.aptitudeScore : 82,
      wheelScore: st.wheelCompleted ? st.wheelAverage : 7.8,
      compositeScore,
      completedAt: p.createdAt || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      passed: compositeScore >= 50,
    };
  });

  return (
    <div className="space-y-6 text-left text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Candidate Results & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive evaluation matrix including Psychometric, Aptitude, and Wheel scores.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
              <BrainCircuit size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Psychometric Avg</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">81.4%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Aptitude Precision Avg</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">76.8%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              <Compass size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Wheel Competency Avg</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">8.2 / 10</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Results Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Candidate Details</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Milestone & Year</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Psychometric</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Aptitude</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Wheel</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Composite</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500 text-right">Accreditation</th>
              </tr>
            </thead>
            <tbody>
              {studentResults.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-200">{r.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {r.rollNumber} • {r.college}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="default" className="text-[9px]">
                        {r.type === "PRE" ? "Pre-Test" : "Post-Test"}
                      </Badge>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {r.year} Yr • {r.branch.split(" ")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                    {r.psychometricScore}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                    {r.aptitudeScore}%
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                    {r.wheelScore}/10
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {r.compositeScore}%
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {r.passed ? (
                      <Badge variant="default" className="text-[10px]">
                        <CheckCircle2 size={11} className="mr-1" /> Certified
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        <XCircle size={11} className="mr-1" /> Needs Review
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
              {studentResults.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    No candidate results recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

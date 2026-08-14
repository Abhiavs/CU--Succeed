import { prisma } from "@/lib/prisma";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default async function ResultGenerationPage({
  searchParams,
}: {
  searchParams: { assessmentId?: string }
}) {
  const assessmentId = searchParams.assessmentId;

  const attempts = await prisma.attempt.findMany({
    where: {
      status: "COMPLETED",
      ...(assessmentId ? { assessmentId } : {})
    },
    include: {
      student: true,
      assessment: {
        include: {
          program: true
        }
      },
    },
    orderBy: { endTime: 'desc' }
  });

  const assessmentsList = await prisma.assessment.findMany({
    select: { id: true, title: true }
  });

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Results Dashboard</h1>
          <p className="text-muted-foreground font-light">View and analyze student assessment submissions.</p>
        </div>
      </div>

      <div className="glass p-2 rounded-2xl flex flex-col md:flex-row gap-4 items-center border border-white/5">
        <div className="flex-1 w-full px-4 text-sm text-white font-medium">
          Filter by Assessment:
        </div>
        <div className="flex gap-2 w-full md:w-auto px-2 md:px-0">
          <form className="w-full flex gap-2">
            <select 
              name="assessmentId" 
              defaultValue={assessmentId || ""}
              className="bg-black/20 border border-white/10 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-w-[250px]"
            >
              <option value="">All Assessments</option>
              {assessmentsList.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            <button type="submit" className="px-4 py-2 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/10 text-sm">Filter</button>
          </form>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Student Name</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Assessment / Program</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Score</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Completion Date</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt) => (
              <tr key={attempt.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 text-sm text-white font-medium">
                  {attempt.student.name}
                  <div className="text-xs text-muted-foreground font-light">{attempt.student.email}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-white">{attempt.assessment.title}</div>
                  <div className="text-xs text-muted-foreground font-mono">{attempt.assessment.program.name}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${attempt.score && attempt.score >= 50 ? 'text-primary' : 'text-red-400'}`}>
                      {attempt.score?.toFixed(0)}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-muted-foreground">
                  {attempt.endTime ? new Date(attempt.endTime).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                </td>
                <td className="py-4 px-6 text-right">
                   {attempt.score && attempt.score >= 50 ? (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
                       <CheckCircle2 size={14} /> Passed
                     </span>
                   ) : (
                     <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium">
                       <XCircle size={14} /> Failed
                     </span>
                   )}
                </td>
              </tr>
            ))}
            {attempts.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p>No results found for the selected criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

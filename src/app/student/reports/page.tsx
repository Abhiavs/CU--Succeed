import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Award,
  TrendingUp,
  Download,
  ShieldCheck,
} from "lucide-react";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const { prisma } = await import("@/lib/prisma");

  const attemptId = resolvedParams.attemptId;
  let attempt = null;

  if (attemptId) {
    attempt = await prisma.attempt.findUnique({
      where: { id: attemptId as string },
    });
  } else {
    attempt = await prisma.attempt.findFirst({
      where: { studentId: session.user.id, status: "COMPLETED" },
      orderBy: { endTime: "desc" },
    });
  }

  const score = attempt?.score;

  return (
    <div className="flex-1 relative overflow-hidden py-10 px-6">
      {/* Animated Orbs */}
      <div className="absolute top-1/4 right-0 w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-4xl mx-auto animate-slide-up">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        {/* Header Panel */}
        <div className="glass p-8 rounded-3xl mb-8 border border-white/10 relative overflow-hidden text-center">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Award size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Performance Reports
          </h1>
          <p className="text-muted-foreground font-light max-w-lg mx-auto">
            Track your growth trajectory, view detailed gap analysis, and
            download your verified certificates.
          </p>
        </div>

        {attempt ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="glass p-8 rounded-3xl border border-primary/20 relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[30px] -z-10"></div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">
                Latest Assessment Score
              </h3>
              <div className="text-6xl font-display font-bold text-white mb-2 flex items-baseline justify-center">
                {Number(score).toFixed(0)}
                <span className="text-3xl text-primary">%</span>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mt-4">
                <TrendingUp size={14} />{" "}
                {Number(score) >= 50
                  ? "Excellent Progress"
                  : "Needs Improvement"}
              </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col justify-center space-y-6">
              <h3 className="font-semibold text-xl text-white mb-2">
                Skill Breakdown
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span>Aptitude</span>
                    <span>85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[85%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span>Soft Skills</span>
                    <span>92%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[92%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-white mb-1">
                    <span>Technical</span>
                    <span>78%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[78%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass p-12 rounded-3xl border border-white/10 text-center mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">
              No Reports Available
            </h2>
            <p className="text-muted-foreground">
              You haven't completed any assessments recently. Your reports and
              certificates will appear here once you finish a module.
            </p>
          </div>
        )}

        {/* Certificates Section */}
        <div className="glass p-8 rounded-3xl border border-white/5 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-[40px] -z-10 group-hover:bg-secondary/20 transition-all"></div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="font-bold text-2xl text-white flex items-center gap-2 mb-1">
                <ShieldCheck className="text-secondary" /> Verified Certificates
              </h2>
              <p className="text-sm text-muted-foreground font-light">
                Official credentials backed by{" "}
              </p>
            </div>
          </div>

          {attempt ? (
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center border border-secondary/30">
                  🎓
                </div>
                <div>
                  <h4 className="text-white font-medium">
                    Pre-Test Assessment Certificate
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    Issued: Today
                  </p>
                </div>
              </div>
              <button className="btn btn-outline p-2">
                <Download size={18} />
              </button>
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-white/10 rounded-xl bg-white/5">
              Complete your assessments to earn your first certificate!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

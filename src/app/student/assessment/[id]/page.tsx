import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Clock } from "lucide-react";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Fetch the specific assessment
  const assessment = await prisma.assessment.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          question: true
        }
      }
    }
  });

  const questions = assessment?.questions.map(q => q.question) || [];

  return (
    <div className="min-h-screen relative overflow-hidden py-16 px-6">
      {/* Animated Orbs */}
      <div className="absolute top-0 right-1/3 w-[30vw] h-[30vw] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[40vw] h-[40vw] bg-secondary/5 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-4xl mx-auto animate-slide-up">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link href="/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
        </div>

        {/* Header Panel */}
        <div className="glass p-8 rounded-3xl mb-8 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] -z-10"></div>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Active Module
              </div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">{assessment?.title || "Assessment"}</h1>
              <p className="text-muted-foreground font-light max-w-lg">Please answer all questions thoughtfully. Your progress is autosaved continuously.</p>
            </div>
            
            <div className="glass p-4 rounded-xl flex items-center gap-4 border border-white/5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Clock size={20} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-mono uppercase">Time Remaining</div>
                <div className="text-xl font-bold text-white">45:00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Content */}
        {!assessment ? (
          <div className="glass p-12 rounded-3xl text-center border border-white/5">
            <h2 className="text-xl font-semibold text-white mb-2">Assessment not found</h2>
            <p className="text-muted-foreground max-w-md mx-auto">This assessment does not exist or is no longer active.</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center border border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No active questions</h2>
            <p className="text-muted-foreground max-w-md mx-auto">There are currently no questions available for this assessment module. Please check back later or contact your official.</p>
          </div>
        ) : (
          <form action="/api/assessments/submit" method="POST" className="space-y-6">
            <input type="hidden" name="assessmentId" value={assessment?.id} />
            {questions.map((q, index) => {
              const options = q.options as { id: string; text: string }[];
              return (
                <div key={q.id} className="glass p-6 md:p-8 rounded-2xl border border-white/5 transition-all hover:border-white/10">
                  <div className="flex gap-4 items-start mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0 border border-primary/20">
                      {index + 1}
                    </div>
                    <h3 className="font-medium text-lg text-white leading-relaxed pt-0.5">
                      {q.text}
                    </h3>
                  </div>
                  
                  <div className="pl-12 flex flex-col gap-3">
                    {options.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded-xl cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group relative overflow-hidden">
                        {/* Radio custom style */}
                        <div className="relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-muted-foreground group-hover:border-primary transition-colors">
                          <input type="radio" name={`q_${q.id}`} value={opt.id} required className="peer absolute opacity-0 w-full h-full cursor-pointer" />
                          <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                        </div>
                        <span className="text-muted-foreground group-hover:text-white peer-checked:text-white transition-colors">{opt.text}</span>
                        
                        {/* Active state styling */}
                        <div className="absolute inset-0 border-2 border-primary/0 peer-checked:border-primary rounded-xl pointer-events-none transition-colors"></div>
                        <div className="absolute inset-0 bg-primary/5 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"></div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
            
            <div className="pt-8 flex justify-end">
              <button type="submit" className="btn btn-primary px-8 py-4 text-lg">
                <CheckCircle2 size={20} />
                Submit Assessment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

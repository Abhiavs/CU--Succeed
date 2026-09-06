import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckCircle2, Clock, BrainCircuit, Sparkles } from "lucide-react";
import { APTITUDE_QUESTIONS } from "@/lib/assessmentData";

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  // Redirect to psychometric or aptitude if accessed by alias
  if (id.toLowerCase().includes("psychometric")) {
    redirect("/student/assessment/psychometric");
  }
  if (id.toLowerCase().includes("aptitude")) {
    redirect("/student/assessment/aptitude");
  }

  let assessment = null;
  let questions: any[] = [];

  try {
    assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            question: true,
          },
        },
      },
    });

    questions = assessment?.questions.map((q) => q.question) || [];
  } catch {
    // Database offline fallback
  }

  // Fallback to sample aptitude questions if DB has no questions
  if (questions.length === 0) {
    questions = APTITUDE_QUESTIONS.map((q) => ({
      id: q.id,
      text: q.question,
      options: q.options,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden py-10 px-4 sm:px-6">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] -z-10 pointer-events-none" />

      <div className="w-full max-w-4xl mx-auto space-y-6 animate-slide-up">
        {/* Navigation */}
        <div>
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Header Panel */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 backdrop-blur-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-2xl">
          <div>
            <Badge variant="default" className="text-xs mb-3">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> Active Module
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {assessment?.title || "CU-SUCCEED Assessment Module"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Answer all questions thoughtfully. Your responses are evaluated upon submission.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <div className="text-slate-400 font-mono">Module Time</div>
              <div className="font-bold text-white">30:00</div>
            </div>
          </div>
        </div>

        {/* Assessment Questions Form */}
        <form action="/api/assessments/submit" method="POST" className="space-y-6">
          <input type="hidden" name="assessmentId" value={assessment?.id || id} />
          <input type="hidden" name="category" value="APTITUDE" />

          {questions.map((q, index) => {
            const options = q.options as { id: string; text: string }[];
            return (
              <Card key={q.id} className="border-white/10 bg-slate-900/70">
                <CardContent className="p-6 sm:p-8 space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-emerald-500/20">
                      {index + 1}
                    </div>
                    <h3 className="font-medium text-base sm:text-lg text-white leading-relaxed">
                      {q.text}
                    </h3>
                  </div>

                  <div className="pl-10 space-y-3">
                    {options.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex items-center gap-3.5 p-4 rounded-2xl border border-white/5 bg-black/20 hover:bg-white/[0.04] hover:border-emerald-500/30 cursor-pointer transition-all group"
                      >
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          value={opt.id}
                          required
                          className="w-4 h-4 text-emerald-500 accent-emerald-500 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm text-slate-300 group-hover:text-white font-medium">
                          {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="rounded-2xl px-10 shadow-emerald-500/25 bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Submit Assessment Module
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

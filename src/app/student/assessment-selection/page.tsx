"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  BrainCircuit,
  Calculator,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function AssessmentSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const year = searchParams.get("year") || "1st";
  const assessment = searchParams.get("assessment") || "PRE";

  const startPsychometric = () => {
  sessionStorage.setItem("selectedYear", year);
  sessionStorage.setItem("assessmentType", assessment);
  sessionStorage.setItem("selectedAssessment", "PSYCHOMETRIC");

  // Mark the assessment flow as started.
  // This prevents going back to registration/setup pages.
  document.cookie =
    "assessment_started=true; path=/; max-age=86400; SameSite=Lax";

  router.push("/student/assessment/psychometric");
};

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <Card className="relative w-full max-w-3xl border-white/10 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-8 sm:p-10 space-y-8">

          {/* Header */}
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-400 p-[1px]">
                <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                </div>
              </div>

              <span className="font-extrabold text-xl text-white">
                CU <span className="text-blue-400">Succeed</span>
              </span>
            </Link>

            <div>
              <Badge className="mb-3">
                {year} Year • {assessment}
              </Badge>

              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Choose Your Assessment
              </h1>

              <p className="text-sm text-slate-400 mt-2">
                Select the assessment you want to take.
              </p>
            </div>
          </div>

          {/* Assessment Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Psychometric */}
            <button
              type="button"
              onClick={startPsychometric}
              className="group text-left rounded-2xl border border-indigo-500/40 bg-indigo-500/5 p-6 transition-all hover:border-blue-400 hover:bg-indigo-500/10 hover:ring-1 hover:ring-indigo-500"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center text-blue-400">
                  <BrainCircuit className="w-6 h-6" />
                </div>

                <Badge className="bg-indigo-500/20 text-blue-400 border border-indigo-500/30">
                  Available
                </Badge>
              </div>

              <h2 className="text-xl font-bold text-white mt-5">
                Psychometric Assessment
              </h2>

              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Evaluate your competencies, behavioural dimensions and
                personal development profile.
              </p>

              <div className="flex items-center gap-4 mt-5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  One attempt
                </span>

                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  Ready
                </span>
              </div>

              <div className="mt-6">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400">
                  Start Psychometric
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>

            {/* Aptitude */}
            <div className="text-left rounded-2xl border border-slate-800 bg-slate-950/50 p-6 opacity-80">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                  <Calculator className="w-6 h-6" />
                </div>

                <Badge
                  variant="outline"
                  className="border-amber-500/30 text-amber-400"
                >
                  Coming Soon
                </Badge>
              </div>

              <h2 className="text-xl font-bold text-white mt-5">
                Aptitude Assessment
              </h2>

              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Test your logical reasoning, quantitative aptitude and
                problem-solving abilities.
              </p>

              <div className="mt-5 text-xs text-slate-500">
                This assessment will be available in a future release.
              </div>

              <Button
                disabled
                variant="outline"
                className="w-full mt-6"
              >
                Assessment Coming Soon
              </Button>
            </div>

          </div>

          <p className="text-center text-xs text-slate-600">
            You can continue with the available Psychometric Pre-Assessment.
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
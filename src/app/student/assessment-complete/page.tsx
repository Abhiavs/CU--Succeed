"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock3,
} from "lucide-react";

export default function AssessmentCompletePage() {
  const router = useRouter();

  useEffect(() => {
    /*
     * Add the completion page as the current
     * protected history entry.
     */
    window.history.pushState(
      null,
      "",
      window.location.href
    );

    const handlePopState = () => {
      /*
       * If the user presses the browser Back button,
       * send them to the sign-in page instead of
       * Psychometric or Wheel.
       */

      router.replace("/");
    };

    window.addEventListener(
      "popstate",
      handlePopState
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handlePopState
      );
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center px-4 py-10 relative overflow-hidden text-slate-100">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <Card className="relative w-full max-w-xl border-slate-800 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-8 sm:p-12 text-center">

          {/* Brand */}
          <div className="flex justify-center mb-8">
            <Link href="/student" className="inline-flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px]">
                <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <span className="font-extrabold text-xl text-white">
                Succeed<span className="text-emerald-400">Academy</span>
              </span>
            </Link>
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />

              <div className="relative w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-11 h-11 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Assessment Successfully Completed
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Well Done! 🎉
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
              Your Psychometric Pre-Assessment has been successfully submitted.
              Your responses have been securely recorded.
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 text-left">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">
                  Submission Recorded
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your assessment attempt has been saved successfully.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock3 className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">
                  Evaluation Complete
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Your responses are now available for evaluation.
              </p>
            </div>
          </div>

          {/* Notice */}
          <div className="mt-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <p className="text-xs text-slate-400 leading-relaxed">
              You have completed your{" "}
              <strong className="text-emerald-400">
                Psychometric Pre-Assessment
              </strong>
              . Your assessment record has been linked to your student account.
            </p>
          </div>

          {/* Action */}
          <div className="mt-8">
            
              <Button
                size="lg"
                className="w-full rounded-2xl h-11 font-semibold"
              >
                Return to Student Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            
          </div>

          {/* Footer */}
          <p className="mt-6 text-[10px] text-slate-600">
            SucceedAcademy • CU-SUCCEED • Psychometric Pre-Assessment
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
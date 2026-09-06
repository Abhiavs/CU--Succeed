"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";

export default function SelectYearPage() {
  const router = useRouter();

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState("");

  const handleContinue = () => {
    if (!selectedYear || !selectedAssessment) return;

    // Keep the student's selection available for the assessment flow.
    sessionStorage.setItem("selectedYear", selectedYear);
    sessionStorage.setItem("assessmentType", selectedAssessment);

    // IMPORTANT:
    // Registration is already complete.
    // Do NOT send the student back to /signup.
    router.push(
      `/student/assessment-selection?year=${encodeURIComponent(
        selectedYear
      )}&assessment=${encodeURIComponent(selectedAssessment)}`
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden bg-slate-950 p-4">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <Card className="border-white/10 bg-slate-900/85 backdrop-blur-xl w-full max-w-2xl shadow-2xl">
        <CardContent className="p-8 sm:p-10 space-y-8">

          {/* Branding */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px]">
                <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              <span className="font-extrabold text-xl text-white">
                Succeed<span className="text-emerald-400">Academy</span>
              </span>
            </Link>

            <Badge variant="default" className="text-xs">
              CU-SUCCEED
            </Badge>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              Assessment Setup
            </h1>

            <p className="text-sm text-slate-400">
              Select your academic year and assessment type to continue.
            </p>
          </div>

          {/* Step 1: Academic Year */}
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-mono font-semibold text-emerald-400 uppercase">
                Step 1
              </div>

              <h2 className="text-lg font-bold text-white">
                Select Academic Year
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Choose your current academic year.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedYear("1st")}
              className={`w-full p-5 rounded-xl border text-left transition-all ${
                selectedYear === "1st"
                  ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                  : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      selectedYear === "1st"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="font-bold text-white">
                      1st Year
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      Undergraduate • First Year
                    </div>
                  </div>
                </div>

                {selectedYear === "1st" && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
            </button>
          </div>

          {/* Step 2: Pre-Assessment */}
          <div className="space-y-3">
            <div>
              <div className="text-[11px] font-mono font-semibold text-blue-400 uppercase">
                Step 2
              </div>

              <h2 className="text-lg font-bold text-white">
                Select Assessment
              </h2>

              <p className="text-xs text-slate-400 mt-1">
                Your initial assessment is a Pre-Assessment.
              </p>
            </div>

            <button
              type="button"
              disabled={!selectedYear}
              onClick={() => setSelectedAssessment("PRE")}
              className={`w-full p-5 rounded-xl border text-left transition-all ${
                !selectedYear
                  ? "border-slate-800 bg-slate-950/30 opacity-50 cursor-not-allowed"
                  : selectedAssessment === "PRE"
                  ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500"
                  : "border-slate-800 bg-slate-950/50 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      selectedAssessment === "PRE"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <BrainCircuit className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="font-bold text-white">
                      Pre-Assessment
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      Initial student competency assessment
                    </div>
                  </div>
                </div>

                {selectedAssessment === "PRE" && (
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                )}
              </div>
            </button>
          </div>

          {/* Continue */}
          <Button
            type="button"
            onClick={handleContinue}
            disabled={!selectedYear || !selectedAssessment}
            size="lg"
            className="w-full rounded-2xl"
          >
            <span className="flex items-center gap-2">
              Continue to Assessment Selection
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>

          <p className="text-center text-xs text-slate-500">
            Your selection will be used for this assessment session.
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  GraduationCap,
  Compass,
  Zap,
  User,
  Hash,
  BookOpen,
  Building2,
  Mail,
  Lock,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";

type AssessmentType = "PRE" | "POST";
type AcademicYear = "1st" | "2nd" | "3rd" | "4th";

export default function StartAssessmentWizard() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [assessmentType, setAssessmentType] = useState<AssessmentType>("PRE");
  const [academicYear, setAcademicYear] = useState<AcademicYear>("3rd");

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    branch: "Computer Science & Engineering",
    collegeName: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    setErrorMessage("");
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 2 | 3);
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          rollNumber: formData.rollNumber,
          branch: formData.branch,
          year: academicYear,
          assessmentType: assessmentType,
          collegeName: formData.collegeName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      const loginResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (loginResult?.error) {
        router.push("/student");
      } else {
        router.push("/student");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-between py-8 px-4 sm:px-6 text-slate-100">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
            SA
          </div>
          <span className="font-bold text-sm text-white">
            Succeed<span className="text-emerald-400 font-semibold">Academy</span>
          </span>
        </Link>

        {/* Clean Step Counter */}
        <div className="flex items-center gap-2 text-xs">
          <span className={`font-semibold ${currentStep >= 1 ? "text-emerald-400" : "text-slate-500"}`}>
            1. Select Type
          </span>
          <span className="text-slate-600">/</span>
          <span className={`font-semibold ${currentStep >= 2 ? "text-emerald-400" : "text-slate-500"}`}>
            2. Select Year
          </span>
          <span className="text-slate-600">/</span>
          <span className={`font-semibold ${currentStep === 3 ? "text-emerald-400" : "text-slate-500"}`}>
            3. Registration
          </span>
        </div>
      </header>

      {/* Main Split Grid */}
      <main className="max-w-6xl mx-auto w-full my-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Interactive Step Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: SELECT TYPE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <Badge variant="outline" className="mb-2">
                  STEP 1 OF 3
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Choose Assessment Milestone
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Select between a pre-training diagnostic baseline or a post-training outcome evaluation.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setAssessmentType("PRE")}
                  className={`p-6 rounded-xl border cursor-pointer transition-all ${
                    assessmentType === "PRE"
                      ? "border-emerald-500 bg-slate-900 ring-1 ring-emerald-500"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Compass className="w-5 h-5" />
                    </div>
                    {assessmentType === "PRE" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  </div>
                  <h3 className="font-bold text-base text-white mb-1">Pre-Assessment</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Baseline competency evaluation before training. Identifies innate cognitive strengths and personal skill gaps.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400 font-medium">
                    Diagnostic Baseline Track
                  </div>
                </div>

                <div
                  onClick={() => setAssessmentType("POST")}
                  className={`p-6 rounded-xl border cursor-pointer transition-all ${
                    assessmentType === "POST"
                      ? "border-blue-500 bg-slate-900 ring-1 ring-blue-500"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    {assessmentType === "POST" && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                  </div>
                  <h3 className="font-bold text-base text-white mb-1">Post-Assessment</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Growth measurement following course completion. Validates training efficacy and issues verified credentials.
                  </p>
                  <div className="text-[11px] font-mono text-blue-400 font-medium">
                    Growth & Accreditation Track
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleNext} className="h-10 px-6 text-xs font-semibold">
                  Next: Select Academic Year <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: SELECT YEAR */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <Badge variant="outline" className="mb-2">
                  STEP 2 OF 3
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Select Academic Cohort Year
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  Calibrates benchmark difficulty and placement metrics to your cohort.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "1st" as AcademicYear, title: "1st Year", subtitle: "Freshman", desc: "Foundations & logic" },
                  { id: "2nd" as AcademicYear, title: "2nd Year", subtitle: "Sophomore", desc: "Core analytical skills" },
                  { id: "3rd" as AcademicYear, title: "3rd Year", subtitle: "Junior", desc: "Pre-placement prep" },
                  { id: "4th" as AcademicYear, title: "4th Year", subtitle: "Final Year", desc: "Industry readiness" },
                ].map((yr) => {
                  const isSelected = academicYear === yr.id;
                  return (
                    <div
                      key={yr.id}
                      onClick={() => setAcademicYear(yr.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all text-center ${
                        isSelected
                          ? "border-emerald-500 bg-slate-900 ring-1 ring-emerald-500"
                          : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-300 font-bold text-xs">
                        {yr.id}
                      </div>
                      <div className="font-bold text-sm text-white">{yr.title}</div>
                      <div className="text-[11px] text-emerald-400 font-mono mb-1">{yr.subtitle}</div>
                      <div className="text-[10px] text-slate-400">{yr.desc}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={handleBack} className="text-xs text-slate-400">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                </Button>
                <Button onClick={handleNext} className="h-10 px-6 text-xs font-semibold">
                  Next: Student Registration <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: REGISTER */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <Badge variant="outline" className="mb-2">
                  STEP 3 OF 3
                </Badge>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Candidate Profile Registration
                </h1>
                <p className="text-xs text-slate-400">
                  Complete your details to link your assessment responses and generate verified credentials.
                </p>
              </div>

              <Card className="border-slate-800 bg-slate-900">
                <CardContent className="p-6 space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                      {errorMessage}
                    </div>
                  )}

                  <form onSubmit={handleSubmitRegistration} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs text-slate-300">
                          Full Legal Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="e.g. Alex Johnson"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="rollNumber" className="text-xs text-slate-300">
                          Student Roll / ID Number
                        </Label>
                        <Input
                          id="rollNumber"
                          placeholder="e.g. 2026-CSE-104"
                          value={formData.rollNumber}
                          onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="branch" className="text-xs text-slate-300">
                          Branch / Department
                        </Label>
                        <select
                          id="branch"
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          className="h-10 text-xs"
                        >
                          <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Electronics & Communication">Electronics & Communication</option>
                          <option value="Mechanical Engineering">Mechanical Engineering</option>
                          <option value="Civil Engineering">Civil Engineering</option>
                          <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                          <option value="Business Administration & Management">MBA / Management</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="collegeName" className="text-xs text-slate-300">
                          College / University
                        </Label>
                        <Input
                          id="collegeName"
                          placeholder="e.g. Succeed Academy of Tech"
                          value={formData.collegeName}
                          onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="email" className="text-xs text-slate-300">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="student@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="password" className="text-xs text-slate-300">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        disabled={isLoading}
                        className="text-xs text-slate-400"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
                      </Button>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-10 px-6 text-xs font-semibold"
                      >
                        {isLoading ? "Provisioning..." : "Launch Assessment Dashboard"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Live Candidate Assessment Passport */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-slate-800 bg-slate-900 p-5 space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-400">ASSESSMENT PASSPORT</span>
              <span className="text-[10px] font-mono text-emerald-400">LIVE SYNC</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Candidate Name</div>
                <div className="font-bold text-white text-sm">
                  {formData.name || "—"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Milestone</div>
                  <Badge variant="default" className="text-[10px] mt-0.5">
                    {assessmentType === "PRE" ? "Pre-Assessment" : "Post-Assessment"}
                  </Badge>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-mono">Cohort</div>
                  <Badge variant="secondary" className="text-[10px] mt-0.5">
                    {academicYear} Year
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Roll / Student ID</div>
                <div className="font-mono text-slate-200">{formData.rollNumber || "—"}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Department</div>
                <div className="text-slate-200">{formData.branch}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-mono">Institution</div>
                <div className="text-slate-200">{formData.collegeName || "Succeed Academy"}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>3 Assessment Tracks Activated</span>
            </div>
          </Card>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 pt-4">
        SucceedAcademy Candidate Onboarding Protocol
      </footer>
    </div>
  );
}

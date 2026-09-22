"use client";

import { useState } from "react";

import { useRouter} from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Lock,
  Hash,
  BookOpen,
  Building2,
  ChevronDown,
  Layers,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const BRANCHES = [
  "Computer Science",
  "Information Technology",
  "Electronics and Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biotechnology",
  "Artificial Intelligence & Machine Learning",
  "Artificial Intelligence & Data Science",
];

const COLLEGES = [
  "Pravara Rural Engineering College, Loni",
];

const BATCHES = ["Batch 2.1"];

export default function SignupPage() {
  const router = useRouter();

  const selectedYear = "1st";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [batch, setBatch] = useState("Batch 2.1");
  const [collegeName, setCollegeName] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Roll numbers must be compact codes (e.g. "12", "21CS045") — students
    // were typing branch names and sentences into this field.
    const normalizedRoll = rollNumber.trim();
    if (!/\d/.test(normalizedRoll) || /\s/.test(normalizedRoll) || normalizedRoll.length > 15) {
      setError(
        "Please enter a valid roll number (numbers only, no spaces — e.g. 42 or 21CS045)."
      );
      setLoading(false);
      return;
    }

    try {
      // Create the student account in PostgreSQL.
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          rollNumber,
          branch,
          batch,
          year: selectedYear,
          assessmentType: "PRE",
          collegeName,
        }),
      });

      const signupData = await signupResponse.json();

      if (!signupResponse.ok) {
        setError(
          signupData.error ||
            signupData.message ||
            "Unable to create your account."
        );
        setLoading(false);
        return;
      }

      // Automatically log the newly created student in.
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!loginResult || loginResult.error) {
        setError(
          "Your account was created, but automatic login failed. Please sign in."
        );
        setLoading(false);
        return;
      }

      // Continue to academic year selection
      router.push("/select-year");
      router.refresh();
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Something went wrong while creating your account. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden bg-slate-950 p-4">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <Card className="border-white/10 bg-slate-900/85 backdrop-blur-xl w-full max-w-md shadow-2xl animate-fade-in relative">
        <CardContent className="p-8 sm:p-10 space-y-6">

          {/* Branding */}
          <div className="text-center space-y-2 flex flex-col items-center">
            <Logo href="/" size="lg" className="mb-2" />

            <h2 className="text-xl font-bold text-white tracking-tight">
              Student Registration
            </h2>

            <p className="text-xs text-slate-400">
              Academic Year:{" "}
              <span className="text-blue-400 font-semibold">
                First Year
              </span>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Full Name
              </Label>

              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Roll Number */}
            <div className="space-y-1.5">
              <Label
                htmlFor="rollNumber"
                className="flex items-center gap-1.5"
              >
                <Hash className="w-3.5 h-3.5 text-indigo-400" />
                Roll Number
              </Label>

              <Input
                id="rollNumber"
                placeholder="e.g. 42"
                value={rollNumber}
                onChange={(e) =>
                  setRollNumber(e.target.value.replace(/\s+/g, ""))
                }
                maxLength={15}
                required
              />
            </div>

            {/* Batch Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="batch" className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Batch
              </Label>

              <div className="relative">
                <select
                  id="batch"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                  className="flex h-10 w-full appearance-none rounded-md border border-slate-700 bg-slate-950 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="" disabled>
                    Select your batch
                  </option>

                  {BATCHES.map((batchOption) => (
                    <option key={batchOption} value={batchOption}>
                      {batchOption}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Branch Dropdown */}
            <div className="space-y-1.5">
              <Label htmlFor="branch" className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                Branch
              </Label>

              <div className="relative">
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  required
                  className="flex h-10 w-full appearance-none rounded-md border border-slate-700 bg-slate-950 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="" disabled>
                    Select your branch
                  </option>

                  {BRANCHES.map((branchOption) => (
                    <option key={branchOption} value={branchOption}>
                      {branchOption}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* College Dropdown */}
            <div className="space-y-1.5">
              <Label
                htmlFor="collegeName"
                className="flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                College
              </Label>

              <div className="relative">
                <select
                  id="collegeName"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                  className="flex h-10 w-full appearance-none rounded-md border border-slate-700 bg-slate-950 px-3 py-2 pr-10 text-sm text-slate-100 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="" disabled>
                    Select your college
                  </option>

                  {COLLEGES.map((collegeOption) => (
                    <option key={collegeOption} value={collegeOption}>
                      {collegeOption}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                Gmail / Email Address
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="student@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full rounded-2xl shadow-indigo-500/20 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                 Creating Account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Register & Continue
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-white/10 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
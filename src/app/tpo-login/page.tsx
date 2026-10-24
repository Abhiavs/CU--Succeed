"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, Building2 } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function TpoLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
      } else {
        router.push("/tpo");
      }
    } catch {
      setError("Failed to authenticate. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl w-full max-w-md p-8 rounded-2xl text-slate-900 dark:text-slate-100">
        <CardContent className="space-y-6 p-0">
          <div className="flex flex-col items-center text-center space-y-3">
            <Logo href="/" size="lg" subtitle="TPO Portal" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" /> Institutional Placement Access
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with your authorized Training & Placement Officer credentials.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="tpo-email" className="text-xs font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" /> College Email Address
              </Label>
              <Input
                id="tpo-email"
                type="email"
                placeholder="head@pravaraengineering.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tpo-password" className="text-xs font-medium flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" /> Password
              </Label>
              <Input
                id="tpo-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-11 text-sm gap-2"
            >
              {loading ? "Authenticating..." : "Sign In to TPO Portal"} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="text-center pt-2">
            <a href="/" className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">
              ← Return to Home
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

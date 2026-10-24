"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
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
        router.push("/student");
      }
    } catch {
      setError("Failed to authenticate. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden bg-gray-50 dark:bg-[#0b2227] p-4 transition-colors">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-[#143a41] shadow-2xl w-full max-w-md relative transition-colors">
        <CardContent className="p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2 flex flex-col items-center">
            <Logo href="/" size="lg" className="mb-2" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Student Portal Sign In</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Access your assessments, dimension wheel, and certificates.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300 text-xs font-medium">
                <Mail className="w-3.5 h-3.5 text-[#006f73] dark:text-indigo-400" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="flex items-center gap-1.5 text-gray-700 dark:text-slate-300 text-xs font-medium">
                <Lock className="w-3.5 h-3.5 text-[#006f73] dark:text-sky-400" /> Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full bg-[#006f73] dark:bg-indigo-600 hover:bg-[#14574f] dark:hover:bg-indigo-700 text-white font-medium py-2.5 transition-all shadow-md rounded-xl mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="pt-6 border-t border-gray-200 dark:border-slate-800 flex flex-col gap-2.5 text-center text-xs text-gray-500 dark:text-slate-400">
            <p>
              New student?{" "}
              <Link href="/start" className="text-[#006f73] dark:text-indigo-400 font-semibold hover:underline">
                Register here
              </Link>
            </p>
            <div className="flex items-center justify-center gap-4 pt-1">
              <Link href="/tpo-login" className="hover:text-[#006f73] dark:hover:text-white transition-colors">
                TPO Login
              </Link>
              <span>•</span>
              <Link href="/admin-login" className="hover:text-[#006f73] dark:hover:text-white transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

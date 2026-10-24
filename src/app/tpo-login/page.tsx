"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mail, Lock, ArrowRight, Building } from "lucide-react";
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
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden bg-slate-950 p-4">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />

      <Card className="border-white/10 bg-slate-900/85 backdrop-blur-xl w-full max-w-md shadow-2xl animate-fade-in relative">
        <CardContent className="p-8 sm:p-10 space-y-6">
          {/* Branding */}
          <div className="text-center space-y-2 flex flex-col items-center">
            <Logo href="/" size="lg" className="mb-2" />
            <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
              College Head / TPO Portal
            </Badge>
            <h2 className="text-xl font-bold text-white tracking-tight">
              TPO & College Head Login
            </h2>
            <p className="text-xs text-slate-400">
              Access your college student assessment analytics & reports
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                College Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="head@pravaraengineering.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                Password
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
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 transition-all"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in as TPO / Head"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400 flex items-center justify-between">
            <Link href="/login" className="hover:text-emerald-400 transition-colors">
              Student Login
            </Link>
            <span>•</span>
            <Link href="/admin-login" className="hover:text-emerald-400 transition-colors">
              Admin Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

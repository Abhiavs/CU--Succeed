"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function AdminLoginPage() {
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
        setError("Invalid administrator credentials. Please check and try again.");
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } catch {
      setError("Failed to authenticate. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b2227] flex flex-col justify-center items-center px-4 sm:px-6 text-gray-800 dark:text-[#b9d8cf] transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2 flex flex-col items-center">
          <Logo href="/" size="lg" />
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-slate-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-[#006f73] dark:text-emerald-400" />
            <span>Official Administrator Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-[#143a41] shadow-2xl transition-colors">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="space-y-1 text-left">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Administrator Sign In</h2>
              <p className="text-xs text-gray-500 dark:text-slate-400">
                Access cohort analytics, question banks, and certificate issuing controls.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <Label htmlFor="admin-email" className="text-xs text-gray-700 dark:text-slate-300 font-medium">
                  Admin Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@cusucceed.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="admin-password" className="text-xs text-gray-700 dark:text-slate-300 font-medium">
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#006f73] dark:bg-emerald-600 hover:bg-[#14574f] dark:hover:bg-emerald-700 text-white font-medium py-2.5 transition-all"
                disabled={loading}
              >
                {loading ? "Authenticating..." : "Sign in as Administrator"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="pt-2 text-center text-xs text-gray-500 dark:text-slate-400">
              <Link href="/login" className="hover:text-[#006f73] dark:hover:text-emerald-400 transition-colors">
                Return to Student Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

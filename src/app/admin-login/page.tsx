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
import { ShieldCheck, ArrowRight, Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@succeed.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid admin credentials. Please use admin@succeed.com / admin123");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 sm:px-6 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
              SA
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Succeed<span className="text-emerald-400 font-semibold">Academy</span>
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Administrator Portal</span>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-slate-900">
          <CardContent className="p-6 sm:p-8 space-y-4">
            <div className="space-y-1 text-left">
              <h2 className="text-lg font-bold text-white">Administrator Sign In</h2>
              <p className="text-xs text-slate-400">
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
                <Label htmlFor="admin-email" className="text-xs text-slate-300">
                  Admin Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@succeed.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="admin-password" className="text-xs text-slate-300">
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

              {/* Default Credential Helper Box */}
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Default Administrator Credentials:</div>
                <div className="font-mono text-slate-400">
                  Email: <strong className="text-emerald-400">admin@succeed.com</strong> (or <strong className="text-emerald-400">admin@cusucceed.com</strong>)
                </div>
                <div className="font-mono text-slate-400">
                  Password: <strong className="text-emerald-400">admin123</strong>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 text-xs font-semibold"
              >
                {loading ? "Authenticating..." : "Access Admin Portal"}
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-400">
          Student taking an assessment?{" "}
          <Link href="/login" className="text-emerald-400 font-semibold hover:underline">
            Student Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

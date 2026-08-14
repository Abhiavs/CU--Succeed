"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid admin credentials");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-secondary/10 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="glass p-10 rounded-3xl w-full max-w-md mx-4 animate-slide-up relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent rounded-t-3xl"></div>
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block font-display font-bold text-2xl text-white mb-2">
            SucceedAcademy
          </Link>
          <h2 className="text-lg text-secondary font-light flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Official Portal
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">Admin Email</label>
            <input
              type="email"
              placeholder="admin@cusucceed.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:border-secondary focus:ring-secondary/20 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:border-secondary focus:ring-secondary/20 focus:shadow-[0_0_0_2px_rgba(59,130,246,0.3)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-secondary w-full py-4 text-base mt-2"
          >
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Access Portal"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm font-medium text-muted-foreground">
          <p>
            Are you a student? <Link href="/login" className="text-primary hover:text-primary-glow transition-colors hover:underline">Student Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

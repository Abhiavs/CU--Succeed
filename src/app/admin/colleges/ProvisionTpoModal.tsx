"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, ShieldCheck, Mail, Building, User, Lock } from "lucide-react";

export default function ProvisionTpoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/provision-tpo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, collegeName }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to provision TPO account.");
        setLoading(false);
      } else {
        setSuccess("TPO account provisioned successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setCollegeName("");
        setLoading(false);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess("");
          router.refresh();
        }, 1500);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => setIsOpen(true)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 h-9"
      >
        <PlusCircle className="w-4 h-4" /> Provision a TPO
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-bold">Provision TPO Account</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium text-center">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleProvision} className="space-y-4 text-left">
              <div className="space-y-1">
                <Label htmlFor="tpo-name" className="text-xs font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-500" /> TPO Name
                </Label>
                <Input
                  id="tpo-name"
                  placeholder="Dr. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tpo-college" className="text-xs font-medium flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-500" /> College Name
                </Label>
                <Input
                  id="tpo-college"
                  placeholder="Pravara Rural Engineering College"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tpo-email" className="text-xs font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" /> College Email Address
                </Label>
                <Input
                  id="tpo-email"
                  type="email"
                  placeholder="head@pravaraengineering.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tpo-password" className="text-xs font-medium flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" /> Temporary Password
                </Label>
                <Input
                  id="tpo-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={loading}
                >
                  {loading ? "Provisioning..." : "Confirm & Provision"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton({ className, variant = "default" }: { className?: string, variant?: "default" | "icon" }) {
  if (variant === "icon") {
    return (
      <button 
        onClick={() => signOut({ callbackUrl: '/' })} 
        className={className || "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors text-muted-foreground w-full text-left"}
      >
        <LogOut size={18} />
        Sign Out
      </button>
    );
  }

  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className={className || "text-coral font-medium hover:text-coral-dark transition-colors underline"}
    >
      Logout
    </button>
  );
}

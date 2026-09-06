"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  className,
}: {
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-950/30 border-slate-300 dark:border-slate-800 transition-colors cursor-pointer ${
        className || ""
      }`}
      title="Sign Out / Logout"
      aria-label="Logout"
    >
      <LogOut className="w-4 h-4" />
    </Button>
  );
}

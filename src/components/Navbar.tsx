import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Compass, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
            CA
          </div>
          <div className="font-bold text-base text-white tracking-tight">
            CU-<span className="text-emerald-400 font-semibold">SUCCEED</span>
          </div>
        </Link>

        
        {/* Action Buttons & Theme Changer */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          {session ? (
            <div className="flex items-center gap-2">
              <Link href={session.user.role === "OFFICIAL" ? "/admin" : "/student"}>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{session.user.name}</span>
                </Button>
              </Link>
              <Link href="/student">
                <Button size="sm" className="text-xs h-8">
                  Dashboard <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-xs text-slate-300 hover:text-white h-8">
                  Sign In
                </Button>
              </Link>
            
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShieldCheck, User } from "lucide-react";
import { Logo } from "@/components/Logo";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      {/* Unified Single Student Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <Logo href="/student" size="md" subtitle="Student Portal" />

          {/* Nav items */}
          <nav className="flex items-center gap-5 text-xs font-medium text-slate-600 dark:text-slate-300">
            <Link href="/student" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/student/results" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              Scorecard & Certificate
            </Link>
          </nav>

          {/* Right actions: ThemeToggle + Student Info + Logout */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
              <User className="w-3.5 h-3.5 text-indigo-600 dark:text-blue-400" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{session.user.name}</span>
            </div>

            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

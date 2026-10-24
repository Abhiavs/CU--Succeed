import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  FileSpreadsheet,
  ClipboardList,
  HelpCircle,
  BarChart3,
  ShieldCheck,
  UserCheck,
  Compass,
  Building2,
} from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "OFFICIAL") {
    redirect("/admin-login");
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Assessments", href: "/admin/assessments", icon: ClipboardList },
    { label: "Wheel Dimensions", href: "/admin/wheel-dimensions", icon: Compass },
    { label: "Question Bank", href: "/admin/questions", icon: HelpCircle },
    { label: "Results", href: "/admin/results", icon: FileSpreadsheet },
    { label: "Certificates", href: "/admin/certificates", icon: BookOpen },
    { label: "Training Matrix", href: "/admin/matrix", icon: BarChart3 },
    { label: "College & TPO Mgmt", href: "/admin/colleges", icon: Building2 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between z-20">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Logo href="/admin" size="md" subtitle="OFFICIAL PORTAL" />
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-3 px-3 text-left">
              Management
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {session.user.name?.[0] || "A"}
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{session.user.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{session.user.email}</div>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

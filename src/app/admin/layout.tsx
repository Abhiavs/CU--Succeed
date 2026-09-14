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

  {
    label: "Wheel Dimensions",
    href: "/admin/wheel-dimensions",
    icon: Compass,
  },

  { label: "Question Bank", href: "/admin/questions", icon: HelpCircle },

  { label: "Results", href: "/admin/results", icon: FileSpreadsheet },

  { label: "Certificates", href: "/admin/certificates", icon: BookOpen },

  { label: "Training Matrix", href: "/admin/matrix", icon: BarChart3 },
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

        {/* Footer with Administrator Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/10 dark:bg-blue-500/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-blue-400 flex-shrink-0">
            {session.user.name?.charAt(0) || "A"}
          </div>
          <div className="text-xs text-left min-w-0 flex-1">
            <div className="font-semibold text-slate-900 dark:text-white truncate">
              {session.user.name}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Administrator</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Nav with ThemeToggle AND Logout */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-400">ADMIN CONTROL CENTER</span>
            <Badge variant="outline" className="text-[10px]">
              Active Session
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <span className="hidden sm:inline">
              Server Status: <strong className="text-indigo-600 dark:text-blue-400">Online</strong>
            </span>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-800 hidden sm:block" />
            <ThemeToggle />
            <SignOutButton />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

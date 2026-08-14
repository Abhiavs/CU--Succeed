import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, FileSpreadsheet, ClipboardList, HelpCircle, BarChart3, Settings } from "lucide-react";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "OFFICIAL") {
    redirect("/admin-login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Glass Sidebar */}
      <aside className="w-64 flex-shrink-0 glass border-r border-border flex flex-col relative z-20">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <Link href="/admin" className="font-display font-bold text-xl text-secondary">
            SucceedAcademy
          </Link>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4 pl-3">Main Menu</div>
          <nav className="space-y-2">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-foreground">
              <LayoutDashboard size={18} className="text-secondary" />
              Dashboard
            </Link>
            <Link href="/admin/assessments" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
              <ClipboardList size={18} className="text-muted-foreground" />
              Assessments
            </Link>
            <Link href="/admin/questions" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
              <HelpCircle size={18} className="text-muted-foreground" />
              Question Bank
            </Link>
            <Link href="/admin/results" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
              <FileSpreadsheet size={18} className="text-muted-foreground" />
              Results
            </Link>
            <Link href="/admin/certificates" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
              <BookOpen size={18} className="text-muted-foreground" />
              Certificates
            </Link>
            <Link href="/admin/matrix" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
              <BarChart3 size={18} className="text-muted-foreground" />
              Training Matrix
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-border">
           <SignOutButton variant="icon" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Animated Orbs for the Dashboard */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10"></div>

        {/* Top Header */}
        <header className="h-16 glass border-b border-border flex items-center justify-between px-8 relative z-10">
          <h1 className="text-lg font-semibold text-white">Official Portal</h1>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
               <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-secondary to-purple-500 flex items-center justify-center text-xs font-bold">
                 {session.user.name?.charAt(0) || "A"}
               </div>
               <span className="text-sm font-medium">{session.user.name}</span>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

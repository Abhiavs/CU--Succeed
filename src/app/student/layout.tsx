import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 z-50 glass px-6 py-4 border-b border-white/5">
        <div className="max-w-[1080px] mx-auto flex items-center justify-between">
          <Link href="/student" className="font-display font-bold text-xl text-white whitespace-nowrap hover:text-primary transition-colors">
            SucceedAcademy <span className="text-sm font-light text-muted-foreground ml-2">Student Portal</span>
          </Link>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:flex items-center gap-4 text-sm font-medium">
               <Link href="/student" className="text-muted-foreground hover:text-white transition-colors">Dashboard</Link>
               <Link href="/student/reports" className="text-muted-foreground hover:text-white transition-colors">Reports</Link>
             </div>
             <div className="flex items-center gap-4 border-l border-white/10 pl-4">
                <div className="hidden md:block text-sm">
                  <div className="text-white font-medium">{session.user.name}</div>
                  <div className="text-xs text-muted-foreground">{session.user.email}</div>
                </div>
                <SignOutButton className="btn btn-outline hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium px-4 py-2" />
             </div>
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const studentCount = await prisma.user.count({ where: { role: "STUDENT" } });
  const activeAssessmentsCount = await prisma.assessment.count({ where: { isActive: true } });
  const questionCount = await prisma.question.count();
  
  // Calculate average completion rate
  const totalAttempts = await prisma.attempt.count({ where: { status: "COMPLETED" } });
  const totalExpectedAttempts = studentCount * activeAssessmentsCount;
  const avgCompletion = totalExpectedAttempts > 0 ? Math.round((totalAttempts / totalExpectedAttempts) * 100) : 0;

  // Recent activity — fetch the latest 5 completed attempts
  const recentAttempts = await prisma.attempt.findMany({
    where: { status: "COMPLETED" },
    orderBy: { endTime: 'desc' },
    take: 5,
    include: {
      student: { select: { name: true } },
      assessment: { select: { title: true } },
    }
  });
  
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground font-light">Welcome back. Here is the latest on the SucceedAcademy platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-2xl glass-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full blur-[30px] -z-10"></div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Total Students</h3>
          <div className="text-5xl font-bold text-white mb-2">{studentCount}</div>
          <div className="text-sm text-muted-foreground">Registered on platform</div>
        </div>

        <div className="glass p-6 rounded-2xl glass-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/20 rounded-full blur-[30px] -z-10"></div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Active Assessments</h3>
          <div className="text-5xl font-bold text-white mb-2">{activeAssessmentsCount}</div>
          <div className="text-sm text-muted-foreground">Currently active</div>
        </div>

        <div className="glass p-6 rounded-2xl glass-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/20 rounded-full blur-[30px] -z-10"></div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Question Bank</h3>
          <div className="text-5xl font-bold text-white mb-2">{questionCount}</div>
          <div className="text-sm text-muted-foreground">Total questions</div>
        </div>

        <div className="glass p-6 rounded-2xl glass-hover relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/20 rounded-full blur-[30px] -z-10"></div>
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Avg. Completion</h3>
          <div className="text-5xl font-bold text-white mb-2">{avgCompletion}%</div>
          <div className="text-sm text-muted-foreground">Across all assessments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="glass p-6 rounded-2xl">
           <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
           <div className="space-y-4">
             {recentAttempts.length === 0 ? (
               <div className="text-center py-8 text-sm text-muted-foreground">
                 No student activity yet. Assessments will appear here once students start taking tests.
               </div>
             ) : (
               recentAttempts.map((attempt) => (
                 <div key={attempt.id} className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                     <span className="text-primary font-bold text-sm">{attempt.student.name?.charAt(0) || "?"}</span>
                   </div>
                   <div className="flex-1 min-w-0">
                     <div className="text-sm font-medium text-white truncate">{attempt.student.name} completed <span className="text-primary">{attempt.assessment.title}</span></div>
                     <div className="text-xs text-muted-foreground font-mono mt-1">Score: {attempt.score?.toFixed(0)}% • {attempt.endTime ? new Date(attempt.endTime).toLocaleDateString() : 'N/A'}</div>
                   </div>
                 </div>
               ))
             )}
           </div>
         </div>
         
         <div className="glass p-6 rounded-2xl bg-gradient-to-br from-card to-secondary/5 border-secondary/20">
           <h3 className="text-lg font-semibold text-white mb-2">Need to create an assessment?</h3>
           <p className="text-sm text-muted-foreground mb-6 font-light">Set up a new Pre-Test or Post-Test, select questions from the bank, and map it to a specific course.</p>
           <Link href="/admin/assessments/new" className="inline-block px-6 py-3 bg-secondary text-white rounded-xl font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-secondary/90 transition-all">
             + New Assessment
           </Link>
         </div>
      </div>
    </div>
  );
}

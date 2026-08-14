import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { BookOpen, FileSpreadsheet, Activity } from "lucide-react";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  const { prisma } = await import("@/lib/prisma");
  
  // Fetch the student with their enrolled programs and associated active assessments
  const studentData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      programs: {
        include: {
          assessments: {
            where: { isActive: true },
            include: {
              attempts: {
                where: { studentId: session.user.id }
              }
            }
          }
        }
      }
    }
  });

  const enrolledPrograms = studentData?.programs || [];
  
  // Calculate stats based on enrolled programs
  let activeAssessmentsCount = 0;
  let completedAttemptsCount = 0;

  enrolledPrograms.forEach(program => {
    program.assessments.forEach(assessment => {
      activeAssessmentsCount++;
      if (assessment.attempts.length > 0 && assessment.attempts[0].status === "COMPLETED") {
        completedAttemptsCount++;
      }
    });
  });



  // Get certificates
  const certificatesCount = await prisma.certificate.count({
    where: { studentId: session.user.id }
  });

  const completionPercentage = activeAssessmentsCount > 0 
    ? Math.round((completedAttemptsCount / activeAssessmentsCount) * 100) 
    : 0;

  return (
    <div className="flex-1 relative overflow-hidden flex flex-col items-center py-10 px-6">
      {/* Animated Orbs */}
      <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 left-1/4 w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-4xl animate-slide-up">
        {/* Header Section */}
        <div className="glass p-8 md:p-12 rounded-3xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-3xl"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Student Dashboard</h1>
              <h2 className="text-lg md:text-xl font-light text-muted-foreground flex items-center gap-2">
                Welcome back, <span className="text-primary font-medium">{session.user.name}</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-full border border-white/10">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium text-white uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass p-6 rounded-2xl glass-hover">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
               <Activity className="text-primary" size={20} />
             </div>
             <div className="text-2xl font-bold text-white mb-1">{completionPercentage}%</div>
             <div className="text-sm text-muted-foreground font-light">Overall Completion</div>
          </div>
          <div className="glass p-6 rounded-2xl glass-hover">
             <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 border border-secondary/20">
               <BookOpen className="text-secondary" size={20} />
             </div>
             <div className="text-2xl font-bold text-white mb-1">{activeAssessmentsCount - completedAttemptsCount}</div>
             <div className="text-sm text-muted-foreground font-light">Pending Assessments</div>
          </div>
          <div className="glass p-6 rounded-2xl glass-hover">
             <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
               <FileSpreadsheet className="text-purple-400" size={20} />
             </div>
             <div className="text-2xl font-bold text-white mb-1">{certificatesCount}</div>
             <div className="text-sm text-muted-foreground font-light">Certificates Earned</div>
          </div>
        </div>

        {/* Enrolled Courses / Programs */}
        <h3 className="text-xl font-bold text-white mb-4">My Enrolled Courses</h3>
        
        {enrolledPrograms.length === 0 ? (
          <div className="glass p-8 rounded-3xl text-center border border-white/5 mb-8">
            <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
          </div>
        ) : (
          <div className="space-y-6 mb-8">
            {enrolledPrograms.map((program) => (
              <div key={program.id} className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -z-10"></div>
                
                <h4 className="text-2xl font-bold text-white mb-2">{program.name}</h4>
                <p className="text-muted-foreground font-light mb-6">{program.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {program.assessments.length === 0 ? (
                    <div className="col-span-2 p-4 bg-white/5 rounded-xl border border-white/10 text-center text-sm text-muted-foreground">
                      No active assessments for this course.
                    </div>
                  ) : (
                    program.assessments.map(assessment => {
                      const isCompleted = assessment.attempts.length > 0 && assessment.attempts[0].status === "COMPLETED";
                      const score = isCompleted ? assessment.attempts[0].score : null;

                      return (
                        <div key={assessment.id} className="p-5 bg-black/20 border border-white/5 rounded-2xl flex flex-col justify-between">
                          <div className="mb-4">
                            <div className="flex justify-between items-start mb-1">
                              <h5 className="font-semibold text-white">{assessment.title}</h5>
                              {isCompleted ? (
                                <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] uppercase font-bold rounded-full">Completed</span>
                              ) : (
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-[10px] uppercase font-bold rounded-full">Pending</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{assessment.type}</p>
                          </div>
                          
                          {isCompleted ? (
                            <Link href={`/student/reports?attemptId=${assessment.attempts[0].id}`} className="btn btn-glass w-full">
                              View Report ({score?.toFixed(0)}%)
                            </Link>
                          ) : (
                            <Link href={`/student/assessment/${assessment.id}`} className="btn btn-primary w-full">
                              Start Assessment
                            </Link>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass p-8 rounded-3xl relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -z-10 group-hover:bg-white/10 transition-all"></div>
            <h3 className="font-bold text-2xl mb-3 text-white">All Reports & Certificates</h3>
            <p className="text-muted-foreground font-light mb-8">View your detailed performance metrics, skill gap analysis, and download your verified certificates across all courses.</p>
            <Link 
              href="/student/reports" 
              className="btn btn-outline w-full text-lg py-3"
            >
              View Global Reports
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}

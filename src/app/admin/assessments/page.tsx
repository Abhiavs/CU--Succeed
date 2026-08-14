import { Settings, Play, Pause, ExternalLink } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AssessmentCard from "./AssessmentCard";

export default async function AssessmentsPage() {
  const assessments = await prisma.assessment.findMany({
    include: {
      program: true,
      attempts: true,
    },
    orderBy: { createdAt: 'desc' }
  });
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Assessments</h1>
          <p className="text-muted-foreground font-light">Configure Pre-Tests, Post-Tests, and view active batches.</p>
        </div>
        <Link href="/admin/assessments/new" className="px-5 py-2.5 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/10">
          Create New Configuration
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Configurations */}
        {assessments.map((assessment) => {
          const completedCount = assessment.attempts.filter(a => a.status === "COMPLETED").length;
          
          return (
            <AssessmentCard 
              key={assessment.id}
              assessment={{
                id: assessment.id,
                title: assessment.title,
                isActive: assessment.isActive,
                type: assessment.type,
                program: { name: assessment.program.name },
                completedCount
              }} 
            />
          );
        })}
      </div>
    </div>
  );
}

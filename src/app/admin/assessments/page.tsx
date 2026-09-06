import { Plus, ClipboardList } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AssessmentCard from "./AssessmentCard";
import { Button } from "@/components/ui/button";

export default async function AssessmentsPage() {
  let assessments: any[] = [];
  try {
    assessments = await (prisma as any).assessment.findMany({
      include: {
        program: true,
        attempts: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    assessments = [];
  }

  return (
    <div className="space-y-6 text-left text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Assessments</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure Pre-Tests, Post-Tests, and view active cohort batches.
          </p>
        </div>
        <Link href="/admin/assessments/new">
          <Button size="sm" className="h-9 px-4 text-xs font-semibold">
            <Plus size={15} className="mr-1" /> Create New Assessment
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {assessments.map((assessment) => {
          const completedCount = assessment.attempts
            ? assessment.attempts.filter((a: any) => a.status === "COMPLETED").length
            : 0;

          return (
            <AssessmentCard
              key={assessment.id}
              assessment={{
                id: assessment.id,
                title: assessment.title,
                isActive: assessment.isActive,
                type: assessment.type,
                program: { name: assessment.program?.name || "Employability Mentorship" },
                completedCount,
              }}
            />
          );
        })}
        {assessments.length === 0 && (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-slate-900 rounded-xl border border-slate-800">
            <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-500" />
            <div className="font-semibold text-sm text-slate-200">No assessments found</div>
            <p className="text-xs text-slate-400 mt-1">
              Click &quot;Create New Assessment&quot; to configure your first evaluation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

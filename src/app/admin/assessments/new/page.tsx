import { prisma } from "@/lib/prisma";
import CreateAssessmentForm from "./CreateAssessmentForm";

export default async function NewAssessmentPage() {
  const programs = await prisma.program.findMany();
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-slide-up pb-20 max-w-4xl">
      <CreateAssessmentForm programs={programs} questions={questions} />
    </div>
  );
}

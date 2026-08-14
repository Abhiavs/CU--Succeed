import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ViewQuestionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "OFFICIAL") {
    redirect("/login");
  }

  const questions = await prisma.question.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="min-h-screen bg-mint p-8">
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-ink">Question Bank</h2>
          <Link href="/admin/questions/add" className="px-6 py-2 bg-forest text-paper font-medium rounded-md hover:bg-forest-dark transition-colors">
            + Add New
          </Link>
        </div>

        <div className="bg-paper rounded-xl shadow-sm border border-line overflow-hidden">
          {questions.length === 0 ? (
            <div className="p-8 text-center text-ink-muted">
              No questions found in the database.
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {questions.map((q) => {
                const options = q.options as { id: string; text: string }[];
                return (
                  <li key={q.id} className="p-6">
                    <p className="font-semibold text-ink mb-3">{q.text}</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-ink-muted mb-3">
                      {options.map((opt, i) => (
                        <div key={opt.id} className={`p-2 border rounded-md ${q.correctAnswer === opt.id ? "bg-forest-light border-forest text-forest-dark font-medium" : "border-line"}`}>
                          {i + 1}. {opt.text} {q.correctAnswer === opt.id && "(Correct)"}
                        </div>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/admin" className="text-ink-muted hover:text-ink underline transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

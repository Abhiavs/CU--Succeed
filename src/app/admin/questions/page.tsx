import {
  Search,
  Plus,
  Filter,
  HelpCircle,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteQuestionButton from "./DeleteQuestionButton";

export default async function QuestionBankPage() {
  let questions: any[] = [];

  try {
    questions = await (prisma as any).question.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (err) {
    console.error("Failed to load questions:", err);
    questions = [];
  }

  return (
    <div className="space-y-6 text-left text-slate-100">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Question Bank
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Manage situational items, aptitude questions, and psychometric
            dimensions.
          </p>
        </div>

        <Link href="/admin/questions/new">
          <Button
            size="sm"
            className="h-9 px-4 text-xs font-semibold"
          >
            <Plus size={15} className="mr-1" />
            Add Question
          </Button>
        </Link>
      </div>

      {/* Table */}
      <Card className="overflow-hidden border-slate-800 bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                <th className="px-5 py-3.5 font-mono uppercase tracking-wider text-slate-400">
                  ID
                </th>

                <th className="px-5 py-3.5 font-mono uppercase tracking-wider text-slate-400">
                  Question Content
                </th>

                <th className="px-5 py-3.5 font-mono uppercase tracking-wider text-slate-400">
                  Category / Trait
                </th>

                <th className="px-5 py-3.5 font-mono uppercase tracking-wider text-slate-400">
                  Type
                </th>

                <th className="px-5 py-3.5 text-right font-mono uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {questions.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-slate-800/60 transition-colors last:border-0 hover:bg-slate-800/30"
                >
                  {/* ID */}
                  <td className="px-5 py-3.5 font-mono text-slate-500">
                    {q.id.substring(0, 8)}...
                  </td>

                  {/* Question */}
                  <td className="max-w-md px-5 py-3.5 font-medium text-slate-200">
                    <div className="max-w-md truncate">
                      {q.text}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-3.5">
                    <Badge
                      variant="outline"
                      className="text-[10px]"
                    >
                      {q.parameter || q.type}
                    </Badge>
                  </td>

                  {/* Type */}
                  <td className="px-5 py-3.5 text-slate-400">
                    {q.type}
                  </td>

                  {/* Delete */}
                  <td className="px-5 py-3.5 text-right">
                    <DeleteQuestionButton
                      questionId={q.id}
                      questionText={q.text}
                    />
                  </td>
                  
                  <td className="px-5 py-3.5 text-right">
                 <div className="flex items-center justify-end gap-2">
                 <Link href={`/admin/questions/${q.id}/edit`}>
                 <Button
                  variant="outline"
                 size="sm"
                 className="h-8 gap-1 text-xs">
      
                  Edit
                </Button>
                </Link>
              </div>
               </td>
                </tr>
              ))}

              {questions.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-slate-400"
                  >
                    <HelpCircle className="mx-auto mb-2 h-8 w-8 text-slate-600" />

                    No questions found in database. Click "Add Question"
                    to seed questions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
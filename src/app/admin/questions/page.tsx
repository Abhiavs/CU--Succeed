import { Search, Plus, Filter, HelpCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function QuestionBankPage() {
  let questions: any[] = [];
  try {
    questions = await (prisma as any).question.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    questions = [];
  }

  return (
    <div className="space-y-6 text-left text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Question Bank</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage situational items, aptitude questions, and psychometric dimensions.
          </p>
        </div>
        <Link href="/admin/questions/new">
          <Button size="sm" className="h-9 px-4 text-xs font-semibold">
            <Plus size={15} className="mr-1" /> Add Question
          </Button>
        </Link>
      </div>

      {/* Table Container */}
      <Card className="border-slate-800 bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                <th className="py-3.5 px-5 font-mono uppercase tracking-wider text-slate-400">ID</th>
                <th className="py-3.5 px-5 font-mono uppercase tracking-wider text-slate-400">Question Content</th>
                <th className="py-3.5 px-5 font-mono uppercase tracking-wider text-slate-400">Category / Trait</th>
                <th className="py-3.5 px-5 font-mono uppercase tracking-wider text-slate-400">Type</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr
                  key={q.id}
                  className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3.5 px-5 font-mono text-slate-500">{q.id.substring(0, 8)}...</td>
                  <td className="py-3.5 px-5 text-slate-200 max-w-md truncate font-medium">{q.text}</td>
                  <td className="py-3.5 px-5">
                    <Badge variant="outline" className="text-[10px]">
                      {q.parameter || q.type}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400">{q.type}</td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    No questions found in database. Click "Add Question" to seed questions.
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

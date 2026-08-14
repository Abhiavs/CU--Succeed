import { Search, Plus, Filter, MoreVertical } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function QuestionBankPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Question Bank</h1>
          <p className="text-muted-foreground font-light">Manage questions for Aptitude, Soft Skills, and Psychometric assessments.</p>
        </div>
        <Link href="/admin/questions/new" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Plus size={18} />
          Add Question
        </Link>
      </div>

      <div className="glass p-2 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search questions, topics, or IDs..." 
            className="w-full bg-transparent border-0 py-3 pl-12 pr-4 text-white focus:ring-0 placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto px-4 md:px-0">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/5">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">ID</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Question Content</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Category</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground">Type</th>
              <th className="py-4 px-6 text-xs font-mono uppercase tracking-wider text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 text-sm font-mono text-muted-foreground">{q.id.substring(0, 8)}...</td>
                <td className="py-4 px-6 text-sm text-white max-w-md truncate">{q.text}</td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-1 bg-white/5 text-muted-foreground text-xs rounded-full border border-white/10">
                    {q.parameter || q.type}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-muted-foreground">{q.type}</td>
                <td className="py-4 px-6 text-right">
                  <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/10">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {questions.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  No questions found. Click 'Add Question' to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground font-light">
        <div>Showing {questions.length} questions</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 glass rounded hover:bg-white/10 disabled:opacity-50">Prev</button>
          <button className="px-3 py-1 glass rounded hover:bg-white/10">Next</button>
        </div>
      </div>
    </div>
  );
}

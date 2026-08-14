"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";

type Program = { id: string; name: string };
type Question = { id: string; text: string; parameter: string | null; type: string };

export default function CreateAssessmentForm({ programs, questions }: { programs: Program[], questions: Question[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("PRE_TEST");
  const [programId, setProgramId] = useState(programs[0]?.id || "");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const toggleQuestion = (id: string) => {
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(q => q !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          type,
          programId,
          questionIds: selectedQuestions,
        }),
      });

      if (res.ok) {
        router.push("/admin/assessments");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create assessment");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/assessments" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft size={16} /> Back to Assessments
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Create New Assessment</h1>
        <p className="text-muted-foreground font-light">Configure a new assessment and map it to a specific course.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass p-8 rounded-3xl space-y-6 border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-2">Assessment Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Module 2 Post-Test"
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Assessment Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none"
              >
                <option value="PRE_TEST">Pre-Test</option>
                <option value="POST_TEST">Post-Test</option>
                <option value="PSYCHOMETRIC">Psychometric</option>
                <option value="APTITUDE">Aptitude</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Target Course (Program)</label>
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                required
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none"
              >
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl space-y-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Select Questions</h2>
              <p className="text-sm text-muted-foreground font-light">{selectedQuestions.length} selected</p>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {questions.map((q) => (
              <label key={q.id} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                selectedQuestions.includes(q.id) 
                  ? 'bg-primary/10 border-primary/50' 
                  : 'bg-black/20 border-white/5 hover:bg-white/5'
              }`}>
                <div className="mt-0.5 relative flex items-center justify-center w-5 h-5 rounded border-2 border-muted-foreground transition-colors">
                  <input 
                    type="checkbox" 
                    checked={selectedQuestions.includes(q.id)}
                    onChange={() => toggleQuestion(q.id)}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer" 
                  />
                  <div className={`w-3 h-3 rounded-sm bg-primary transition-opacity ${selectedQuestions.includes(q.id) ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
                <div>
                  <div className="text-white text-sm leading-relaxed mb-1">{q.text}</div>
                  <div className="flex gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-muted-foreground">{q.parameter || q.type}</span>
                  </div>
                </div>
              </label>
            ))}
            {questions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No questions found in the bank. Please create questions first.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary px-8 py-3 text-base"
          >
            <Save size={18} />
            {loading ? "Creating..." : "Create Assessment"}
          </button>
        </div>
      </form>
    </>
  );
}

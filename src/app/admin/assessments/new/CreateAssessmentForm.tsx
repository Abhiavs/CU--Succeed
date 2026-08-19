"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Program = { id: string; name: string };
type Question = { id: string; text: string; parameter: string | null; type: string };

export default function CreateAssessmentForm({
  programs,
  questions,
}: {
  programs: Program[];
  questions: Question[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("PRE_TEST");
  const [programId, setProgramId] = useState(programs[0]?.id || "");
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const toggleQuestion = (id: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
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
    <div className="space-y-6 text-left text-slate-900 dark:text-slate-100">
      <div>
        <Link
          href="/admin/assessments"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-2"
        >
          <ChevronLeft size={15} /> Back to Assessments
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Create New Assessment
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure a new Pre-Test, Post-Test, or Track assessment for student cohorts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="title">Assessment Title</Label>
                <Input
                  id="title"
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Diagnostic Pre-Assessment 2026"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="desc">Description</Label>
                <textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional assessment description"
                  className="h-20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type">Assessment Category</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-10 text-xs"
                >
                  <option value="PRE_TEST">Pre-Assessment (Baseline)</option>
                  <option value="POST_TEST">Post-Assessment (Outcome)</option>
                  <option value="PSYCHOMETRIC">Psychometric Matrix</option>
                  <option value="APTITUDE">Aptitude Precision</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="program">Target Course / Cohort</Label>
                <select
                  id="program"
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="h-10 text-xs"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                  {programs.length === 0 && (
                    <option value="default">General Employability Cohort</option>
                  )}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Selector */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Select Questions</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedQuestions.length} of {questions.length} questions selected
                </p>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {questions.map((q) => {
                const isSelected = selectedQuestions.includes(q.id);
                return (
                  <label
                    key={q.id}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-slate-950/80 ring-1 ring-emerald-500"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleQuestion(q.id)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="flex-1">
                      <div className="text-xs text-slate-900 dark:text-slate-100 font-medium mb-1.5 leading-relaxed">
                        {q.text}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {q.parameter || q.type}
                      </Badge>
                    </div>
                  </label>
                );
              })}
              {questions.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400">
                  No questions in question bank. Seed or add questions first.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading} className="h-10 px-6 text-xs font-semibold">
            <Save size={15} className="mr-1.5" />
            {loading ? "Creating..." : "Save Assessment"}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Save, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewQuestionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState("MULTIPLE_CHOICE");
  const [parameter, setParameter] = useState("");
  const [options, setOptions] = useState([
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState("A");

  const handleOptionChange = (id: string, newText: string) => {
    setOptions(options.map((opt) => (opt.id === id ? { ...opt, text: newText } : opt)));
  };

  const addOption = () => {
    const nextId = String.fromCharCode(options[options.length - 1].id.charCodeAt(0) + 1);
    setOptions([...options, { id: nextId, text: "" }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return;
    setOptions(options.filter((opt) => opt.id !== id));
    if (correctAnswer === id) {
      setCorrectAnswer(options.find((opt) => opt.id !== id)?.id || "A");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          type,
          parameter,
          options,
          correctAnswer,
        }),
      });

      if (res.ok) {
        router.push("/admin/questions");
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create question");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left text-slate-900 dark:text-slate-100 max-w-3xl">
      <div>
        <Link
          href="/admin/questions"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-2"
        >
          <ChevronLeft size={15} /> Back to Question Bank
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Create New Question
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Add a new question to the master question bank for future assessments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="qtext">Question Text</Label>
              <textarea
                id="qtext"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., Which of the following is an example of active listening?"
                className="h-24"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category (Parameter)</Label>
                <Input
                  id="category"
                  required
                  type="text"
                  value={parameter}
                  onChange={(e) => setParameter(e.target.value)}
                  placeholder="e.g., Soft Skills, Aptitude"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type">Question Type</Label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-10 text-xs"
                >
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TEXT">Short Answer / Text</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {type === "MULTIPLE_CHOICE" && (
          <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Options & Correct Answer</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                  className="h-7 text-xs"
                >
                  <Plus size={12} className="mr-1" /> Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {options.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-3">
                    <div className="w-6 text-xs font-bold text-slate-500 text-center">
                      {opt.id}.
                    </div>
                    <Input
                      required
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                      placeholder={`Option ${opt.id}`}
                      className="flex-1"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={opt.id}
                        checked={correctAnswer === opt.id}
                        onChange={() => setCorrectAnswer(opt.id)}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      Correct
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(opt.id)}
                      disabled={options.length <= 2}
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading} className="h-10 px-6 text-xs font-semibold">
            <Save size={15} className="mr-1.5" />
            {loading ? "Saving..." : "Save Question"}
          </Button>
        </div>
      </form>
    </div>
  );
}

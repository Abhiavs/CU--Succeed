"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Save, Trash2 } from "lucide-react";

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
    setOptions(options.map(opt => opt.id === id ? { ...opt, text: newText } : opt));
  };

  const addOption = () => {
    const nextId = String.fromCharCode(options[options.length - 1].id.charCodeAt(0) + 1);
    setOptions([...options, { id: nextId, text: "" }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) return; // Minimum 2 options
    setOptions(options.filter(opt => opt.id !== id));
    if (correctAnswer === id) {
      setCorrectAnswer(options.find(opt => opt.id !== id)?.id || "A");
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
    <div className="space-y-8 animate-slide-up pb-20 max-w-3xl">
      <div className="mb-4">
        <Link href="/admin/questions" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <ChevronLeft size={16} /> Back to Question Bank
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">Create New Question</h1>
        <p className="text-muted-foreground font-light">Add a new question to the master bank for use in future assessments.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass p-8 rounded-3xl space-y-6 border border-white/5">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Question Text</label>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g., Which of the following is an example of active listening?"
              className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category / Parameter */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category (Parameter)</label>
              <input
                required
                type="text"
                value={parameter}
                onChange={(e) => setParameter(e.target.value)}
                placeholder="e.g., Soft Skills, Aptitude"
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Question Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary appearance-none"
              >
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TEXT">Short Answer / Text</option>
              </select>
            </div>
          </div>
        </div>

        {type === "MULTIPLE_CHOICE" && (
          <div className="glass p-8 rounded-3xl space-y-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-white">Options & Correct Answer</label>
              <button 
                type="button" 
                onClick={addOption}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus size={14} /> Add Option
              </button>
            </div>

            <div className="space-y-4">
              {options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-4 group">
                  <div className="flex items-center justify-center w-6 text-sm font-bold text-muted-foreground">
                    {opt.id}.
                  </div>
                  <input
                    required
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                    placeholder={`Option ${opt.id}`}
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-white transition-colors">
                      <input
                        type="radio"
                        name="correctAnswer"
                        value={opt.id}
                        checked={correctAnswer === opt.id}
                        onChange={() => setCorrectAnswer(opt.id)}
                        className="w-4 h-4 accent-primary"
                      />
                      Correct
                    </label>
                    <button
                      type="button"
                      onClick={() => removeOption(opt.id)}
                      disabled={options.length <= 2}
                      className="p-2 text-muted-foreground/50 hover:text-red-400 disabled:opacity-30 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Save Question"}
          </button>
        </div>
      </form>
    </div>
  );
}

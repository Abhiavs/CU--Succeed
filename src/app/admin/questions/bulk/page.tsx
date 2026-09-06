"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Plus, Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/*
 * Reused option presets from the single question page.
 */
const optionPresets: Record<
  string,
  { id: string; text: string }[]
> = {
  FREQUENCY: [
    { id: "A", text: "Very often" },
    { id: "B", text: "Often" },
    { id: "C", text: "Sometimes" },
    { id: "D", text: "Rarely" },
    { id: "E", text: "Never" },
  ],
  AGREEMENT: [
    { id: "A", text: "Strongly Agree" },
    { id: "B", text: "Agree" },
    { id: "C", text: "Neutral" },
    { id: "D", text: "Disagree" },
    { id: "E", text: "Strongly Disagree" },
  ],
  QUALITY: [
    { id: "A", text: "Excellent" },
    { id: "B", text: "Good" },
    { id: "C", text: "Average" },
    { id: "D", text: "Poor" },
    { id: "E", text: "Very Poor" },
  ],
  Trueness: [
    { id: "A", text: "Absolutely True" },
    { id: "B", text: "True" },
    { id: "C", text: "Mostly True" },
    { id: "D", text: "Partially True" },
    { id: "E", text: "False" },
  ],
  CUSTOM: [
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
    { id: "E", text: "" },
  ],
};

type BulkQuestion = {
  text: string;
  type: "MULTIPLE_CHOICE" | "TEXT";
  parameter: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  optionPreset: string;
};

function emptyQuestion(): BulkQuestion {
  return {
    text: "",
    type: "MULTIPLE_CHOICE",
    parameter: "",
    options: optionPresets.CUSTOM.map((o) => ({ ...o })),
    correctAnswer: "A",
    optionPreset: "CUSTOM",
  };
}

export default function BulkQuestionsPage() {
  const router = useRouter();

  const [assessmentType, setAssessmentType] = useState("PSYCHOMETRIC");
  const [commonType, setCommonType] = useState<"MULTIPLE_CHOICE" | "TEXT">(
    "MULTIPLE_CHOICE"
  );
  const [commonPreset, setCommonPreset] = useState("CUSTOM");
  const [applyToAll, setApplyToAll] = useState(false);

  const [questions, setQuestions] = useState<BulkQuestion[]>(() => [
    emptyQuestion(),
    emptyQuestion(),
  ]);

  const [loading, setLoading] = useState(false);

  const updateQuestion = (index: number, patch: Partial<BulkQuestion>) => {
    setQuestions((current) =>
      current.map((q, i) => (i === index ? { ...q, ...patch } : q))
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, emptyQuestion()]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions((current) => current.filter((_, i) => i !== index));
  };

  const handlePresetChange = (index: number, preset: string) => {
    updateQuestion(index, {
      optionPreset: preset,
      options: (optionPresets[preset] || optionPresets.CUSTOM).map((o) => ({
        ...o,
      })),
    });
  };

  const handleOptionTextChange = (
    index: number,
    optionId: string,
    text: string
  ) => {
    updateQuestion(index, {
      options: questions[index].options.map((o) =>
        o.id === optionId ? { ...o, text } : o
      ),
    });
  };

  /* Apply selected common settings to all questions */
  const applyCommonSettings = () => {
    setQuestions((current) =>
      current.map((q) => ({
        ...q,
        type: commonType,
        optionPreset: commonPreset,
        options:
          commonType === "MULTIPLE_CHOICE"
            ? (optionPresets[commonPreset] || optionPresets.CUSTOM).map(
                (o) => ({ ...o })
              )
            : q.options,
      }))
    );
    setApplyToAll(false);
  };

  const validate = (): string | null => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return `Question ${i + 1}: text is required`;
      if (
        q.type === "MULTIPLE_CHOICE" &&
        q.options.some((o) => !o.text.trim())
      ) {
        return `Question ${i + 1}: all options must be filled`;
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentType,
          questions: questions.map((q) => ({
            text: q.text.trim(),
            type: q.type,
            parameter: q.parameter.trim(),
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        const summary =
          data.createdCount > 0
            ? `${data.createdCount} question${data.createdCount > 1 ? "s" : ""} created successfully.`
            : "No questions created.";
        if (data.errorCount > 0) {
          alert(
            `${summary}\n\n${data.errorCount} failed. Please check the details in the question bank.`
          );
        } else {
          alert(summary);
        }
        router.push("/admin/questions");
        router.refresh();
      } else {
        alert(data.error || "Failed to create questions");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while creating questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6 text-left text-slate-900 dark:text-slate-100">
      {/* HEADER */}
      <div>
        <Link
          href="/admin/questions"
          className="mb-2 inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ChevronLeft size={15} />
          Back to Question Bank
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Add Multiple Questions
        </h1>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Create many questions at once. Set common settings, then fill in each
          question&apos;s text.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* COMMON SETTINGS */}
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* ASSESSMENT TYPE */}
              <div className="space-y-2">
                <Label htmlFor="assessmentType">Assessment</Label>
                <select
                  id="assessmentType"
                  value={assessmentType}
                  onChange={(e) => setAssessmentType(e.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="APTITUDE">Aptitude Assessment</option>
                  <option value="PSYCHOMETRIC">Psychometric Assessment</option>
                </select>
              </div>

              {/* QUESTION TYPE */}
              <div className="space-y-2">
                <Label htmlFor="type">Question Type</Label>
                <select
                  id="type"
                  value={commonType}
                  onChange={(e) => {
                    setCommonType(e.target.value as any);
                    setApplyToAll(true);
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="TEXT">Short Answer / Text</option>
                </select>
              </div>

              {/* OPTION PRESET */}
              {commonType === "MULTIPLE_CHOICE" && (
                <div className="space-y-2">
                  <Label htmlFor="preset">Option Style</Label>
                  <select
                    id="preset"
                    value={commonPreset}
                    onChange={(e) => {
                      setCommonPreset(e.target.value);
                      setApplyToAll(true);
                    }}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                  >
                    <option value="CUSTOM">Custom Options</option>
                    <option value="FREQUENCY">Frequency — Very often to Never</option>
                    <option value="AGREEMENT">Agreement — Strongly Agree to Disagree</option>
                    <option value="QUALITY">Quality — Excellent to Very Poor</option>
                    <option value="Trueness">Trueness — Absolutely True to False</option>
                  </select>
                </div>
              )}
            </div>

            {/* APPLY TO ALL */}
            {applyToAll && (
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
                <span className="text-xs text-slate-500">
                  Apply these settings to all {questions.length} question
                  {questions.length > 1 ? "s" : ""}?
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  onClick={applyCommonSettings}
                >
                  Apply to All
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setApplyToAll(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QUESTION LIST */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <Card
              key={index}
              className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <CardContent className="space-y-4 p-6">
                {/* QUESTION HEADER */}
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {index + 1}
                    </span>
                    Question {index + 1}
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={q.optionPreset}
                        disabled={q.type !== "MULTIPLE_CHOICE"}
                        onChange={(e) =>
                          handlePresetChange(index, e.target.value)
                        }
                        className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                      >
                        <option value="CUSTOM">Custom</option>
                        <option value="FREQUENCY">Frequency</option>
                        <option value="AGREEMENT">Agreement</option>
                        <option value="QUALITY">Quality</option>
                        <option value="Trueness">Trueness</option>
                      </select>

                      <select
                        value={q.type}
                        onChange={(e) =>
                          updateQuestion(index, {
                            type: e.target.value as any,
                          })
                        }
                        className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs dark:border-slate-700 dark:bg-slate-950"
                      >
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                        <option value="TEXT">Text</option>
                      </select>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                      onClick={() => removeQuestion(index)}
                      disabled={questions.length <= 1}
                      title="Remove question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* QUESTION TEXT */}
                <textarea
                  required
                  value={q.text}
                  onChange={(e) =>
                    updateQuestion(index, { text: e.target.value })
                  }
                  placeholder={`Enter question ${index + 1} text...`}
                  className="min-h-[60px] w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
                />

                {/* CATEGORY / PARAMETER */}
                <div className="space-y-2">
                  <Label htmlFor={`category-${index}`}>
                    Category / Parameter
                  </Label>
                  <Input
                    id={`category-${index}`}
                    type="text"
                    value={q.parameter}
                    onChange={(e) =>
                      updateQuestion(index, { parameter: e.target.value })
                    }
                    placeholder="e.g. Technical Skills"
                  />
                </div>

                {/* OPTIONS */}
                {q.type === "MULTIPLE_CHOICE" && (
                  <div className="space-y-2">
                    {q.options.map((option, oi) => (
                      <div
                        key={option.id}
                        className="flex flex-col gap-2 rounded-lg border border-slate-200 p-2.5 dark:border-slate-800 sm:flex-row sm:items-center"
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {oi + 1}
                        </div>

                        <Input
                          type="text"
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(
                              index,
                              option.id,
                              e.target.value
                            )
                          }
                          placeholder={`Option ${oi + 1}`}
                          className="flex-1"
                        />

                        <label className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                          <input
                            type="radio"
                            name={`correct-${index}`}
                            value={option.id}
                            checked={q.correctAnswer === option.id}
                            onChange={() =>
                              updateQuestion(index, {
                                correctAnswer: option.id,
                              })
                            }
                            className="h-4 w-4"
                          />
                          Highest Score
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ADD ANOTHER */}
        <div>
          <Button
            type="button"
            variant="outline"
            onClick={addQuestion}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Question
          </Button>
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="h-10 px-6 text-xs font-semibold"
          >
            <Save size={15} className="mr-1.5" />
            {loading
              ? "Saving..."
              : `Save All ${questions.length} Questions`}
          </Button>
        </div>
      </form>
    </div>
  );
}
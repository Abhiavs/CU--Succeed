"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PSYCHOMETRIC_SECTIONS } from "@/lib/assessmentData";

type QuestionOption = {
  id: string;
  text: string;
};

export default function EditQuestionPage() {
  const router = useRouter();

  const params = useParams();

  const questionId = params.questionId as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [text, setText] = useState("");

  const [type, setType] =
    useState("MULTIPLE_CHOICE");

  const [parameter, setParameter] =
    useState("");

  /*
   * The parameter doubles as the psychometric section. "section"
   * mode picks one of the three scoring sections; "custom" keeps a
   * free-text label for aptitude questions.
   */
  const [parameterMode, setParameterMode] =
    useState<"section" | "custom">("custom");

  const [options, setOptions] =
    useState<QuestionOption[]>([
      { id: "A", text: "" },
      { id: "B", text: "" },
      { id: "C", text: "" },
      { id: "D", text: "" },
      { id: "E", text: "" },
    ]);

  const [correctAnswer, setCorrectAnswer] =
    useState("");

  /*
   * ============================================================
   * LOAD QUESTION
   * ============================================================
   */

  useEffect(() => {
    if (!questionId) return;

    const loadQuestion = async () => {
      try {
        const response = await fetch(
          `/api/questions/${questionId}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load question"
          );
        }

        const question =
          await response.json();

        setText(question.text || "");

        setType(
          question.type ||
            "MULTIPLE_CHOICE"
        );

        const loadedParameter =
          question.parameter || "";

        setParameter(loadedParameter);

        /*
         * If the stored parameter is one of the psychometric
         * sections, open the dropdown on it; otherwise it is a
         * free-text aptitude label.
         */
        const matchesSection =
          PSYCHOMETRIC_SECTIONS.some(
            (section) =>
              section.parameter ===
              loadedParameter
          );

        setParameterMode(
          matchesSection ? "section" : "custom"
        );

        setCorrectAnswer(
          question.correctAnswer || ""
        );

        /*
         * Prisma Json field can return
         * different shapes.
         */

        if (
          Array.isArray(question.options)
        ) {
          setOptions(
            question.options.map(
              (
                option: any,
                index: number
              ) => ({
                id:
                  option.id ||
                  String.fromCharCode(
                    65 + index
                  ),

                text:
                  typeof option ===
                  "string"
                    ? option
                    : option.text || "",
              })
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to load question:",
          error
        );

        alert(
          "Failed to load question"
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [questionId]);

  /*
   * ============================================================
   * OPTION CHANGE
   * ============================================================
   */

  const handleOptionChange = (
    id: string,
    newText: string
  ) => {
    setOptions(
      options.map((option) =>
        option.id === id
          ? {
              ...option,
              text: newText,
            }
          : option
      )
    );
  };

  /*
   * ============================================================
   * SAVE QUESTION
   * ============================================================
   */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(
        `/api/questions/${questionId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            text,

            type,

            parameter,

            options,

            correctAnswer:
              type ===
              "MULTIPLE_CHOICE"
                ? correctAnswer
                : null,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            "Failed to update question"
        );

        return;
      }

      router.push(
        "/admin/questions"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to update question:",
        error
      );

      alert(
        "Something went wrong while updating the question"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <Loader2 className="h-5 w-5 animate-spin" />

          Loading question...

        </div>

      </div>
    );
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="max-w-3xl space-y-6 text-left text-slate-900 dark:text-slate-100">

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

          Edit Question

        </h1>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

          Update the question, category, options, and correct answer.

        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* QUESTION DETAILS */}

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

          <CardContent className="space-y-4 p-6">

            {/* QUESTION TEXT */}

            <div className="space-y-1.5">

              <Label htmlFor="questionText">

                Question Text

              </Label>

              <textarea
                id="questionText"
                required
                value={text}
                onChange={(e) =>
                  setText(e.target.value)
                }
                placeholder="Enter question"
                className="h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />

            </div>

            {/* CATEGORY + TYPE */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* PARAMETER / SECTION */}

              <div className="space-y-1.5">

                <Label htmlFor="parameter">

                  Category (Parameter)

                </Label>

                {/*
                 * A single control: pick one of the three psychometric
                 * scoring sections, or "Custom" for an aptitude label.
                 */}
                <select
                  id="parameter"
                  value={
                    parameterMode === "custom"
                      ? "custom"
                      : parameter
                  }
                  onChange={(e) => {
                    const next = e.target.value;

                    if (next === "custom") {
                      setParameterMode("custom");

                      /*
                       * Clear a section string so it isn't saved as a
                       * label by accident.
                       */
                      const wasSection =
                        PSYCHOMETRIC_SECTIONS.some(
                          (section) =>
                            section.parameter ===
                            parameter
                        );

                      if (wasSection) {
                        setParameter("");
                      }
                    } else {
                      setParameterMode("section");
                      setParameter(next);
                    }
                  }}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                >

                  <option value="custom">

                    Custom / Aptitude Label

                  </option>

                  {PSYCHOMETRIC_SECTIONS.map(
                    (section) => (

                      <option
                        key={section.id}
                        value={section.parameter}
                      >

                        {section.name} (
                        {section.questionRange})

                      </option>

                    )
                  )}

                </select>

                {parameterMode === "custom" && (

                  <Input
                    id="parameterCustom"
                    value={parameter}
                    onChange={(e) =>
                      setParameter(
                        e.target.value
                      )
                    }
                    placeholder="e.g. Technical Skills"
                  />

                )}

                <p className="text-[11px] text-slate-500">

                  {parameterMode === "section"
                    ? "Assigns this question to a psychometric scoring section."
                    : "Free-text section label (used for aptitude questions)."}

                </p>

              </div>

              {/* QUESTION TYPE */}

              <div className="space-y-1.5">

                <Label htmlFor="type">

                  Question Type

                </Label>

                <select
                  id="type"
                  value={type}
                  onChange={(e) =>
                    setType(
                      e.target.value
                    )
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                >

                  <option value="MULTIPLE_CHOICE">

                    Multiple Choice

                  </option>

                  <option value="TEXT">

                    Short Answer / Text

                  </option>

                </select>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* OPTIONS */}

        {type ===
          "MULTIPLE_CHOICE" && (

          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

            <CardContent className="space-y-4 p-6">

              <div>

                <Label>

                  Answer Options

                </Label>

                <p className="mt-1 text-xs text-slate-500">

                  Edit the options and select the correct answer.

                </p>

              </div>

              <div className="space-y-3">

                {options.map(
                  (option, index) => (

                    <div
                      key={option.id}
                      className="flex items-center gap-3"
                    >

                      {/* OPTION NUMBER */}

                      <div className="w-8 text-center text-xs font-bold text-slate-500">

                        {index + 1}.

                      </div>

                      {/* OPTION INPUT */}

                      <Input
                        required
                        value={option.text}
                        onChange={(e) =>
                          handleOptionChange(
                            option.id,
                            e.target.value
                          )
                        }
                        placeholder={`Option ${
                          index + 1
                        }`}
                        className="flex-1"
                      />

                      {/* CORRECT ANSWER */}

                      <label className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">

                        <input
                          type="radio"
                          name="correctAnswer"
                          value={option.id}
                          checked={
                            correctAnswer ===
                            option.id
                          }
                          onChange={() =>
                            setCorrectAnswer(
                              option.id
                            )
                          }
                          className="h-4 w-4"
                        />

                        Correct

                      </label>

                    </div>

                  )
                )}

              </div>

            </CardContent>

          </Card>

        )}

        {/* SAVE BUTTON */}

        <div className="flex justify-end">

          <Button
            type="submit"
            disabled={saving}
            className="h-10 px-6 text-xs font-semibold"
          >

            {saving ? (

              <Loader2
                size={15}
                className="mr-1.5 animate-spin"
              />

            ) : (

              <Save
                size={15}
                className="mr-1.5"
              />

            )}

            {saving
              ? "Updating..."
              : "Update Question"}

          </Button>

        </div>

      </form>

    </div>
  );
}
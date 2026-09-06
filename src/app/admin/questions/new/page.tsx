"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* =========================================
   OPTION PRESETS
========================================= */

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

/* =========================================
   PAGE
========================================= */

export default function NewQuestionPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("");

  const [type, setType] =
    useState("MULTIPLE_CHOICE");

  const [assessmentType, setAssessmentType] =
    useState("APTITUDE");

  const [parameter, setParameter] =
    useState("");

  /*
   * Option preset selector
   */

  const [optionPreset, setOptionPreset] =
    useState("CUSTOM");

  /*
   * Five options
   */

  const [options, setOptions] = useState([
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
    { id: "E", text: "" },
  ]);

  /*
   * Highest scoring option
   */

  const [correctAnswer, setCorrectAnswer] =
    useState("A");

  /* =========================================
     CHANGE OPTION PRESET
  ========================================= */

  const handlePresetChange = (
    preset: string
  ) => {
    setOptionPreset(preset);

    const presetOptions =
      optionPresets[preset] ||
      optionPresets.CUSTOM;

    setOptions(
      presetOptions.map((option) => ({
        ...option,
      }))
    );
  };

  /* =========================================
     CHANGE SINGLE OPTION
  ========================================= */

  const handleOptionChange = (
    id: string,
    newText: string
  ) => {
    setOptions((currentOptions) =>
      currentOptions.map((option) =>
        option.id === id
          ? {
              ...option,
              text: newText,
            }
          : option
      )
    );
  };

  /* =========================================
     SUBMIT
  ========================================= */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    /*
     * Validate question text
     */

    if (!text.trim()) {
      alert("Please enter the question.");

      return;
    }

    /*
     * Validate five options
     */

    if (type === "MULTIPLE_CHOICE") {
      const hasEmptyOption =
        options.some(
          (option) =>
            !option.text.trim()
        );

      if (hasEmptyOption) {
        alert(
          "Please fill all five options."
        );

        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/questions",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            text: text.trim(),

            type,

            parameter:
              parameter.trim(),

            options,

            correctAnswer,

            assessmentType,
          }),
        }
      );

      if (res.ok) {
        router.push(
          "/admin/questions"
        );

        router.refresh();
      } else {
        const data =
          await res.json();

        alert(
          data.error ||
            "Failed to create question"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="max-w-3xl space-y-6 text-left text-slate-900 dark:text-slate-100">

      {/* PAGE HEADER */}

      <div>

        <Link
          href="/admin/questions"
          className="mb-2 inline-flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          <ChevronLeft size={15} />

          Back to Question Bank
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">

          Create New Question

        </h1>

        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">

          Add a new question and assign it to an assessment.

        </p>

      </div>


      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* QUESTION DETAILS */}

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

          <CardContent className="space-y-5 p-6">


            {/* QUESTION TEXT */}

            <div className="space-y-2">

              <Label htmlFor="qtext">

                Question Text

              </Label>

              <textarea
                id="qtext"
                required
                value={text}
                onChange={(e) =>
                  setText(
                    e.target.value
                  )
                }
                placeholder="Enter the question here..."
                className="min-h-[120px] w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-slate-500 dark:focus:ring-slate-800"
              />

            </div>


            {/* ASSESSMENT */}

            <div className="space-y-2">

              <Label htmlFor="assessmentType">

                Assessment

              </Label>

              <select
                id="assessmentType"
                value={assessmentType}
                onChange={(e) =>
                  setAssessmentType(
                    e.target.value
                  )
                }
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              >

                <option value="APTITUDE">

                  Aptitude Assessment

                </option>

                <option value="PSYCHOMETRIC">

                  Psychometric Assessment

                </option>

              </select>

              <p className="text-xs text-slate-500">

                This question will be assigned to the selected assessment.

              </p>

            </div>


            {/* CATEGORY + TYPE */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">


              {/* CATEGORY */}

              <div className="space-y-2">

                <Label htmlFor="category">

                  Category / Parameter

                </Label>

                <Input
                  id="category"
                  required
                  type="text"
                  value={parameter}
                  onChange={(e) =>
                    setParameter(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Technical Skills"
                />

              </div>


              {/* QUESTION TYPE */}

              <div className="space-y-2">

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

        {type === "MULTIPLE_CHOICE" && (

          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">

            <CardContent className="space-y-5 p-6">


              {/* OPTIONS HEADER */}

              <div>

                <Label>

                  Five Response Options

                </Label>

                <p className="mt-1 text-xs text-slate-500">

                  Choose a preset or create your own options.

                </p>

              </div>


              {/* PRESET SELECTOR */}

              <div className="space-y-2">

                <Label htmlFor="optionPreset">

                  Option Style

                </Label>

                <select
                  id="optionPreset"
                  value={optionPreset}
                  onChange={(e) =>
                    handlePresetChange(
                      e.target.value
                    )
                  }
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950"
                >

                  <option value="CUSTOM">

                    Custom Options

                  </option>

                  <option value="FREQUENCY">

                    Frequency — Very often to Never

                  </option>

                  <option value="AGREEMENT">

                    Agreement — Strongly Agree to Strongly Disagree

                  </option>

                  <option value="QUALITY">

                    Quality — Excellent to Very Poor

                  </option>

                  <option value="Trueness">

                    Trueness — Absolutely True to False

                  </option>

                </select>

              </div>


              {/* FIVE OPTIONS */}

              <div className="space-y-3">

                {options.map(
                  (option, index) => (

                    <div
                      key={option.id}
                      className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-800 sm:flex-row sm:items-center"
                    >

                      {/* OPTION NUMBER */}

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">

                        {index + 1}

                      </div>


                      {/* OPTION TEXT */}

                      <Input
                        required
                        type="text"
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


                      {/* HIGHEST SCORE */}

                      <label className="flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">

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

                        Highest Score

                      </label>

                    </div>

                  )
                )}

              </div>


              <p className="text-xs text-slate-500">

                You can use the preset options and still manually edit any option text.

              </p>

            </CardContent>

          </Card>

        )}


        {/* SAVE BUTTON */}

        <div className="flex justify-end">

          <Button
            type="submit"
            disabled={loading}
            className="h-10 px-6 text-xs font-semibold"
          >

            <Save
              size={15}
              className="mr-1.5"
            />

            {loading
              ? "Saving..."
              : "Save Question"}

          </Button>

        </div>

      </form>

    </div>
  );
}
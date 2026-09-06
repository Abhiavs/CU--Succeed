"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteQuestionButtonProps {
  questionId: string;
  questionText: string;
}

export default function DeleteQuestionButton({
  questionId,
  questionText,
}: DeleteQuestionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this question?\n\n"${questionText}"`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const response = await fetch(
        `/api/questions/${questionId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error (data.error || "Failed to delete question");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Delete question error:", error);

      alert("Something went wrong while deleting the question.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="h-8 text-red-400 hover:bg-red-500/10 hover:text-red-300"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </>
      )}
    </Button>
  );
}
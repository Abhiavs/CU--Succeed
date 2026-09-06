"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, AlertTriangle } from "lucide-react";

type DeleteAllButtonProps = {
  count: number;
  assessmentType?: string;
};

export default function DeleteAllButton({
  count,
  assessmentType,
}: DeleteAllButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const url = assessmentType
        ? `/api/questions/delete-all?assessmentType=${assessmentType}`
        : "/api/questions/delete-all";

      const res = await fetch(url, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        setOpen(false);
        router.refresh();
      } else {
        setError(data.error || "Failed to delete questions");
      }
    } catch (err) {
      console.error("Delete all error:", err);
      setError("An error occurred while deleting questions");
    } finally {
      setLoading(false);
    }
  };

  const label = assessmentType
    ? `Delete All ${assessmentType} Questions`
    : "Delete All Questions";

  const description = assessmentType
    ? `This will permanently delete all ${assessmentType} questions. This action cannot be undone.`
    : "This will permanently delete ALL questions from the database. This action cannot be undone.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="h-9 px-4 text-xs font-semibold"
          disabled={count === 0}
        >
          <Trash2 size={15} className="mr-1" />
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete All Questions
          </DialogTitle>
          <DialogDescription className="pt-2">{description}</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </span>
            ) : (
              `Delete ${count} Question${count === 1 ? "" : "s"}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

type ReattemptButtonProps = {
  wheelScoreId?: string;
  attemptId?: string;
  type: "WHEEL" | "ATTEMPT";
};

export default function ReattemptButton({
  wheelScoreId,
  attemptId,
  type,
}: ReattemptButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/admin/reattempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(type === "ATTEMPT" ? { attemptId } : { wheelScoreId }),
          allowed: true,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message || "Reattempt permission granted.");
        setTimeout(() => setMessage(null), 4000);
      } else {
        setError(data.error || "Failed to grant reattempt permission.");
      }
    } catch (err) {
      console.error("Reattempt error:", err);
      setError("An error occurred while granting reattempt permission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <Button
        size="sm"
        type="button"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Updating...
          </span>
        ) : (
          <>
            <RotateCcw className="mr-2 h-4 w-4" />
            Allow Reattempt
          </>
        )}
      </Button>

      {message && (
        <span className="flex items-center gap-1 text-xs text-emerald-600">
          <CheckCircle2 className="h-3 w-3" />
          {message}
        </span>
      )}

      {error && (
        <span className="flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </span>
      )}
    </div>
  );
}
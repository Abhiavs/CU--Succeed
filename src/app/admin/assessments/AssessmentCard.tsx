"use client";

import { Play, Pause, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type AssessmentProps = {
  id: string;
  title: string;
  isActive: boolean;
  type: string;
  program: { name: string };
  completedCount: number;
};

export default function AssessmentCard({ assessment }: { assessment: AssessmentProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      await fetch(`/api/assessments/${assessment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !assessment.isActive }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAssessment = async () => {
    if (!confirm("Are you sure you want to delete this assessment? This cannot be undone.")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/assessments/${assessment.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete assessment");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className={`border-slate-800 bg-slate-900 group transition-all text-left ${deleting ? "opacity-50" : ""}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base text-white">{assessment.title}</h3>
              <Badge variant={assessment.isActive ? "default" : "outline"} className="text-[10px]">
                {assessment.isActive ? "Active" : "Draft"}
              </Badge>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {assessment.program.name} • {assessment.type}
            </div>
          </div>

          <button
            onClick={deleteAssessment}
            disabled={deleting}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-slate-800 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Delete Assessment"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex justify-between text-xs text-slate-400 py-2 border-y border-slate-800">
          <span>Completed Attempts</span>
          <span className="font-mono font-bold text-slate-200">{assessment.completedCount}</span>
        </div>

        <div className="flex gap-2 pt-1">
          {assessment.isActive ? (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleActive}
              disabled={loading}
              className="flex-1 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20"
            >
              <Pause size={13} className="mr-1" /> {loading ? "Pausing..." : "Pause"}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={toggleActive}
              disabled={loading}
              className="flex-1 text-xs"
            >
              <Play size={13} className="mr-1" /> {loading ? "Activating..." : "Activate"}
            </Button>
          )}

          <Link href={`/admin/results?assessmentId=${assessment.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full text-xs">
              <ExternalLink size={13} className="mr-1" /> View Stats
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

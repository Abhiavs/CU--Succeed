"use client";

import { Settings, Play, Pause, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
    <div className={`glass p-6 rounded-2xl border ${assessment.isActive ? 'border-primary/20' : 'border-white/5'} relative group transition-all duration-300 ${deleting ? 'opacity-50' : ''}`}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-white">{assessment.title}</h3>
            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
              assessment.isActive 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'bg-white/10 text-muted-foreground border border-white/10'
            }`}>
              {assessment.isActive ? 'Active' : 'Draft'}
            </span>
          </div>
          <div className="text-sm text-muted-foreground font-mono">{assessment.program.name} • {assessment.type}</div>
        </div>
        <button 
          onClick={deleteAssessment}
          disabled={deleting}
          className="btn btn-glass p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          title="Delete Assessment"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs font-mono text-muted-foreground mb-1">
          <span>Completed Attempts</span>
          <span className="text-white">{assessment.completedCount}</span>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-white/5">
         {assessment.isActive ? (
           <button 
             onClick={toggleActive}
             disabled={loading}
             className="btn btn-outline flex-1 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 disabled:opacity-50"
           >
             <Pause size={14} /> {loading ? "Pausing..." : "Pause"}
           </button>
         ) : (
           <button 
             onClick={toggleActive}
             disabled={loading}
             className="btn btn-primary flex-1 disabled:opacity-50"
           >
             <Play size={14} /> {loading ? "Activating..." : "Activate"}
           </button>
         )}
         <Link 
           href={`/admin/results?assessmentId=${assessment.id}`}
           className="btn btn-glass flex-1"
         >
           <ExternalLink size={14} /> View Stats
         </Link>
      </div>
    </div>
  );
}

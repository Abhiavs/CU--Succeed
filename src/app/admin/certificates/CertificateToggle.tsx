"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

type Props = {
  certificateId: string;
  initialStatus: string;
};

export default function CertificateToggle({ certificateId, initialStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    const newStatus = initialStatus === "ACTIVE" ? "REVOKED" : "ACTIVE";
    if (!confirm(`Are you sure you want to change this certificate to ${newStatus}?`)) return;
    
    setLoading(true);
    try {
      await fetch(`/api/certificates/${certificateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-4">
      {initialStatus === "ACTIVE" ? (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-medium">
          <CheckCircle2 size={14} /> Active
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium">
          <XCircle size={14} /> Revoked
        </span>
      )}
      
      <button 
        onClick={toggleStatus}
        disabled={loading}
        className="btn btn-outline p-2 disabled:opacity-50"
        title={initialStatus === "ACTIVE" ? "Revoke Certificate" : "Restore Certificate"}
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <div className="flex items-center justify-end gap-3">
      {initialStatus === "ACTIVE" ? (
        <Badge variant="default" className="text-[10px]">
          <CheckCircle2 size={12} className="mr-1" /> Active
        </Badge>
      ) : (
        <Badge variant="destructive" className="text-[10px]">
          <XCircle size={12} className="mr-1" /> Revoked
        </Badge>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={toggleStatus}
        disabled={loading}
        className="h-7 w-7 text-xs border-slate-700 hover:bg-slate-800"
        title={initialStatus === "ACTIVE" ? "Revoke Certificate" : "Restore Certificate"}
      >
        <RotateCcw size={12} />
      </Button>
    </div>
  );
}

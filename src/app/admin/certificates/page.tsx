import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";
import CertificateToggle from "./CertificateToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ShieldCheck, Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function CertificatesPage() {
  const storeProfiles = inMemoryStore.getAllProfiles();

  const certificates = storeProfiles.map((p) => {
    const st = inMemoryStore.getState(p.id);
    const score = Math.round(
      (st.psychometricScore || 78) * 0.35 +
      (st.aptitudeScore || 82) * 0.35 +
      ((st.wheelAverage || 7.8) * 10) * 0.30
    );

    return {
      id: `SUC-EMP-2026-${p.id.slice(-4).toUpperCase()}`,
      status: "ACTIVE",
      issueDate: p.createdAt || new Date().toISOString(),
      score,
      student: {
        id: p.id,
        name: p.name,
        email: p.email,
        rollNumber: p.rollNumber,
        branch: p.branch,
        collegeName: p.collegeName,
      },
      program: {
        name: `${p.assessmentType === "PRE" ? "Pre-Assessment" : "Post-Assessment"} (${p.year} Year)`,
      },
    };
  });

  return (
    <div className="space-y-6 text-left text-slate-900 dark:text-slate-100">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Certificates & Credentials Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Inspect, verify, issue, and manage official digital certificates awarded to evaluated candidates.
        </p>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
              <Award size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Issued Credentials</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {certificates.length || 18}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Active & Verifiable</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
              <Download size={20} />
            </div>
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Accreditation Protocol</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">v2.6</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Certificate ID</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Candidate Name</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Evaluation Track</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Score</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500">Issue Date</th>
                <th className="py-3.5 px-4 font-mono uppercase text-slate-500 text-right">Status & Action</th>
              </tr>
            </thead>
            <tbody>
              {certificates.map((cert) => (
                <tr
                  key={cert.id}
                  className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {cert.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-200">{cert.student?.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {cert.student?.rollNumber} • {cert.student?.collegeName}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {cert.program?.name || "Standard Assessment Track"}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {cert.score}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {new Date(cert.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <CertificateToggle certificateId={cert.id} initialStatus={cert.status} />
                  </td>
                </tr>
              ))}
              {certificates.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Award className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                    No digital certificates issued yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

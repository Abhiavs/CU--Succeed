import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ShieldCheck } from "lucide-react";
import ProvisionTpoModal from "./ProvisionTpoModal";
import DeleteTpoButton from "./DeleteTpoButton";

export default async function AdminCollegesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "OFFICIAL") {
    redirect("/admin-login");
  }

  // Find all TPO users
  const tpoUsers = await prisma.user.findMany({
    where: { role: "TPO" },
    orderBy: { createdAt: "desc" },
  });

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { collegeName: true },
  });

  const collegeStats: Record<string, number> = {};
  students.forEach((st) => {
    const key = st.collegeName || "Unassigned";
    collegeStats[key] = (collegeStats[key] || 0) + 1;
  });

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-emerald-500" /> College & TPO Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Monitor authorized TPO accounts, verified institutional domains, and institutional student rosters.
          </p>
        </div>
        <div>
          <ProvisionTpoModal />
        </div>
      </div>

      {/* TPO Roster */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Authorized TPO Accounts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">List of verified Training & Placement Officers with college domain access.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">TPO Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">College Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                {tpoUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No TPO accounts registered in the platform yet.
                    </td>
                  </tr>
                ) : (
                  tpoUsers.map((tpo) => (
                    <tr key={tpo.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> {tpo.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{tpo.email}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-300">{tpo.collegeName || "All Institutions"}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-emerald-600 text-white text-[10px]">Active & Verified</Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {new Date(tpo.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DeleteTpoButton tpoId={tpo.id} tpoName={tpo.name} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

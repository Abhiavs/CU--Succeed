import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Award,
  Download,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex flex-col py-10 px-4 sm:px-6 text-slate-900 dark:text-slate-100">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div>
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {/* Header Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center p-8 space-y-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <Award className="w-7 h-7" />
          </div>
          <Badge variant="default" className="text-xs">
            Official Certification & Reports
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Student Assessment Reports & Credentials
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
            Access your verified digital certificates, competency archetype analysis, and multi-dimensional performance scorecard.
          </p>

          <div className="pt-2 flex justify-center">
            <Link href="/student/results">
              <Button size="lg" className="rounded-xl px-8">
                <Sparkles className="w-4 h-4 mr-2" /> Open Full Results & Certificate Hub <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Certificate Card */}
        <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600 dark:text-emerald-400 w-5 h-5" /> Verifiable Certificate
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Issued under SucceedAcademy Employability Accreditation Protocol
                </p>
              </div>

              <Link href="/student/results">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Download className="w-3.5 h-3.5" /> View & Print Certificate
                </Button>
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg font-bold">
                  🎓
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    {session.user.name}'s Multidimensional Assessment Credential
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Status: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Active & Verified</span>
                  </p>
                </div>
              </div>

              <Link href="/student/results">
                <Button size="sm" className="text-xs">
                  Inspect
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

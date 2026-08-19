import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { HomeInteractiveDemo } from "@/components/HomeInteractiveDemo";
import {
  ArrowRight,
  BrainCircuit,
  Zap,
  Compass,
  CheckCircle2,
  Award,
  BarChart3,
  Users2,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Standardized Student Employability Framework</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Assess Candidate Potential with Multidimensional Rigor
            </h1>

            <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
              Evaluate student competency across <strong>Psychometric traits</strong>, <strong>Aptitude precision</strong>, and an interactive <strong>Wheel of Competencies</strong> with instant analytics and verifiable digital certification.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={session ? "/student" : "/start"}>
                <Button size="lg" className="h-11 px-6 rounded-lg text-sm font-semibold">
                  {session ? "Enter Student Dashboard" : "Start Assessment Journey"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link href="#flow">
                <Button variant="outline" size="lg" className="h-11 px-6 rounded-lg text-sm text-slate-300 border-slate-700">
                  View Workflow Flowchart
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
              <div>
                <div className="text-xl font-bold text-white">3 Pillars</div>
                <div className="text-[11px] text-slate-400">Psych, Aptitude, Wheel</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-400">Pre & Post</div>
                <div className="text-[11px] text-slate-400">Growth Tracking</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">8 Dimensions</div>
                <div className="text-[11px] text-slate-400">Dynamic Radar</div>
              </div>
            </div>
          </div>

          {/* Right Hero: Live Interactive Demo */}
          <div className="lg:col-span-6">
            <HomeInteractiveDemo />
          </div>
        </div>
      </section>

      {/* 6-Step Workflow Section */}
      <section id="flow" className="py-20 border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="outline" className="mb-2">
              Structured Roadmap
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              The 6-Step Assessment Journey
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Follow our systematic 6-step roadmap engineered for measurable student skill growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: "01", title: "Home", desc: "Platform overview & assessment launcher." },
              { step: "02", title: "Select Type", desc: "Choose Pre-Test or Post-Test." },
              { step: "03", title: "Select Year", desc: "1st, 2nd, 3rd, or 4th Year cohort." },
              { step: "04", title: "Register", desc: "Student Roll, Branch, College profile." },
              { step: "05", title: "3 Modules", desc: "Psychometric, Aptitude, Wheel." },
              { step: "06", title: "Results", desc: "Scorecard, radar comparison, & certificate." },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div className="text-[10px] font-mono font-bold text-emerald-400 mb-2">
                  STEP {item.step}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-normal">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Pillars Deep Dive */}
      <section id="tracks" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="outline" className="mb-2">
              Evaluation Tracks
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
              Three Independent Assessment Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardContent className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-emerald-400 font-semibold uppercase">Pillar 01</div>
                  <h3 className="text-lg font-bold text-white">Psychometric Matrix</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Situational judgment questions measuring emotional resilience, ownership mindset, teamwork, and behavioral ethics.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <Link href="/start">
                    <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-slate-300">
                      <span>Launch Psychometric</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardContent className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-blue-400 font-semibold uppercase">Pillar 02</div>
                  <h3 className="text-lg font-bold text-white">Aptitude Precision</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Timed problem solving evaluating quantitative computation, logical deduction, and verbal sentence correction.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <Link href="/start">
                    <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-slate-300">
                      <span>Launch Aptitude</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardContent className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-indigo-400 font-semibold uppercase">Pillar 03</div>
                  <h3 className="text-lg font-bold text-white">Wheel of Competencies</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Interactive 8-dimension self-rating radar chart covering technical depth, time discipline, EQ, and leadership.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <Link href="/start">
                    <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-slate-300">
                      <span>Launch Dimension Wheel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="font-semibold text-slate-300">
            SucceedAcademy <span className="font-normal text-slate-500">| Assessment Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">
              Student Sign In
            </Link>
            <Link href="/admin-login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
            <span>© {new Date().getFullYear()} SucceedAcademy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { BrandLockup } from "@/components/Logo";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  ArrowRight,
  BrainCircuit,
  Zap,
  Compass,
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/20 selection:text-blue-300">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="relative pt-20 pb-20 border-b border-slate-800/80">

        <div className="max-w-5xl mx-auto px-6">

          <div className="max-w-3xl mx-auto space-y-7 text-center">

            {/* Brand Lockup */}

            <BrandLockup className="pb-2" />

            {/* Badge */}

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300">

              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />

              <span>
                Standardized Student Employability Framework
              </span>

            </div>

            {/* Heading */}

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">

              Assess Candidate Potential with
              <span className="text-blue-400">
                {" "}Multidimensional Rigor
              </span>

            </h1>

            {/* Description */}

            <p className="text-sm sm:text-base lg:text-lg text-slate-400 font-normal leading-relaxed max-w-3xl mx-auto">

              Evaluate student competency across{" "}

              <strong className="text-slate-200">
                Psychometric traits
              </strong>

              ,{" "}

              <strong className="text-slate-200">
                Aptitude precision
              </strong>

              , and an interactive{" "}

              <strong className="text-slate-200">
                Wheel of Competencies
              </strong>

              {" "}with instant analytics and verifiable digital
              certification.

            </p>

            {/* Main Action */}

            <div className="flex justify-center pt-3">

              <Link
                href={
                  session
                    ? "/student"
                    : "/start"
                }
              >

                <Button
                  size="lg"
                  className="h-12 px-8 rounded-lg text-sm font-semibold"
                >

                  {session
                    ? "Enter Student Dashboard"
                    : "Start Assessment Journey"}

                  <ArrowRight className="w-4 h-4 ml-2" />

                </Button>

              </Link>

            </div>

            {/* Metrics */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-slate-800/80">

              <div className="text-center">

                <div className="text-2xl font-bold text-white">
                  3 Pillars
                </div>

                <div className="text-[11px] text-slate-400 mt-1">
                  Psychometric, Aptitude, Wheel
                </div>

              </div>

              <div className="text-center">

                <div className="text-2xl font-bold text-indigo-400">
                  Pre & Post
                </div>

                <div className="text-[11px] text-slate-400 mt-1">
                  Growth Tracking
                </div>

              </div>

              <div className="text-center">

                <div className="text-2xl font-bold text-blue-400">
                  8 Dimensions
                </div>

                <div className="text-[11px] text-slate-400 mt-1">
                  Dynamic Radar
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          6 STEP ASSESSMENT JOURNEY
      ===================================================== */}

      <section
        id="flow"
        className="py-20 border-b border-slate-800/80 bg-slate-950/40"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-12">

            <Badge
              variant="outline"
              className="mb-2"
            >
              Structured Roadmap
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">

              The 6-Step Assessment Journey

            </h2>

            <p className="text-slate-400 text-xs sm:text-sm">

              Follow our systematic 6-step roadmap engineered for
              measurable student skill growth.

            </p>

          </div>


          {/* Steps */}

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">

            {[
              {
                step: "01",
                title: "Home",
                desc: "Platform overview & assessment launcher.",
              },

              {
                step: "02",
                title: "Select Type",
                desc: "Choose Pre-Test or Post-Test.",
              },

              {
                step: "03",
                title: "Select Year",
                desc: "Choose your academic year.",
              },

              {
                step: "04",
                title: "Register",
                desc: "Complete your student profile.",
              },

              {
                step: "05",
                title: "Assessments",
                desc: "Psychometric, Aptitude, and Wheel.",
              },

              {
                step: "06",
                title: "Results",
                desc: "Scorecards, insights, and certificates.",
              },

            ].map((item) => (

              <div
                key={item.step}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >

                <div className="text-[10px] font-mono font-bold text-blue-400 mb-2">

                  STEP {item.step}

                </div>

                <div>

                  <h4 className="font-semibold text-white text-sm mb-1">

                    {item.title}

                  </h4>

                  <p className="text-xs text-slate-400 leading-normal">

                    {item.desc}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          THREE ASSESSMENT PILLARS
      ===================================================== */}

      <section
        id="tracks"
        className="py-20"
      >

        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center max-w-2xl mx-auto mb-14">

            <Badge
              variant="outline"
              className="mb-2"
            >
              Evaluation Tracks
            </Badge>

            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">

              Three Independent Assessment Pillars

            </h2>

            <p className="text-sm text-slate-400">

              Measure student potential through multiple dimensions
              of assessment and development.

            </p>

          </div>


          {/* Cards */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


            {/* Psychometric */}

            <Card className="border-slate-800 bg-slate-900">

              <CardContent className="p-6 space-y-4">

                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">

                  <BrainCircuit className="w-5 h-5" />

                </div>

                <div>

                  <div className="text-[11px] font-mono text-blue-400 font-semibold uppercase">

                    Pillar 01

                  </div>

                  <h3 className="text-lg font-bold text-white">

                    Psychometric Matrix

                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">

                    Situational and behavioral questions measuring
                    emotional resilience, teamwork, ownership, and
                    professional mindset.

                  </p>

                </div>

                <div className="pt-2 border-t border-slate-800">

                  <Link href="/start">

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs text-slate-300"
                    >

                      <span>
                        Launch Psychometric
                      </span>

                      <ArrowRight className="w-3.5 h-3.5" />

                    </Button>

                  </Link>

                </div>

              </CardContent>

            </Card>


            {/* Aptitude */}

            <Card className="border-slate-800 bg-slate-900">

              <CardContent className="p-6 space-y-4">

                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">

                  <Zap className="w-5 h-5" />

                </div>

                <div>

                  <div className="text-[11px] font-mono text-blue-400 font-semibold uppercase">

                    Pillar 02

                  </div>

                  <h3 className="text-lg font-bold text-white">

                    Aptitude Assessment

                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">

                    Evaluate analytical reasoning, problem-solving,
                    logical thinking, and quantitative ability.

                  </p>

                </div>

                <div className="pt-2 border-t border-slate-800">

                  <Link href="/start">

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs text-slate-300"
                    >

                      <span>
                        Launch Aptitude
                      </span>

                      <ArrowRight className="w-3.5 h-3.5" />

                    </Button>

                  </Link>

                </div>

              </CardContent>

            </Card>


            {/* Wheel */}

            <Card className="border-slate-800 bg-slate-900">

              <CardContent className="p-6 space-y-4">

                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">

                  <Compass className="w-5 h-5" />

                </div>

                <div>

                  <div className="text-[11px] font-mono text-indigo-400 font-semibold uppercase">

                    Pillar 03

                  </div>

                  <h3 className="text-lg font-bold text-white">

                    Wheel of Competencies

                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">

                    Interactive competency assessment covering
                    technical skills, communication, confidence,
                    leadership, and personal development.

                  </p>

                </div>

                <div className="pt-2 border-t border-slate-800">

                  <Link href="/start">

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-xs text-slate-300"
                    >

                      <span>
                        Launch Competency Wheel
                      </span>

                      <ArrowRight className="w-3.5 h-3.5" />

                    </Button>

                  </Link>

                </div>

              </CardContent>

            </Card>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-6 mt-auto">

        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">

          <div className="font-semibold text-slate-300">

            CU-SUCCEED{" "}

            <span className="font-normal text-slate-500">

              | Assessment Platform

            </span>

          </div>


          <div className="flex flex-wrap justify-center items-center gap-6">

            <Link
              href="/login"
              className="hover:text-white transition-colors"
            >

              Student Sign In

            </Link>


            <Link
              href="/admin-login"
              className="hover:text-white transition-colors"
            >

              Admin Portal

            </Link>


            <span>

              © {new Date().getFullYear()} CU-SUCCEED

            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <header className="relative pt-24 pb-16 overflow-hidden flex flex-col items-center justify-center min-h-[85vh] text-center border-b border-border">
        {/* Animated Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="max-w-[1080px] mx-auto px-6 z-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 shadow-[0_0_20px_rgba(16,185,129,0.15)] text-sm font-medium text-primary">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Problem statement → platform blueprint
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            SucceedAcademy
            <br />
            <span className="text-4xl md:text-5xl">Digital Platform</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-[64ch] mx-auto mb-10 font-light">
            One cohesive ecosystem behind the public website, every student
            assessment, and the officials who run them — beautifully designed,
            massively scalable.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link
              href={
                session
                  ? session.user.role === "OFFICIAL"
                    ? "/admin"
                    : "/student"
                  : "/login"
              }
              className="px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
            >
              Enter the Platform
            </Link>
            <Link
              href="#programs"
              className="px-8 py-4 glass text-foreground font-semibold rounded-full hover:bg-white/5 transition-all"
            >
              Explore Programs
            </Link>
          </div>

          {/* Architecture Visualization */}
          <div
            className="max-w-4xl mx-auto glass p-6 md:p-10 rounded-2xl border border-white/10 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <svg
              viewBox="0 0 960 260"
              width="100%"
              height="auto"
              role="img"
              aria-label="Growth path"
              className="drop-shadow-2xl"
            >
              <path
                d="M80,210 H190 V170 H280 H390 V130 H480 H590 V90 H680 H790 V50 H880"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path
                d="M80,210 H190 V170 H280 H390 V130 H480 H590 V90 H680 H790 V50 H880"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="animate-[dash_3s_ease-in-out_forwards]"
                strokeDasharray="1500"
                strokeDashoffset="1500"
              />

              <g className="transition-all hover:scale-110 origin-[80px_210px]">
                <circle
                  cx="80"
                  cy="210"
                  r="8"
                  fill="#10B981"
                  className="shadow-[0_0_15px_#10B981]"
                />
                <text
                  className="font-mono text-xs font-semibold fill-white/80"
                  x="80"
                  y="190"
                  textAnchor="middle"
                >
                  Pre-test
                </text>
              </g>

              <g className="transition-all hover:scale-110 origin-[280px_170px]">
                <circle cx="280" cy="170" r="8" fill="#10B981" />
                <text
                  className="font-mono text-xs font-semibold fill-white/80"
                  x="280"
                  y="150"
                  textAnchor="middle"
                >
                  Training
                </text>
              </g>

              <g className="transition-all hover:scale-110 origin-[480px_130px]">
                <circle cx="480" cy="130" r="8" fill="#10B981" />
                <text
                  className="font-mono text-xs font-semibold fill-white/80"
                  x="480"
                  y="110"
                  textAnchor="middle"
                >
                  Post-test
                </text>
              </g>

              <g className="transition-all hover:scale-110 origin-[680px_90px]">
                <circle cx="680" cy="90" r="8" fill="#10B981" />
                <text
                  className="font-mono text-xs font-semibold fill-white/80"
                  x="680"
                  y="70"
                  textAnchor="middle"
                >
                  Report card
                </text>
              </g>

              <g className="transition-all hover:scale-110 origin-[880px_50px]">
                <circle
                  cx="880"
                  cy="50"
                  r="10"
                  fill="#3B82F6"
                  className="shadow-[0_0_20px_#3B82F6]"
                />
                <text
                  className="font-mono text-sm font-bold fill-white"
                  x="880"
                  y="28"
                  textAnchor="middle"
                >
                  Certificate
                </text>
              </g>

              <style>{`
                @keyframes dash { to { stroke-dashoffset: 0; } }
              `}</style>
            </svg>
          </div>
        </div>
      </header>

      <main>
        {/* About Us */}
        <section id="about" className="py-24 border-b border-border relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 -z-10"></div>
          <div className="max-w-[1080px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider mb-4">
                <span className="w-8 h-px bg-primary"></span> About
              </div>
              <h2 className="font-display font-bold text-4xl mb-6">
                Empowering{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  student success
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 font-light leading-relaxed">
                conducts various employability, aptitude, communication,
                soft-skills, and student-development programs. We believe in
                tracking progress through measurable assessments and actionable,
                beautiful reports.
              </p>
              <div className="flex gap-6">
                <div className="glass p-6 rounded-2xl flex-1 text-center glass-hover">
                  <h4 className="font-bold text-3xl text-white mb-1">10k+</h4>
                  <p className="text-xs text-muted-foreground uppercase font-mono">
                    Students
                  </p>
                </div>
                <div className="glass p-6 rounded-2xl flex-1 text-center glass-hover">
                  <h4 className="font-bold text-3xl text-white mb-1">50+</h4>
                  <p className="text-xs text-muted-foreground uppercase font-mono">
                    Colleges
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] glass rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
              <div className="w-full h-full border border-white/5 rounded-xl bg-black/40 flex flex-col p-6 backdrop-blur-sm relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
                  <div
                    className="h-4 w-1/2 bg-white/5 rounded animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-4 w-5/6 bg-white/10 rounded animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                  <div className="mt-8 flex gap-4">
                    <div
                      className="h-24 w-24 bg-primary/20 rounded-full flex-shrink-0 animate-pulse"
                      style={{ animationDelay: "450ms" }}
                    ></div>
                    <div className="flex-1 space-y-2 py-2">
                      <div className="h-3 w-full bg-white/10 rounded"></div>
                      <div className="h-3 w-full bg-white/10 rounded"></div>
                      <div className="h-3 w-2/3 bg-white/5 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Programs & Services */}
        <section
          id="programs"
          className="py-24 border-b border-border relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[150px] -z-10 transform translate-x-1/2 -translate-y-1/2"></div>

          <div className="max-w-[1080px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 text-secondary font-mono text-sm uppercase tracking-wider mb-4">
                Our Offerings
              </div>
              <h2 className="font-display font-bold text-4xl mb-4">
                Comprehensive Training Programs
              </h2>
              <p className="text-muted-foreground font-light text-lg">
                Designed to bridge the gap between academic curriculum and
                industry requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Employability Mentorship",
                  desc: "EMP prepares students for modern workforce challenges with industry alignment.",
                  icon: "🚀",
                },
                {
                  title: "Aptitude Training",
                  desc: "Sharpen analytical, quantitative, and logical problem-solving skills.",
                  icon: "🧠",
                },
                {
                  title: "Soft Skills Training",
                  desc: "Communication, teamwork, adaptability, and leadership development.",
                  icon: "💬",
                },
                {
                  title: "Corporate Training",
                  desc: "Specialized modules for organizational excellence and upskilling.",
                  icon: "🏢",
                },
                {
                  title: "Faculty Mentorship",
                  desc: "Empowering educators with modern pedagogies and tools.",
                  icon: "👨‍🏫",
                },
                {
                  title: "Psychometric Assessments",
                  desc: "Deep insights into personality, strengths, and career potential.",
                  icon: "📊",
                },
              ].map((prog, i) => (
                <div
                  key={i}
                  className="glass p-8 rounded-2xl glass-hover group"
                >
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl mb-6 border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                    {prog.icon}
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-white">
                    {prog.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {prog.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Ecosystem */}
        <section id="ecosystem" className="py-24 border-b border-border">
          <div className="max-w-[1080px] mx-auto px-6">
            <div className="max-w-2xl mb-16">
              <h2 className="font-display font-bold text-4xl mb-4">
                A complete digital ecosystem
              </h2>
              <p className="text-muted-foreground text-lg font-light">
                Connecting our public presence with student development,
                assessment management, tracking, and reporting in one seamless
                platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] -z-10 group-hover:bg-primary/40 transition-colors"></div>
                <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary rounded-full"></span> The
                  Student Journey
                </h3>
                <p className="text-muted-foreground mb-8 font-light leading-relaxed">
                  Students can access their dashboard, participate in Pre-Tests,
                  Psychometric Assessments, and view their growth trajectory via
                  Post-Tests.
                </p>
                <ul className="space-y-4 text-sm text-gray-300 font-mono">
                  <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-primary">→</span> Login & Dashboard
                    access
                  </li>
                  <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-primary">→</span> Take secure,
                    autosaved assessments
                  </li>
                  <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-primary">→</span> Receive automated,
                    verifiable certificates
                  </li>
                </ul>
              </div>

              <div className="glass p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-[50px] -z-10 group-hover:bg-secondary/40 transition-colors"></div>
                <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-3">
                  <span className="w-2 h-8 bg-secondary rounded-full"></span>{" "}
                  Official Management
                </h3>
                <p className="text-muted-foreground mb-8 font-light leading-relaxed">
                  Authorized officials have full control over the ecosystem.
                  Manage content, configure tests, and extract insights without
                  developers.
                </p>
                <ul className="space-y-4 text-sm text-gray-300 font-mono">
                  <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-secondary">→</span> Build & manage the
                    Question Bank
                  </li>
                  <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-secondary">→</span> Configure logic
                    for specific Assessments
                  </li>
                  <li className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <span className="text-secondary">→</span> Track batch
                    analytics and generate reports
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border overflow-hidden">
        {/* Subtle glow at the top of the footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-16 bg-primary/5 blur-[40px] -z-10"></div>

        <div className="max-w-[1080px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <Link
                href="/"
                className="font-display font-bold text-2xl text-white inline-block mb-4 hover:text-primary transition-colors"
              >
                SucceedAcademy
              </Link>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                The complete digital ecosystem for student assessment, training,
                and employability development.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">
                Platform
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/#about"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-light"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#programs"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-light"
                  >
                    Programs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#ecosystem"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-light"
                  >
                    Ecosystem
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-light"
                  >
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin-login"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-light"
                  >
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Programs Links */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">
                Programs
              </h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-sm text-muted-foreground font-light">
                    Employability Mentorship
                  </span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground font-light">
                    Aptitude Training
                  </span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground font-light">
                    Soft Skills Training
                  </span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground font-light">
                    Corporate Training
                  </span>
                </li>
                <li>
                  <span className="text-sm text-muted-foreground font-light">
                    Psychometric Assessments
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-5">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">Email</div>
                    <div className="text-xs text-muted-foreground font-light">
                      info@succeedacademy.com
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">
                      Location
                    </div>
                    <div className="text-xs text-muted-foreground font-light">
                      abc , india
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground font-light">
              © {new Date().getFullYear()} SucceedAcademy. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs text-muted-foreground font-light hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="text-xs text-muted-foreground font-light hover:text-white transition-colors cursor-pointer">
                Terms of Service
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-light">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                All systems operational
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, GraduationCap, Building2 } from "lucide-react";
import { Logo, LogoIcon } from "@/components/Logo";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-teal-500/20 selection:text-teal-300">

      {/* Minimal Navbar per requirements */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          <div className="flex items-center gap-3">
            <Logo href="/" size="md" subtitle="" />
          </div>

          <div className="flex items-center gap-3">
            {session ? (
              <Link href={session.user.role === "TPO" ? "/tpo" : session.user.role === "OFFICIAL" ? "/admin" : "/student"}>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs gap-1.5">
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signup">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/tpo-login">
                  <Button variant="outline" size="sm" className="border-slate-700 text-emerald-400 hover:bg-slate-800 text-xs gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> TPO Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px] -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs px-3 py-1">
              TopClass Training Company In India
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Empowering Careers & <span className="text-emerald-400">Placement Readiness</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At <strong className="text-white">CUSucceed</strong>, we are dedicated to fostering growth and development in students and working professionals. With over 12 years of experience, we have trained more than 120,000 individuals nationwide, partnering with top colleges and corporate organizations.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/tpo-login">
                <Button variant="outline" size="lg" className="border-slate-700 text-slate-200 hover:bg-slate-800 text-sm font-semibold gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" /> College TPO Portal
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <LogoIcon size={40} />
                <h3 className="text-lg font-bold text-white">Quick Portal Access</h3>
              </div>
              <p className="text-xs text-slate-400">Select your portal to log in or register your account.</p>
              <div className="space-y-3">
                <Link href="/login" className="block">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Student Portal</div>
                        <div className="text-[11px] text-slate-400">Take psychometric & competency assessments</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </Link>

                <Link href="/tpo-login" className="block">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">TPO / College Head Portal</div>
                        <div className="text-[11px] text-slate-400">View college student reports & badge graphs</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </Link>

                <Link href="/admin-login" className="block">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Official Admin Portal</div>
                        <div className="text-[11px] text-slate-400">Manage assessments, questions & students</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs">Services</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight">What we provide at CUSucceed</h2>
            <p className="text-xs text-slate-400">Comprehensive training solutions tailored for academic institutions and corporate teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-800 bg-slate-900">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Campus Recruitment Training</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Significantly boosts students employability by equipping them with essential practical skills, comprehensive interview preparation, and invaluable industry insights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Faculty Development Training</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enriches educators by providing cutting-edge teaching methodologies, seamless technology integration, and continuous avenues for professional growth.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white">Corporate Training</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sharpens employees' skills, fostering adaptability and continuous improvement to enhance organizational productivity and drive success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-3">
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-xs">Statistics</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight">Our Numbers Speak</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-4xl font-black text-emerald-400">12+</div>
              <div className="text-sm font-semibold text-white">Years in Industry</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-4xl font-black text-emerald-400">120,000+</div>
              <div className="text-sm font-semibold text-white">Trained Nationwide</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-4xl font-black text-emerald-400">30,000+</div>
              <div className="text-sm font-semibold text-white">Trainees Placed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span>© {new Date().getFullYear()} CUSucceed. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link href="/tpo-login" className="hover:text-white transition-colors">TPO Login</Link>
            <Link href="/admin-login" className="hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

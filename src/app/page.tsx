import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Logo, LogoIcon } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0b2227] text-gray-800 dark:text-[#b9d8cf] transition-colors">

      {/* Slim, Minimal Navbar with Entrance Animation */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-slate-800 bg-white/95 dark:bg-[#0b2227]/95 backdrop-blur-md animate-entrance-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          <div className="flex items-center gap-3">
            <Logo href="/" size="md" subtitle="" />
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {session ? (
              <Link href={session.user.role === "TPO" ? "/tpo" : session.user.role === "OFFICIAL" ? "/admin" : "/student"}>
                <Button size="sm" className="bg-[#006f73] dark:bg-emerald-600 hover:bg-[#14574f] dark:hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 transition-all shadow-md hover-lift">
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/signup">
                  <Button size="sm" className="bg-[#004d50] hover:bg-[#006f73] text-white font-semibold text-xs transition-all px-5 py-2 rounded-lg shadow-sm hover-lift">
                    Signup
                  </Button>
                </Link>
                <Link href="/tpo-login">
                  <Button size="sm" className="bg-[#004d50] hover:bg-[#006f73] text-white font-semibold text-xs transition-all px-5 py-2 rounded-lg shadow-sm hover-lift">
                    TPO Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Staggered Entrance & Continuous Floating Logo */}
      <section id="home" className="py-16 md:py-28 relative overflow-hidden flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">

          {/* Left Column (Staggered Entrance Sequence) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-[#006f73] dark:text-emerald-400 leading-tight animate-entrance-title">
              Top<span className="font-bold">Class</span>
            </h1>

            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#193335] dark:text-white leading-snug animate-entrance-subtitle">
              Training Company In <span className="text-[#006f73] dark:text-emerald-400">India</span>
            </div>

            <div className="space-y-4 text-gray-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed pt-2 max-w-2xl font-normal animate-entrance-desc">
              <p>
                At CUSucceed, we are dedicated to fostering growth and development in students and working professionals. Our mission is to equip individuals with the essential skills needed to excel in today&apos;s competitive job market.
              </p>
              <p>
                With over 12 years of experience in the industry, we have trained more than 120,000 individuals nationwide. We proudly associate with colleges and corporate organizations across India, ensuring that our training programs are accessible to students and professionals alike, helping them become industry-ready and achieve their career goals.
              </p>
            </div>
          </div>

          {/* Right Column: Entrance Scale + Continuous Floating Logo */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-10 animate-entrance-logo">
            <div className="absolute w-[350px] h-[350px] bg-[#6fbf58]/10 dark:bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="animate-float-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cu-succeed-logo.png"
                alt="CU-SUCCEED Brand Logo"
                className="w-72 sm:w-80 md:w-96 h-auto drop-shadow-xl select-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="outline" className="text-[#006f73] dark:text-emerald-400 border-[#006f73]/30 dark:border-emerald-500/30 text-xs">Services</Badge>
            <h2 className="text-3xl font-bold text-[#193335] dark:text-white tracking-tight">What we provide at CUSucceed</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">Comprehensive training solutions tailored for academic institutions and corporate teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#006f73]/40 dark:hover:border-emerald-500/40 transition-all hover-lift shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#193335] dark:text-white">Campus Recruitment Training</h3>
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                  Significantly boosts students&apos; employability by equipping them with essential practical skills, comprehensive interview preparation, and invaluable industry insights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#006f73]/40 dark:hover:border-emerald-500/40 transition-all hover-lift shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#193335] dark:text-white">Faculty Development Training</h3>
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                  Enriches educators by providing cutting-edge teaching methodologies, seamless technology integration, and continuous avenues for professional growth.
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#006f73]/40 dark:hover:border-emerald-500/40 transition-all hover-lift shadow-sm">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#193335] dark:text-white">Corporate Training</h3>
                <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                  Sharpens employees&apos; skills, fostering adaptability and continuous improvement to enhance organizational productivity and drive success.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-3">
            <Badge variant="outline" className="text-[#006f73] dark:text-emerald-400 border-[#006f73]/30 dark:border-emerald-500/30 text-xs">Statistics</Badge>
            <h2 className="text-3xl font-bold text-[#193335] dark:text-white tracking-tight">Our Numbers Speak</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-2 hover:border-[#006f73]/30 dark:hover:border-emerald-500/30 transition-all hover-lift">
              <div className="text-4xl font-black text-[#006f73] dark:text-emerald-400">12+</div>
              <div className="text-sm font-semibold text-[#193335] dark:text-white">Years in Industry</div>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-2 hover:border-[#006f73]/30 dark:hover:border-emerald-500/30 transition-all hover-lift">
              <div className="text-4xl font-black text-[#006f73] dark:text-emerald-400">120,000+</div>
              <div className="text-sm font-semibold text-[#193335] dark:text-white">Trained Nationwide</div>
            </div>
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 space-y-2 hover:border-[#006f73]/30 dark:hover:border-emerald-500/30 transition-all hover-lift">
              <div className="text-4xl font-black text-[#006f73] dark:text-emerald-400">30,000+</div>
              <div className="text-sm font-semibold text-[#193335] dark:text-white">Trainees Placed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/60 py-8 text-center text-xs text-gray-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <LogoIcon size={28} />
            <span>© {new Date().getFullYear()} CUSucceed. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/signup" className="hover:text-[#006f73] dark:hover:text-white transition-colors">Signup</Link>
            <Link href="/tpo-login" className="hover:text-[#006f73] dark:hover:text-white transition-colors">TPO Login</Link>
            <Link href="/admin-login" className="hover:text-[#006f73] dark:hover:text-white transition-colors">Admin Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

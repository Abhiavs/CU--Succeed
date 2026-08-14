import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="sticky top-0 z-50 glass px-6 py-4">
      <div className="max-w-[1080px] mx-auto flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl text-primary whitespace-nowrap hover:text-white transition-colors">
          SucceedAcademy
        </Link>
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0 text-sm font-medium">
          <li><Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
          <li><Link href="/#programs" className="text-muted-foreground hover:text-primary transition-colors">Programs</Link></li>
          <li><Link href="/#ecosystem" className="text-muted-foreground hover:text-primary transition-colors">Platform</Link></li>
          {session ? (
            <li>
              <Link 
                href={session.user.role === "OFFICIAL" ? "/admin" : "/student"} 
                className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                Dashboard
              </Link>
            </li>
          ) : (
            <li>
              <Link 
                href="/login" 
                className="px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary hover:text-primary-foreground transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
           {session ? (
            <Link 
              href={session.user.role === "OFFICIAL" ? "/admin" : "/student"} 
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary hover:text-primary-foreground transition-all text-sm"
            >
              Dashboard
            </Link>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full hover:bg-primary hover:text-primary-foreground transition-all text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

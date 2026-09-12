import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailLower = credentials.email.trim().toLowerCase();

        // Authentication must always use the production database. Assessment
        // accounts and credentials must never fall back to demo data.
        try {
          const user = await prisma.user.findUnique({
            where: { email: emailLower },
          });

          if (user) {
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordValid) {
              const u = user as any;
              return {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                rollNumber: u.rollNumber || null,
                branch: u.branch || null,
                year: u.year || null,
                assessmentType: u.assessmentType || null,
                collegeName: u.collegeName || null,
                batch: u.batch || null,
              };
            }
          }
        } catch (dbError) {
          console.error("Authentication database lookup failed.", dbError);
          return null;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rollNumber = user.rollNumber;
        token.branch = user.branch;
        token.year = user.year;
        token.assessmentType = user.assessmentType;
        token.collegeName = user.collegeName;
        token.batch = user.batch;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "STUDENT" | "OFFICIAL";
        session.user.rollNumber = token.rollNumber as string | null;
        session.user.branch = token.branch as string | null;
        session.user.year = token.year as string | null;
        session.user.assessmentType = token.assessmentType as string | null;
        session.user.collegeName = token.collegeName as string | null;
        session.user.batch = token.batch as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

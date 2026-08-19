import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { inMemoryStore } from "./store";

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

        // 1. Hardcoded admin verification fallback (works even if DB is offline)
        if (
          (emailLower === "admin@succeed.com" || emailLower === "admin@cusucceed.com") &&
          credentials.password === "admin123"
        ) {
          return {
            id: "admin-master-001",
            name: "Super Administrator",
            email: emailLower,
            role: "OFFICIAL",
            rollNumber: null,
            branch: null,
            year: null,
            assessmentType: null,
            collegeName: "Succeed Academy HQ",
          };
        }

        // 2. Query Prisma database
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
              };
            }
          }
        } catch (dbError) {
          console.warn("DB offline, checking store:", dbError);
        }

        // 3. Check fallback in-memory store for students
        const storedProfile = inMemoryStore.getProfile(emailLower);
        if (storedProfile) {
          return {
            id: storedProfile.id,
            name: storedProfile.name,
            email: storedProfile.email,
            role: "STUDENT",
            rollNumber: storedProfile.rollNumber,
            branch: storedProfile.branch,
            year: storedProfile.year,
            assessmentType: storedProfile.assessmentType,
            collegeName: storedProfile.collegeName,
          };
        }

        // 4. Demo fallback account if student logs in with demo credentials
        if (emailLower.includes("@") && credentials.password.length >= 4) {
          const demoId = "student-demo-" + emailLower.split("@")[0];
          const demoProfile = {
            id: demoId,
            name: emailLower.split("@")[0].toUpperCase(),
            email: emailLower,
            rollNumber: "SUC-2026-001",
            branch: "Computer Science & Engineering",
            year: "3rd",
            assessmentType: "PRE" as const,
            collegeName: "Succeed Institute of Technology",
            createdAt: new Date().toISOString(),
          };
          inMemoryStore.saveProfile(demoProfile);
          return {
            id: demoProfile.id,
            name: demoProfile.name,
            email: demoProfile.email,
            role: "STUDENT",
            rollNumber: demoProfile.rollNumber,
            branch: demoProfile.branch,
            year: demoProfile.year,
            assessmentType: demoProfile.assessmentType,
            collegeName: demoProfile.collegeName,
          };
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
  secret: process.env.NEXTAUTH_SECRET || "my_super_secret_key",
};

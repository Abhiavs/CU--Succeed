import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "STUDENT" | "OFFICIAL";
    rollNumber?: string | null;
    branch?: string | null;
    year?: string | null;
    assessmentType?: string | null;
    collegeName?: string | null;
  }

  interface Session {
    user: User & {
      id: string;
      role: "STUDENT" | "OFFICIAL";
      rollNumber?: string | null;
      branch?: string | null;
      year?: string | null;
      assessmentType?: string | null;
      collegeName?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "STUDENT" | "OFFICIAL";
    rollNumber?: string | null;
    branch?: string | null;
    year?: string | null;
    assessmentType?: string | null;
    collegeName?: string | null;
  }
}

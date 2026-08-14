import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: "STUDENT" | "OFFICIAL"
  }

  interface Session {
    user: User & {
      id: string
      role: "STUDENT" | "OFFICIAL"
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "STUDENT" | "OFFICIAL"
  }
}

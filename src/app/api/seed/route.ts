import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const adminEmail = "admin@cusucceed.com";
    
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      
      await prisma.user.create({
        data: {
          name: "Super Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "OFFICIAL",
        },
      });
      return NextResponse.json({ message: "Admin account created successfully: admin@cusucceed.com / admin123" });
    }
    
    return NextResponse.json({ message: "Admin account already exists." });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Failed to seed admin", details: error.message }, { status: 500 });
  }
}

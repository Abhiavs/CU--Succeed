import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "OFFICIAL") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const { id } = await params;
    const cert = await prisma.certificate.update({
      where: { id },
      data: { status: data.status }
    });

    return NextResponse.json(cert, { status: 200 });
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

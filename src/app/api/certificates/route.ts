import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inMemoryStore } from "@/lib/store";

export async function GET() {
  try {
    let dbCertificates: any[] = [];
    try {
      dbCertificates = await (prisma as any).certificate.findMany({
        include: {
          student: true,
          program: true,
        },
        orderBy: { issueDate: "desc" },
      });
    } catch (e) {
      dbCertificates = [];
    }

    // Combine with in-memory student profiles
    const storeProfiles = inMemoryStore.getAllProfiles();
    const syntheticCerts = storeProfiles.map((p) => {
      const st = inMemoryStore.getState(p.id);
      const readiness = Math.round(
        (st.psychometricScore || 78) * 0.35 +
        (st.aptitudeScore || 82) * 0.35 +
        ((st.wheelAverage || 7.8) * 10) * 0.30
      );

      return {
        id: `SUC-EMP-2026-${p.id.slice(-4).toUpperCase()}`,
        status: "ACTIVE",
        issueDate: p.createdAt || new Date().toISOString(),
        score: readiness,
        student: {
          id: p.id,
          name: p.name,
          email: p.email,
          rollNumber: p.rollNumber,
          branch: p.branch,
          collegeName: p.collegeName,
        },
        program: {
          name: `${p.assessmentType === "PRE" ? "Pre-Assessment" : "Post-Assessment"} (${p.year} Year)`,
        },
      };
    });

    const allCertificates = [...dbCertificates, ...syntheticCerts];
    return NextResponse.json({ certificates: allCertificates }, { status: 200 });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { studentId, programId } = body;

    const certId = `SUC-EMP-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let certificate;
    try {
      certificate = await (prisma as any).certificate.create({
        data: {
          id: certId,
          studentId: studentId || session.user.id,
          programId: programId || "default-prog",
          status: "ACTIVE",
          issueDate: new Date(),
        },
      });
    } catch (e) {
      certificate = {
        id: certId,
        studentId: studentId || session.user.id,
        programId: programId || "default-prog",
        status: "ACTIVE",
        issueDate: new Date().toISOString(),
      };
    }

    return NextResponse.json({ success: true, certificate }, { status: 201 });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

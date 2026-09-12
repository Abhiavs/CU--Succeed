import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import {
  getAttemptType,
  getResultTabTitle,
  parseResultTab,
} from "@/lib/attemptType";

/*
 * ============================================================
 * GET /api/admin/results/export
 *
 * Downloads completed assessment attempts as an Excel sheet.
 *
 * Query params:
 *   tab    -> psychometric | wheel | post (optional)
 *   batch  -> "Batch 1" | "Batch 2"      (optional)
 *
 * Only OFFICIAL (admin) sessions may export results.
 * ============================================================
 */

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "OFFICIAL") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    const tabParam = searchParams.get("tab") || undefined;
    const batch = searchParams.get("batch") || "";

    const currentTab = parseResultTab(tabParam);

    /*
     * ============================================================
     * LOAD COMPLETED ATTEMPTS
     * ============================================================
     */

    const attempts = await prisma.attempt.findMany({
      where: {
        status: "COMPLETED",
      },

      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            rollNumber: true,
            branch: true,
            year: true,
            assessmentType: true,
            collegeName: true,
            batch: true,
          },
        },

        assessment: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

    /*
     * ============================================================
     * FILTER BY TAB + BATCH
     * ============================================================
     */

    const filtered = attempts.filter((attempt) => {
      const matchesTab =
        getAttemptType(attempt) === currentTab;

      const matchesBatch =
        !batch || attempt.student?.batch === batch;

      return matchesTab && matchesBatch;
    });

    /*
     * ============================================================
     * BUILD SHEET ROWS
     * ============================================================
     */

    const rows = filtered.map((attempt) => {
      const score =
        attempt.score === null ||
        attempt.score === undefined
          ? null
          : Number(attempt.score);

      const isWheel =
        getAttemptType(attempt) === "WHEEL";

      return {
        Batch: attempt.student?.batch || "—",
        Candidate: attempt.student?.name || "Unknown Student",
        "Roll Number": attempt.student?.rollNumber || "—",
        Branch: attempt.student?.branch || "—",
        College: attempt.student?.collegeName || "—",
        Assessment: getResultTabTitle(currentTab),
        "Assessment Title":
          attempt.assessment?.title || getResultTabTitle(currentTab),
        Score:
          score === null || Number.isNaN(score)
            ? "—"
            : isWheel
            ? score
            : `${score}%`,
        Completed: attempt.endTime
          ? new Date(attempt.endTime).toLocaleDateString("en-IN")
          : new Date(attempt.updatedAt).toLocaleDateString("en-IN"),
        Status: "Completed",
      };
    });

    /*
     * ============================================================
     * BUILD WORKBOOK
     * ============================================================
     */

    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Results"
    );

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    /*
     * ============================================================
     * FILE NAME
     * ============================================================
     */

    const batchSuffix = batch
      ? `-${batch.replace(/\s+/g, "-").toLowerCase()}`
      : "";

    const fileName = `cu-succeed-results-${currentTab.toLowerCase()}${batchSuffix}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,

      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "Content-Disposition": `attachment; filename="${fileName}"`,

        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error("Results export error:", error);

    return NextResponse.json(
      { error: "Failed to export results." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/*
 * ============================================================
 * GET WHEEL DIMENSIONS
 *
 * Examples:
 * /api/wheel/dimensions?type=PRE
 * /api/wheel/dimensions?type=POST
 * ============================================================
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");

    const where: any = {
      isActive: true,
    };

    if (type) {
      where.assessmentType = type;
    }

    const dimensions =
      await prisma.wheelDimension.findMany({
        where,

        orderBy: {
          sortOrder: "asc",
        },
      });

    return NextResponse.json({
      success: true,
      dimensions,
    });
  } catch (error) {
    console.error(
      "GET wheel dimensions error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load wheel dimensions",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * ============================================================
 * CREATE WHEEL DIMENSION
 * ============================================================
 */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "OFFICIAL") {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    const {
      name,
      assessmentType,
      sortOrder,
    } = body;

    if (!name || !assessmentType) {
      return NextResponse.json(
        {
          error:
            "Dimension name and assessment type are required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      assessmentType !== "PRE" &&
      assessmentType !== "POST"
    ) {
      return NextResponse.json(
        {
          error:
            "Assessment type must be PRE or POST",
        },
        {
          status: 400,
        }
      );
    }

    const dimension =
      await prisma.wheelDimension.create({
        data: {
          name: name.trim(),

          assessmentType,

          sortOrder:
            Number(sortOrder) || 0,
        },
      });

    return NextResponse.json(
      {
        success: true,
        dimension,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "CREATE wheel dimension error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create wheel dimension",
      },
      {
        status: 500,
      }
    );
  }
}
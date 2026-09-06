import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/*
 * ============================================================
 * UPDATE WHEEL DIMENSION
 * ============================================================
 */

export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      dimensionId: string;
    }>;
  }
) {
  try {
    /*
     * ============================================================
     * AUTHORIZATION
     * ============================================================
     */

    const session =
      await getServerSession(authOptions);

    if (
      !session ||
      session.user.role !== "OFFICIAL"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ============================================================
     * GET DIMENSION ID
     * ============================================================
     */

    const { dimensionId } =
      await params;

    if (!dimensionId) {
      return NextResponse.json(
        {
          error:
            "Dimension ID is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ============================================================
     * READ REQUEST BODY
     * ============================================================
     */

    const body =
      await req.json();

    const {
      name,
      assessmentType,
      sortOrder,
      isActive,
    } = body;

    /*
     * ============================================================
     * CHECK DIMENSION EXISTS
     * ============================================================
     */

    const existingDimension =
      await prisma.wheelDimension.findUnique({
        where: {
          id: dimensionId,
        },
      });

    if (!existingDimension) {
      return NextResponse.json(
        {
          error:
            "Wheel dimension not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ============================================================
     * VALIDATE ASSESSMENT TYPE
     * ============================================================
     */

    if (
      assessmentType &&
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

    /*
     * ============================================================
     * UPDATE DIMENSION
     * ============================================================
     */

    const updatedDimension =
      await prisma.wheelDimension.update({
        where: {
          id: dimensionId,
        },

        data: {
          ...(name !== undefined && {
            name: name.trim(),
          }),

          ...(assessmentType !==
            undefined && {
            assessmentType,
          }),

          ...(sortOrder !==
            undefined && {
            sortOrder:
              Number(sortOrder),
          }),

          ...(isActive !==
            undefined && {
            isActive,
          }),
        },
      });

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    return NextResponse.json({
      success: true,

      dimension:
        updatedDimension,

      message:
        "Wheel dimension updated successfully",
    });

  } catch (error) {
    console.error(
      "UPDATE wheel dimension error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update wheel dimension",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * ============================================================
 * DELETE WHEEL DIMENSION
 * ============================================================
 */

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      dimensionId: string;
    }>;
  }
) {
  try {
    /*
     * ============================================================
     * AUTHORIZATION
     * ============================================================
     */

    const session =
      await getServerSession(authOptions);

    if (
      !session ||
      session.user.role !== "OFFICIAL"
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ============================================================
     * GET DIMENSION ID
     * ============================================================
     */

    const { dimensionId } =
      await params;

    if (!dimensionId) {
      return NextResponse.json(
        {
          error:
            "Dimension ID is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * ============================================================
     * CHECK EXISTS
     * ============================================================
     */

    const existingDimension =
      await prisma.wheelDimension.findUnique({
        where: {
          id: dimensionId,
        },
      });

    if (!existingDimension) {
      return NextResponse.json(
        {
          error:
            "Wheel dimension not found",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ============================================================
     * DELETE
     * ============================================================
     */

    await prisma.wheelDimension.delete({
      where: {
        id: dimensionId,
      },
    });

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    return NextResponse.json({
      success: true,

      message:
        "Wheel dimension deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE wheel dimension error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete wheel dimension",
        },
      {
        status: 500,
      }
    );
  }
}
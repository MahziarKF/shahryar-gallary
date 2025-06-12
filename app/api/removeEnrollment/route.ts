import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, courseId } = body;

    if (!userId || !courseId) {
      return NextResponse.json(
        { error: "Missing userId or courseId" },
        { status: 400 }
      );
    }

    const removedEnrollment = await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: Number(userId),
          courseId: Number(courseId),
        },
      },
    });

    return NextResponse.json(
      { message: "Enrollment deleted", data: removedEnrollment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return NextResponse.json(
      { error: "Failed to delete enrollment", detail: error },
      { status: 500 }
    );
  }
}

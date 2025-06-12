import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, courseId } = body;

    if (!username || !courseId) {
      return new Response(
        JSON.stringify({ error: "username and courseId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "کاربر مورد نظر پیدا نشد." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: Number(courseId) },
    });

    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return new Response(
        JSON.stringify({
          error: "این کاربر در حال حاضر در این دوره شرکت کرده است",
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create the enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });

    // Automatically create an attendance record linked to the enrollment
    const attendance = await prisma.attendance.create({
      data: {
        enrollment_id: enrollment.id,
        checklist: [], // start with empty attendance checklist
      },
    });

    return new Response(
      JSON.stringify({
        message: "User enrolled successfully",
        enrollment,
        attendance,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Enrollment error:", error);

    if (
      error?.code === "P2002" &&
      error?.meta?.target?.includes("userId_courseId")
    ) {
      return new Response(
        JSON.stringify({ error: "User is already enrolled in this course." }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Failed to enroll user." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

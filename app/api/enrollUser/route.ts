import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, courseId } = await req.json();

    if (!username || !courseId) {
      return new Response(
        JSON.stringify({ error: "username and courseId are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return new Response(JSON.stringify({ error: "Course not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create enrollment (unique user-course pair)
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });

    return new Response(
      JSON.stringify({ message: "User enrolled successfully", enrollment }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    // Handle unique constraint violation (user already enrolled)
    if (
      error?.code === "P2002" &&
      error?.meta?.target?.includes("user_id_course_id")
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

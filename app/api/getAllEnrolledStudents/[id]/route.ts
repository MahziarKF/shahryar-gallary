import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params; // context.params is available after await
  const courseId = await Number(id);

  if (isNaN(courseId)) {
    return new Response(JSON.stringify({ error: "Invalid course ID." }), {
      status: 400,
    });
  }
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            is_active: true,
            is_verified: true,
            profile_image_url: true,
            role: true,
          },
        },
      },
    });

    const users = enrollments.map((e) => e.user);

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch enrolled users:", error);
    return new Response(
      JSON.stringify({ error: "Server error fetching enrolled users." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

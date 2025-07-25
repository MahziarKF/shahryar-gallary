// /app/api/getAllCourses/route.ts (App Router)
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const courses = await prisma.course.findMany();
    return new Response(JSON.stringify({ courses }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      "error from getAllCourses --dev only please : error removed please re add the error",
      { status: 500 }
    );
  }
}

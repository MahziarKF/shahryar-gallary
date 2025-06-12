import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // params is a Promise
) {
  const params = await context.params; // await the params
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ message: "Invalid course id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const deletedCourse = await prisma.course.delete({
      where: { id },
    });
    return new Response(JSON.stringify(deletedCourse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error deleting course", error }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } // id param is string
) {
  const id = parseInt(context.params.id, 10); // convert to number

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

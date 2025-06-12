import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id || typeof id !== "number") {
      return new Response("Invalid or missing teacher ID", { status: 400 });
    }

    // ✅ Check if teacher exists
    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!existingTeacher) {
      return new Response("Teacher not found", { status: 404 });
    }

    const deletedTeacher = await prisma.teacher.delete({
      where: { id },
    });

    return new Response(`Teacher ${deletedTeacher.name} was deleted.`, {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error deleting teacher:", error);
    return new Response("Error while deleting teacher.", { status: 500 });
  }
}

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Hardcoded teacherId (make sure this teacher exists in your DB)
const HARDCODED_TEACHER_ID = 1;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, price, duration, is_active } = body;

    if (id !== undefined && typeof id !== "number") {
      return NextResponse.json(
        { error: "Id must be a number if provided." },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required and must be a string." },
        { status: 400 }
      );
    }

    if (price !== undefined && typeof price !== "string") {
      return NextResponse.json(
        { error: "Price must be a string." },
        { status: 400 }
      );
    }

    if (duration !== undefined && typeof duration !== "string") {
      return NextResponse.json(
        { error: "Duration must be a string." },
        { status: 400 }
      );
    }

    let course;
    if (id) {
      // Upsert course by ID
      course = await prisma.course.upsert({
        where: { id },
        update: {
          title,
          description: description ?? null,
          price: price ?? "0",
          duration: duration ?? "0",
          is_active: is_active ?? true,
          teacherId: HARDCODED_TEACHER_ID,
        },
        create: {
          title,
          description: description ?? null,
          price: price ?? "0",
          duration: duration ?? "0",
          is_active: is_active ?? true,
          teacherId: HARDCODED_TEACHER_ID,
        },
      });
    } else {
      // Create new course
      course = await prisma.course.create({
        data: {
          title,
          description: description ?? null,
          price: price ?? "0",
          duration: duration ?? "0",
          is_active: is_active ?? true,
          teacherId: HARDCODED_TEACHER_ID,
        },
      });
    }

    return NextResponse.json(course, { status: id ? 200 : 201 });
  } catch (error: any) {
    console.error("Create/upsert course error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

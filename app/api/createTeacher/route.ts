import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, bio, image, phone, professions } = body;
    const teacher = await prisma.teacher.create({
      data: { name, bio, image_url: image, professions, phone },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    console.log("Create teacher error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}

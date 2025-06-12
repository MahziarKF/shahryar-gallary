import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    const exists = await prisma.category.findFirst({ where: { name } });
    if (exists) {
      return NextResponse.json(
        { message: "category already exists." },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({ data: { name } });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "error while creating a category." },
      { status: 500 }
    );
  }
}

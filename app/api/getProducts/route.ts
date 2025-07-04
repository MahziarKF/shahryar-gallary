import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { limit = 10, page = 1 } = body;

    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      skip,
      take: limit,
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}

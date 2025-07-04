import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, username } = body;
    const product = await prisma.product.findFirst({
      where: { name: productName },
    });
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    if (!product) {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 }
      );
    }
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    const addedBookmark = await prisma.bookmarkedProduct.create({
      data: {
        productId: product.id,
        userId: user.id,
      },
    });
    return NextResponse.json(
      {
        message: "added bookmark successfuly",
        addedBookmark,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "server error." }, { status: 500 });
  }
}

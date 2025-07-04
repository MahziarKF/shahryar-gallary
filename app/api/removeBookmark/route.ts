import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productName, username } = body;
    const product = await prisma.product.findFirst({
      where: { name: productName },
    });
    if (!product)
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 }
      );
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user)
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    const removedBookmark = await prisma.bookmarkedProduct.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        },
      },
    });
    return NextResponse.json(
      { message: "bookmark successfuly removed", removedBookmark },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}

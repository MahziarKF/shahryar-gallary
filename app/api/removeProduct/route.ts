import { deleteProductImages } from "@/lib/image";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id)
      return NextResponse.json({ message: "No id provided" }, { status: 400 });
    const deletedProduct = await prisma.product.delete({ where: { id } });
    await deleteProductImages(String(deletedProduct.name));
    return NextResponse.json(
      { message: "کالا با موفقیت حدف شد" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "error while deleting product" },
      { status: 500 }
    );
  }
}

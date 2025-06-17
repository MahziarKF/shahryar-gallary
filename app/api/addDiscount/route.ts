import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, discount } = body;

    // Check if product exists
    const productExists = await prisma.product.findFirst({
      where: { id: Number(product_id) },
    });

    if (!productExists) {
      return NextResponse.json(
        { message: "این کالا وجود ندارد" },
        { status: 409 }
      );
    }

    // Check if the product already has a discount
    const discountExists = await prisma.discount.findFirst({
      where: {
        product_id: Number(product_id),
      },
    });

    if (discountExists) {
      return NextResponse.json(
        { message: "این کالا قبلاً دارای تخفیف است" },
        { status: 409 }
      );
    }

    // Add the discount if no existing discount is found
    const newDiscount = await prisma.discount.create({
      data: {
        product_id: Number(product_id),
        discount_percent: Number(discount),
      },
    });

    return NextResponse.json(
      { message: "تخفیف با موفقیت اضافه شد", discount: newDiscount },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "server error." }, { status: 500 });
  }
}

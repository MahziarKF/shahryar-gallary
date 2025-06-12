import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, desc, price, stock, category_id } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { message: "The 'name' field is required." },
        { status: 400 }
      );
    }
    if (!price) {
      return NextResponse.json(
        { message: "The 'price' field is required." },
        { status: 400 }
      );
    }

    // Check for duplicate product
    const productExists = await prisma.product.findFirst({ where: { name } });
    if (productExists) {
      return NextResponse.json(
        {
          message: "Product already exists with this name.",
        },
        { status: 409 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description: desc,
        price,
        stock,
        category_id: Number(category_id),
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error while creating a product.",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

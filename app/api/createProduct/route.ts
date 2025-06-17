import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, price, stock, category_id } = body;

    if (!name || !price) {
      return NextResponse.json(
        { message: "The 'name' and 'price' fields are required." },
        { status: 400 }
      );
    }

    const productExists = await prisma.product.findFirst({ where: { name } });
    if (productExists) {
      return NextResponse.json(
        { message: "Product already exists with this name." },
        { status: 409 }
      );
    }

    // Step 1: Create the product
    const product = await prisma.product.create({
      data: { name, description, price, stock },
    });

    // Step 2: If category_id is provided, create ProductCategory entry
    if (category_id) {
      await prisma.productCategory.create({
        data: {
          product_id: product.id,
          category_id: Number(category_id),
        },
      });
    }

    // Optional: Fetch product with categories
    const fullProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: { categories: true },
    });

    return NextResponse.json(
      {
        message: "Product created successfully.",
        product: fullProduct,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error while creating product:", error);
    return NextResponse.json(
      {
        message: "Error while creating a product.",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

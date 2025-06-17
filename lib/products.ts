// lib/getProducts.ts
import prisma from "@/lib/prisma";

export default async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: {
          include: {
            category: true, // ✅ This is essential to get the category name
          },
        },
        discount: true, // ✅ To get the discount list
      },
    });
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
}

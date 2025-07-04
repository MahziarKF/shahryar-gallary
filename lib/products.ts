// lib/getProducts.ts
import prisma from "@/lib/prisma";

export default async function getProducts(limit = true) {
  try {
    const products = await prisma.product.findMany({
      ...(limit && { take: 10 }), // take only if limit is true
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        discount: true,
      },
    });
    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
}

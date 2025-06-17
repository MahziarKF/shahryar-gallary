import prisma from "@/lib/prisma";

export default async function getDiscounts() {
  try {
    const discounts = await prisma.discount.findMany();
    return discounts ?? [];
  } catch (error) {
    console.log(`error while getting discounts : ${error}`);
  }
}

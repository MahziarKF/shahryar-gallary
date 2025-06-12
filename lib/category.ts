import prisma from "@/lib/prisma";

export default async function getCategorys() {
  try {
    const categorys = await prisma.category.findMany();
    return categorys;
  } catch (error) {
    console.log(error);
  }
}

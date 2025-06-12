import prisma from "@/lib/prisma";
export default async function getTeachers() {
  try {
    const teachers = await prisma.teacher.findMany();
    return teachers;
  } catch (error) {
    console.log(error);
    return [];
  }
}

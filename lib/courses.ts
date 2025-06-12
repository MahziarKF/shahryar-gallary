import prisma from "@/lib/prisma";
export default async function getCourses() {
  try {
    const courses = await prisma.course.findMany();
    return courses;
  } catch (error) {
    console.log("error while getting courses in lib/courses.ts", error);
    return []; // Always return an array
  }
}

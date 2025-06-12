import prisma from "@/lib/prisma";

export default async function getEnrollmentId(
  userId: number | string,
  courseId: number | string
): Promise<number | null> {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: Number(userId),
        courseId: Number(courseId),
      },
    },
    select: {
      id: true,
    },
  });

  return enrollment ? enrollment.id : null;
}

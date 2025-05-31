import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const course = await prisma.course.create({
      data: {
        title: "Hardcoded course",
        description: "Test description",
        price: "100",
        duration: "10",
        is_active: true,
      },
    });

    return new Response(JSON.stringify(course), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("CREATE COURSE ERROR:", error.message, error);
    return new Response(JSON.stringify({ error: "error.message" }), {
      status: 500,
    });
  }
}

import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export default async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username) {
    return;
  }
  const user = await prisma.user.findUnique({ where: { username: username } });
  if (!user) {
    return new Response(JSON.stringify("No user found"), { status: 404 });
  }
  const userEnrollments = await prisma.course.findMany({
    where: { enrollments: { some: { userId: user.id } } },
  });
  if (!userEnrollments) {
    return new Response(
      JSON.stringify({
        message: "شما هنوز در دوره ایی ثبت نام نکردید",
        count: 0,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return new Response(
    JSON.stringify({ message: "دوره های شما", Enrollments: userEnrollments }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

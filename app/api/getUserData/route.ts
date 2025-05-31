import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return new Response(JSON.stringify({ error: "username is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      message: "Data retrieved successfully.",
      userData: user,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Example: you could add cookies here if needed
        // "Set-Cookie": `token=${token}; HttpOnly; Path=/;`,
      },
    }
  );
}

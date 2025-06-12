import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify({ students: users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

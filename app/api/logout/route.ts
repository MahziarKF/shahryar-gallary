// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { serialize } from "cookie";
import prisma from "@/lib/prisma";
export async function GET() {
  const expiredToken = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0, // delete immediately
  });

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Set-Cookie": expiredToken,
    },
  });
}

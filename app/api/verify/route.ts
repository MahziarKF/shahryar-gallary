// app/api/verify/route.ts or pages/api/verify.ts depending on your structure

import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, username } = body;

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (!user) {
    return new Response("user not found", { status: 400 });
  }

  if (Number(user.verification) === Number(code)) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        is_verified: true,
        verification: 1000000, // Or null, depending on your logic
      },
    });

    return new Response(
      JSON.stringify({
        message: "Email verified! You can now log in.",
        verified: true,
      }),
      { status: 200 }
    );
  }

  return new Response(JSON.stringify({ verified: false }), { status: 400 });
}

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createTokenForUser, createUserCookie, TokenPayload } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (!user) {
      return new Response(
        JSON.stringify("نام کاربری یا رمز عبور اشتباه است."),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
      return new Response(
        JSON.stringify("نام کاربری یا رمز عبور اشتباه است."),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const payload: TokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    const token = createTokenForUser(payload);
    const cookie = createUserCookie(token);

    return new Response(
      JSON.stringify({
        message: "ورود موفقیت‌آمیز بود!",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie, // ✅ Set token cookie here
        },
      }
    );
  } catch (error) {
    console.error("Error logging in user:", error);
    return new Response("خطا در ورود به سیستم", { status: 500 });
  }
}

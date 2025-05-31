import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createTokenForUser, createUserCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if user exists by username or email
    const userExists = await prisma.user.findUnique({
      where: { username: body.username },
    });
    if (userExists) {
      return new Response(
        JSON.stringify("این نام کاربری توسط شخصی دیگر استفاده شده."),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (body.password.length < 8) {
      return new Response(
        JSON.stringify("رمز عبور شما میبایست بیشتر از 8 کاراکتر باشد"),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        phone: body.phone ?? null,
        password: hashedPassword,
        role: body.role || "student",
      },
    });

    // Create JWT token and cookie
    const token = createTokenForUser({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });
    const cookie = createUserCookie(token);

    // Return user info and set cookie
    return new Response(
      JSON.stringify({
        message: "ثبت‌نام با موفقیت انجام شد!",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response("خطا در ثبت‌نام کاربر", { status: 500 });
  }
}

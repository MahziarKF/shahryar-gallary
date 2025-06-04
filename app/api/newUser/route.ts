import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createTokenForUser, createUserCookie } from "@/lib/auth";
import crypto from "crypto";
const { sendVerificationEmail } = require("@/lib/email");
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.email || !body.username || !body.password) {
      return new Response(
        JSON.stringify("لطفا ایمیل، نام کاربری و رمز عبور را وارد کنید."),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if user exists by username or email
    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (userExists) {
      return new Response(
        JSON.stringify("نام کاربری یا ایمیل وارد شده قبلا استفاده شده است."),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (body.password.length < 8) {
      return new Response(
        JSON.stringify("رمز عبور باید حداقل 8 کاراکتر باشد."),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Generate email verification token
    const verificationCode = await sendVerificationEmail(body.email);
    console.log("------------", typeof verificationCode);
    // Create new user with verification token and is_verified false
    const newUser = await prisma.user.create({
      data: {
        username: body.username,
        email: body.email,
        phone: body.phone ?? null,
        password: hashedPassword,
        role: body.role || "student",
        is_verified: false,
        verification: Number(verificationCode), // Make sure this field exists in your Prisma schema
      },
    });

    // Send verification email

    // Create JWT token and cookie
    const token = createTokenForUser({
      userId: String(newUser.id),
      username: newUser.username,
      role: newUser.role,
    });
    const cookie = createUserCookie(token);

    // Return user info and set cookie
    return new Response(
      JSON.stringify({
        message: "ثبت‌نام با موفقیت انجام شد! لطفا ایمیل خود را تایید کنید.",
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
    return new Response(JSON.stringify({ message: "خطا در ثبت‌نام کاربر" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

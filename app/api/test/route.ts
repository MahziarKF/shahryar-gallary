import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, username } = body;

    if (!code || !username) {
      return new Response(
        JSON.stringify({ message: "کد و نام کاربری الزامی هستند." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.user.update({
      where: { username },
      data: { verification: code }, // assuming `verificationcode` is the correct field
    });

    return new Response(JSON.stringify({ message: "کد با موفقیت ثبت شد." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating verification code:", error);
    return new Response(JSON.stringify({ message: "خطا در ثبت کد" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

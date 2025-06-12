import { cookies } from "next/headers";
import { getUserFromToken } from "./auth";
import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
function isTokenExpired(token: string): boolean {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(Buffer.from(payloadBase64, "base64").toString());
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

export default async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token || isTokenExpired(token)) {
      throw new Error("TOKEN_EXPIRED");
    }

    const userFromToken = await getUserFromToken(token);
    if (!userFromToken) return;

    const user = await prisma.user.findUnique({
      where: { username: userFromToken.username },
    });

    return user;
  } catch (error) {
    if (error instanceof Error && error.message === "TOKEN_EXPIRED") {
      throw error;
    }
    console.error("Error while getting user data -> lib/user.ts", error);
  }
}

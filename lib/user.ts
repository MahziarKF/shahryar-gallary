import { cookies } from "next/headers";
import { getUserFromToken } from "./auth";
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
      // Instead of throwing, just return undefined
      console.warn("Token expired or not found");
      return undefined;
    }

    const userFromToken = await getUserFromToken(token);
    if (!userFromToken) return undefined;

    const user = await prisma.user.findUnique({
      where: { username: userFromToken.username },
    });

    return user;
  } catch (error) {
    console.error("Error while getting user data -> lib/user.ts", error);
    return undefined;
  }
}

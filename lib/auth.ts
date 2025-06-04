// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { serialize } from "cookie";
import { number } from "framer-motion";

const JWT_SECRET = process.env.JWT_SECRET!;

export type TokenPayload = {
  userId: string;
  username: string;
  role: string;
};

export function createTokenForUser(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function createUserCookie(token: string): string {
  return serialize("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  return token || null;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(token: string) {
  const decoded: any = verifyToken(token);
  if (!decoded) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(decoded.userId) },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      // Add more fields if needed
    },
  });

  return user;
}

export async function getUserFromRequest(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  return await getUserFromToken(token);
}

export async function getUser() {
  const cookieStore = await cookies(); // do not await cookies()
  const token = cookieStore.get("token")?.value;
  const user = token ? await getUserFromToken(token) : null;
  if (!user) {
    return null;
  }
  return user;
}
// No changes needed here if it's already this:

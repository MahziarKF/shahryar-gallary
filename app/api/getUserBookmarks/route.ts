import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return NextResponse.json({ message: "user not found." }, { status: 404 });
    }
    const userBookmarks = await prisma.bookmarkedProduct.findMany({
      where: { userId: Number(user.id) },
    });
    return NextResponse.json(
      {
        message: "Retrived user's bookmarks.",
        bookmarks: userBookmarks,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(`error while fetching user bookmarks : ${error}`);
    return NextResponse.json({ message: "server error." }, { status: 500 });
  }
}

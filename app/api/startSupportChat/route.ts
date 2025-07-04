import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId } = body;

    const conversation = await prisma.conversation.findMany({
      where: { id: conversationId, isActive: false },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found." },
        { status: 404 }
      );
    }

    const endedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json(
      { message: "Conversation ended successfully.", data: endedConversation },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 }
    );
  }
}

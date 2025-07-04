import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, deleteChat } = body;

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, isActive: true },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found." },
        { status: 404 }
      );
    }
    if (deleteChat) {
      const deletedConversation = await prisma.conversation.delete({
        where: { id: conversationId },
      });
      return NextResponse.json(
        { message: "Conversation ended and deleted.", deletedConversation },
        { status: 201 }
      );
    }
    const endedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        isActive: false,
      },
    });

    return NextResponse.json(
      { message: "Conversation ended successfully.", endedConversation },
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

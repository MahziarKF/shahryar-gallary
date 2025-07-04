import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId } = body;
    if (!conversationId)
      return NextResponse.json(
        { message: "please provide a conversation id" },
        { status: 400 }
      );
    const deletedConversation = await prisma.conversation.delete({
      where: { id: conversationId },
    });
    if (!deletedConversation)
      return NextResponse.json(
        { message: "conversation not found" },
        { status: 404 }
      );
    return NextResponse.json(
      {
        message: "deleted conversation successfuly.",
        conversation: deletedConversation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}

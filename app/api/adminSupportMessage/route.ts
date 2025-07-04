import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("🔹 Received POST request to append unique support messages");

    const body = await req.json();
    const { username, message, selectedConversationId } = body; // single message, not messages
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return NextResponse.json({
        message: "Please Log in to further support users.",
      });
    }
    const conversation = await prisma.conversation.findFirst({
      where: { id: selectedConversationId },
      include: {
        messages: true,
      },
    });

    if (!conversation) {
      //   conversation = await prisma.conversation.create({
      //     data: { userId: user.id, adminId: null },
      //   });
      return NextResponse.json(
        { message: "conversation not found." },
        { status: 404 }
      );
    }

    const conversationId = conversation.id;

    // Get all existing messages for that conversation
    const existingMessages = await prisma.supportMessage.findMany({
      where: { conversationId },
      select: {
        message: true,
        sentAt: true,
        senderType: true,
      },
    });

    // Convert to a Set of unique keys to identify duplicates
    const existingKeys = new Set(
      existingMessages.map(
        (m) =>
          `${m.senderType}||${m.message}||${new Date(m.sentAt).toISOString()}`
      )
    );

    // Wrap the single message into an array for uniform processing
    const newMessagesArray = [message];

    // Filter new (non-duplicate) messages
    const newMessages = newMessagesArray.filter((msg: any) => {
      const key = `${msg.senderType}||${msg.message}||${new Date(
        msg.sentAt
      ).toISOString()}`;
      return !existingKeys.has(key);
    });

    if (newMessages.length === 0) {
      return NextResponse.json(
        { created: 0, message: "No new messages to add." },
        { status: 200 }
      );
    }

    // Add only new messages
    const created = await prisma.supportMessage.createMany({
      data: newMessages.map((msg: any) => ({
        conversationId,
        senderType: msg.senderType,
        senderId: user.id, // Or conditionally based on senderType
        message: msg.message,
        sentAt: new Date(msg.sentAt),
      })),
    });

    return NextResponse.json(
      { created: created.count, message: "Message added successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error appending messages:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

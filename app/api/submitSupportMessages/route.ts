import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("🔹 Received POST request to append unique support messages");

    const body = await req.json();
    const { username, message, conversationIdFromBody } = body;

    console.log("🟡 Incoming message:", message);

    if (!username) {
      return NextResponse.json(
        { message: "You're not logged in. Please log in to contact support." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { message: "No message provided." },
        { status: 400 }
      );
    }

    if (!conversationIdFromBody) {
      return NextResponse.json(
        { message: "Missing conversation ID." },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }

    // Find conversation by ID only (no fallback to username)
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationIdFromBody },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found with provided ID." },
        { status: 404 }
      );
    }

    const conversationId = conversation.id;

    // Fetch existing messages for duplicate detection
    const existingMessages = await prisma.supportMessage.findMany({
      where: { conversationId },
      select: {
        message: true,
        senderType: true,
      },
    });

    const existingKeys = new Set(
      existingMessages.map((m) => `${m.senderType}||${m.message}`)
    );

    const newMessagesArray = [message]; // Wrap single message into array

    // Filter out duplicates
    const newMessages = newMessagesArray.filter((msg: any) => {
      const key = `${msg.senderType}||${msg.message}`;
      return !existingKeys.has(key);
    });

    if (newMessages.length === 0) {
      return NextResponse.json(
        {
          created: 0,
          message: "No new messages to add (all were duplicates).",
          conversationId,
        },
        { status: 200 }
      );
    }

    // Determine senderId: if support, use adminId else userId
    const senderId =
      newMessages[0].senderType === "support"
        ? conversation.adminId ?? 1 // fallback if no adminId
        : conversation.userId;

    // Save new messages
    const created = await prisma.supportMessage.createMany({
      data: newMessages.map((msg: any) => ({
        conversationId,
        senderType: msg.senderType,
        senderId,
        message: msg.message,
        sentAt: new Date(msg.sentAt),
      })),
    });

    return NextResponse.json(
      {
        created: created.count,
        message: "Message(s) added successfully.",
        conversationId,
      },
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

// /lib/conversations.ts (server side)
import prisma from "./prisma";

export default async function getAllConversations() {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        user: true, // if you want to include user info for username
        messages: { take: 1, orderBy: { sentAt: "desc" } }, // last message
      },
    });
    return conversations || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function createConversation(userId: number) {
  try {
    const conversation = await prisma.conversation.create({
      data: {
        userId,
        adminId: null,
      },
    });
    return conversation;
  } catch (error) {
    console.error("❌ Error creating conversation:", error);
    throw new Error("Failed to create conversation");
  }
}

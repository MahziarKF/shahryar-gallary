import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export type SupportMessage = Prisma.SupportMessageGetPayload<{}>;

export default async function getSupportMessages(
  userId: number | null
): Promise<SupportMessage[] | null> {
  try {
    if (!userId) return null;

    const conversation = await prisma.conversation.findFirst({
      where: {
        userId,
        isActive: true,
      },
      include: {
        messages: true,
      },
    });
    console.log(`------------------------xxx`, conversation?.messages);
    return conversation?.messages ?? null;
  } catch (error) {
    console.error("Error in getSupportMessages:", error);
    return null;
  }
}

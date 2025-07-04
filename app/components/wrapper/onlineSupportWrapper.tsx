import getUser from "@/lib/user";
import OnlineSupport from "../onlineSupport";
import getAllConversations, { createConversation } from "@/lib/conversations";
import getSupportMessages from "@/lib/supportMessages";

export default async function OnlineSupportWrapper() {
  const user = await getUser();

  // Return empty chat UI if no user or user is admin
  if (!user || user?.role === "admin") {
    return null;
  }

  const conversations = await getAllConversations();
  console.log(user?.id);

  // Get first active conversation
  let conversation: any = conversations.find(
    (c: any) => c.userId === user.id && c.isActive
  );

  // Create a new conversation if none found
  if (!conversation) {
    console.log(`conversation not found`);
    conversation = await createConversation(user.id);
  }
  console.log(conversation);
  console.log(conversations);
  const messages: any = await getSupportMessages(user.id);
  return (
    <OnlineSupport
      user={user}
      initialMessagesOrAlreadyThereMessages={messages}
      conversationIdProps={conversation?.id || null}
    />
  );
}

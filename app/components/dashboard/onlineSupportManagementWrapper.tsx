"use client";

import { useState } from "react";
import OnlineSupportManagementChat from "./onlineSupportManagement";
import SupportConversationList from "./onlineSupportChatsList";
import { User } from "@/app/types";

type Conversation = {
  id: string;
  username: string;
  userId: number;
  lastMessage?: string;
};

type Props = {
  user: User;
  conversations: Conversation[];
};

export default function OnlineSupportManagementWrapper({
  user,
  conversations,
}: Props) {
  const [mode, setMode] = useState<"list" | "chat">("list");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [selectedChatMessages, setSelectedChatMessages] = useState(null);
  const handleSelectConversation = async (
    conversationId: string,
    userId: number
  ) => {
    setSelectedConversationId(conversationId);
    setMode("chat");
    try {
      const request = await fetch(`/api/getSupportMessages?userId=${userId}`);
      const result = await request.json();
      console.log(result);
      setSelectedChatMessages(result.messages);
      // console.log(result.messages);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBackToList = () => {
    setMode("list");
    setSelectedConversationId(null);
  };

  return (
    <>
      {mode === "list" ? (
        <SupportConversationList
          conversations={conversations}
          selectedId={selectedConversationId ?? ""}
          onSelect={handleSelectConversation}
        />
      ) : mode === "chat" && selectedConversationId ? (
        <div className="space-y-4">
          <button
            onClick={handleBackToList}
            className="text-sm text-blue-600 underline mb-2"
          >
            ← Back to Conversations
          </button>
          <OnlineSupportManagementChat
            user={user}
            setModeAction={setMode}
            initialMessages={selectedChatMessages || []}
            selectedConversationId={selectedConversationId} // You can load messages by selectedConversationId here
          />
        </div>
      ) : null}
    </>
  );
}

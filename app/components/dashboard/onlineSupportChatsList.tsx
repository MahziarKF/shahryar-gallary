"use client";

import { useState } from "react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { User } from "@/app/types";

type Conversation = {
  id: string;
  username: string;
  userId: number;
  lastMessage?: string;
  user: User;
};

type Props = {
  conversations?: any; // optional with default empty array
  onSelect: (conversationId: string, userId: number) => void;
  selectedId?: string;
  onStartNewConversation?: () => void; // optional callback for new convo button
};

export default function SupportConversationList({
  conversations = [],
  onSelect,
  selectedId,
  onStartNewConversation,
}: Props) {
  const [search, setSearch] = useState("");
  const filtered = conversations.filter(
    (conv) =>
      typeof conv.user?.username === "string" &&
      conv.user.username.toLowerCase().includes(search.toLowerCase())
  );
  console.log(conversations);
  return (
    <div className="w-full max-w-sm bg-white shadow rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-gray-800">Active Chats</h2>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by username..."
        className="w-full mb-3 px-3 py-2 text-sm border rounded focus:outline-none"
      />

      {filtered.length === 0 ? (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">No active chats</p>
          {onStartNewConversation && (
            <button
              onClick={onStartNewConversation}
              className="mt-2 text-amber-600 hover:underline"
              type="button"
            >
              Start a new conversation
            </button>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((conv) => (
            <li
              key={conv.id}
              onClick={() => onSelect(conv.id, conv.user.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all border ${
                selectedId === conv.id
                  ? "bg-amber-100 border-amber-300"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="font-medium text-gray-800">
                {conv.user.username}
              </div>
              <div className="text-xs text-gray-500">
                {conv.lastMessage || "No messages yet"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

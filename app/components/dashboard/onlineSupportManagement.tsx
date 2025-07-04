"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

import {
  PaperAirplaneIcon,
  XMarkIcon,
  CheckCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";
import { User } from "@/app/types";

type Message = {
  senderType: "user" | "support";
  id: number;
  message: string;
  sentAt: Date;
  error?: string;
  senderId: number | null;
  conversationId?: string | number;
};

type SupportChatProps = {
  user: User | null;
  initialMessages: Message[];
  selectedConversationId: string;
  setModeAction: (mode: "chat" | "list") => void;
};

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export default function OnlineSupportManagementChat({
  user,
  initialMessages = [],
  selectedConversationId,
  setModeAction,
}: SupportChatProps) {
  const socketRef = useRef<typeof Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [active, setActive] = useState(true);

  // [NEW] Modal state
  const [showEndModal, setShowEndModal] = useState(false);
  const [alsoDelete, setAlsoDelete] = useState(false);
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    socketRef.current = io(socketUrl);

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket with ID:", socketRef.current?.id);
    });

    socketRef.current.emit("joinRoom", {
      conversationId: String(selectedConversationId),
    });

    socketRef.current.on(
      "newMessage",
      ({
        message,
        senderType,
        senderId,
        conversationId,
        sentAt,
      }: {
        message: string;
        senderType: "user" | "support";
        senderId: number;
        conversationId: string;
        sentAt: Date;
      }) => {
        console.log("received full message object:", message);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            message,
            senderId,
            senderType,
            conversationId,
            sentAt,
          },
        ]);
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [selectedConversationId]);
  useEffect(() => {
    console.log(messages);
  }, [messages]);
  const handleSendMessage = async (overrideMessage?: string) => {
    const messageToSend = overrideMessage ?? input.trim();
    if (!messageToSend) return;

    const newMessage: Message = {
      id: Date.now(),
      senderType: "support",
      message: messageToSend,
      sentAt: new Date(),
      senderId: user?.id ?? null,
      conversationId: selectedConversationId,
    };

    setMessages((prev) => [...prev, newMessage]);
    if (!overrideMessage) setInput("");

    try {
      // const res = await fetch("/api/adminSupportMessage", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     username: user?.username,
      //     message: newMessage,
      //     selectedConversationId,
      //   }),
      // });
      const res = await fetch("/api/submitSupportMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user?.username,
          message: newMessage,
          conversationIdFromBody: selectedConversationId,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message.");

      socketRef.current?.emit("newMessage", {
        message: newMessage.message,
        conversationId: selectedConversationId,
        senderType: newMessage.senderType,
        senderId: newMessage.senderId,
        sentAt: new Date(),
      });
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMessage.id ? { ...m, error: err.message } : m
        )
      );
    }
  };

  const handleEndChatConfirmed = async () => {
    try {
      const res = await fetch(`/api/endSupportChat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversationId,
          deleteChat: alsoDelete, // you can use this in your API to decide if you delete or not
        }),
      });

      if (!res.ok) {
        const result = await res.json();
        console.log(result.message);
        throw new Error("Failed to end chat.");
      }

      setActive(false);
      setShowEndModal(false);
      handleSendMessage("Chat ended by admin.");
      setModeAction("list");
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearMessages = async () => {
    try {
      const res = await fetch("/api/clearSupportMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selectedConversationId }),
      });
      if (!res.ok) throw new Error("Failed to clear messages.");
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl w-full max-w-2xl mx-auto p-4 relative">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <div className="flex items-center gap-2">
          <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-amber-500" />
          <h2 className="text-lg font-semibold">Support Chat (Admin View)</h2>
        </div>
        <XMarkIcon className="w-5 h-5 cursor-pointer text-gray-500 hover:text-red-500" />
      </div>

      <div className="h-64 overflow-y-auto space-y-2 bg-amber-50 p-4 rounded">
        {messages.map((msg, index) => (
          <MessageBubble
            key={msg.id || index}
            message={msg.message}
            type={msg.senderType}
            error={msg.error}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={input}
          disabled={!active}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 border px-4 py-2 rounded-full text-sm focus:outline-none"
          placeholder={active ? "Type a message..." : "Chat is inactive"}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!active}
          className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full"
        >
          <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
        </button>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {active ? (
          <button
            onClick={() => setShowEndModal(true)} // [NEW]
            className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-md text-sm"
          >
            <XMarkIcon className="h-4 w-4" />
            End Chat
          </button>
        ) : (
          <button
            onClick={() => setActive(true)}
            className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-600 px-3 py-1 rounded-md text-sm"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Start Chat
          </button>
        )}
        <button
          onClick={handleClearMessages}
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-md text-sm"
        >
          <TrashIcon className="h-4 w-4" />
          Clear Messages
        </button>
      </div>

      {/* [NEW] End Chat Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-2">End Chat</h3>
            <p className="text-sm text-gray-700 mb-4">
              Do you want to end this chat? You can also delete the entire chat
              history.
            </p>
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                checked={alsoDelete}
                onChange={() => setAlsoDelete(!alsoDelete)}
              />
              <span className="text-sm">Also delete chat</span>
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEndModal(false)}
                className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEndChatConfirmed}
                className="text-sm px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessageBubble({
  message,
  type,
  error,
}: {
  message: string;
  type: "user" | "support";
  error?: string;
}) {
  const isUser = type === "user";
  return (
    <div className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
          isUser
            ? "bg-white border text-gray-800 rounded-bl-none"
            : "bg-amber-500 text-white rounded-br-none"
        }`}
      >
        {message}
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1 px-1 max-w-[80%]">
          {error}
        </span>
      )}
    </div>
  );
}

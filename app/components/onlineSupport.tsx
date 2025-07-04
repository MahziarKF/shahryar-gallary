"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

import {
  PhoneIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { User } from "../types";

type Message = {
  conversationId?: string;
  senderType: "user" | "support";
  id: number;
  message: string;
  sentAt: Date;
  error?: string;
  senderId: number | null;
};

type PropTypes = {
  user: User | null;
  initialMessagesOrAlreadyThereMessages?: Message[] | null | [];
  conversationIdProps: string | null;
};

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export default function OnlineSupport({
  user,
  initialMessagesOrAlreadyThereMessages = [],
  conversationIdProps,
}: PropTypes) {
  // Fix socketRef typing here (use Socket instance type)
  const socketRef = useRef<typeof Socket | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(
    conversationIdProps
  );
  const [messages, setMessages] = useState<Message[]>(
    initialMessagesOrAlreadyThereMessages
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Show button after 200ms (optional)
    const timeout = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  // Initialize socket connection once on mount
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(socketUrl);

      socketRef.current.on("connect", () => {
        console.log("connected!");
      });

      socketRef.current.on(
        "newMessage",
        ({
          conversationId: msgConversationId,
          message,
          senderId,
          senderType,
          sentAt,
        }: {
          conversationId: string;
          message: string;
          senderId: number;
          senderType: "user" | "support";
          sentAt: Date;
        }) => {
          console.log("received data:", {
            conversationId: msgConversationId,
            message,
            senderId,
            senderType,
            sentAt,
          });
          const newMessage: Message = {
            id: Date.now(),
            senderType,
            message,
            sentAt,
            senderId,
            conversationId: msgConversationId,
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      );

      socketRef.current.on(
        "clearMessages",
        ({
          conversationId: clearedConversationId,
        }: {
          conversationId: string;
        }) => {
          console.log("clear");
          setMessages([
            {
              sentAt: new Date(),
              message: "Chat cleared by admin.",
              conversationId: clearedConversationId,
              senderId: null,
              senderType: "support",
              id: Date.now(),
            },
          ]);
        }
      );
    }
  }, []);

  // Join socket room when conversationId becomes available
  useEffect(() => {
    if (conversationId && socketRef.current) {
      socketRef.current.emit("joinRoom", { conversationId });
      console.log("Joined socket room:", conversationId);
      setConversationId(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      senderType: "user",
      message: input.trim(),
      sentAt: new Date(),
      senderId: user?.id || null,
      conversationId: conversationId || undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const payload = {
        message: newMessage,
        username: user?.username || null,
        conversationIdFromBody: conversationId,
      };

      const response = await fetch("/api/submitSupportMessages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMsg = "Failed to send message.";
        try {
          const errorJson = await response.json();
          errorMsg = errorJson.message || errorMsg;
        } catch {
          errorMsg = await response.text();
        }
        throw new Error(errorMsg);
      }

      const responseData = await response.json();

      // If no conversationId yet, set it from response
      if (responseData.conversationId && !conversationId) {
        setConversationId(responseData.conversationId);
      }

      // Emit socket event AFTER conversationId is set (or already available)
      if (responseData.conversationId || conversationId) {
        socketRef.current?.emit("newMessage", {
          message: newMessage.message,
          conversationId: responseData.conversationId || conversationId,
          senderType: newMessage.senderType,
          senderId: newMessage.senderId,
          sentAt: new Date(),
        });
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      setErrorMessage(
        error.message || "Could not send message. Please try again."
      );
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id
            ? { ...msg, error: error.message || "An error occurred." }
            : msg
        )
      );
    }
  };

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center relative"
          aria-label="Open Support Chat"
        >
          <PhoneIcon className="w-7 h-7" />
          <span className="absolute -top-2 -right-2 bg-red-500 w-4 h-4 rounded-full border-2 border-white" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end justify-end p-6">
          <div className="bg-white w-full max-w-sm h-[500px] rounded-xl shadow-xl flex flex-col overflow-hidden relative">
            <div className="bg-amber-600 text-white p-4 flex items-center gap-2">
              <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
              <h2 className="font-semibold text-lg flex-1">Online Support</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 bg-amber-50 p-4 overflow-y-auto space-y-2">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg.message}
                  type={msg.senderType}
                  error={msg.error}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {errorMessage && (
              <div className="text-red-500 text-xs px-4 pb-1">
                {errorMessage}
              </div>
            )}

            <div className="p-3 border-t flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full"
              >
                <PaperAirplaneIcon className="h-5 w-5 rotate-45" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
          isUser
            ? "bg-amber-500 text-white rounded-br-none"
            : "bg-white text-gray-800 border rounded-bl-none"
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

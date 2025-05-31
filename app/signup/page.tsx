"use client";

import { useState } from "react";

export default function Signup() {
  const [status, setStatus] = useState("Not connected");

  async function handleSignup() {
    const res = await fetch("/api/signup", { method: "POST" });
    const data = await res.json();
    setStatus(data.message);
    console.log(data.message);
  }

  return (
    <div className="w-screen h-screen bg-[#1A1A1A] flex items-center justify-center">
      <div className="w-2/3 h-2/3 bg-[#2A2A2A] flex flex-col items-center justify-center gap-4">
        <button
          onClick={handleSignup}
          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
        >
          Connect to MongoDB
        </button>
        <p>Status: {status}</p>
      </div>
    </div>
  );
}

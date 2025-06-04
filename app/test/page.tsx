"use client";

import { useEffect, useState } from "react";

export default function Test() {
  const changeCode = async () => {
    const code = 232323;
    const res = await fetch("/api/test", {
      method: "POST",
      body: JSON.stringify({ code, username: "test" }),
    });
    const result = await res.json();
    console.log(result);
  };
  return (
    <div className="p-4">
      <h2>status:</h2>
      <button onClick={changeCode}>qwwqd</button>
    </div>
  );
}

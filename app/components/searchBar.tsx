"use client";

import { Search, X } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const [value, setValue] = useState("");

  return (
    <div className="relative w-full h-2/3">
      <input
        type="text"
        dir="rtl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="جستجوی ساز، دوره‌ها و غیره"
        className="w-full h-full pl-10 pr-4 py-5 text-right border-2 border-[#E2E8F0] shadow-md focus:shadow-2xl focus:border-blue-400/50 rounded-lg focus:outline-none placeholder:text-right"
      />
      {/* Icon on the left: Search OR X */}
      {value ? (
        <button
          onClick={() => setValue("")}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      ) : (
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
      )}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type DropdownProps = {
  title: string;
  items: { id?: number | string; title: string }[];
  optionalAction?: any;
  onSelect?: any;
};

export default function Dropdown({
  title,
  items,
  optionalAction,
  onSelect,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleSelect = (item: string) => {
    // Match label to internal mode value
    const modeMap: Record<string, string> = {
      "دوره ها": "course",
      "دانش آموزان دوره": "students",
    };
    if (optionalAction) {
      optionalAction(modeMap[item]);
    }
    setSelected(item);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-48 rounded-lg text-[#EA580C] font-bold text-lg"
      >
        <span>{selected || title}</span>
        <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-48 rounded-md shadow-lg bg-white border border-gray-200">
          <ul className="py-1">
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  handleSelect(item.title);
                  onSelect(item.id, item.title);
                }}
                className="px-4 text-[#F59E0B] text-lg font-semibold py-2 hover:bg-blue-100 cursor-pointer"
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

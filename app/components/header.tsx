"use client";
import Link from "next/link";
import SearchBar from "./searchBar";
import Dropdown from "./dropDown";
import AuthModal from "./SignUpModal";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface props {
  user: {
    userId: string;
    username: string;
    role: string;
  } | null;
}

export default function Header({ user }: props) {
  const [showModal, setShowModal] = useState(false);
  const pathName = usePathname();
  const router = useRouter();
  return (
    <div className="z-[100] bg-gray-100/95 shadow-lg sticky top-0 w-full flex flex-wrap items-center justify-between px-4 py-2">
      {/* Left side: Dashboard/Login button */}
      <div className="flex items-center">
        {user ? (
          pathName !== "/dashboard" && (
            <Link href="/dashboard">
              <button className="hover:bg-[#C2410C] bg-[#EA580C] rounded-lg text-sm sm:text-lg font-semibold text-white px-3 py-2">
                داشبورد
              </button>
            </Link>
          )
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="hover:bg-[#C2410C] bg-[#EA580C] rounded-lg text-sm sm:text-lg font-semibold text-white px-3 py-2"
          >
            ثبت نام | ورود
          </button>
        )}
      </div>

      {/* Center: Search bar (always visible) */}
      <div className="flex-1 flex justify-center sm:justify-start px-2">
        <SearchBar />
      </div>

      {/* Right side: Dropdowns and Logo (hidden on small screens) */}
      <div className="hidden sm:flex items-center gap-6">
        <Dropdown
          title="آموزش"
          onSelect={(id: number, title: string) => {
            router.push(`/products/${title}`);
          }}
          items={[
            { id: 1, title: "گیتار" },
            { id: 2, title: "ویالون" },
            { id: 3, title: "پیانو" },
            { id: 4, title: "اون چیزه گرده" },
          ]}
        />
        <Dropdown
          title="سازها"
          onSelect={(id: number, title: string) => {
            router.push(`/products/${title}`);
          }}
          items={[
            { id: 5, title: "گیتار" },
            { id: 6, title: "ویالون" },
            { id: 7, title: "پیانو" },
            { id: 8, title: "اون چیزه گرده" },
          ]}
        />
        <Dropdown
          title="استاید"
          onSelect={(id: number, title: string) => {
            router.push(`/products/${title}`);
          }}
          items={[
            { id: 9, title: "ابراهیمی" },
            { id: 10, title: "اوارمن" },
            { id: 11, title: "محمد پور" },
          ]}
        />

        <div>{/*logo  shouldbehere*/}</div>
      </div>

      {/* Modal */}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

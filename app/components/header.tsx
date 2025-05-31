"use client";
import Link from "next/link";
import SearchBar from "./searchBar";
import Dropdown from "./dropDown";
import AuthModal from "./SignUpModal";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { getUser, TokenPayload } from "@/lib/auth";
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

  return (
    <div className="col-span-10 z-[100] gap-7 bg-gray-100/95 shadow-lg grid grid-cols-10 py-1 sticky top-0">
      <div className="col-span-1"></div>
      <div className="col-span-1 flex items-center justify-center">
        {user ? (
          pathName !== "/dashboard" && (
            <Link href="/dashboard">
              <button className="h-2/3 hover:bg-[#C2410C] bg-[#EA580C] hover:cursor-pointer  rounded-lg text-lg font-semibold text-white px-3 py-2">
                داشبورد
              </button>
            </Link>
          )
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="h-2/3 hover:bg-[#C2410C] bg-[#EA580C] hover:cursor-pointer  rounded-lg text-lg font-semibold text-white px-3 py-2"
          >
            ثبت نام | ورود
          </button>
        )}
      </div>
      <div className="col-span-3 flex items-center justify-center">
        <SearchBar></SearchBar>
      </div>
      <div className="col-span-1 flex items-center justify-center hover:cursor-pointer">
        <Dropdown
          title="آموزش"
          items={["گیتار", "ویالون", "پیانو", "اون چیزه گرده"]}
        ></Dropdown>
      </div>
      <div className="col-span-1 flex items-center justify-center hover:cursor-pointer">
        {" "}
        <Dropdown
          title="سازها"
          items={["گیتار", "ویالون", "پیانو", "اون چیزه گرده"]}
        ></Dropdown>
      </div>
      <div className="col-span-1 flex items-center justify-center hover:cursor-pointer">
        {" "}
        <Dropdown
          title="استاید"
          items={["ابراهیمی", "اوارمن", "محمد پور"]}
        ></Dropdown>
      </div>
      <div className="col-span-1">LOGO</div>
      <div className="col-span-1"></div>
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

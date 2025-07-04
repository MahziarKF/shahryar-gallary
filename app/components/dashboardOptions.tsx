"use client";

import { useState } from "react";
import Settings from "./settings";
import ManagementSection from "./managementSection";
import ProductsManagement from "./productsManagement";
import OnlineSupportManagement from "./dashboard/onlineSupportManagement";
import OnlineSupportManagementChat from "./dashboard/onlineSupportManagement";
import OnlineSupportManagementWrapper from "./dashboard/onlineSupportManagementWrapper";

interface Props {
  user: any;
  dashBoardOptions: {
    label: string;
    key: string;
    note?: string;
  }[];
  teachers: any[];
  courses: any[];
  products: any[];
  categorys: any[];
  conversations?: any;
}

export default function DashBoardOptions({
  user,
  teachers,
  dashBoardOptions,
  courses,
  categorys,
  products,
  conversations,
}: Props) {
  const [selectedKey, setSelectedKey] = useState("Courses");

  const Courses = () => (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-orange-600">
        دوره‌های آموزشی شما
      </h3>
      <p>لیست دوره‌های شما در این قسمت نمایش داده می‌شود.</p>
    </section>
  );

  const Profile = () => (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-orange-600">پروفایل کاربری</h3>
      <p>
        نام کاربری: <strong>{user.username}</strong>
      </p>
      <p>
        ایمیل: <strong>{user.email ?? "ثبت نشده"}</strong>
      </p>
    </section>
  );

  const Management = () => {
    if (user.role !== "admin") {
      return (
        <section className="text-red-600 font-semibold">
          شما دسترسی مدیر را ندارید.
        </section>
      );
    }
    return (
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-orange-600">مدیریت</h3>
        <ManagementSection courses={courses} teachers={teachers} />
      </section>
    );
  };

  function renderContent() {
    switch (selectedKey) {
      case "Settings":
        return <Settings username={user.username} />;
      case "Profile":
        return <Profile />;
      case "Courses":
        return <Courses />;
      case "Management":
        return <Management />;
      case "Products":
        return <ProductsManagement products={products} categorys={categorys} />;
      case "OnlineSupport":
        return (
          <OnlineSupportManagementWrapper
            user={user}
            conversations={conversations}
          />
        );
      default:
        return <div className="text-gray-500 italic">گزینه نامعتبر است.</div>;
    }
  }

  return (
    <div className="flex min-h-screen gap-2.5 mx-2.5 mt-2.5">
      {/* Sidebar */}
      <aside className="w-[250px] bg-white rounded-xl shadow p-6 flex flex-col gap-4 sticky top-0 self-start">
        <nav className="flex flex-col gap-3">
          {dashBoardOptions.map(({ key, label, note }) => (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`py-3 px-5 rounded-lg font-semibold hover:cursor-pointer text-center transition ${
                selectedKey === key
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white rounded-xl shadow p-8 overflow-x-auto">
        <div className="text-gray-700">{renderContent()}</div>
      </main>
    </div>
  );
}

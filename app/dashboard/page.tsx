// app/dashboard/page.tsx
import { getUser } from "@/lib/auth";
import DashBoardOptions from "../components/dashboardOptions";
import HeaderWrapper from "../components/headerWraper";
import { redirect } from "next/navigation";

export default async function DashBoard() {
  const user = await getUser();

  // Redirect unauthenticated users
  if (!user) {
    redirect("/"); // Redirect on server
  }

  // Create absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/getUserData?username=${user.username}`,
    {
      cache: "no-store", // Optional: ensures fresh data
    }
  );

  if (!res.ok) {
    // Optional error handling
    redirect("/error");
  }

  const { userData } = await res.json();
  // Dashboard options
  const dashboardOptions = [
    { label: "درس‌ها", key: "Courses" },
    { label: "آکوردها", key: "Chords", note: "(not implemented)" },
    { label: "پروفایل", key: "Profile" },
    { label: "تنظیمات", key: "Settings" },
  ];

  if (user?.role === "admin") {
    dashboardOptions.push({
      label: "مدیریت دانش‌آموزان",
      key: "Management",
    });
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100/95">
      <HeaderWrapper />
      <DashBoardOptions user={userData} dashBoardOptions={dashboardOptions} />
    </div>
  );
}

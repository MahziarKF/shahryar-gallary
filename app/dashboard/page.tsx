// app/dashboard/page.tsx (or wherever DashBoard is used)
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import DashBoardOptions from "../components/dashboardOptions";
import HeaderWrapper from "../components/headerWraper";
import getTeachers from "@/lib/getTeachers";
import getCourses from "@/lib/courses";
import getUser from "@/lib/user";
import getProducts from "@/lib/products";
import getCategorys from "@/lib/category";

export default async function DashBoard() {
  const cookieStore = await cookies();

  let user = null;
  try {
    user = await getUser();
  } catch (error) {
    if (error instanceof Error && error.message === "TOKEN_EXPIRED") {
      // Clear token cookie
      cookieStore.set("token", "", { maxAge: -1, path: "/" });

      // Redirect to home page
      redirect("/");
    }
  }

  if (!user) {
    redirect("/"); // fallback if user not found
  }

  const teachers = await getTeachers();
  const courses = await getCourses();
  const products = await getProducts();
  const categorys = await getCategorys();
  const dashboardOptions = [
    { label: "درس‌ها", key: "Courses" },
    { label: "آکوردها", key: "Chords", note: "(not implemented)" },
    { label: "پروفایل", key: "Profile" },
    { label: "تنظیمات", key: "Settings" },
  ];

  if (user?.role === "admin") {
    dashboardOptions.push(
      { label: "مدیریت دانش‌آموزان", key: "Management" },
      { label: "مدیریت کالاها", key: "Products" }
    );
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100/95">
      <HeaderWrapper />
      <DashBoardOptions
        user={user}
        teachers={teachers}
        courses={courses}
        dashBoardOptions={dashboardOptions}
        products={products ?? []} // ✅ fallback to empty array
        categorys={categorys ?? []}
      />
    </div>
  );
}

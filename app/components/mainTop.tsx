import { Course } from "../types";
import CourseList from "./recommendedCourses";

export default function MainTop({ courses }: { courses: Course[] }) {
  return (
    <div
      className="w-full min-h-screen bg-gradient-to-r from-orange-700 via-amber-600 to-yellow-500 animate-gradient-x text-white px-5 py-12
      grid grid-cols-1 md:grid-cols-3 grid-rows-auto md:grid-rows-2 gap-6"
    >
      <div className="md:col-span-1 md:row-span-2 h-64 md:h-auto bg-[url('./../public/test.png')] bg-contain bg-no-repeat bg-center"></div>

      <div className="flex flex-col items-end md:col-span-2 text-right">
        <h1 className="text-4xl py-7.5 md:text-5xl font-extrabold text-amber-300 drop-shadow-lg">
          صدای دل، ساز در دست
        </h1>
        <h2 className="text-xl py-3.5 md:text-2xl font-semibold text-amber-100">
          موسیقی چیزی بیش از نُت‌هاست؛ موسیقی تجربه است
        </h2>
        <p className="text-base md:text-lg max-w-2xl text-amber-50 leading-relaxed">
          نواختن یک ساز یعنی حرف زدن با جهان بدون گفتن کلمه‌ای. اینجا جاییه که
          شور و اشتیاق به موسیقی زنده میشه — جایی برای کشف صداهای جدید، احساسات
          قدیمی و لحظات ناب. اگر به ساز زدن فکر کردی، تو همین حالا یک قدم به
          رویای موسیقی‌ات نزدیک‌تری.
        </p>
      </div>

      <div className="md:col-span-3 overflow-auto scrollbar-hide max-h-96 md:max-h-full">
        <CourseList courses={courses} />
      </div>
    </div>
  );
}

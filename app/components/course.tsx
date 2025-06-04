"use client";

import { useState } from "react";

interface Course {
  id: number;
  title: string;
  description?: string;
  price?: string;
  duration?: string;
  is_active?: boolean;
}

interface CourseCardProps {
  course: Course;
  isSelected?: boolean;
  blank?: boolean;
  deleteCourse: (id: number) => void;
}

export default function CourseCard({
  course,
  deleteCourse,
  isSelected,
  blank = false,
}: CourseCardProps) {
  const [loading, setLoading] = useState(false);

  const toggleLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <>
      <div
        className={`ring-1 ${
          isSelected ? "bg-emerald-100 ring-3 ring-blue-400 shadow-md" : ""
        } ring-orange-700 rounded-md p-4 grid grid-cols-10 grid-rows-3 gap-2 items-center ${
          loading ? "pointer-events-none" : ""
        }`}
      >
        {/* Icon */}
        <div className="col-span-3 row-span-3 flex justify-center items-center">
          {loading ? (
            <div className="skeleton w-20 h-20 rounded"></div>
          ) : (
            <img
              src="https://img.icons8.com/ios-filled/100/guitar.png"
              alt="Course icon"
              className="w-20 h-20 object-contain"
            />
          )}
        </div>

        {/* Title */}
        <div className="col-span-7 row-span-1 flex items-center">
          {loading ? (
            <div className="skeleton w-3/4 h-6 rounded"></div>
          ) : (
            <h3 className="text-lg font-bold">{course.title}</h3>
          )}
        </div>

        {/* Description */}
        <div className="col-span-7 row-span-1 text-gray-700 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
          {loading ? (
            <div className="skeleton w-full h-4 rounded"></div>
          ) : (
            course.description || "بدون توضیح"
          )}
        </div>

        {/* Details */}
        <div className="col-span-7 row-span-1 flex flex-wrap gap-4 text-sm text-gray-600">
          {loading ? (
            <>
              <div className="skeleton w-20 h-4 rounded"></div>
              <div className="skeleton w-20 h-4 rounded"></div>
              <div className="skeleton w-24 h-4 rounded"></div>
            </>
          ) : (
            <>
              <p>
                <span className="text-sm">💰</span> قیمت:{" "}
                {course.price ?? "نامشخص"}
              </p>
              <p>
                <span className="text-sm">⏳</span> مدت:{" "}
                {course.duration ?? "نامشخص"} روز
              </p>
              <p>
                وضعیت:{" "}
                <span
                  className={
                    course.is_active ? "text-green-600" : "text-red-600"
                  }
                >
                  {course.is_active ? "فعال" : "غیرفعال"}
                </span>
              </p>
            </>
          )}
        </div>

        {/* Buttons */}
        {!blank && (
          <div className="col-span-3 row-span-3 flex flex-col justify-between items-center gap-2">
            {loading ? (
              <>
                <div className="skeleton w-full h-8 rounded"></div>
                <div className="skeleton w-full h-8 rounded"></div>
              </>
            ) : (
              <>
                <button className="w-full bg-blue-600 text-white rounded py-1 hover:bg-blue-700 transition">
                  ویرایش
                </button>
                <button
                  onClick={() => {
                    toggleLoading();
                    deleteCourse(course.id);
                  }}
                  className="w-full bg-red-600 text-white rounded py-1 hover:bg-red-700 transition"
                >
                  حذف
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Skeleton shimmer style */}
      <style jsx>{`
        .skeleton {
          position: relative;
          overflow: hidden;
          background-color: #e2e8f0;
        }
        .skeleton::before {
          content: "";
          position: absolute;
          top: 0;
          left: -150%;
          height: 100%;
          width: 150%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}

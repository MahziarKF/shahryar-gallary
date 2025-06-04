"use client";
import { faUser, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

interface Student {
  id: number;
  username: string;
  email?: string | null;
  phone?: string | null;
  role?: string;
  onRemove: (id: number) => void;
  loading?: boolean; // Optional prop to show skeleton
}

export default function SmallStudentCard({
  id,
  username,
  email,
  phone,
  role,
  onRemove,
  loading = false,
}: Student) {
  return (
    <>
      <div
        className={`ring-1 my-2 ring-orange-700 rounded-md px-4 py-2 bg-white shadow-sm flex flex-col gap-1 text-sm ${
          loading ? "pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-xl text-gray-800 truncate flex items-center gap-2">
            {loading ? (
              <div className="skeleton w-32 h-6 rounded"></div>
            ) : (
              <>
                <FontAwesomeIcon icon={faUser} className="text-lg" />
                {username}
              </>
            )}
          </h3>
          {loading ? (
            <div className="skeleton w-16 h-5 rounded"></div>
          ) : (
            role && (
              <span
                className={`text-sm px-2 py-0.5 rounded bg-blue-100 ${
                  role === "student"
                    ? "text-blue-700"
                    : role === "admin"
                    ? "font-semibold text-red-700"
                    : "text-green-700"
                }`}
              >
                {role}
              </span>
            )
          )}
        </div>

        {/* Email */}
        {loading ? (
          <div className="skeleton w-48 h-4 rounded"></div>
        ) : email ? (
          <p className="text-gray-600 truncate">
            <span className="font-medium">📧 </span>
            {email}
          </p>
        ) : null}

        {/* Phone */}
        {loading ? (
          <div className="skeleton w-40 h-4 rounded"></div>
        ) : phone ? (
          <p className="text-gray-600 truncate">
            <span className="font-medium">📱 </span>
            {phone}
          </p>
        ) : (
          <p className="text-gray-500 italic truncate">
            <span className="font-medium">📱 </span>
            بدون شماره همراه
          </p>
        )}

        {/* Remove button */}
        {loading ? (
          <div className="skeleton w-20 h-6 self-end rounded"></div>
        ) : (
          <button
            onClick={() => onRemove?.(id)}
            className="mt-2 self-end text-xl text-red-600 hover:text-red-800 flex hover:cursor-pointer items-center gap-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            حذف
          </button>
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

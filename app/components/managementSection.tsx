"use client";

import Courses from "./courseManage";
import { useState } from "react";
import Students from "./studentsManage";
import Attendance from "./attendanceManage";

export default function ManagementSection() {
  const [selectedKey, setSelectedKey] = useState("Courses");

  const managementOptions = [
    { label: "دوره و کلاس ها", key: "Courses" },
    { label: "دانش آموزان", key: "Students" },
    { label: "حضور غیاب روزانه", key: "attendance" },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case "Courses":
        return <Courses />;
      case "Students":
        return <Students />;
      case "attendance":
        return <Attendance />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="w-full flex sm:gap-5 justify-around mb-5">
        {managementOptions.map((option) => (
          <div
            key={option.key}
            className={`py-3 px-15 rounded-lg text-lg font-bold text-center transition cursor-pointer ${
              selectedKey === option.key
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }`}
            onClick={() => setSelectedKey(option.key)}
          >
            {option.label}
          </div>
        ))}
      </div>

      <div className="p-5 border rounded-md">{renderContent()}</div>
    </div>
  );
}

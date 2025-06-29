"use client";

import Courses from "./courseManage";
import { useState } from "react";
import Students from "./studentsManage";
import Attendance from "./attendanceManage";
import Dropdown from "./dropDown";
import CreateTeacher from "./createTeacher";

export default function ManagementSection({
  teachers,
  courses,
}: {
  teachers: any[];
  courses: any[];
}) {
  const [selectedKey, setSelectedKey] = useState("Teachers");
  const [managedCourses, setManagedCourses] = useState(courses);
  const [managedTeachers, setManagedTeachers] = useState(teachers);
  const managementOptions = [
    { label: "دوره و کلاس ها", key: "Courses" },
    { label: "اساتید", key: "Teachers" },
    { label: "دانش آموزان", key: "Students" },
    { label: "حضور غیاب روزانه", key: "Attendance" },
  ];
  const renderContent = () => {
    switch (selectedKey) {
      case "Courses":
        return (
          <Courses
            onCoursesChange={handleCoursesChange}
            existingCourses={managedCourses}
            existingTeachers={managedTeachers}
          />
        );
      case "Students":
        return <Students />;
      case "Attendance":
        return <Attendance courses={managedCourses} />;
      case "Teachers":
        return (
          <CreateTeacher
            onTeacherChange={handleTeacherChanage}
            existingTeachers={managedTeachers}
          />
        );
      default:
        return null;
    }
  };
  const handleCoursesChange = (newCourses: any[]) => {
    setManagedCourses(newCourses);
  };
  const handleTeacherChanage = (newTeachers: any[]) => {
    setManagedTeachers(newTeachers);
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

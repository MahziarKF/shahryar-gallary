"use client";

import { useState } from "react";


export default function Students() {
  const addStudent = (data: { name: string; email?: string }) => {
    // TODO: Add student logic here
  };

  const deleteStudent = (studentId: string) => {
    // TODO: Delete student logic here
  };

  // Simple form state
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = () => {
    addStudent(formData);
    setFormData({ name: "", email: "" });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">مدیریت دانش‌آموزان</h2>

      <div className="mb-6">
        <h3 className="font-bold mb-2">افزودن دانش‌آموز جدید</h3>
        <input
          name="name"
          placeholder="نام دانش‌آموز"
          value={formData.name}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <input
          name="email"
          type="email"
          placeholder="ایمیل (اختیاری)"
          value={formData.email}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <button
          onClick={handleAddStudent}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          افزودن دانش‌آموز
        </button>
      </div>

      <div>
        <h3 className="font-bold mb-2">لیست دانش‌آموزان</h3>
        {/* Example hardcoded students */}
        <ul>
          <li className="flex justify-between items-center border-b py-2">
            <span>علی رضایی</span>
            <button
              onClick={() => deleteStudent("student-id-1")}
              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
            >
              حذف
            </button>
          </li>
          {/* Map your students list here */}
        </ul>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useEffect } from "react";
import CourseCard from "./course";
export default function Courses() {
  const [courses, setCourses] = useState<
    | {
        id: number;
        title: string;
        description?: string;
        price?: string; // change to string
        duration?: string; // change to string
        is_active?: boolean;
      }[]
    | null
  >(null);
  useEffect(() => {
    const callFetchCourses = async () => {
      const { courses } = await fetchCourses();
      console.log(courses);
      setCourses(courses);
    };
    callFetchCourses();
  }, []);
  const fetchCourses = async () => {
    const res = await fetch("/api/getAllCourses");
    const data = await res.json();
    return data;
  };
  const addCourse = async (data: {
    title: string;
    description?: string;
    price?: string; // change to string
    duration?: string; // change to string
    is_active?: boolean;
  }) => {
    try {
      const res = await fetch("/api/addCourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: String(data.title),
          description: data.description || null,
          price: data.price ?? "0", // send string
          duration: data.duration ?? "0", // send string
          is_active: data.is_active ?? true,
        }),
      });
      const resJson = await res.json();
      console.log(res.status, resJson);

      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCourse = async (courseId: number) => {
    const res = await fetch(`/api/deleteCourse/${courseId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    console.log("deleting course", courseId, "result : ", result);
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "", // string now
    duration: "", // string now
    is_active: true,
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : String(value),
    }));
  };

  const handleAddCourse = async () => {
    await addCourse({
      ...formData,
      duration: formData.duration,
    });

    setFormData({
      title: "",
      description: "",
      price: "",
      duration: "",
      is_active: true,
    });
  };
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">مدیریت دوره‌ها و کلاس‌ها</h2>

      <div className="mb-6">
        <h3 className="font-bold mb-2">افزودن دوره جدید</h3>
        <input
          name="title"
          placeholder="عنوان دوره"
          value={formData.title}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <textarea
          name="description"
          placeholder="توضیحات (اختیاری)"
          value={formData.description}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <input
          name="price"
          type="number"
          placeholder="قیمت (اختیاری)"
          value={formData.price}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <input
          name="duration"
          type="number"
          min={0}
          placeholder="مدت زمان (روز)"
          value={formData.duration}
          onChange={handleInputChange}
          className="block mb-2 p-2 border rounded w-full"
        />
        <label className="inline-flex items-center mb-4 mr-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="mr-2"
          />
          فعال باشد
        </label>
        <button
          onClick={handleAddCourse}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          افزودن دوره
        </button>
      </div>

      <div>
        <h3 className="font-bold mb-2">لیست دوره‌ها</h3>
        <ul className="grid grid-cols-2 gap-4 w-full">
          {courses?.map((course) => (
            <li key={course.title} className="col-span-1">
              <CourseCard course={course} deleteCourse={deleteCourse} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

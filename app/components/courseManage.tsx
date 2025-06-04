"use client";
import { useState, useEffect } from "react";
import CourseCard from "./course";
import Dropdown from "./dropDown";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SmallStudentCard from "./smallStudentCard";
type CourseType = {
  id: number;
  title: string;
  description?: string;
  price?: string;
  duration?: string;
  is_active?: boolean;
};
export default function Courses() {
  const [currentMode, setCurrentMode] = useState<string>("students");
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(null);
  const [courses, setCourses] = useState<
    | {
        id: number;
        title: string;
        description?: string;
        price?: string;
        duration?: string;
        is_active?: boolean;
      }[]
    | null
  >(null);
  const [users, setUsers] = useState<
    {
      id: number;
      username: string;
      email?: string | null;
      phone?: string | null;
      role: string;
    }[]
  >([]);
  const [courseUsers, setCourseUsers] = useState<
    {
      id: number;
      username: string;
      email?: string | null;
      phone?: string | null;
      role: string;
    }[]
  >([]);
  const [enrollMessage, setEnrollMessage] = useState<{
    message: string;
    isOk: boolean;
  } | null>(null);

  const [studentName, setStudentName] = useState<string>("");
  const [loadingStudent, setLoadingStudent] = useState<boolean>(false);
  useEffect(() => {
    const callFetchCourses = async () => {
      const { courses } = await fetchCourses();
      console.log(courses);
      setCourses(courses);
    };
    const callFetchUsers = async () => {
      const users = await fetchUsers();
      setUsers(users.students);
      console.log(users);
    };
    callFetchCourses();
    callFetchUsers();
  }, []);
  useEffect(() => {
    const fetchCourseUsersCaller = async () => {
      if (currentCourse) {
        fetchCourseUsers(currentCourse.id);
      }
    };
    fetchCourseUsersCaller();
  }, [currentCourse]);
  useEffect(() => {
    setEnrollMessage({ isOk: true, message: "" });
    setStudentName("");
  }, [currentCourse, currentMode]);
  const updateCourses = async () => {
    const { courses } = await fetchCourses();
    setCourses(courses);
  };
  const fetchUsers = async () => {
    const res = await fetch("/api/getAllStudents");
    const data = await res.json();
    return data;
  };
  const fetchCourses = async () => {
    const res = await fetch("/api/getAllCourses");
    const data = await res.json();
    return data;
  };
  const fetchCourseUsers = async (courseId: number) => {
    try {
      console.log("fetching course users....");
      const res = await fetch(`/api/getAllEnrolledStudents/${courseId}`);
      const data = await res.json();
      console.log(data);
      setCourseUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  };
  const enrollStudent = async (studentName: string) => {
    setStudentName("");
    if (!studentName) {
      setEnrollMessage({ message: "لطفا یک  نام وارد کنید", isOk: false });
      return;
    }
    if (!currentCourse) return;

    try {
      console.log("enrolling student in", currentCourse, "...");

      const res = await fetch("/api/enrollUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: studentName,
          courseId: currentCourse.id,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        console.log("Error enrolling student:", result.error);
        setEnrollMessage({ message: result.error, isOk: false });
      } else {
        console.log("Enrolled successfully:", result);
        setEnrollMessage({
          message: "دانش آموز با موفقیت اضافه شد",
          isOk: true,
        });
        fetchCourseUsers(currentCourse.id);
      }
    } catch (error) {
      console.error("Network or server error:", error);
    }
  };
  const removeEnrollment = async (userId: number) => {
    try {
      setLoadingStudent(true);
      console.log("removing enrollment for", userId, "...");
      console.log({ userId, currentCourse });
      const res = await fetch("/api/removeEnrollment", {
        method: "POST",
        body: JSON.stringify({ userId, courseId: currentCourse?.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newUsersForCurrentCourseUsers = courseUsers.filter(
        (u) => u.id !== userId
      );
      setCourseUsers(newUsersForCurrentCourseUsers);
    } catch (error) {
      console.log("error while removing enrollment  for", userId);
    }
    setLoadingStudent(false);
  };
  const addCourse = async (data: {
    title: string;
    description?: string;
    price?: string;
    duration?: string;
    is_active?: boolean;
  }) => {
    try {
      const res = await fetch("/api/addCourse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: String(data.title),
          description: data.description || null,
          price: data.price ?? "0",
          duration: data.duration ?? "0",
          is_active: data.is_active ?? true,
        }),
      });
      const resJson = await res.json();
      console.log(res.status, resJson);
      updateCourses();
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
    updateCourses();
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
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
    await addCourse({ ...formData });
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
      <div className="text-right">
        <Dropdown
          title="نوع دستور"
          items={["دانش آموزان دوره", "دوره ها"]}
          optionalAction={setCurrentMode}
        />
      </div>

      {currentMode === "course" ? (
        <>
          <h2 className="text-xl font-semibold mb-4">
            مدیریت دوره‌ها و کلاس‌ها
          </h2>

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
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">لیست دوره‌ها</h3>
              <button
                onClick={updateCourses}
                className="text-blue-600 hover:text-blue-800 transition"
                title="بروزرسانی لیست دوره‌ها"
              >
                <FontAwesomeIcon icon={faRotateRight} className="text-lg" />
              </button>
            </div>

            <ul className="grid grid-cols-2 gap-4 w-full list-none">
              {courses?.map((course) => (
                <li key={course.id} className="col-span-1">
                  <CourseCard course={course} deleteCourse={deleteCourse} />
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold">
              دانش آموزان دوره : {currentCourse?.title}
            </h2>
            {currentCourse && (
              <button
                onClick={() => setCurrentCourse(null)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                انصراف
              </button>
            )}
          </div>
          {currentCourse
            ? courseUsers.map((u) => (
                <SmallStudentCard
                  id={u.id}
                  role={u.role}
                  email={u.email}
                  phone={u.phone}
                  username={u.username}
                  onRemove={removeEnrollment}
                  loading={loadingStudent}
                />
              ))
            : null}
          <ul className="grid grid-cols-2 gap-4 w-full list-none">
            {" "}
            {!currentCourse
              ? courses?.map((course) => (
                  <li
                    onClick={() => {
                      setCurrentCourse(course);
                    }}
                    key={course.id}
                    className={`col-span-1 hover:cursor-pointer `}
                  >
                    <CourseCard
                      blank={true}
                      isSelected={currentCourse === course.title}
                      course={course}
                      deleteCourse={deleteCourse}
                    />
                  </li>
                ))
              : null}
          </ul>
        </>
      )}
      {currentCourse ? (
        <>
          {" "}
          <div className="flex items-center gap-3 mt-5">
            <input
              name="duration"
              type="text"
              placeholder="نام دانش آموز"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="p-2 border rounded flex-grow"
            />
            <button
              onClick={() => {
                enrollStudent(studentName);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              اضافه کردن دانش آموز به دوره
            </button>
          </div>
          {enrollMessage && (
            <p
              className={`text-md text-left ${
                enrollMessage.isOk ? "text-green-600" : "text-red-600"
              }`}
            >
              {enrollMessage.message}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}

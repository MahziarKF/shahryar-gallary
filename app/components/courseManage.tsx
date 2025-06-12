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

export default function Courses({
  existingTeachers,
  existingCourses,
  onCoursesChange,
}: {
  onCoursesChange: (newCourses: CourseType[]) => void;
  existingTeachers: any;
  existingCourses: CourseType[];
}) {
  const [currentMode, setCurrentMode] = useState<string>("course");
  const [currentCourse, setCurrentCourse] = useState<CourseType | null>(null);
  const [courses, setCourses] = useState<CourseType[]>(existingCourses);

  const [users, setUsers] = useState<
    {
      id: number;
      username: string;
      email?: string | null;
      phone?: string | null;
      role: string;
    }[]
  >([]);

  const [courseUsers, setCourseUsers] = useState<typeof users>([]);
  const [enrollMessage, setEnrollMessage] = useState<{
    message: string;
    isOk: boolean;
  } | null>(null);

  const [studentName, setStudentName] = useState<string>("");
  const [loadingStudent, setLoadingStudent] = useState<boolean>(false);
  const [teachers, setTeachers] = useState(existingTeachers);
  // Only fetch users once on mount

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/getAllStudents");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.students);
      } else {
        console.error("Failed to fetch students");
      }
    };
    fetchUsers();
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
    setCourses(existingCourses);
  }, [existingCourses]);

  useEffect(() => {
    setEnrollMessage({ isOk: true, message: "" });
    setStudentName("");
  }, [currentCourse, currentMode]);

  const fetchCourseUsers = async (courseId: number) => {
    try {
      const res = await fetch(`/api/getAllEnrolledStudents/${courseId}`);
      const data = await res.json();
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
      const res = await fetch("/api/enrollUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: studentName,
          courseId: currentCourse.id,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        setEnrollMessage({ message: result.error, isOk: false });
      } else {
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
      const res = await fetch("/api/removeEnrollment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId: currentCourse?.id }),
      });
      if (res.ok) {
        setCourseUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (error) {
      console.log("error while removing enrollment for", userId);
    }
    setLoadingStudent(false);
  };

  const addCourse = async (data: {
    title: string;
    description?: string;
    price?: string;
    duration?: string;
    is_active?: boolean;
    teacherId: string;
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
      // Instead of fetching courses again, you may want to handle it outside or via props update
      // updateCourses(); // Removed this
      if (res.ok) {
        console.log("added:", resJson);
        setCourses([...courses, resJson]);
        onCoursesChange([...courses, resJson]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCourse = async (courseId: number) => {
    try {
      const res = await fetch(`/api/deleteCourse/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (res.ok) {
        const updatedCourses = courses.filter(
          (course) => course.id !== courseId
        );
        setCourses(updatedCourses);
        onCoursesChange(updatedCourses); // <-- Notify parent
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    is_active: true,
    teacherId: "",
  });

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      teacherId: "",
    });
  };

  return (
    <div>
      <div className="text-right">
        <Dropdown
          title="نوع دستور"
          items={[{ title: "دانش آموزان دوره" }, { title: "دوره ها" }]}
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
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleInputChange}
              className="block mb-2 p-2 border rounded w-full"
            >
              <option value="">انتخاب معلم</option>
              {teachers.map((teacher: { id: number; name: string }) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>

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
              {/* Removed updateCourses button */}
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
                  key={u.id}
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

          <div className="flex flex-col gap-3 mt-4">
            <input
              type="text"
              placeholder="نام دانش آموز"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="p-2 border rounded"
            />
            <button
              onClick={() => enrollStudent(studentName)}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              ثبت نام دانش آموز
            </button>
            {enrollMessage && (
              <div
                className={`text-sm p-2 mt-2 rounded ${
                  enrollMessage.isOk
                    ? "text-green-600 bg-green-100"
                    : "text-red-600 bg-red-100"
                }`}
              >
                {enrollMessage.message}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

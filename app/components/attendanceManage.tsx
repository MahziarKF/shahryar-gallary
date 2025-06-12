import { useEffect, useState } from "react";
import { Course, User } from "../types";
import Dropdown from "./dropDown";

type Props = {
  courses: Course[];
};

type AttendanceRecord = {
  [day: number]: boolean | null;
};

export default function Attendance({ courses }: Props) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [attendance, setAttendance] = useState<AttendanceRecord>({});

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const duration = Number(selectedCourse?.duration || 0);
  // Fetch students when course changes

  useEffect(() => {
    if (selectedCourseId === null) return;

    const fetchStudents = async () => {
      try {
        console.log("Fetching students for course ID:", selectedCourseId);
        const res = await fetch(
          `/api/getAllEnrolledStudents/${selectedCourseId}`
        );
        const data = await res.json();
        console.log("Fetched students:", data.users); // Corrected
        setStudents(data.users); // Corrected
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };

    fetchStudents();
  }, [selectedCourseId]);

  // Reset attendance when student changes
  useEffect(() => {
    const setAttendanceData = async () => {
      if (!selectedStudentId || !selectedCourseId) return;

      try {
        const res = await fetch(
          `/api/attendance?studentId=${selectedStudentId}&courseId=${selectedCourseId}`
        );
        const data = await res.json();

        if (data.attendance?.checklist) {
          const checklist: number[] = data.attendance.checklist;

          const attendanceObj: AttendanceRecord = {};

          // Convert [1,0,-1] -> { day: boolean | null }
          checklist.forEach((val, idx) => {
            if (val === 1) attendanceObj[idx + 1] = true;
            else if (val === 0) attendanceObj[idx + 1] = false;
            else attendanceObj[idx + 1] = null;
          });

          setAttendance(attendanceObj);
        } else {
          // fallback if no attendance data yet
          const initial: AttendanceRecord = {};
          for (let i = 1; i <= duration; i++) {
            initial[i] = null;
          }
          setAttendance(initial);
        }
      } catch (error) {
        console.log("error while fetching attendance", error);
      }
    };

    setAttendanceData();
  }, [selectedStudentId, selectedCourseId, duration]);

  const toggleAttendance = (day: number) => {
    console.log("Toggling attendance for day:", day);
    setAttendance((prev) => ({
      ...prev,
      [day]: prev[day] === true ? false : prev[day] === false ? null : true,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedStudentId || !selectedCourseId) {
      console.warn("Student or course not selected. Cannot submit.");
      return;
    }

    console.log("Submitting attendance:", attendance);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudentId,
          courseId: selectedCourseId,
          attendance,
        }),
      });
      console.log({
        studentId: selectedStudentId,
        courseId: selectedCourseId,
        attendance,
      });
      if (!res.ok) {
        console.error(`❌ Failed to mark attendance for Day-`);
      } else {
        console.log(`✅ Marked attendance for Day-`);
      }
    } catch (err) {
      console.error("Error submitting attendance:", err);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">مدیریت حضور و غیاب روزانه</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col">
          <Dropdown
            title="دوره ها"
            items={courses}
            onSelect={(id: number) => {
              setSelectedCourseId(id);
            }}
          ></Dropdown>
        </div>

        {students.length > 0 && (
          <div className="flex flex-col">
            <Dropdown
              title="دانش آموزان"
              items={students.map((s) => {
                return { id: s.id, title: s.username };
              })}
              onSelect={(id: number) => {
                setSelectedStudentId(id);
              }}
            ></Dropdown>
          </div>
        )}
      </div>

      {/* Table */}
      {selectedStudentId && (
        <table className="w-full table-auto text-center border">
          <thead>
            <tr>
              <th className="border px-4 py-2">روز</th>
              <th className="border px-4 py-2">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: duration }, (_, i) => i + 1).map((day) => (
              <tr key={day}>
                <td className="border px-4 py-2">روز {day}</td>
                <td
                  className={`border px-4 py-2 cursor-pointer ${
                    attendance[day] === true
                      ? "bg-green-200"
                      : attendance[day] === false
                      ? "bg-red-200"
                      : "bg-gray-100"
                  }`}
                  onClick={() => toggleAttendance(day)}
                >
                  {attendance[day] === true
                    ? "✅ حاضر"
                    : attendance[day] === false
                    ? "❌ غایب"
                    : "ثبت نشده"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedStudentId && (
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          ذخیره حضور و غیاب
        </button>
      )}
    </div>
  );
}

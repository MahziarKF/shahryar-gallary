import getEnrollmentId from "@/lib/getEnrollment";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Transform frontend boolean|null attendance into [1,0,-1] format
function transformAttendancePayload(
  attendanceObj: Record<string, boolean | null>
): number[] {
  const maxIndex = Math.max(
    ...Object.keys(attendanceObj).map((k) => Number(k))
  );
  const checklist: number[] = [];
  for (let i = 1; i <= maxIndex; i++) {
    const val = attendanceObj[i.toString()];
    if (val === true) checklist.push(1);
    else if (val === false) checklist.push(0);
    else checklist.push(-1); // null case
  }
  return checklist;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId, courseId, attendance } = body;

    console.log(`🧑‍🎓 Student ID: ${studentId}`);
    console.log(`📚 Course ID: ${courseId}`);
    console.log(`📊 Attendance payload: ${JSON.stringify(attendance)}`);

    const enrollmentId = await getEnrollmentId(studentId, courseId);
    if (!enrollmentId)
      return NextResponse.json(
        { message: "Enrollment ID not found." },
        { status: 404 }
      );

    const checklist = transformAttendancePayload(attendance);

    const updatedAttendance = await prisma.attendance.update({
      where: { enrollment_id: enrollmentId },
      data: {
        checklist,
        last_updated: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Attendance updated successfully",
        attendance: updatedAttendance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("❌ Error updating attendance:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const studentId = url.searchParams.get("studentId");
    const courseId = url.searchParams.get("courseId");
    if (!studentId || !courseId) {
      return NextResponse.json(
        {
          message: "invalid/no courseid/studnentid provided.",
        },
        { status: 400 }
      );
    }
    const enrollmentId = await getEnrollmentId(studentId, courseId);
    if (!enrollmentId)
      return NextResponse.json(
        { message: "Enrollment ID not found." },
        { status: 404 }
      );
    const attendance = await prisma.attendance.findUnique({
      where: { enrollment_id: enrollmentId },
    });

    console.log(`------------------\n ${studentId + " --- " + courseId}`);
    return NextResponse.json({ attendance }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "error while getting the enrolled student checklist  attendance",
      },
      { status: 500 }
    );
    console.log(error);
  }
}

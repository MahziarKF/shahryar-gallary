// types.ts
export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string | null;
  password: string;
  role: string;
  is_verified?: boolean | null;
  is_active?: boolean | null;
  profile_image_url?: string | null;
  last_login_at?: Date | null;
  updated_at?: Date | null;
  created_at?: Date | null;
  verification?: number | null;
  teachings?: CourseTeacher[]; // relations
  enrollments?: Enrollment[];
}

export interface Course {
  id: number;
  title: string;
  description?: string | null;
  price: string;
  duration: string;
  teacherId: number;
  teacher?: Teacher;
  is_active?: boolean | null;
  created_at?: Date | null;
  teachers?: CourseTeacher[]; // co-teachers
  enrollments?: Enrollment[];
}

export interface Teacher {
  id: number;
  name: string;
  professions: string[];
  bio?: string | null;
  image_url?: string | null;
  phone?: string | null;
  created_at: Date;
  updated_at: Date;
  courses?: Course[];
}

export interface CourseTeacher {
  id: number;
  userId: number;
  courseId: number;
  assigned_at?: Date | null;
  course?: Course;
  user?: User;
}

export interface Category {
  id: number;
  name: string;
  Product?: Product[];
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  stock: number;
  category_id?: number | null;
  created_at?: Date | null;
  Category?: Category[] | null;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolled_at?: Date | null;
  Attendance?: Attendance | null;
  course?: Course;
  user?: User;
}

export interface Attendance {
  id: number;
  enrollment_id: number;
  checklist: boolean[];
  last_updated?: Date | null;
  Enrollment?: Enrollment;
}

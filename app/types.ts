import { Prisma } from "@prisma/client";

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

export interface Teacher {
  id: number;
  name: string;
  bio?: string | null;
  image_url?: string | null;
  phone?: string | null;
  professions: string[];
  created_at?: Date | null;
  updated_at?: Date | null;
  courses?: Course[];
}

export interface Course {
  id: number;
  title: string;
  description?: string | null;
  price: string;
  duration: string;
  teacherId: number;
  is_active?: boolean | null;
  created_at?: Date | null;
  teacher?: Teacher;
  teachers?: CourseTeacher[];
  enrollments?: Enrollment[];
}

export interface CourseTeacher {
  id: number;
  userId: number;
  courseId: number;
  assigned_at?: Date | null;
  course?: Course;
  user?: User;
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
  checklist: number[]; // Prisma: Int[], keep as number[]
  last_updated?: Date | null;
  Enrollment?: Enrollment;
}

export interface Category {
  id: number;
  name: string;
  products?: ProductCategory[]; // Correct relation from Prisma
}

export interface ProductCategory {
  product_id: number;
  category_id: number;
  product?: Product;
  category?: Category;
}
export type SupportMessageArray = Prisma.SupportMessageGetPayload<{}>[];

export type Conversation = {
  id: string;
  userId: number;
  adminId: number | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
};
export type ConversationWithMessages = Conversation & {
  messages: SupportMessage[];
};

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  stock: number;
  image_url?: string | null;
  created_at?: Date | null;
  discount?: Discount; // Correct relation from Prisma (array)
  categories?: ProductCategory[]; // Correct relation from Prisma
}

export interface Discount {
  id: number;
  product_id: number;
  discount_percent: number; // Typo fixed: from 'discount_precent'
  created_at?: Date | null;
  product?: Product;
}

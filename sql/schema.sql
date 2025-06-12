-- ========================
-- CATEGORIES
-- ========================
CREATE TABLE "Category" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ========================
-- PRODUCTS
-- ========================
CREATE TABLE "Product" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    price TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- PRODUCT-CATEGORY (MANY-TO-MANY)
-- ========================
CREATE TABLE "ProductCategory" (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (product_id, category_id),
    FOREIGN KEY (product_id) REFERENCES "Product"(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES "Category"(id) ON DELETE CASCADE
);

-- ========================
-- USERS
-- ========================
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url TEXT DEFAULT '',
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verification INT
);

-- ========================
-- TEACHERS (new model)
-- ========================
CREATE TABLE "Teacher" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    image_url TEXT,
    phone VARCHAR(20),
    professions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- COURSES
-- ========================
CREATE TABLE "Course" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL, 
    description TEXT,
    price TEXT NOT NULL,
    duration TEXT NOT NULL,
    teacher_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES "Teacher"(id) ON DELETE RESTRICT
);

-- ========================
-- ENROLLMENTS
-- ========================
CREATE TABLE "Enrollment" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES "Course"(id) ON DELETE CASCADE
);

-- ========================
-- COURSE TEACHERS (Co-teaching)
-- ========================
CREATE TABLE "CourseTeacher" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES "Course"(id) ON DELETE CASCADE
);

-- ========================
-- ATTENDANCE
-- ========================
CREATE TABLE "Attendance" (
    id SERIAL PRIMARY KEY,
    enrollment_id INT NOT NULL UNIQUE,
    checklist SMALLINT[] NOT NULL DEFAULT '{}',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (enrollment_id) REFERENCES "Enrollment"(id) ON DELETE CASCADE
);

-- ========================
-- INSERT MAHZ USER
-- ========================
INSERT INTO "User" (
  username, email, phone, password, role
) VALUES (
  'ww', 'mahz@example.com', '1234567890', 'securepassword123', 'student'
);

-- ========================
-- MAKE ss ADMIN
-- ========================
UPDATE "User" SET role = 'admin' WHERE username = 'ssa';

-- ========================
-- ENROLL MAHZ IN COURSE ID 1
-- ========================
INSERT INTO "Enrollment" (user_id, course_id)
SELECT id, 1 FROM "User" WHERE username = 'mahz';

-- ========================
-- RESET TABLES FOR CLEAN START (DANGEROUS: DATA LOSS)
-- ========================
TRUNCATE TABLE "ProductCategory", "CourseTeacher", "Enrollment", "Attendance", "Course", "Teacher", "User", "Product", "Category"
RESTART IDENTITY CASCADE;

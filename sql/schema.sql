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
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price TEXT NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category_id INT REFERENCES "Category"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- USERS
-- ========================
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url TEXT DEFAULT '',
    last_login_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- COURSES
-- ========================
CREATE TABLE "Course" (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL UNIQUE, 
    description TEXT,
    price TEXT NOT NULL,
    duration TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ========================
-- ENROLLMENTS
-- ========================
CREATE TABLE "Enrollment" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES "Course"(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- ========================
-- COURSE TEACHERS
-- ========================
CREATE TABLE "CourseTeacher" (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES "Course"(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- ========================
-- INSERT MAHZ USER
-- ========================
INSERT INTO "User" (
  username, email, phone, password, role
) VALUES (
  'mahz', 'mahz@example.com', '1234567890', 'securepassword123', 'student'
);

-- ========================
-- MAKE MAHZ ADMIN
-- ========================
UPDATE "User" SET role = 'admin' WHERE username = 'mahz';

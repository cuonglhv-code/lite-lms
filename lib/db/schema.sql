-- ============================================================
-- Jaxtina Lite LMS – Database Schema
-- Vercel Postgres (Neon)
-- ============================================================

-- Users (teachers + managers)
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL CHECK (role IN ('teacher', 'manager')),
  created_at    TIMESTAMP DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           VARCHAR(30) UNIQUE NOT NULL,
  name           VARCHAR(100) NOT NULL,
  level          VARCHAR(50),
  course_type    VARCHAR(50),
  duration_weeks INT,
  tuition_fee    NUMERIC(10,2),
  active         BOOLEAN DEFAULT TRUE
);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_code  VARCHAR(30) UNIQUE NOT NULL,
  class_name  VARCHAR(100) NOT NULL,
  course_id   UUID REFERENCES courses(id),
  teacher_id  UUID REFERENCES users(id),
  start_date  DATE,
  end_date    DATE,
  schedule    TEXT,
  capacity    INT DEFAULT 20,
  status      VARCHAR(30) DEFAULT 'Open for enrolment'
              CHECK (status IN ('Planned','Open for enrolment','Full','Ongoing','Completed','Cancelled')),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_code VARCHAR(20) UNIQUE NOT NULL,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150),
  phone        VARCHAR(30),
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Enrolments
CREATE TABLE IF NOT EXISTS enrolments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID REFERENCES students(id),
  class_id         UUID REFERENCES classes(id),
  enrol_date       DATE DEFAULT CURRENT_DATE,
  target_exam_date DATE,
  status           VARCHAR(20) DEFAULT 'Active'
                   CHECK (status IN ('Active','On hold','Completed','Drop-out')),
  notes            TEXT,
  UNIQUE(student_id, class_id)
);

-- Homework & Tasks
CREATE TABLE IF NOT EXISTS homework (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id         UUID REFERENCES classes(id),
  student_id       UUID REFERENCES students(id),
  assigned_date    DATE DEFAULT CURRENT_DATE,
  title            VARCHAR(200) NOT NULL,
  skill            VARCHAR(30),
  resource_url     TEXT,
  due_date         DATE,
  status           VARCHAR(30) DEFAULT 'Assigned'
                   CHECK (status IN ('Not assigned','Assigned','Submitted','Late','Missing','Checked')),
  score            NUMERIC(5,2),
  teacher_comment  TEXT,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Assessments & Results
CREATE TABLE IF NOT EXISTS assessments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id         UUID REFERENCES classes(id),
  student_id       UUID REFERENCES students(id),
  assessment_date  DATE DEFAULT CURRENT_DATE,
  assessment_type  VARCHAR(30),
  assessment_name  VARCHAR(200),
  max_score        NUMERIC(6,2) DEFAULT 100,
  score            NUMERIC(6,2),
  teacher_comment  TEXT,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- Attendance
CREATE TABLE IF NOT EXISTS attendance (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id     UUID REFERENCES classes(id),
  student_id   UUID REFERENCES students(id),
  session_date DATE NOT NULL,
  status       VARCHAR(20) DEFAULT 'Present'
               CHECK (status IN ('Present','Absent','Late','Excused')),
  notes        TEXT,
  UNIQUE(class_id, student_id, session_date)
);

-- Resource links (course materials library)
CREATE TABLE IF NOT EXISTS resources (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id      UUID REFERENCES classes(id),
  title         VARCHAR(200) NOT NULL,
  url           TEXT,
  blob_url      TEXT,
  resource_type VARCHAR(50),
  uploaded_by   UUID REFERENCES users(id),
  created_at    TIMESTAMP DEFAULT NOW()
);

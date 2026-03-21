-- ============================================================
-- Migration 002: Student Interface
-- Date: 2026-03-21
-- Run in Vercel Dashboard → Storage → Neon → SQL Editor
-- ============================================================

-- 1. Expand role CHECK to include 'student'
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('teacher', 'manager', 'student'));

-- 2. Link students to user accounts
ALTER TABLE students
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE students
  ADD CONSTRAINT IF NOT EXISTS students_user_id_unique UNIQUE (user_id);

-- 3. Assignments (class-level tasks posted by teachers)
CREATE TABLE IF NOT EXISTS assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  title       VARCHAR(200) NOT NULL,
  description TEXT,
  due_at      TIMESTAMPTZ,
  max_points  NUMERIC(6,2) DEFAULT 100,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- 4. Files attached to assignments by teacher (for students to download)
CREATE TABLE IF NOT EXISTS assignment_attachments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  filename      VARCHAR(255) NOT NULL,
  mime_type     VARCHAR(100),
  blob_url      TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- 5. Student submissions
CREATE TABLE IF NOT EXISTS submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id    UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  submitted_at  TIMESTAMPTZ,
  status        VARCHAR(20) NOT NULL DEFAULT 'not_submitted'
                CHECK (status IN ('not_submitted', 'submitted', 'returned')),
  grade         NUMERIC(6,2),
  feedback_text TEXT,
  returned_at   TIMESTAMPTZ,
  created_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE (assignment_id, student_id)
);

-- 6. Files uploaded by students as part of their submission
CREATE TABLE IF NOT EXISTS submission_files (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  filename      VARCHAR(255) NOT NULL,
  mime_type     VARCHAR(100),
  blob_url      TEXT NOT NULL,
  uploaded_at   TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assignments_class_id
  ON assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_assignment_attachments_assignment_id
  ON assignment_attachments(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment_student
  ON submissions(assignment_id, student_id);
CREATE INDEX IF NOT EXISTS idx_submission_files_submission_id
  ON submission_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id
  ON students(user_id);

-- ============================================================
-- Seed: Student user accounts + data linkage
-- Run AFTER migration above. Password for all: "password123"
-- Hash: $2b$10$zWeFrs30XwPabiyfwp8yD.sc67KIOTwfIN2kmYpFeiLC9pu7rWg1C
-- ============================================================

INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('00000000-0000-0000-0000-000000000010', 'Nguyen Thi Mai', 'mai.nguyen@email.com',
   '$2b$10$zWeFrs30XwPabiyfwp8yD.sc67KIOTwfIN2kmYpFeiLC9pu7rWg1C', 'student'),
  ('00000000-0000-0000-0000-000000000011', 'Tran Van Duc',   'duc.tran@email.com',
   '$2b$10$zWeFrs30XwPabiyfwp8yD.sc67KIOTwfIN2kmYpFeiLC9pu7rWg1C', 'student'),
  ('00000000-0000-0000-0000-000000000012', 'Le Thi Hoa',     'hoa.le@email.com',
   '$2b$10$zWeFrs30XwPabiyfwp8yD.sc67KIOTwfIN2kmYpFeiLC9pu7rWg1C', 'student')
ON CONFLICT (email) DO NOTHING;

-- Link student records to user accounts (using fixed seed UUIDs)
UPDATE students SET user_id = '00000000-0000-0000-0000-000000000010'
  WHERE student_code = 'S001';
UPDATE students SET user_id = '00000000-0000-0000-0000-000000000011'
  WHERE student_code = 'S002';
UPDATE students SET user_id = '00000000-0000-0000-0000-000000000012'
  WHERE student_code = 'S003';

-- Sample assignment for Foundation 1 - Class A
INSERT INTO assignments (id, class_id, title, description, due_at, max_points)
VALUES (
  '40000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  'Writing Task 2: Problem-Solution Essay',
  'Write a 250-word essay on the problem of traffic congestion in cities and propose two solutions. Use formal academic register and include a clear thesis statement.',
  NOW() + INTERVAL '11 days',
  100
) ON CONFLICT (id) DO NOTHING;

-- S001 (Mai) has already submitted; S003 (Hoa) has a returned grade
INSERT INTO submissions (id, assignment_id, student_id, submitted_at, status, grade, feedback_text, returned_at)
VALUES
  ('50000000-0000-0000-0000-000000000001',
   '40000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000001',
   NOW() - INTERVAL '1 day', 'submitted', NULL, NULL, NULL),
  ('50000000-0000-0000-0000-000000000002',
   '40000000-0000-0000-0000-000000000001',
   '30000000-0000-0000-0000-000000000003',
   NOW() - INTERVAL '3 days', 'returned', 72, 'Good structure and clear thesis. Work on cohesive devices between paragraphs.', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Rollback (run if needed):
-- DROP TABLE IF EXISTS submission_files CASCADE;
-- DROP TABLE IF EXISTS submissions CASCADE;
-- DROP TABLE IF EXISTS assignment_attachments CASCADE;
-- DROP TABLE IF EXISTS assignments CASCADE;
-- ALTER TABLE students DROP COLUMN IF EXISTS user_id;
-- DELETE FROM users WHERE role = 'student';
-- ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
-- ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('teacher','manager'));
-- ============================================================

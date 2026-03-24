-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL,
  module_id uuid,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('ielts_task1', 'ielts_task2')),
  config_json jsonb DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz
);

-- Create activity_submissions table
CREATE TABLE IF NOT EXISTS activity_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'scoring', 'scored', 'error')),
  essay_text text,
  examiner_payload_json jsonb,
  examiner_result_json jsonb,
  band_overall numeric(3,1),
  submitted_at timestamptz DEFAULT now(),
  scored_at timestamptz,
  deleted_at timestamptz,
  UNIQUE(activity_id, student_id)
);

-- Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_submissions ENABLE ROW LEVEL SECURITY;

-- Basic Policies (To be refined with specific role checks later)
-- Requirement: Teachers/admins: full INSERT, UPDATE, DELETE on their own activities
-- Requirement: Students: SELECT only on activities belonging to courses they are enrolled in
-- Note: Since 'courses' is in a different DB, we allow SELECT via API-level logic, or open SELECT for all authenticated
CREATE POLICY "Enable SELECT for authenticated users" ON activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable ALL for service-role" ON activities FOR ALL TO service_role USING (true);

-- Requirement: Students: INSERT and SELECT their own rows only
CREATE POLICY "Students can manage own submissions" ON activity_submissions FOR ALL TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Teachers/System can manage all submissions" ON activity_submissions FOR ALL TO service_role USING (true);

-- rollback: -- INTENTIONAL DROP
-- DROP TABLE IF EXISTS activity_submissions;
-- DROP TABLE IF EXISTS activities;

---
name: lms-supabase-migration
description: >
  Use this skill when the user wants to add new Supabase tables, columns, 
  foreign keys, RLS policies, or indexes to the lite-lms project. Also use 
  when writing or reviewing SQL migration files for the Activities integration. 
  Never modifies existing tables — additive schema changes only.
---

# lite-lms — Supabase Migration

## Goal
Produce safe, reversible, correctly named migration SQL files that are 
strictly additive — no changes to existing lite-lms tables ever.

## Additive Rule
Before writing any SQL, confirm the target table does not already exist in 
`supabase/migrations/`. If it does, stop and raise a blocking Artifact.

## Naming Convention
`supabase/migrations/YYYYMMDDHHMMSS_description.sql`
Example: `20260324130000_add_activities_table.sql`

## New Tables for This Integration
Two new tables are permitted for the Activities integration:

### `activities`
```sql
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES modules(id) ON DELETE SET NULL,
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('ielts_task1', 'ielts_task2')),
  config_json jsonb DEFAULT '{}'::jsonb,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### `activity_submissions`
```sql
CREATE TABLE activity_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'scoring', 'scored', 'error')),
  essay_text text,
  examiner_payload_json jsonb,
  examiner_result_json jsonb,
  band_overall numeric(3,1),
  submitted_at timestamptz DEFAULT now(),
  scored_at timestamptz,
  UNIQUE(activity_id, student_id)
);
```

## Instructions
1. Read all files in `supabase/migrations/` to understand the current schema 
   and confirm the exact names of `courses`, `modules`, and `auth.users` tables
   before writing any FK reference
2. Write the migration SQL using the table definitions above as the base template
3. Add a `-- rollback:` section at the end of every migration file
4. Enable RLS on both new tables and define policies (see RLS section below)
5. Validate by running:
   `python .agent/skills/lms-supabase-migration/scripts/validate_migration.py <file>`
6. Dry-run reminder — tell the user to run:
   `supabase db diff --schema public`
   `supabase migration up --dry-run`

## RLS Policies Required

### activities
- Teachers/admins: full INSERT, UPDATE, DELETE on their own activities
- Students: SELECT only on activities belonging to courses they are enrolled in

### activity_submissions
- Students: INSERT and SELECT their own rows only
- Teachers/admins: SELECT all submissions for activities they own
- System/service role: UPDATE (for writing back scored results from the examiner)

## Constraints
- NEVER ALTER, DROP, or rename any existing lite-lms table or column
- If an FK reference table name is uncertain, read the migrations — never guess
- Never apply migrations automatically — always show SQL as an Artifact first
- If a change requires a multi-step migration (e.g. backfill), split into 
  separate numbered files

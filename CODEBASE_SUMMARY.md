# Codebase Summary: Lite LMS (IELTS Activities Integration)

## Project Overview
Lite LMS is an English language learning platform focused on IELTS preparation. This project is currently integrating a new **Activities** feature that allows students to submit essays for AI-assisted scoring.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Database/Auth**: Supabase
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: Integrated with `jaxtina-ielts-examiner` for scoring

## Database Schema (Supabase)

### `activities`
- `id` (UUID, PK)
- `course_id` (UUID) - Links to existing courses
- `module_id` (UUID, optional)
- `title` (TEXT)
- `type` (TEXT: 'ielts_task1' or 'ielts_task2')
- `config_json` (JSONB)
- `created_by` (UUID)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### `activity_submissions`
- `id` (UUID, PK)
- `activity_id` (UUID, FK -> activities.id)
- `student_id` (UUID)
- `status` (TEXT: 'pending', 'scoring', 'scored', 'error')
- `essay_text` (TEXT)
- `examiner_payload_json` (JSONB) - Data sent to the AI examiner
- `examiner_result_json` (JSONB) - Structured result from the AI examiner
- `band_overall` (NUMERIC)
- `submitted_at` (TIMESTAMPTZ)
- `scored_at` (TIMESTAMPTZ)

## Key Routes
- `/courses/[courseId]/activities` - Activity list for a course
- `/courses/[courseId]/activities/[activityId]` - Activity submission/view page
- `/api/activities/*` - CRUD for activity management
- `/api/activities/submit` - Entry point for AI scoring pipeline

## Role-Based Access
- **Teachers/Admins**: Can create and manage activities.
- **Students**: Can view activities in their courses and submit responses.
- **Service Role**: Used for AI pipeline writes and system-level operations.

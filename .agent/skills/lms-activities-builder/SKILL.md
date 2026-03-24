---
name: lms-activities-builder
description: >
  Use this skill when building anything related to the new Activities feature — 
  the Activities tab inside a course, the activity submission form, the student 
  results page, the teacher activity creation page, or the teacher submissions 
  view. This skill owns all new routes under app/(dashboard)/courses/[courseId]/
  activities/ and app/api/activities/.
---

# lite-lms — Activities Feature Builder

## Goal
Build the Activities feature as a self-contained additive module that plugs 
into the existing lite-lms course structure without modifying any existing file.

## Reference Data Model
Read `.agent/skills/lms-activities-builder/references/activities_data_model.md`
for the approved schema. If this file is empty, read the latest migration file 
in `supabase/migrations/` that references the `activities` table instead.

## Route Map (all new files — none exist yet)
```
app/
  (dashboard)/
    courses/[courseId]/
      activities/
        page.tsx              ← Activities tab: list all activities in course
        [activityId]/
          page.tsx            ← Task brief + essay submission form (student)
          results/
            page.tsx          ← Band scores + AI feedback display (student)
    teacher/
      activities/
        create/
          page.tsx            ← Teacher creates new IELTS activity
        [activityId]/
          submissions/
            page.tsx          ← Teacher views all student submissions + scores
  api/
    activities/
      route.ts                ← GET list, POST create
    activities/[id]/
      route.ts                ← GET single, PATCH update, DELETE
      submit/
        route.ts              ← POST: receive essay → call examiner → store result
      results/
        route.ts              ← GET: return scored result for current user
```

## Instructions

1. **Read the existing course page structure** before building — locate how 
   `courses/[courseId]/` is currently structured (modules, tabs, layouts) and 
   replicate the EXACT same layout wrapper and tab pattern for Activities

2. **Adding the Activities tab to the course view:**
   - This is the ONE place you may need to touch an existing file — surface this 
     as a blocking Artifact identifying the exact file and the minimal change 
     (single tab entry) before making any edit. Wait for approval.

3. **Student Activity Page** (`[activityId]/page.tsx`) must include:
   - Task type badge (Task 1 / Task 2)
   - Task brief/prompt from `config_json.prompt`
   - Word count requirement (Task 1: min 150w, Task 2: min 250w)
   - Live word counter on the textarea
   - Submit button — disabled until word count requirement is met
   - On submit: POST to `api/activities/[id]/submit/` with essay text
   - Loading state while scoring is in progress (status: 'scoring')
   - Auto-redirect to results page when status becomes 'scored'

4. **Results Page** (`results/page.tsx`) must display:
   - Overall band score (large, prominent)
   - Four criterion scores: Task Achievement, Coherence & Cohesion, 
     Lexical Resource, Grammatical Range & Accuracy
   - Per-criterion written feedback
   - Three improvement suggestions
   - Submitted essay text (read-only, collapsible)

5. **Teacher Create Page** must allow:
   - Select activity type: Task 1 or Task 2
   - Enter task title and full task prompt (stored in `config_json.prompt`)
   - Select which course (and optionally which module) to attach to
   - Set time limit and word limit overrides (optional, stored in `config_json`)

6. **Teacher Submissions View** must show:
   - Table of all student submissions for the activity
   - Columns: student name, submitted_at, status, band_overall, 
     link to full result
   - Sort by submitted_at desc by default
   - Filter by status (pending / scoring / scored / error)

## Constraints
- Use `lms-component-generator` skill for all new UI components
- Use `lms-examiner-connector` skill for the submit API route logic
- Use `lms-supabase-migration` skill for any schema questions
- Never hardcode course IDs, user IDs, or API URLs

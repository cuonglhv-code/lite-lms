# Activities Data Model Reference

> This file is populated by the agent after the Supabase migration is approved 
> and applied (M1). Until then, refer to the migration SQL file directly.

## activities
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, auto-generated |
| course_id | uuid | FK → courses.id, CASCADE |
| module_id | uuid | FK → modules.id, SET NULL, nullable |
| title | text | Display name |
| type | text | 'ielts_task1' or 'ielts_task2' |
| config_json | jsonb | prompt, word_limit, time_limit |
| created_by | uuid | FK → auth.users.id |
| created_at | timestamptz | auto |
| updated_at | timestamptz | auto |

## activity_submissions
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, auto-generated |
| activity_id | uuid | FK → activities.id, CASCADE |
| student_id | uuid | FK → auth.users.id, CASCADE |
| status | text | pending / scoring / scored / error |
| essay_text | text | Student's submitted essay |
| examiner_payload_json | jsonb | Full payload sent to examiner API |
| examiner_result_json | jsonb | Full raw response from examiner API |
| band_overall | numeric(3,1) | Extracted overall band for quick queries |
| submitted_at | timestamptz | auto |
| scored_at | timestamptz | Set when status → scored |
| UNIQUE | (activity_id, student_id) | One submission per student per activity |

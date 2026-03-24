# name: Start Session
# description: Load project context, review progress, and prepare for work.

## Role
You are the lead developer. At the start of every session, you must orient yourself to the project's current state and safety rules.

## Step 1: Read Context
- Read `CODEBASE_SUMMARY.md` to understand the architecture and schema.
- Read `session_handoff.md` to see what was done last and what's next.

## Step 2: Verify Safety
- Review `.agent/workflows/supabase_schema_rls.md` for database safety.
- Review `.agent/workflows/nextjs_app_router.md` for routing rules.

## Step 3: Plan Next Task
- Choose the next item from `session_handoff.md`.
- Use `new_page.md` or `ai_scoring_pipeline.md` workflows as needed for the task.

---

## End of Session Routine
At the end of your turn, update `CODEBASE_SUMMARY.md` and `session_handoff.md` with:
- Any new database tables or columns added.
- Any new routes or pages shipped.
- Unfinished tasks for the next session.

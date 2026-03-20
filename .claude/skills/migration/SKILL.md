---
name: migration
description: Generate a safe SQL migration file for the Jaxtina LMS Vercel Postgres database. Use when adding tables, columns, indexes, or constraints. Enforces safe patterns: no destructive changes without IF EXISTS, NOT NULL columns must have DEFAULT, correct UUID FK references matching schema.sql, snake_case naming, date-prefixed filename.
---

Generate a SQL migration file at `lib/db/migrations/YYYYMMDD_<description>.sql`.

Rules:
- Never DROP a column or table without IF EXISTS
- All new NOT NULL columns must include a DEFAULT value
- FK columns must reference existing tables from lib/db/schema.sql
- File name: snake_case, date-prefixed (e.g. 20260320_add_ielts_band_target.sql)
- Add a comment header: `-- Migration: <description> / Date: YYYY-MM-DD`
- Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` for new columns
- Always include a rollback comment block at the bottom showing how to undo the migration

After generating the file, remind the user to run it against Vercel Postgres via the Vercel dashboard SQL editor or `psql $POSTGRES_URL_NON_POOLING < <file>`.

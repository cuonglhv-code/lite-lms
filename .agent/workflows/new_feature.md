# name: New Feature
# description: End-to-end workflow for shipping a complete feature across all layers.

## Role
You are a senior full-stack engineer delivering a complete, production-ready
feature on this Next.js + Supabase IELTS platform. You work layer by layer,
bottom-up (DB → API → UI), confirming each layer before moving to the next.
Read ALL of the following before starting:

- `CODEBASE_SUMMARY.md`
- `.agent/session_handoff.md`
- `supabase_schema_rls.md`
- `nextjs_app_router.md`
- `ai_scoring_pipeline.md`
- `ui_ux_conventions.md`

Do not write a single line of code until Step 1 is complete and approved.

---

## Feature intake form

Paste this when requesting a new feature:

```
## New feature request

**Feature name:** [short name, e.g. "IELTS Activities"]

**What it does:**
[2–3 sentences describing the feature from the student's perspective]

**User story:**
As a [student / teacher / admin], I want to [action] so that [outcome].

**Entry point:**
[Where does the user access this? e.g. dashboard sidebar, /activities route]

**Core screens / views:**
1. [screen 1 — e.g. Activity list page]
2. [screen 2 — e.g. Activity detail page]
3. [screen 3 — e.g. Submission and feedback view]

**Data involved:**
[What data does this feature create, read, update, or delete?]

**AI involvement:**
[ ] No AI needed
[ ] Uses existing scoring pipeline
[ ] Needs new prompt / scoring logic

**Auth requirement:**
[ ] Public (no login needed)
[ ] Authenticated students only
[ ] Teacher / admin only

**Out of scope (will NOT be built in this feature):**
- [item 1]
- [item 2]
```

---

## Delivery process — 6 layers, bottom up

---

### Layer 0 — Feature plan (always first)

Before any code, produce a complete feature plan:

```
## Feature plan: [Feature name]

### Affected layers
- [ ] Database (new tables / columns / RLS)
- [ ] API routes (new Route Handlers or Server Actions)
- [ ] AI pipeline (new prompts or scoring logic)
- [ ] UI (new pages and components)
- [ ] Auth / middleware (new protected routes)

### New routes
| Route | Type | Purpose |
|---|---|---|
| /activities | Page | Activity list |
| /activities/[id] | Page | Activity detail |
| /api/activities/submit | Route Handler | Handle submission |

### New database tables / columns
| Table | Columns | Purpose |
|---|---|---|
| activities | id, title, type, task_prompt, created_at | Stores activity definitions |
| activity_submissions | id, user_id, activity_id, essay, score_data, status | Student submissions |

### New components
| Component | Location | Purpose |
|---|---|---|
| ActivityCard | components/activities/ | List item card |
| ActivityEditor | components/activities/ | Essay writing interface |
| ActivityFeedback | components/activities/ | Score + feedback display |

### Environment variables needed
- [list any new keys required]

### Dependencies on existing features
- [e.g. "Uses existing AI scoring pipeline from ai_scoring_pipeline.md"]
- [e.g. "Requires authenticated session from middleware"]

### Risks / unknowns
- [anything that might be tricky or need a decision]
```

Show this plan and wait for approval before writing any code.

---

### Layer 1 — Database (supabase_schema_rls.md)

Follow `supabase_schema_rls.md` exactly. Produce:

**1a. Migration file**
`supabase/migrations/{{timestamp}}_{{feature_name}}.sql`

```sql
-- Feature: [Feature name]
-- Created: [date]

-- 1. Create tables
CREATE TABLE activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('task1', 'task2')),
  task_prompt TEXT NOT NULL,
  difficulty  TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_submissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  essay       TEXT NOT NULL,
  word_count  INT,
  score_data  JSONB,
  status      TEXT DEFAULT 'pending'
              CHECK (status IN ('pending', 'scoring', 'completed', 'failed')),
  error_message TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_submissions ENABLE ROW LEVEL SECURITY;

-- 3. RLS policies
-- Activities: public read (teachers create via dashboard)
CREATE POLICY "Anyone can read activities"
ON activities FOR SELECT USING (true);

-- Submissions: students own their rows
CREATE POLICY "Students can read own submissions"
ON activity_submissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own submissions"
ON activity_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- AI pipeline writes via service role
CREATE POLICY "Service role full access to submissions"
ON activity_submissions FOR ALL
USING (auth.role() = 'service_role');

-- Rollback:
-- DROP TABLE activity_submissions;
-- DROP TABLE activities;
```

**1b. TypeScript types**
`src/types/activities.ts`

```ts
export type ActivityType = 'task1' | 'task2'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type SubmissionStatus = 'pending' | 'scoring' | 'completed' | 'failed'

export interface Activity {
  id: string
  title: string
  type: ActivityType
  task_prompt: string
  difficulty: Difficulty
  created_at: string
}

export interface ActivitySubmission {
  id: string
  user_id: string
  activity_id: string
  essay: string
  word_count: number
  score_data: ScoringResult | null
  status: SubmissionStatus
  error_message: string | null
  created_at: string
}
```

Show Layer 1 output and wait for approval before Layer 2.

---

### Layer 2 — AI pipeline (ai_scoring_pipeline.md)

Only if AI is involved in this feature. Follow
`ai_scoring_pipeline.md` exactly.

**2a. Prompt file**
`src/lib/scoring/prompts/activity_task2_prompt.md`

```
# Prompt version: 1.0
# Last updated: [date]
# Task type: IELTS Writing Task 2 — Activities

You are an expert IELTS examiner. Score the following essay against the
four official IELTS Writing Task 2 band descriptors.

Task prompt given to the student:
{{task_prompt}}

Student essay:
{{essay}}

Word count: {{word_count}}

Return ONLY valid JSON in this exact structure:
{
  "task_achievement":     { "band": 0, "feedback": "" },
  "coherence_cohesion":   { "band": 0, "feedback": "" },
  "lexical_resource":     { "band": 0, "feedback": "" },
  "grammatical_range":    { "band": 0, "feedback": "" },
  "overall_band":         0,
  "summary_feedback":     "",
  "improvement_suggestions": []
}

Band scores must be one of: 0, 1, 1.5, 2, 2.5 ... 9.
Do not include any text outside the JSON object.
```

**2b. API route**
`src/app/api/activities/score/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { scoreEssay } from '@/lib/scoring/scorer'

export const maxDuration = 60 // Vercel function timeout for AI routes

export async function POST(req: NextRequest) {
  const supabase = createServerClient()

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { submissionId, essay, taskPrompt, taskType } = await req.json()

  // 2. Mark as scoring
  await supabase
    .from('activity_submissions')
    .update({ status: 'scoring' })
    .eq('id', submissionId)

  try {
    // 3. Score the essay
    const score = await scoreEssay(essay, taskType, taskPrompt)

    // 4. Write result
    await supabase
      .from('activity_submissions')
      .update({
        status: 'completed',
        score_data: score,
        word_count: essay.split(/\s+/).length
      })
      .eq('id', submissionId)

    return NextResponse.json({ success: true, score })

  } catch (error) {
    // 5. Always handle failure — never leave status as 'scoring'
    await supabase
      .from('activity_submissions')
      .update({
        status: 'failed',
        error_message: error instanceof Error
          ? error.message
          : 'Unknown scoring error'
      })
      .eq('id', submissionId)

    return NextResponse.json(
      { error: 'Scoring failed' },
      { status: 500 }
    )
  }
}
```

Show Layer 2 output and wait for approval before Layer 3.

---

### Layer 3 — Routing and pages (nextjs_app_router.md)

Follow `nextjs_app_router.md` exactly. Produce all three files per route.

**Activities list**

`src/app/activities/page.tsx`
```tsx
import { createServerClient } from '@/lib/supabase/server'
import { ActivityCard } from '@/components/activities/ActivityCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Activity } from '@/types/activities'

export const metadata = { title: 'Activities | IELTS Examiner' }

export default async function ActivitiesPage() {
  const supabase = createServerClient()
  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  if (!activities?.length) return (
    <EmptyState
      title="No activities yet"
      description="Check back soon — new writing tasks are added regularly."
    />
  )

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-heading mb-6">Writing Activities</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {activities.map((activity: Activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    </main>
  )
}
```

`src/app/activities/loading.tsx`
```tsx
export default function Loading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200 mb-6" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    </main>
  )
}
```

`src/app/activities/error.tsx`
```tsx
"use client"
import { EmptyState } from '@/components/shared/EmptyState'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <EmptyState
        title="Could not load activities"
        description="Something went wrong. Please try again."
        action={
          <button onClick={reset}
            className="rounded-lg bg-brand-500 px-4 py-2 text-white
                       hover:bg-brand-600 focus-visible:ring-2">
            Try again
          </button>
        }
      />
    </main>
  )
}
```

Repeat the same three-file pattern for:
- `src/app/activities/[id]/page.tsx` — activity detail + essay editor
- `src/app/activities/[id]/results/page.tsx` — score and feedback view

Show Layer 3 output and wait for approval before Layer 4.

---

### Layer 4 — Components (ui_ux_conventions.md)

Follow `ui_ux_conventions.md` exactly. Build all components mobile-first.

```
src/components/activities/
├── ActivityCard.tsx        # List card with title, type badge, difficulty
├── ActivityEditor.tsx      # Full essay editor with word counter + submit
├── ActivityFeedback.tsx    # Tabbed score + feedback view (mobile)
└── ActivityBadge.tsx       # Task type + difficulty badge
```

**ActivityCard.tsx**
```tsx
import Link from 'next/link'
import { ActivityBadge } from './ActivityBadge'
import type { Activity } from '@/types/activities'

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link href={`/activities/${activity.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-5
                 hover:border-brand-500 hover:shadow-sm
                 focus-visible:ring-2 focus-visible:ring-brand-500
                 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-subhead font-semibold text-slate-800 leading-snug">
          {activity.title}
        </h2>
        <ActivityBadge type={activity.type} difficulty={activity.difficulty} />
      </div>
      <p className="text-small text-slate-500 line-clamp-2">
        {activity.task_prompt}
      </p>
      <p className="mt-3 text-label text-brand-500 font-medium">
        Start writing →
      </p>
    </Link>
  )
}
```

**ActivityEditor.tsx** (client component — interactivity needed)
```tsx
"use client"
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ScoringProgress } from '@/components/scoring/ScoringProgress'
import type { Activity } from '@/types/activities'

const MIN_WORDS = { task1: 150, task2: 250 }
const AUTO_SAVE_KEY = (id: string) => `activity_draft_${id}`

export function ActivityEditor({ activity }: { activity: Activity }) {
  const [essay, setEssay] = useState('')
  // ... rest of component logic (TRUNCATED IN REQUEST)
}
```

---

### Layer 5 — Verification and Polish

Follow `ui_ux_conventions.md` checklist.
1. Test mobile layout (375px)
2. Verify loading, empty, and error states
3. Run accessibility audit
4. Update `CODEBASE_SUMMARY.md`

### Layer 6 — Handoff

Append to `.agent/session_handoff.md`:
- Detailed summary of the new feature
- List of new routes and tables
- Instructions for the next session

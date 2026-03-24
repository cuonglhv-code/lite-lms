# name: AI Scoring Pipeline
# description: Workflow for building, modifying, and chaining the IELTS AI scoring pipeline.

## Role
You are a senior AI engineer working on an IELTS writing scoring pipeline.
Before making any changes, read the existing scoring logic and prompt files.
This pipeline handles real student data — be conservative, test thoroughly.

---

## Pipeline architecture

The scoring pipeline has these stages. Each stage is a separate concern:

```
 Essay submitted by user (client)
        ↓
 Route Handler: /api/score/route.ts
    - Validates input
    - Checks auth (user must be authenticated)
    - Writes pending submission to Supabase
        ↓
 AI Scoring Service: src/lib/scoring/scorer.ts
    - Loads the prompt template
    - Calls AI provider (OpenAI / Anthropic / etc.)
    - Parses and validates the structured response
        ↓
 Score normaliser: src/lib/scoring/normaliser.ts
    - Maps raw AI output to IELTS band descriptors (0–9 scale)
    - Validates scores are within legal range
        ↓
 Supabase write (service role)
    - Writes final score + feedback to `submissions` table
    - Updates `feedback` table with per-criterion breakdown
        ↓
 Client receives result
    - Real-time subscription OR polling OR redirect
```

---

## Stage 1 — Prompt template rules

Prompt files live in: `src/lib/scoring/prompts/`

Rules:
- One `.md` or `.txt` file per task type (e.g. `task1_prompt.md`, `task2_prompt.md`)
- Use `{{placeholders}}` for dynamic values (essay text, word count, etc.)
- Never hardcode band descriptors inline — import from `src/lib/scoring/descriptors.ts`
- Version prompts with a comment header:
  ```
  # Prompt version: 1.2
  # Last updated: {{date}}
  # Changes: {{what changed and why}}
  ```
- When modifying a prompt, always A/B test on 3 sample essays before committing

Prompt output must always be structured JSON:
```json
{
  "task_achievement": { "band": 7, "feedback": "..." },
  "coherence_cohesion": { "band": 6.5, "feedback": "..." },
  "lexical_resource": { "band": 7, "feedback": "..." },
  "grammatical_range": { "band": 6, "feedback": "..." },
  "overall_band": 6.5,
  "summary_feedback": "...",
  "improvement_suggestions": ["...", "..."]
}
```

---

## Stage 2 — AI provider call pattern

```ts
// src/lib/scoring/scorer.ts
import { openai } from '@/lib/ai/client'
import { loadPrompt } from '@/lib/scoring/prompts/loader'
import { ScoringResult, ScoringResultSchema } from '@/types/scoring'

export async function scoreEssay(
  essay: string,
  taskType: 'task1' | 'task2'
): Promise<ScoringResult> {
  const prompt = loadPrompt(taskType, { essay })

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.2   // low temperature for consistent scoring
  })

  const raw = JSON.parse(response.choices.message.content!)

  // Always validate with Zod before trusting AI output
  return ScoringResultSchema.parse(raw)
}
```

Key rules:
- Always use `temperature: 0.2` or lower for scoring (consistency over creativity)
- Always validate AI output with a Zod schema before writing to DB
- Wrap the AI call in try/catch and write `status: 'failed'` to DB on error
- Never expose the raw AI response to the client — always normalise first

---

## Stage 3 — Chaining workflows

When building a new pipeline feature, chain these workflows in order:

```
Step 1: supabase_schema_rls.md
  → Create any new tables / columns needed for the feature

Step 2: nextjs_app_router.md
  → Create the Route Handler and any new page components

Step 3: ai_scoring_pipeline.md (this file)
  → Build the scoring logic, prompts, and Supabase writes

Step 4: start_session.md end-of-session routine
  → Update CODEBASE_SUMMARY.md and session_handoff.md
```

---

## Error handling pattern

Every pipeline stage must handle failure gracefully:

```ts
try {
  const score = await scoreEssay(essay, taskType)
  await supabase.from('submissions').update({
    status: 'completed',
    score_data: score
  }).eq('id', submissionId)
} catch (error) {
  await supabase.from('submissions').update({
    status: 'failed',
    error_message: error instanceof Error ? error.message : 'Unknown error'
  }).eq('id', submissionId)
  // Never throw — return a safe error response to the client
}
```

---

## Checklist before deploying any pipeline change

- [ ] Prompt version header updated
- [ ] AI output validated with Zod schema
- [ ] `temperature` set to 0.2 or lower
- [ ] Error handling writes `status: 'failed'` to DB
- [ ] Service role key used for DB writes (not anon key)
- [ ] Tested on at least 3 sample essays (Task 1 and Task 2)
- [ ] Band scores validated to be within 0–9 range
- [ ] No raw AI output exposed to client
- [ ] `CODEBASE_SUMMARY.md` updated if schema changed

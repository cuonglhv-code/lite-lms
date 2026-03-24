---
name: lms-component-generator
description: >
  Use this skill when building any new React/Next.js UI component, page layout, 
  form, table, dashboard widget, or loading/error state for the lite-lms 
  codebase. Ensures all new UI is visually and structurally consistent with 
  the existing lite-lms design system.
---

# lite-lms — Component Generator

## Goal
Generate new UI components that are indistinguishable in style and structure 
from existing lite-lms components.

## Instructions

1. **Read existing components first** — before generating anything, scan the 
   `components/` directory. Identify:
   - The UI library in use (shadcn/ui, Radix, Chakra, or custom — read imports)
   - The prop type pattern (interface vs type, naming convention)
   - How loading states are handled (skeleton, spinner, or suspense)
   - How error states are handled (toast, intermediate error, or error boundary)
   - The Tailwind class naming conventions (if Tailwind is used)
   - Save one existing component as your golden example before generating

2. **Component file rules:**
   - Named interface for all props: `ComponentNameProps`
   - `'use client'` only when the component uses hooks or browser APIs — 
     default to Server Component
   - Co-locate the component test file: `ComponentName.test.tsx`
   - Max 100 lines per component — propose a split if exceeded

3. **File placement:**
   - Shared UI primitives: `components/ui/`
   - Activities-specific: `components/activities/`
   - Teacher-specific: `components/teacher/`
   - Full pages: appropriate `app/` route as `page.tsx`

4. **New components needed for Activities integration:**
   - `ActivityCard` — displays activity title, type badge, status, and CTA
   - `EssaySubmissionForm` — textarea with live word counter and submit button
   - `BandScoreDisplay` — shows overall + 4 criterion scores visually
   - `FeedbackPanel` — displays per-criterion feedback + improvement suggestions
   - `SubmissionsTable` — teacher view of all student submissions with filters
   - `ActivityStatusBadge` — colour-coded: pending / scoring / scored / error

## Constraints
- No inline styles — use Tailwind or the existing CSS convention found in workspace
- No new UI libraries — use only what is already in `package.json`
- No `any` in prop types
- Always handle loading and error states
- Match the exact visual language of existing lite-lms components

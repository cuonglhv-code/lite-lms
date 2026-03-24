---
name: lms-codebase-orchestrator
description: >
  Use this skill for any general question about the lite-lms codebase, its 
  architecture, navigation, or when the user's intent doesn't clearly match 
  a more specific skill. Acts as the entry point that reads the workspace 
  and routes to the right specialist skill. Also use this when the user asks 
  what skill to use.
---

# lite-lms — Codebase Orchestrator

## Goal
Orient yourself in the live workspace and route the user's intent to the 
correct specialist skill. Never answer architecture questions from memory — 
always read actual files first.

## Stack Reference
Read `package.json` and `app/` to confirm — but expected stack is:
- Framework: Next.js (App Router)
- Backend: Supabase (Auth, Postgres, RLS, Storage)
- Language: TypeScript (strict mode)
- Deployment: Vercel

## Routing Table
| User Intent | Route to Skill |
|---|---|
| DB schema / migration / RLS | `lms-supabase-migration` |
| Activities tab / IELTS activity feature | `lms-activities-builder` |
| New UI component / page / layout | `lms-component-generator` |
| Examiner API call / scoring connection | `lms-examiner-connector` |
| "Will this break existing code?" | `lms-integration-guard` |
| Anything else (routing, auth, API routes) | Handle directly below |

## Instructions
1. Read `package.json`, full `app/` directory tree, and `supabase/migrations/` 
   before answering any architecture question
2. Identify the correct specialist skill from the routing table above and 
   invoke it — do not handle specialist tasks directly
3. For general tasks not in the routing table, apply the constraints below

## General Coding Constraints
- Additive only — do NOT modify any existing lite-lms file without a 
  blocking Artifact asking for my explicit approval first
- TypeScript strict mode — no `any` without an inline explanation comment
- Reuse the existing UI component library — read `components/` before building
- Never touch `.env` or `.env.local` — surface new vars as an Artifact list
- Commit format: `[MX] short description`
- All work goes to branch: `feature/activities-ielts-integration`

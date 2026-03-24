---
name: lms-integration-guard
description: >
  Use this skill BEFORE making any change that might affect existing lite-lms 
  files, routes, tables, or components. Also invoke automatically before every 
  commit to verify the additive-only rule has not been violated. Acts as the 
  safety rail for the entire integration.
---

# lite-lms — Integration Guard

## Goal
Enforce the core constraint of this integration: the existing lite-lms codebase 
is frozen. Every proposed change is evaluated before execution.

## Pre-Change Checklist
Run this checklist mentally before EVERY file operation:

```
[ ] Is the target file a NEW file (does not currently exist in workspace)?
    → YES: Safe to proceed
    → NO:  STOP — raise blocking Artifact (see template below)

[ ] Is the target Supabase table a NEW table?
    → YES: Safe to proceed with migration skill
    → NO:  STOP — raise blocking Artifact

[ ] Does this change import from or depend on any existing lite-lms module 
    in a way that would break if that module changes?
    → NO:  Safe to proceed
    → YES: Document the dependency in the Artifact and propose decoupling
```

## Blocking Artifact Template
When a proposed change would touch an existing file, raise this Artifact 
before doing anything:

```
⛔ INTEGRATION GUARD — BLOCKED

Proposed change: [describe what was about to happen]
Existing file affected: [exact file path]
Reason this file needs changing: [explain why]

Options:
  A) [Alternative approach that avoids touching the existing file]
  B) [Minimal surgical change — show exact line(s) that would be added]
  C) Proceed with modification (requires your explicit approval)

Awaiting your decision before proceeding.
```

## Pre-Commit Verification
Before every `git commit`, run:
1. `git diff --name-only HEAD` — list all changed files
2. Cross-check every file against the known list of NEW files for this branch
3. If ANY existing lite-lms file appears in the diff unexpectedly, 
   do NOT commit — raise a blocking Artifact immediately
4. Run: `npm run lint && npm run type-check && npm run build`
5. Only commit if all checks pass and no existing files were modified

## Known Exception — Activities Tab Entry Point
The one anticipated modification to an existing file is adding the 
"Activities" tab link to the course navigation. When this is reached:
- Identify the exact file and the exact lines to add
- Present as a surgical diff Artifact
- Wait for explicit approval before applying
- After applying, run the full pre-commit verification above

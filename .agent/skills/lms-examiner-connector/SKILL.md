---
name: lms-examiner-connector
description: >
  Use this skill for anything related to calling the jaxtina-ielts-examiner 
  API from lite-lms — including building the submit API route, handling 
  examiner responses, error handling, retry logic, and storing results back 
  into activity_submissions. Also use when the examiner API contract needs 
  to be read or updated.
---

# lite-lms — Examiner API Connector

## Goal
Implement a robust, fault-tolerant connection between lite-lms Activities and 
the deployed jaxtina-ielts-examiner scoring API. The examiner is an external 
HTTP service — never import its code directly.

## API Contract Reference
Read `.agent/skills/lms-examiner-connector/references/examiner_api_contract.md`
for the confirmed request/response schema.

If this file is empty:
1. Clone `jaxtina-ielts-examiner` to `../ielts-examiner-ref/`
2. Read `app/api/task1/route.ts` and `app/api/analyze/route.ts` in full
3. Extract and document the request payload and response JSON schema for both
4. Write the findings to the reference file as an Artifact for my approval
5. Do NOT build the connector until the contract is confirmed

## Environment Variables Required
```
IELTS_EXAMINER_API_URL=        # Base URL of deployed examiner (no trailing slash)
IELTS_EXAMINER_API_SECRET=     # Shared secret for service-to-service auth
```
Never hardcode these. Surface them as a required env vars Artifact if not found 
in the workspace.

## Submit Flow (app/api/activities/[id]/submit/route.ts)

```typescript
// Pseudocode — implement in strict TypeScript
1. Authenticate the request — verify the calling user is enrolled in the course
2. Validate essay text: check word count meets minimum for task type
3. Set activity_submissions.status = 'scoring' (optimistic update)
4. Build examiner payload from activity config_json + essay_text + student_id
5. POST to ${IELTS_EXAMINER_API_URL}/api/[task1|analyze] with payload
   - Set timeout: 30 seconds
   - Include Authorization: Bearer ${IELTS_EXAMINER_API_SECRET}
6. On success:
   - Parse response JSON against expected schema
   - Extract band_overall from response
   - Write full result to activity_submissions:
       examiner_result_json = full response
       band_overall = extracted score
       status = 'scored'
       scored_at = now()
7. On examiner API error or timeout:
   - Set status = 'error'
   - Log error details to examiner_payload_json for debugging
   - Return 502 to client with user-friendly message
8. Return submission ID to client for redirect to results page
```

## Error Handling Rules
- Timeout (>30s): set status 'error', return 504 to client
- Examiner returns non-200: set status 'error', log raw response, return 502
- Invalid response schema: set status 'error', log parse error, return 502
- Student not enrolled: return 403 immediately, do not call examiner
- Essay under word count: return 400 immediately, do not call examiner
- Never expose the IELTS_EXAMINER_API_SECRET in any client-side code or log

## Constraints
- All examiner calls are server-side only — never call from the browser
- The examiner URL must come from `process.env.IELTS_EXAMINER_API_URL`
- Always store the full raw examiner response in `examiner_result_json` 
  before parsing — preserves debuggability
- If the examiner API contract changes, update the reference file first 
  and raise a blocking Artifact before changing any connector code

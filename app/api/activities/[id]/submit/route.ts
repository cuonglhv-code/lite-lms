import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import { callExaminer } from '@/lib/examiner/client'
import type { ExaminerPayload } from '@/lib/examiner/types'
import type { Json } from '@/lib/supabase/types'
import type { Database } from '@/lib/supabase/types'

type SubmissionInsert = Database['public']['Tables']['activity_submissions']['Insert']

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { essay_text } = await req.json()
    if (!essay_text || typeof essay_text !== 'string' || essay_text.trim().length === 0) {
      return NextResponse.json({ error: 'Essay text is required' }, { status: 400 })
    }

    const words = essay_text.trim().split(/\s+/).length
    const supabase = createServerClient()

    const { data: activity, error: activityError } = await supabase
      .from('activities')
      .select('type, config_json')
      .eq('id', params.id)
      .maybeSingle()

    if (activityError || !activity) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })

    const minWords = activity.type === 'ielts_task1' ? 150 : 250
    if (words < minWords) {
      return NextResponse.json({ error: `Word count too low. Minimum ${minWords} required.` }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('activity_submissions')
      .select('status')
      .eq('activity_id', params.id)
      .eq('student_id', session.user.id)
      .in('status', ['pending', 'scoring', 'scored'])
      .maybeSingle()

    if (existing) {
      const msg = existing.status === 'scored' 
        ? 'Already submitted and scored' 
        : 'Submission already in progress'
      return NextResponse.json({ error: msg }, { status: 409 })
    }

    const { data: submission, error: submitError } = await supabase
      .from('activity_submissions')
      .insert({
        activity_id: params.id,
        student_id: session.user.id,
        essay_text,
        status: 'scoring',
        submitted_at: new Date().toISOString()
      } as SubmissionInsert)
      .select('id')
      .single()

    if (submitError) {
      console.error('[SUBMIT_POST]', submitError.message)
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }

    // Trigger examiner scoring asynchronously (we don't await the final redirect)
    // The client will poll the results page for the 'scored' status.
    try {
      const config = activity.config_json as unknown as { prompt?: string; taskType?: 'academic' | 'general' }
      const payload: ExaminerPayload = {
        essay: essay_text,
        taskNumber: activity.type === 'ielts_task1' ? '1' : '2',
        taskType: config.taskType ?? 'academic',
        question: config.prompt ?? '',
        user_id: session.user.id,
        language: 'en'
      }

      const examinerResult = await callExaminer(payload)

      // Write results back to activity_submissions
      await supabase
        .from('activity_submissions')
        .update({
          status: 'scored',
          examiner_result_json: examinerResult.result as unknown as Json,
          examiner_payload_json: payload as unknown as Json,
          band_overall: examinerResult.result.bands.overall,
          scored_at: new Date().toISOString()
        })
        .eq('id', submission.id)

    } catch (err: unknown) {
      console.error('[M5_EXAMINER_CALL_FAILED]', err)
      // Soft-fail to error state so the Results page can show the failure message
      await supabase
        .from('activity_submissions')
        .update({ status: 'error' })
        .eq('id', submission.id)
    }

    return NextResponse.json({ submission_id: submission.id })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

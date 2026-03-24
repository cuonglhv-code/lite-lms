import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
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
      .select('type')
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

    // TODO [M5]: Call jaxtina-ielts-examiner API here after insertion
    // POST ${process.env.IELTS_EXAMINER_API_URL}/api/[task1|analyze]
    // On result: update status='scored', write examiner_result_json, band_overall, scored_at

    return NextResponse.json({ submission_id: submission.id })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

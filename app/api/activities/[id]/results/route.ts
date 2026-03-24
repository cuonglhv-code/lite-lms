import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('activity_submissions')
    .select(`
        id,
        activity_id,
        student_id,
        status,
        essay_text,
        examiner_result_json,
        band_overall,
        submitted_at,
        scored_at
    `)
    .eq('activity_id', params.id)
    .eq('student_id', session.user.id)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (data.student_id !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(data)
}

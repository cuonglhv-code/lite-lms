import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { sql } from '@vercel/postgres'

// PATCH: grade a submission
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'teacher') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const { score, feedback, status } = await req.json()

    if (score === undefined || score === null) {
      return NextResponse.json({ error: 'score is required' }, { status: 400 })
    }

    const { rows } = await sql`
      UPDATE submissions
      SET
        grade = ${score},
        feedback_text = ${feedback ?? null},
        status = ${status ?? 'returned'},
        graded_at = NOW()
      WHERE id = ${params.id}
      RETURNING *`

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: rows[0] }, { status: 200 })
  } catch (error) {
    console.error('Grade submission error:', error)
    return NextResponse.json(
      { error: 'Failed to grade submission' },
      { status: 500 }
    )
  }
}

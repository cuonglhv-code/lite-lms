import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStudentByUserId, upsertSubmission } from '@/lib/db/queries'

// POST: turn in / resubmit an assignment
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'student') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const student = await getStudentByUserId(session.user.id)
  if (!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 })

  const { assignmentId } = await req.json()
  if (!assignmentId) return NextResponse.json({ error: 'assignmentId required' }, { status: 400 })

  const submission = await upsertSubmission(assignmentId, student.id)
  return NextResponse.json(submission, { status: 201 })
}

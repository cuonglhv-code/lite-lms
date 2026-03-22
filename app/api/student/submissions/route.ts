import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStudentByUserId, upsertSubmission, getAssignmentById } from '@/lib/db/queries'

// POST: turn in / resubmit an assignment
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'student') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const student = await getStudentByUserId(session.user.id)
  if (!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 })

  const { assignmentId, content, fileUrl } = await req.json()
  if (!assignmentId) return NextResponse.json({ error: 'assignmentId required' }, { status: 400 })

  // Fetch the assignment to check its type
  const assignment = await getAssignmentById(assignmentId)
  if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })

  // Validation: check if content/file is provided
  const hasContent = content && content.trim().length > 0
  const hasFile = fileUrl && fileUrl.length > 0

  // If assignment requires a file, validate that one is provided
  if (!hasContent && !hasFile) {
    return NextResponse.json(
      { error: 'Please attach a file or provide text before submitting' },
      { status: 400 }
    )
  }

  // If assignment is text-based, validate minimum word count (50 words)
  if (content && content.trim().length > 0) {
    const wordCount = content.trim().split(/\s+/).length
    if (wordCount < 50) {
      return NextResponse.json(
        { error: 'Your response is too short (minimum 50 words)' },
        { status: 400 }
      )
    }
  }

  try {
    const submission = await upsertSubmission(assignmentId, student.id)
    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 })
  }
}

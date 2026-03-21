import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/lib/auth'
import {
  getStudentByUserId,
  createDraftSubmission,
  createSubmissionFile,
  deleteSubmissionFile,
} from '@/lib/db/queries'

// POST: upload a file to Vercel Blob and attach to a submission
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'student') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const student = await getStudentByUserId(session.user.id)
  if (!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const assignmentId = formData.get('assignmentId') as string | null

  if (!file || !assignmentId) {
    return NextResponse.json({ error: 'file and assignmentId required' }, { status: 400 })
  }

  // Ensure a draft submission row exists before linking files
  const submission = await createDraftSubmission(assignmentId, student.id)

  // Upload to Vercel Blob
  const blob = await put(`submissions/${submission.id}/${file.name}`, file, { access: 'public' })

  // Persist file metadata
  const submissionFile = await createSubmissionFile({
    submission_id: submission.id,
    filename: file.name,
    mime_type: file.type || null,
    blob_url: blob.url,
  })

  return NextResponse.json({
    submissionFile,
    submissionId: submission.id,
    blobUrl: blob.url,
    filename: file.name,
    mimeType: file.type || null,
  }, { status: 201 })
}

// DELETE: remove a file from a submission (before turning in)
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'student') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { fileId, submissionId } = await req.json()
  if (!fileId || !submissionId) {
    return NextResponse.json({ error: 'fileId and submissionId required' }, { status: 400 })
  }

  await deleteSubmissionFile(fileId, submissionId)
  return NextResponse.json({ success: true })
}

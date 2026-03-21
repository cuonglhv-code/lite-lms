import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStudentByUserId, getAssignmentsWithSubmissions } from '@/lib/db/queries'

export async function GET(
  _req: NextRequest,
  { params }: { params: { classId: string } },
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'student') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const student = await getStudentByUserId(session.user.id)
  if (!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 })

  const assignments = await getAssignmentsWithSubmissions(params.classId, student.id)
  return NextResponse.json(assignments)
}

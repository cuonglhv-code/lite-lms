import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getStudentByUserId, getEnrolledClassesForStudent } from '@/lib/db/queries'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'student') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const student = await getStudentByUserId(session.user.id)
  if (!student) return NextResponse.json({ error: 'Student record not found' }, { status: 404 })

  const classes = await getEnrolledClassesForStudent(student.id)
  return NextResponse.json(classes)
}

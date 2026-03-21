import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllStudents, getStudentsByClass, createStudent, createEnrolment } from '@/lib/db/queries'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const classId = req.nextUrl.searchParams.get('classId')
  const students = classId ? await getStudentsByClass(classId) : await getAllStudents()
  return NextResponse.json(students)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const student = await createStudent(body)

  if (body.class_id) {
    await createEnrolment({ student_id: student.id, class_id: body.class_id, target_exam_date: body.target_exam_date })
  }

  return NextResponse.json(student, { status: 201 })
}

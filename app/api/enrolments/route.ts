import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createEnrolment } from '@/lib/db/queries'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { student_id, class_id, target_exam_date, notes } = body
    
    const enrolment = await createEnrolment({
      student_id,
      class_id,
      target_exam_date,
      notes
    })

    return NextResponse.json(enrolment, { status: 201 })
  } catch (error) {
    console.error('Failed to create enrolment:', error)
    return NextResponse.json({ error: 'Failed to create enrolment' }, { status: 500 })
  }
}

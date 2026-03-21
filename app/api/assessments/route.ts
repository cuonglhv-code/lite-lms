import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAssessmentsByClass, createAssessment } from '@/lib/db/queries'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const classId = req.nextUrl.searchParams.get('classId')
  if (!classId) return NextResponse.json({ error: 'classId required' }, { status: 400 })

  const assessments = await getAssessmentsByClass(classId)
  return NextResponse.json(assessments)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const assessment = await createAssessment(body)
  return NextResponse.json(assessment, { status: 201 })
}

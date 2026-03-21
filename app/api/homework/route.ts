import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getHomeworkByClass, createHomework, updateHomeworkStatus } from '@/lib/db/queries'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const classId = req.nextUrl.searchParams.get('classId')
  if (!classId) return NextResponse.json({ error: 'classId required' }, { status: 400 })

  const homework = await getHomeworkByClass(classId)
  return NextResponse.json(homework)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const hw = await createHomework(body)
  return NextResponse.json(hw, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await updateHomeworkStatus(body.id, body.status, body.score, body.teacher_comment)
  return NextResponse.json({ success: true })
}

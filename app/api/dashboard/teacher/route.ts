import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getTeacherDashboardData } from '@/lib/db/queries'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const classId   = searchParams.get('classId')
  const studentId = searchParams.get('studentId') ?? undefined

  if (!classId) return NextResponse.json({ error: 'classId required' }, { status: 400 })

  const data = await getTeacherDashboardData(classId, studentId)
  return NextResponse.json(data)
}

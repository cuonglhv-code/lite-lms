import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAttendanceByClass, upsertAttendance } from '@/lib/db/queries'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const classId     = req.nextUrl.searchParams.get('classId')
  const sessionDate = req.nextUrl.searchParams.get('date') ?? undefined
  if (!classId) return NextResponse.json({ error: 'classId required' }, { status: 400 })

  const attendance = await getAttendanceByClass(classId, sessionDate)
  return NextResponse.json(attendance)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  // body can be a single record or an array for bulk entry
  const records = Array.isArray(body) ? body : [body]
  await Promise.all(records.map(upsertAttendance))
  return NextResponse.json({ success: true })
}

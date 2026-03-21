import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getAllClasses, getClassesByTeacher, createClass } from '@/lib/db/queries'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const classes = session.user.role === 'manager'
    ? await getAllClasses()
    : await getClassesByTeacher(session.user.id)

  return NextResponse.json(classes)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const cls = await createClass(body)
  return NextResponse.json(cls, { status: 201 })
}

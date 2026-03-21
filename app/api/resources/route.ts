import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getResourcesByClass } from '@/lib/db/queries'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const classId = req.nextUrl.searchParams.get('classId')
  if (!classId) return NextResponse.json({ error: 'classId required' }, { status: 400 })

  const resources = await getResourcesByClass(classId)
  return NextResponse.json(resources)
}

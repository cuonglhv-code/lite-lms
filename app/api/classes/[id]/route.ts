import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getClassById } from '@/lib/db/queries'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cls = await getClassById(params.id)
  if (!cls) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(cls)
}

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getManagerDashboardData } from '@/lib/db/queries'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'manager') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const data = await getManagerDashboardData()
  return NextResponse.json(data)
}

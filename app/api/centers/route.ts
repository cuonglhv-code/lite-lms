import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const centers = await prisma.center.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(centers)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch centers' }, { status: 500 })
  }
}

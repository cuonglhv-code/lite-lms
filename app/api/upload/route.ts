import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/lib/auth'
import { createResource } from '@/lib/db/queries'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData  = await req.formData()
  const file      = formData.get('file') as File | null
  const classId   = formData.get('classId') as string
  const title     = formData.get('title') as string
  const resType   = formData.get('resource_type') as string | null

  if (!file || !classId || !title) {
    return NextResponse.json({ error: 'file, classId, and title are required' }, { status: 400 })
  }

  const blob = await put(file.name, file, { access: 'public' })

  const resource = await createResource({
    class_id:      classId,
    title,
    blob_url:      blob.url,
    resource_type: resType ?? file.type,
    uploaded_by:   session.user.id,
  })

  return NextResponse.json(resource, { status: 201 })
}

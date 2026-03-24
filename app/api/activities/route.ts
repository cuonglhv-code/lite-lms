import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type ActivityInsert = Database['public']['Tables']['activities']['Insert']

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')

  if (!courseId) {
    return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('course_id', courseId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[ACTIVITIES_GET]', error.message)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const role = session.user.role
  const isTeacher = role === 'teacher' || role === 'admin' || role === 'manager'

  if (!isTeacher) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { course_id, module_id, title, type, config_json } = body

    if (!course_id || !title || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('activities')
      .insert({
        course_id,
        module_id: module_id || null,
        title,
        type,
        config_json: config_json || {},
        created_by: session.user.id,
        updated_at: new Date().toISOString()
      } as ActivityInsert)
      .select()
      .single()

    if (error) {
      console.error('[ACTIVITIES_POST]', error.message)
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

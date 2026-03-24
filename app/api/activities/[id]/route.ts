import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type ActivityUpdate = Database['public']['Tables']['activities']['Update']

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('id', params.id)
    .is('deleted_at', null)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const role = session.user.role
  const isAdmin = role === 'admin' || role === 'manager'

  const supabase = createServerClient()
  
  const { data: current, error: fetchError } = await supabase
    .from('activities')
    .select('created_by')
    .eq('id', params.id)
    .maybeSingle()

  if (fetchError || !current) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  if (!isAdmin && current.created_by !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { title, config_json } = body

    const { data, error } = await supabase
      .from('activities')
      .update({
        title,
        config_json,
        updated_at: new Date().toISOString()
      } as ActivityUpdate)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('[ACTIVITY_PATCH]', error.message)
      return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const role = session.user.role
  const isAdmin = role === 'admin' || role === 'manager'
  const isTeacher = role === 'teacher' || isAdmin

  if (!isTeacher) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const supabase = createServerClient()
  
  const { data: current, error: fetchError } = await supabase
    .from('activities')
    .select('created_by')
    .eq('id', params.id)
    .maybeSingle()

  if (fetchError || !current) return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  if (!isAdmin && current.created_by !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { error } = await supabase
    .from('activities')
    .update({ deleted_at: new Date().toISOString() } as ActivityUpdate)
    .eq('id', params.id)

  if (error) {
    console.error('[ACTIVITY_DELETE]', error.message)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Activity archived' })
}

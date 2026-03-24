import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, PenLine, BarChart2 } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { getClassesByTeacher } from '@/lib/db/queries'

export default async function TeacherActivitiesPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const supabase = createServerClient()
  
  // 1. Fetch activities with submission aggregates
  const { data: activities, error: selectError } = await supabase
    .from('activities')
    .select(`
      *,
      activity_submissions (
        status,
        band_overall
      )
    `)
    .eq('created_by', session.user.id)
    .order('created_at', { ascending: false })

  if (selectError) {
    console.error('[TEACHER_ACTIVITIES_SELECT]', selectError)
  }

  // 2. Fetch teacher's classes for course context (lookup course names)
  const classes = await getClassesByTeacher(session.user.id)
  const courseMap: Record<string, string> = {}
  classes.forEach(c => {
    if (c.course_id) courseMap[c.course_id] = c.course_name || 'Unknown Course'
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">IELTS Writing Tasks</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Manage your custom tasks and view student progress</p>
        </div>
        <Link 
          href="/teacher/activities/create"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activities?.map((activity) => {
          type ActivitySubmission = {
            status: string
            band_overall: number | null
          }
          const subs = activity.activity_submissions as unknown as ActivitySubmission[] || []
          const total = subs.length
          const scored = subs.filter((s) => s.status === 'scored').length
          const pending = subs.filter((s) => s.status === 'scoring' || s.status === 'pending').length
          const errors = subs.filter((s) => s.status === 'error').length
          
          const avgBand = scored > 0 
            ? (subs.reduce((acc, s) => acc + (s.band_overall || 0), 0) / scored).toFixed(1)
            : '0.0'

          return (
            <div key={activity.id} className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[var(--color-text-primary)]">{activity.title}</h3>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                      {activity.type === 'ielts_task1' ? 'Task 1' : 'Task 2'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {courseMap[activity.course_id] || 'Legacy / General Task'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                   <Link 
                    href={`/teacher/activities/${activity.id}/submissions`}
                    className="text-xs font-bold text-[var(--color-primary)] hover:underline px-3 py-1.5 bg-[var(--color-primary)]/10 rounded-lg transition-colors"
                   >
                    View Submissions
                   </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6 pt-6 border-t border-[var(--color-surface-alt)]">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">Submissions</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[var(--color-text-primary)]">{total}</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-medium underline decoration-[var(--color-border)] decoration-2 underline-offset-4">total</span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">Avg Band</p>
                  <div className="flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-xl font-bold text-[var(--color-primary)]">{avgBand}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">Completion</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {scored} / {total} <span className="text-xs text-[var(--color-text-muted)] ml-1">scored</span>
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">Status</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {pending > 0 && <span>{pending} pending</span>}
                    {pending > 0 && errors > 0 && <span className="mx-1 text-[var(--color-border)]">|</span>}
                    {errors > 0 && <span className="text-[var(--color-error)]">{errors} failed</span>}
                    {pending === 0 && errors === 0 && <span className="text-[var(--color-success)] text-xs font-bold uppercase">All Scored</span>}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        {activities?.length === 0 && (
          <div className="bg-[var(--color-surface-alt)] rounded-xl border border-dashed border-[var(--color-border)] py-16 flex flex-col items-center text-center">
            <PenLine className="w-10 h-10 text-[var(--color-text-muted)] opacity-30 mb-4" />
            <p className="text-[var(--color-text-secondary)] font-medium">No IELTS activities created yet.</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 mb-4">Create your first task to start assessing student writing with AI.</p>
            <Link href="/teacher/activities/create" className="text-sm font-bold text-[var(--color-primary)] hover:underline">
               Get Started →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

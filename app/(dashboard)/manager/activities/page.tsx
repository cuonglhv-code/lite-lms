import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getAllTeachers, getAllClasses } from '@/lib/db/queries'
import Link from 'next/link'
import { BarChart3, TrendingUp, AlertTriangle, Users } from 'lucide-react'

type SubmissionAggregate = {
  status: string
  band_overall: number | null
}

type ActivityWithSubmissions = {
  id: string
  title: string
  type: string
  course_id: string
  created_by: string
  activity_submissions: SubmissionAggregate[]
}

export default async function ManagerActivitiesPage() {
  const session = await auth()
  const isAllowed = ['admin', 'manager'].includes(session?.user?.role || '')
  
  if (!session?.user || !isAllowed) {
    redirect('/dashboard')
  }

  const supabase = createServerClient()
  
  // 1. Fetch all activities with aggregated submission data
  const { data } = await supabase
    .from('activities')
    .select(`
      id,
      title,
      type,
      course_id,
      created_by,
      activity_submissions (
        status,
        band_overall
      )
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  const activities = (data as unknown) as ActivityWithSubmissions[] | null

  // 2. Fetch teachers and classes for name resolution
  const [teachers, classes] = await Promise.all([
    getAllTeachers(),
    getAllClasses()
  ])

  const teacherMap = new Map(teachers.map(t => [t.id, t.name]))
  const courseMap = new Map(classes.map(c => [c.course_id, c.course_name]))

  // 3. Global Stats Calculation
  const totalActivities = activities?.length || 0
  const allSubs: SubmissionAggregate[] = activities?.flatMap(a => a.activity_submissions) || []
  const totalSubs = allSubs.length
  const scoredSubs = allSubs.filter(s => s.status === 'scored')
  const avgGlobalBand = scoredSubs.length > 0 
    ? (scoredSubs.reduce((acc, s) => acc + (s.band_overall || 0), 0) / scoredSubs.length).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">IELTS Performance Hub</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Global oversight of writing tasks and automated scoring health</p>
        </div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Tasks', value: totalActivities, icon: BarChart3, color: 'text-[var(--color-primary)]' },
          { label: 'Total Submissions', value: totalSubs, icon: Users, color: 'text-[var(--color-text-secondary)]' },
          { label: 'Avg Global Band', value: avgGlobalBand, icon: TrendingUp, color: 'text-[var(--color-success)]' }
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--color-surface)] p-6 rounded-2xl border border-[var(--color-border)] shadow-sm">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">{stat.label}</span>
                <stat.icon className={`w-4 h-4 ${stat.color} opacity-60`} />
             </div>
             <p className="text-3xl font-black text-[var(--color-text-primary)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]/30">
           {/* TODO [M7]: Add client-side search filter — extract table to a 'use client' ManagerActivitiesTable component */}
           <div className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest pl-2">Task Activity Record</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
             <thead className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
                <tr className="text-left text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
                   <th className="px-6 py-4">Task & Course</th>
                   <th className="px-6 py-4">Author</th>
                   <th className="px-6 py-4 text-center">Attempts</th>
                   <th className="px-6 py-4 text-center">Avg. Band</th>
                   <th className="px-6 py-4">Status Distribution</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[var(--color-border)]">
                {activities?.map((activity) => {
                  const subs = activity.activity_submissions || []
                  const total = subs.length
                  const scored = subs.filter(s => s.status === 'scored').length
                  const errors = subs.filter(s => s.status === 'error').length
                  const avgBand = scored > 0 
                    ? (subs.reduce((acc, s) => acc + (s.band_overall || 0), 0) / scored).toFixed(1)
                    : '—'

                  return (
                    <tr key={activity.id} className="hover:bg-[var(--color-surface-alt)] transition-colors group">
                       <td className="px-6 py-4">
                          <div className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{activity.title}</div>
                          <div className="text-[10px] text-[var(--color-text-muted)] uppercase mt-0.5 font-medium">
                             {courseMap.get(activity.course_id) || 'General Curriculum'}
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded bg-[var(--color-surface-alt)] text-xs font-bold text-[var(--color-text-secondary)]">
                             {teacherMap.get(activity.created_by) || 'System'}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-center font-bold text-[var(--color-text-primary)]">
                          {total}
                       </td>
                       <td className="px-6 py-4 text-center">
                          <span className={`text-base font-black ${avgBand !== '—' ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] opacity-30'}`}>
                             {avgBand}
                          </span>
                       </td>
                       <td className="px-6 py-4 min-w-[140px]">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 flex-1 bg-[var(--color-surface-alt)] rounded-full overflow-hidden flex shadow-inner">
                               <div className="h-full bg-[var(--color-success)]" style={{ width: `${total > 0 ? (scored/total)*100 : 0}%` }} />
                               <div className="h-full bg-[var(--color-error)]" style={{ width: `${total > 0 ? (errors/total)*100 : 0}%` }} />
                            </div>
                            {errors > 0 && <AlertTriangle className="w-3.5 h-3.5 text-[var(--color-error)] animate-pulse" />}
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <Link 
                            href={`/teacher/activities/${activity.id}/submissions`}
                            className="px-4 py-1.5 rounded-lg bg-[var(--color-surface-alt)] text-[var(--color-primary)] font-bold text-xs hover:bg-[var(--color-primary)] hover:text-white transition-all whitespace-nowrap"
                          >
                             View Analytics
                          </Link>
                       </td>
                    </tr>
                  )
                })}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

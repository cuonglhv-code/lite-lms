import { auth } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { getStudentsByIds } from '@/lib/db/queries'
import { ActivityStatusBadge } from '@/components/activities/ActivityStatusBadge'
import Link from 'next/link'
import { ChevronLeft, Users, BarChart2, CheckCircle2, AlertCircle } from 'lucide-react'

export default async function ActivitySubmissionsPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const supabase = createServerClient()
  
  // 1. Fetch activity core data (Supabase)
  const { data: activity } = await supabase
    .from('activities')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!activity) notFound()

  // 2. Fetch all submissions (Supabase)
  const { data: submissions } = await supabase
    .from('activity_submissions')
    .select('*')
    .eq('activity_id', params.id)
    .order('submitted_at', { ascending: false })

  // 3. Resolve student names using Neon (Postgres)
  const studentIds = Array.from(new Set(submissions?.map(s => s.student_id) || []))
  const students = await getStudentsByIds(studentIds)
  const studentMap = new Map(students.map(s => [s.id, s.name]))

  // Aggregate stats
  const total = submissions?.length || 0
  const scored = submissions?.filter(s => s.status === 'scored').length || 0
  const scoring = submissions?.filter(s => s.status === 'scoring' || s.status === 'pending').length || 0
  const errors = submissions?.filter(s => s.status === 'error').length || 0
  const scoredSubs = submissions?.filter(s => s.status === 'scored') || []
  const avgBand = scored > 0 
    ? (scoredSubs.reduce((acc, s) => acc + (s.band_overall || 0), 0) / scored).toFixed(1)
    : '0.0'

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2">
        <Link 
          href="/teacher/activities"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Tasks
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{activity.title}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
                 {activity.type === 'ielts_task1' ? 'Task 1' : 'Task 2'}
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Reviewing submissions for this writing assignment</p>
          </div>
        </div>
      </header>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: total, icon: Users, color: 'text-[var(--color-text-primary)]' },
          { label: 'Scored', value: scored, icon: CheckCircle2, color: 'text-[var(--color-success)]' },
          { label: 'In Progress', value: scoring, icon: BarChart2, color: 'text-[var(--color-primary)]', pulse: scoring > 0 },
          { label: 'Avg Band', value: avgBand, icon: BarChart2, color: 'text-[var(--color-primary)]' },
          { label: 'Errors', value: errors, icon: AlertCircle, color: 'text-[var(--color-error)]' }
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] shadow-sm">
             <p className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider mb-2">{stat.label}</p>
             <div className="flex items-center gap-2">
                <stat.icon className={`w-4 h-4 ${stat.color} ${stat.pulse ? 'animate-pulse' : ''}`} />
                <span className="text-xl font-bold text-[var(--color-text-primary)]">{stat.value}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface-alt)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
             <thead className="bg-[var(--color-surface-alt)] border-b border-[var(--color-border)]">
                <tr className="text-left text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">
                   <th className="px-6 py-4">Student</th>
                   <th className="px-6 py-4">Submitted At</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Band</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-surface)]">
                {submissions?.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[var(--color-surface-alt)] transition-colors">
                     <td className="px-6 py-4 font-bold text-[var(--color-text-primary)]">
                        {studentMap.get(sub.student_id) || 'Unknown Student'}
                     </td>
                     <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                        {sub.submitted_at 
                          ? new Date(sub.submitted_at).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                          : '—'}
                     </td>
                     <td className="px-6 py-4">
                        <ActivityStatusBadge status={sub.status} />
                     </td>
                     <td className="px-6 py-4">
                        {sub.status === 'scored' ? (
                          <span className="text-lg font-bold text-[var(--color-primary)] tabular-nums">{sub.band_overall?.toFixed(1)}</span>
                        ) : (
                          <span className="text-[var(--color-text-muted)] opacity-50">—</span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/courses/${activity.course_id}/activities/${activity.id}/results?studentId=${sub.student_id}`}
                          className="px-4 py-1.5 bg-[var(--color-primary)] text-white rounded-lg text-xs font-bold hover:bg-[var(--color-primary-hover)] transition-all inline-block shadow-sm"
                        >
                           Review
                        </Link>
                     </td>
                  </tr>
                ))}
                {(!submissions || submissions.length === 0) && (
                  <tr>
                     <td colSpan={5} className="py-24 text-center">
                        <Users className="w-12 h-12 text-[var(--color-text-muted)] opacity-20 mx-auto mb-4" />
                        <h3 className="text-[var(--color-text-primary)] font-bold">No submissions yet</h3>
                        <p className="text-[var(--color-text-secondary)] text-xs mt-1">Once students start completing this task, they will appear here.</p>
                     </td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

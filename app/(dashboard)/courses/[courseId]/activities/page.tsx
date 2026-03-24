import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import { ActivityCard } from '@/components/activities/ActivityCard'
import { redirect } from 'next/navigation'
import type { Database } from '@/lib/supabase/types'
import { Inbox } from 'lucide-react'

type Activity = Database['public']['Tables']['activities']['Row']

export default async function ActivitiesPage({ 
  params 
}: { 
  params: { courseId: string } 
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const supabase = createServerClient()
  
  // 1. Fetch activities for this course
  const { data: activities, error: actError } = await supabase
    .from('activities')
    .select('*')
    .eq('course_id', params.courseId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  // 2. Fetch submissions for this student across these activities
  const { data: submissions } = await supabase
    .from('activity_submissions')
    .select('activity_id, status')
    .eq('student_id', session.user.id)
    .is('deleted_at', null)

  if (actError) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold bg-red-50 rounded-lg">
        Error loading activities. Please try again.
      </div>
    )
  }

  // 3. Map status to activities
  const submissionMap = new Map((submissions || []).map(s => [s.activity_id, s.status]))

  return (
    <div className="page-container py-8 max-w-4xl">
      <div className="flex flex-col gap-2 mb-8 border-b-2 border-surface-alt pb-4">
        <h1 className="text-3xl font-bold text-heading">Writing Activities</h1>
        <p className="text-text-secondary font-medium">
          {activities?.length || 0} tasks assigned to this course.
        </p>
      </div>

      {activities?.length === 0 ? (
        <div className="card-lg py-20 flex flex-col items-center justify-center text-center gap-4 bg-white border-2 border-dashed border-gray-100">
          <div className="w-16 h-16 bg-surface-alt rounded-full flex items-center justify-center border-2 border-white shadow-sm">
             <Inbox className="w-8 h-8 text-text-muted opacity-40" />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-text-primary">No activities yet</h2>
            <p className="text-text-muted font-medium max-w-sm">
              Your teacher has not assigned any IELTS writing tasks for this course yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activities?.map((activity: Activity) => (
            <ActivityCard
              key={activity.id}
              id={activity.id}
              courseId={params.courseId}
              title={activity.title}
              type={activity.type}
              status={submissionMap.get(activity.id) || 'not_started'}
              minWords={activity.type === 'ielts_task1' ? 150 : 250}
            />
          ))}
        </div>
      )}
    </div>
  )
}

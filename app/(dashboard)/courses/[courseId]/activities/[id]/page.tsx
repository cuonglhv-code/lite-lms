import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { TaskPromptDisplay } from '@/components/activities/TaskPromptDisplay'
import { WritingArea } from './WritingArea'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

type ActivityConfig = {
  prompt?: string
  has_image?: boolean
}

export default async function ActivitySubmissionPage({ 
  params 
}: { 
  params: { courseId: string; id: string } 
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const supabase = createServerClient()
  
  // 1. Fetch activity and check for existing submission
  // subRes query removed .is('deleted_at', null) per user instruction
  const [actRes, subRes] = await Promise.all([
    supabase.from('activities').select('*').eq('id', params.id).eq('course_id', params.courseId).is('deleted_at', null).maybeSingle(),
    supabase.from('activity_submissions').select('id, status').eq('activity_id', params.id).eq('student_id', session.user.id).maybeSingle()
  ])

  if (!actRes.data) return notFound()
  
  // 2. Redirect if already scored or scoring
  if (subRes.data?.status === 'scored' || subRes.data?.status === 'scoring') {
    redirect(`/courses/${params.courseId}/activities/${params.id}/results`)
  }

  const config = actRes.data.config_json as ActivityConfig
  const minWords = actRes.data.type === 'ielts_task1' ? 150 : 250

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white">
      {/* Header bar */}
      <header className="h-16 border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
        <Link 
          href={`/student/class/${params.courseId}`} // Note: Using courseId as classId link helper for now
          className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Course
        </Link>
        <div className="text-center">
          <span className="text-xs uppercase tracking-widest text-text-muted font-bold">
            {actRes.data.type.replace('_', ' ')}
          </span>
          <h1 className="text-sm font-bold text-text-primary">{actRes.data.title}</h1>
        </div>
        <div className="w-24" /> {/* Spacer */}
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Sidebar: Task Prompt */}
        <aside className="w-full lg:w-[450px] border-r border-gray-200 bg-surface-alt overflow-y-auto p-8 shrink-0">
          <TaskPromptDisplay 
            title={actRes.data.title}
            prompt={config?.prompt ?? ''}
            hasImage={config?.has_image}
          />
          <div className="mt-8 p-5 bg-white rounded-xl border border-color-border shadow-sm">
            <h4 className="text-sm font-bold text-text-primary mb-3">Task Requirements</h4>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">•</span>
                Minimum {minWords} words required.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">•</span>
                Write in academic English style.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand font-bold">•</span>
                Check your grammar and spelling before submitting.
              </li>
            </ul>
          </div>
        </aside>

        {/* Main: Writing Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <WritingArea 
            activityId={params.id}
            courseId={params.courseId}
            minWords={minWords}
          />
        </main>
      </div>
    </div>
  )
}

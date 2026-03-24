import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ActivityStatusBadge } from '@/components/activities/ActivityStatusBadge'
import { ScoringPoller } from './ScoringPoller'

type ExaminerResult = {
  feedback?: { summary?: string; detailed?: string }
  scores?: Record<string, number>
}

export default async function ResultsPage({ 
  params 
}: { 
  params: { courseId: string; id: string } 
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('activity_submissions')
    .select('*')
    .eq('activity_id', params.id)
    .eq('student_id', session.user.id)
    .maybeSingle()

  if (error || !data) return notFound()

  const isScoring = data.status === 'scoring' || data.status === 'pending'
  const isError = data.status === 'error'
  const result = data.examiner_result_json as ExaminerResult | null

  return (
    <div className="page-container py-10 max-w-4xl">
      <header className="mb-8">
        <Link 
          href={`/courses/${params.courseId}/activities`} 
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-[var(--color-primary)] mb-4 font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Tasks
        </Link>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Task Results</h1>
          <ActivityStatusBadge status={data.status} />
        </div>
      </header>

      {isScoring ? (
        <div className="card-lg py-16 flex flex-col items-center text-center gap-6">
          <ScoringPoller />
          <RefreshCw className="w-12 h-12 text-[var(--color-primary)] animate-spin" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary">Your essay is being scored</h2>
            <p className="text-text-secondary max-w-sm">
              Our AI examiner is currently evaluating your writing. This usually takes 30-60 seconds.
              The page will update automatically.
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="card-lg py-16 flex flex-col items-center text-center gap-6 border-red-100 bg-red-50/30">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-red-700">Scoring failed</h2>
            <p className="text-red-600 max-w-sm">
              We encountered an error while analyzing your essay. Please try submitting again or contact support.
            </p>
          </div>
          <Link href={`/courses/${params.courseId}/activities/${params.id}`} className="btn-primary px-8 flex items-center justify-center">
            Try Again
          </Link>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in duration-700">
          {/* Main Score Card */}
          <div className="bg-[var(--color-primary)] text-white rounded-2xl p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <p className="text-white/70 uppercase tracking-widest text-xs font-bold mb-2">Overall Band Score</p>
              <h2 className="text-7xl font-black">{data.band_overall?.toFixed(1) || '0.0'}</h2>
            </div>
            <div className="relative z-10 flex-1 max-w-md italic text-white/90 leading-relaxed text-xl border-l-2 border-white/20 pl-6">
              &quot;{result?.feedback?.summary || 'Great effort! Your writing shows a good grasp of the task requirements.'}&quot;
            </div>
          </div>

          {/* Detailed Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Task Response', key: 'task_response' },
              { label: 'Coherence', key: 'coherence' },
              { label: 'Lexical Resource', key: 'lexical_resource' },
              { label: 'Grammar', key: 'grammar_accuracy' }
            ].map((crit) => (
              <div key={crit.label} className="card p-6 flex flex-col gap-2 items-center text-center border-none shadow-sm hover:shadow-md transition-shadow">
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">{crit.label}</span>
                <span className="text-2xl font-black text-[var(--color-primary)]">
                  {(result?.scores?.[crit.key] || 0).toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          {/* Full Feedback Content */}
          <div className="card-lg lg:p-12 space-y-8 bg-white border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-text-primary flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-[var(--color-success)]" />
              Detailed Examiner Feedback
            </h3>
            <div className="text-lg text-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
              {result?.feedback?.detailed || 'Processing detailed feedback...'}
            </div>
          </div>

          <div className="flex justify-center pt-8">
            <Link 
              href={`/student/class/${params.courseId}`} // Link back to assignments view
              className="text-sm font-bold text-[var(--color-primary)] hover:underline"
            >
              ← Return to Course Overview
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

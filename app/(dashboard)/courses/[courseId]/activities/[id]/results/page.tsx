import { auth } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, RefreshCw, AlertTriangle } from 'lucide-react'
import { ActivityStatusBadge } from '@/components/activities/ActivityStatusBadge'
import { ScoringPoller } from './ScoringPoller'
import type { ExaminerResult } from '@/lib/examiner/types'

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
  const result = data.examiner_result_json as ExaminerResult['result'] | null

  return (
    <div className="page-container py-10 max-w-4xl">
      <header className="mb-8 font-sans">
        <Link 
          href={`/courses/${params.courseId}/activities`} 
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-[var(--color-primary)] mb-4 font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Writing Tasks
        </Link>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Your Feedback</h1>
          <ActivityStatusBadge status={data.status} />
        </div>
      </header>

      {isScoring ? (
        <div className="card-lg py-20 flex flex-col items-center text-center gap-6 shadow-sm">
          <ScoringPoller />
          <RefreshCw className="w-12 h-12 text-[var(--color-primary)] animate-spin" />
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary font-sans">Assessment in progress...</h2>
            <p className="text-text-secondary max-w-sm">
              Claude is analyzing your grammar, vocabulary, and task response. This usually takes less than a minute.
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="card-lg py-16 flex flex-col items-center text-center gap-6 border-red-200 bg-red-50/50 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <div className="space-y-2 font-sans">
            <h2 className="text-xl font-bold text-red-800">Scoring encountered an issue</h2>
            <p className="text-red-700 max-w-sm">
              We couldn&apos;t complete the AI analysis for this submission. Please try again or contact your teacher.
            </p>
          </div>
          <Link href={`/courses/${params.courseId}/activities/${params.id}`} className="px-10 py-3 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700 transition-all">
            Restart Task
          </Link>
        </div>
      ) : (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Hero Score Card */}
          <div className="bg-[var(--color-primary)] text-white rounded-3xl p-10 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />
            <div className="relative z-10 text-center md:text-left">
              <p className="text-white/60 uppercase tracking-[0.2em] text-[10px] font-black mb-4">IELTS BAND SCORE</p>
              <h2 className="text-8xl font-black leading-none">{data.band_overall?.toFixed(1) || '0.0'}</h2>
            </div>
            <div className="relative z-10 flex-1 max-w-md italic text-white/90 leading-relaxed text-xl border-l-[3px] border-white/20 pl-8 font-medium">
              &quot;{result?.overallComment || 'Your essay is complete. Review the specific criteria below for detailed feedback.'}&quot;
            </div>
          </div>

          {/* Criteria Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Task Response', icon: '📝', key: 'ta' },
              { label: 'Coherence', icon: '🔗', key: 'cc' },
              { label: 'Vocabulary', icon: '📚', key: 'lr' },
              { label: 'Grammar', icon: '⚡', key: 'gra' }
            ].map((crit) => (
              <div key={crit.label} className="bg-white rounded-2xl p-6 flex flex-col items-center text-center border border-gray-100 shadow-sm hover:translate-y-[-4px] transition-all">
                <span className="text-2xl mb-3">{crit.icon}</span>
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-2">{crit.label}</span>
                <span className="text-3xl font-black text-[var(--color-primary)]">
                  {(result?.feedback?.[crit.key as keyof typeof result.feedback]?.score || 0).toFixed(1)}
                </span>
              </div>
            ))}
          </div>

          {/* Detailed Feedbacks */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-text-primary px-2 font-sans">Diagnostic Breakdown</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { label: 'Task Achievement/Response', key: 'ta' },
                { label: 'Coherence & Cohesion', key: 'cc' },
                { label: 'Lexical Resource', key: 'lr' },
                { label: 'Grammar Accuracy', key: 'gra' }
              ].map((c) => {
                const fb = result?.feedback?.[c.key as keyof typeof result.feedback]
                return (
                  <div key={c.key} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                      <h4 className="font-bold text-text-primary text-sm uppercase tracking-wide">{c.label}</h4>
                      <span className="bg-[var(--color-surface-alt)] text-[var(--color-primary)] font-black px-3 py-1 rounded-full text-xs">
                        Band {fb?.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-[var(--color-success)] uppercase mb-1">Strengths</p>
                        <p className="text-sm text-text-secondary leading-relaxed">{fb?.wellDone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[var(--color-warning)] uppercase mb-1">Area for Improvement</p>
                        <p className="text-sm text-text-secondary leading-relaxed">{fb?.improvement}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actionable Tips */}
          {result?.tips && result.tips.length > 0 && (
            <div className="bg-[var(--color-surface-alt)] rounded-3xl p-10 border border-[var(--color-border)] shadow-inner">
               <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)] text-white text-lg">💡</span>
                  Focus Areas for Next Band
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {result.tips.map((tip, i) => (
                   <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group">
                      <span className="text-[var(--color-primary)] font-black text-xl opacity-20 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                      <p className="text-sm text-text-primary font-medium leading-relaxed">{tip}</p>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

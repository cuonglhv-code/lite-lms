'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Save, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface CourseOption {
  id: string
  name: string
}

export function CreateActivityForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [courses, setCourses] = useState<CourseOption[]>([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    type: 'ielts_task2' as 'ielts_task1' | 'ielts_task2',
    prompt: '',
    course_id: '',
    taskType: 'academic' as 'academic' | 'general',
    has_image: false
  })

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/classes')
        if (!res.ok) throw new Error('Failed to load courses')
        const classes = await res.json()
        
        interface ClassResponse {
          course_id: string
          course_name: string
        }
        const uniqueCourses: CourseOption[] = []
        const seen = new Set()
        
        classes.forEach((c: ClassResponse) => {
          if (c.course_id && !seen.has(c.course_id)) {
            seen.add(c.course_id)
            uniqueCourses.push({ id: c.course_id, name: c.course_name || 'Unnamed Course' })
          }
        })

        setCourses(uniqueCourses)
        if (uniqueCourses.length > 0) setFormData(prev => ({ ...prev, course_id: uniqueCourses[0].id }))
      } catch (err) {
        console.error('Failed to load courses', err)
        setError('Could not load your courses. Please refresh the page.')
      } finally {
        setLoadingCourses(false)
      }
    }
    loadCourses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.prompt.trim().length < 50) {
      setError('Task prompt must be at least 50 characters to provide sufficient context for AI scoring.')
      return
    }
    
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          config_json: {
            prompt: formData.prompt,
            taskType: formData.taskType,
            has_image: formData.has_image
          }
        })
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to create activity')
      }
      
      const data = await res.json()
      router.push(`/teacher/activities/${data.id}/submissions`)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Submission failed. Please check your network and try again.'
      setError(msg)
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <Link 
          href="/teacher/activities" 
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Tasks
        </Link>
      </header>

      <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="p-8 space-y-8">
           <div className="space-y-4">
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">New Writing Task</h1>
              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Task Title</label>
                  <input 
                    required
                    placeholder="e.g. Cambridge 18 Test 1 Task 2"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all text-sm bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                    value={formData.title}
                    onChange={e => updateField('title', e.target.value)}
                  />
              </div>
           </div>

           <div className="space-y-5 pt-4 border-t border-[var(--color-surface-alt)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">IELTS Component</label>
                    <div className="flex bg-[var(--color-surface-alt)] p-1 rounded-xl border border-[var(--color-border)]">
                       {(['ielts_task1', 'ielts_task2'] as const).map(t => (
                         <button
                           key={t}
                           type="button"
                           onClick={() => updateField('type', t)}
                           className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                             formData.type === t 
                             ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm border border-[var(--color-border)]' 
                             : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                           }`}
                         >
                           {t === 'ielts_task1' ? 'Task 1' : 'Task 2'}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Exam Type</label>
                    <div className="flex bg-[var(--color-surface-alt)] p-1 rounded-xl border border-[var(--color-border)]">
                       {(['academic', 'general'] as const).map(t => (
                         <button
                           key={t}
                           type="button"
                           onClick={() => updateField('taskType', t)}
                           className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                             formData.taskType === t 
                             ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm border border-[var(--color-border)]' 
                             : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                           }`}
                         >
                           {t.charAt(0).toUpperCase() + t.slice(1)}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Target Course</label>
                 <select 
                   required
                   disabled={loadingCourses}
                   className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none bg-[var(--color-surface)] text-sm text-[var(--color-text-primary)] disabled:opacity-50"
                   value={formData.course_id}
                   onChange={e => updateField('course_id', e.target.value)}
                 >
                    {courses.length === 0 && !loadingCourses && <option value="">No active courses found</option>}
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                 </select>
              </div>

              {formData.type === 'ielts_task1' && (
                <div className="flex items-center gap-3 p-4 bg-[var(--color-primary)]/5 rounded-2xl border border-[var(--color-primary)]/10 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
                   <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">Requires Image Analysis?</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Check if student needs to analyze a chart, graph, or map.</p>
                   </div>
                   <input 
                    type="checkbox"
                    className="w-5 h-5 rounded-md border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    checked={formData.has_image}
                    onChange={e => updateField('has_image', e.target.checked)}
                   />
                </div>
              )}

              <div className="space-y-1.5 pt-2">
                 <label className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Task Prompt</label>
                 <textarea 
                   required
                   rows={6}
                   placeholder="Enter the full exam question prompt..."
                   className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all text-sm font-sans bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                   value={formData.prompt}
                   onChange={e => updateField('prompt', e.target.value)}
                 />
                 <div className="flex items-center justify-between">
                    <p className={`text-[10px] font-bold ${formData.prompt.length < 50 ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'}`}>
                      {formData.prompt.length} / 50 characters min
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)]">AI uses this prompt to contextualize scores.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="px-8 py-5 bg-[var(--color-surface-alt)] border-t border-[var(--color-border)] flex items-center justify-end gap-4">
           {error && (
             <div className="flex items-center gap-2 text-sm text-[var(--color-error)] mr-auto font-medium animate-in fade-in transition-all">
                <AlertCircle className="w-4 h-4" />
                {error}
             </div>
           )}
           <button 
             disabled={isSubmitting}
             type="submit"
             className="flex items-center gap-2 px-8 py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-all shadow-md disabled:opacity-50"
           >
             {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             Create Task
           </button>
        </div>
      </form>
    </div>
  )
}

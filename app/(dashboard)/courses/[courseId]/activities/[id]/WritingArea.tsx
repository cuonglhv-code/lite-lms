'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WordCounter } from '@/components/activities/WordCounter'
import { Loader2, AlertCircle } from 'lucide-react'

interface Props {
  activityId: string
  courseId: string
  minWords: number
}

export function WritingArea({ activityId, courseId, minWords }: Props) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const isReady = wordCount >= minWords

  async function handleSubmit() {
    if (!isReady || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    
    try {
      const res = await fetch(`/api/activities/${activityId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ essay_text: text }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Submission failed')
      }
      
      router.push(`/courses/${courseId}/activities/${activityId}/results?status=scoring`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Editor area */}
      <div className="flex-1 p-10 overflow-y-auto">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (error) setError(null)
          }}
          placeholder="Type your response here..."
          className="w-full h-full text-lg leading-relaxed text-text-primary placeholder-text-muted border-none focus:ring-0 resize-none font-sans"
          disabled={isSubmitting}
        />
      </div>

      {/* Footer bar */}
      <div className="h-20 border-t border-gray-100 flex items-center justify-between px-10 bg-white shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-6">
          <WordCounter current={wordCount} target={minWords} />
          
          {error && (
            <div className="flex items-center gap-2 text-color-error text-sm font-medium animate-in fade-in slide-in-from-left-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!isReady || isSubmitting}
          className={`px-10 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
            isReady && !isSubmitting
              ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-md'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit for AI Scoring'
          )}
        </button>
      </div>
    </div>
  )
}

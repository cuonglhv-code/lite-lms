import type { Submission } from '@/lib/types'
import { MessageSquare } from 'lucide-react'
import GradeBadge from './GradeBadge'

interface Props {
  submission: Submission | null
  maxPoints: number
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function FeedbackPanel({ submission, maxPoints }: Props) {
  if (!submission || submission.status !== 'returned') return null

  return (
    <div className="bg-white rounded-xl border border-green-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-green-600" />
          Teacher feedback
        </h3>
        <GradeBadge grade={submission.grade} maxPoints={maxPoints} />
      </div>

      {submission.feedback_text ? (
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-green-50 rounded-lg p-3 border border-green-100">
          {submission.feedback_text}
        </p>
      ) : (
        <p className="text-sm text-gray-400 italic">No written feedback provided.</p>
      )}

      <p className="text-xs text-gray-400">
        Returned {formatDate(submission.returned_at)}
      </p>
    </div>
  )
}

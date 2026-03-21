import Link from 'next/link'
import type { AssignmentWithSubmission } from '@/lib/types'
import StatusBadge from './StatusBadge'
import GradeBadge from './GradeBadge'
import { Calendar } from 'lucide-react'

interface Props {
  assignment: AssignmentWithSubmission
  classId: string
}

function relativeDue(iso: string | null): { label: string; color: string } {
  if (!iso) return { label: 'No due date', color: 'text-gray-400' }
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  if (diff < 0) return { label: `${Math.abs(diff)}d late`, color: 'text-red-500' }
  if (diff === 0) return { label: 'Due today', color: 'text-red-500' }
  if (diff <= 3) return { label: `Due in ${diff}d`, color: 'text-amber-500' }
  return { label: `Due in ${diff}d`, color: 'text-gray-500' }
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function AssignmentCard({ assignment, classId }: Props) {
  const due = relativeDue(assignment.due_at)
  const status = assignment.submission?.status ?? 'not_submitted'

  return (
    <Link
      href={`/student/class/${classId}/assignment/${assignment.id}`}
      className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-4 hover:border-indigo-200 hover:shadow-sm transition-all group"
    >
      {/* Status dot */}
      <div className={`w-2 h-2 rounded-full shrink-0 ${
        status === 'returned'    ? 'bg-green-500' :
        status === 'submitted'   ? 'bg-blue-500' :
        'bg-gray-300'
      }`} />

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
          {assignment.title}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className={`flex items-center gap-1 text-xs ${due.color}`}>
            <Calendar className="w-3 h-3" />
            {formatDate(assignment.due_at)} · {due.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {status === 'returned' && assignment.submission?.grade !== null && (
          <GradeBadge grade={assignment.submission!.grade} maxPoints={Number(assignment.max_points)} />
        )}
        <StatusBadge status={status} />
      </div>
    </Link>
  )
}

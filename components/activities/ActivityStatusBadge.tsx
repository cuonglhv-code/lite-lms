import { clsx } from 'clsx'
import type { Database } from '@/lib/supabase/types'

type SubmissionStatus = Database['public']['Tables']['activity_submissions']['Row']['status']
export type ActivityStatus = SubmissionStatus | 'not_started'

interface Props {
  status: ActivityStatus
  className?: string
}

export const ActivityStatusBadge = ({ status, className }: Props) => {
  const styles: Record<ActivityStatus, string> = {
    not_started: 'badge-grey',
    pending: 'badge-grey',
    scoring: 'badge-blue',
    scored: 'badge-green',
    error: 'badge-red'
  }

  const labels: Record<ActivityStatus, string> = {
    not_started: 'Not Started',
    pending: 'Pending',
    scoring: 'Scoring...',
    scored: 'Completed',
    error: 'Error'
  }

  return (
    <span className={clsx(styles[status], 'relative flex items-center gap-2', className)}>
      {status === 'scoring' && (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      )}
      {labels[status]}
    </span>
  )
}

import type { SubmissionStatus } from '@/lib/types'

interface Props {
  status: SubmissionStatus
}

const CONFIG: Record<SubmissionStatus, { label: string; className: string }> = {
  not_submitted: {
    label: 'Not submitted',
    className: 'bg-gray-100 text-gray-600',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-blue-100 text-blue-700',
  },
  returned: {
    label: 'Returned',
    className: 'bg-green-100 text-green-700',
  },
}

export default function StatusBadge({ status }: Props) {
  const { label, className } = CONFIG[status]
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${className}`}>
      {label}
    </span>
  )
}

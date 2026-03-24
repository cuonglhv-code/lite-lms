import Link from 'next/link'
import { clsx } from 'clsx'
import { ActivityStatusBadge, type ActivityStatus } from './ActivityStatusBadge'

interface Props {
  id: string
  courseId: string
  title: string
  type: 'ielts_task1' | 'ielts_task2'
  status: ActivityStatus
  minWords: number
}

export const ActivityCard = ({ id, courseId, title, type, status, minWords }: Props) => {
  const isScored = status === 'scored'
  
  return (
    <div className="card transition-std hover:shadow-card-hover hover:-translate-y-0.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={clsx(
            'chip uppercase tracking-wider font-bold',
            type === 'ielts_task1' ? 'text-blue-600 bg-blue-50' : 'text-indigo-600 bg-indigo-50'
          )}>
            {type.replace('_', ' ')}
          </span>
          <span className="text-xs text-muted-c font-medium italic">
            Min {minWords} words
          </span>
        </div>
        <h3 className="text-heading font-bold text-lg mt-1">{title}</h3>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
        <ActivityStatusBadge status={status} />
        <Link 
          href={`/courses/${courseId}/activities/${id}${isScored ? '/results' : ''}`}
          className={clsx(
            isScored ? 'btn-secondary' : 'btn-primary',
            'px-4 py-2 text-sm h-10 min-w-[120px] flex items-center justify-center'
          )}
        >
          {isScored ? 'View Results' : 'Start Task'}
        </Link>
      </div>
    </div>
  )
}

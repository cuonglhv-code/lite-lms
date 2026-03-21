import Link from 'next/link'
import { Star, CheckCircle2, ArrowRight } from 'lucide-react'
import type { DailyGoal } from '@/lib/dashboard-data'

interface Props {
  goals: DailyGoal[]
}

export default function TodayGoals({ goals }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Today&apos;s goals</h2>

      <ul className="space-y-3">
        {goals.map(goal => {
          const done = goal.current >= goal.target
          return (
            <li key={goal.id}>
              <div className="flex items-center gap-3 group">
                {done
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  : <Star className="w-5 h-5 text-indigo-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                }

                <span className={`text-sm flex-1 ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                  {goal.label}
                </span>

                {/* Progress pill */}
                <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 shrink-0
                  ${done
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                  }`}>
                  {goal.current}/{goal.target}
                </span>

                {/* Start button */}
                {!done && (
                  <Link
                    href={goal.href}
                    className="shrink-0 flex items-center gap-0.5 text-xs font-semibold text-indigo-600
                               hover:text-indigo-800 transition-colors"
                  >
                    Start <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Inline progress bar */}
              {goal.target > 1 && !done && (
                <div className="mt-1.5 ml-8 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

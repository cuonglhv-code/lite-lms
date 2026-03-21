import { Check } from 'lucide-react'
import type { WeekDay } from '@/lib/dashboard-data'

interface Props {
  days: WeekDay[]
}

export default function LearningPlan({ days }: Props) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">This week</h2>
        <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          Edit plan
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          let circleClass = ''
          let textClass = 'text-gray-400'
          let showCheck = false

          if (day.done) {
            circleClass = 'bg-indigo-600 border-indigo-600'
            textClass = 'text-indigo-700 font-semibold'
            showCheck = true
          } else if (day.goalSet) {
            circleClass = 'bg-gray-200 border-gray-200'
            textClass = 'text-gray-600 font-medium'
          } else {
            circleClass = 'bg-transparent border-dashed border-gray-300'
            textClass = 'text-gray-400'
          }

          return (
            <div
              key={day.label}
              className="flex flex-col items-center gap-1.5"
              title={day.fullLabel}
            >
              <span className={`text-xs ${textClass}`}>{day.label}</span>
              <div
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all
                  ${circleClass}
                  ${day.isToday ? 'ring-2 ring-offset-1 ring-indigo-400' : ''}
                `}
              >
                {showCheck
                  ? <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  : day.isToday
                    ? <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    : null
                }
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-indigo-600" />
          Done
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-200" />
          Planned
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-dashed border-gray-300" />
          No goal set
        </span>
      </div>
    </section>
  )
}

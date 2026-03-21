const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const DAY_LABELS = ['M','T','W','T','F','S','S']

interface Props {
  year: number
  month: number  // 1-12
  activityMap: Record<number, 0 | 1 | 2>
}

export default function HabitCalendar({ year, month, activityMap }: Props) {
  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month

  // First day of month: 0=Sun…6=Sat → convert to Mon-based: 0=Mon…6=Sun
  const firstDow = new Date(year, month - 1, 1).getDay()
  const startOffset = (firstDow + 6) % 7  // Mon-based offset
  const daysInMonth = new Date(year, month, 0).getDate()

  // Build calendar grid cells
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  function dayCellClass(day: number): string {
    const level = activityMap[day] ?? 0
    const isToday = isCurrentMonth && today.getDate() === day

    let base = 'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all '
    if (isToday) base += 'ring-2 ring-indigo-500 ring-offset-1 '

    if (level === 2) return base + 'bg-indigo-600 text-white'
    if (level === 1) return base + 'bg-indigo-200 text-indigo-800'
    return base + 'bg-gray-100 text-gray-400'
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        {MONTH_NAMES[month - 1]} {year}
      </h2>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="flex justify-center">
            <span className="text-xs text-gray-400 font-medium w-8 text-center">{d}</span>
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => (
          <div key={i} className="flex justify-center">
            {day !== null
              ? <div className={dayCellClass(day)}>{day}</div>
              : <div className="w-8 h-8" />
            }
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-1.5 text-xs text-gray-500">
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-gray-100" /> No activity
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-indigo-200" /> Some goals done
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded bg-indigo-600" /> All goals completed
        </span>
      </div>
    </div>
  )
}

// Activity tab: 3-month heatmap calendar, recent activity feed, 4-week stats

import {
  Video, Dumbbell, PenLine, BookOpen, Headphones, Trophy,
} from 'lucide-react'
import type { ActivityItem } from '@/lib/profile-data'

interface Props {
  activityCalendar: Record<string, 0 | 1 | 2>
  activityFeed: ActivityItem[]
}

// ── Heatmap ───────────────────────────────────────────────────

function toKey(date: Date): string {
  return date.toISOString().split('T')[0]
}

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_INITIALS = ['M','','W','','F','','S'] // only show M W F S to avoid clutter

function ActivityHeatmap({ calendar }: { calendar: Record<string, 0 | 1 | 2> }) {
  const today = new Date()

  // Build start: 91 days ago, aligned to Monday
  const start = new Date(today)
  start.setDate(start.getDate() - 90)
  const dow = start.getDay()
  start.setDate(start.getDate() - (dow === 0 ? 6 : dow - 1)) // Monday-align

  // Build week columns
  const weeks: Date[][] = []
  const cur = new Date(start)
  while (cur <= today) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }

  // Month label positions
  const monthLabels: { weekIndex: number; label: string }[] = []
  weeks.forEach((week, i) => {
    const first = week[0]
    if (first.getDate() <= 7) {
      monthLabels.push({ weekIndex: i, label: MONTH_SHORT[first.getMonth()] })
    }
  })

  function cellClass(date: Date): string {
    if (date > today) return 'bg-transparent'
    const level = calendar[toKey(date)] ?? 0
    const isToday = toKey(date) === toKey(today)
    const base = 'w-4 h-4 rounded-sm'
    const ring = isToday ? ' ring-2 ring-offset-1 ring-indigo-500' : ''
    if (level === 2) return `${base} bg-indigo-600${ring}`
    if (level === 1) return `${base} bg-indigo-200${ring}`
    return `${base} bg-gray-100${ring}`
  }

  return (
    <div className="overflow-x-auto pb-1">
      {/* Month labels */}
      <div className="flex gap-1 mb-1 pl-5">
        {weeks.map((_, wi) => {
          const ml = monthLabels.find(m => m.weekIndex === wi)
          return (
            <div key={wi} className="w-4 text-[10px] text-gray-400 text-center shrink-0">
              {ml ? ml.label : ''}
            </div>
          )
        })}
      </div>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 pr-1 shrink-0">
          {DAY_INITIALS.map((d, i) => (
            <div key={i} className="w-4 h-4 text-[10px] text-gray-400 flex items-center justify-end">{d}</div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1 shrink-0">
            {week.map((day, di) => (
              <div
                key={di}
                className={cellClass(day)}
                title={`${toKey(day)}: ${['No activity', 'Some goals', 'All goals done'][calendar[toKey(day)] ?? 0]}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-3.5 rounded-sm bg-gray-100" /> No activity</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-3.5 rounded-sm bg-indigo-200" /> Some goals</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-3.5 h-3.5 rounded-sm bg-indigo-600" /> All goals done</span>
      </div>
    </div>
  )
}

// ── Activity feed icons ────────────────────────────────────────

const FEED_ICONS: Record<ActivityItem['type'], React.ReactNode> = {
  video:       <Video       className="w-4 h-4 text-indigo-500" />,
  practice:    <Dumbbell    className="w-4 h-4 text-amber-500"  />,
  writing:     <PenLine     className="w-4 h-4 text-purple-500" />,
  reading:     <BookOpen    className="w-4 h-4 text-blue-500"   />,
  listening:   <Headphones  className="w-4 h-4 text-teal-500"   />,
  achievement: <Trophy      className="w-4 h-4 text-yellow-500" />,
}

// ── 4-week mini stats ─────────────────────────────────────────

function computeWeeklyStats(calendar: Record<string, 0 | 1 | 2>) {
  const today = new Date()
  const stats = Array.from({ length: 4 }, (_, weekIdx) => {
    let active = 0
    for (let d = 0; d < 7; d++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (weekIdx * 7) - d)
      if ((calendar[toKey(date)] ?? 0) > 0) active++
    }
    return { label: weekIdx === 0 ? 'This week' : `${weekIdx}w ago`, active }
  }).reverse()
  return stats
}

// ── Main component ─────────────────────────────────────────────

export default function ActivityTab({ activityCalendar, activityFeed }: Props) {
  const weeklyStats = computeWeeklyStats(activityCalendar)
  const maxActive = Math.max(...weeklyStats.map(w => w.active), 1)

  return (
    <div className="space-y-5">

      {/* Heatmap calendar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity — last 3 months</h3>
        <ActivityHeatmap calendar={activityCalendar} />
      </div>

      {/* 4-week summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Last 4 weeks</h3>
        <div className="grid grid-cols-4 gap-3">
          {weeklyStats.map(w => (
            <div key={w.label} className="flex flex-col items-center gap-1.5">
              <div className="w-full h-16 bg-gray-50 rounded-lg flex flex-col justify-end p-1 overflow-hidden">
                <div
                  className="w-full bg-indigo-400 rounded transition-all duration-500"
                  style={{ height: `${Math.round((w.active / maxActive) * 100)}%`, minHeight: w.active > 0 ? '8px' : '0' }}
                />
              </div>
              <p className="text-xs font-bold text-gray-700 tabular-nums">{w.active}<span className="font-normal text-gray-400">d</span></p>
              <p className="text-[10px] text-gray-400 text-center leading-tight">{w.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity feed */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent activity</h3>
        <ul className="space-y-1">
          {activityFeed.map(item => (
            <li key={item.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                {FEED_ICONS[item.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{item.label}</p>
                <p className="text-xs text-gray-400">
                  {item.duration ? `${item.duration} · ` : ''}{item.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  )
}

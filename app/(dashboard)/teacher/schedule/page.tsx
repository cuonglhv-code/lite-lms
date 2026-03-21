import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TEACHER_SCHEDULE } from '@/lib/teacher-data'

type SessionStatus = 'upcoming' | 'in-progress' | 'done' | 'missing-record'

function statusStyle(status: SessionStatus) {
  if (status === 'missing-record') return 'border-amber-400 bg-amber-50'
  if (status === 'done')           return 'border-green-400 bg-green-50'
  if (status === 'in-progress')    return 'border-indigo-500 bg-indigo-50'
  return 'border-gray-200 bg-white'
}

function statusBadge(status: SessionStatus) {
  if (status === 'missing-record') return <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">⚠ No Record</span>
  if (status === 'done')           return <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold">✓ Done</span>
  if (status === 'in-progress')    return <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-semibold">In Progress</span>
  return <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-semibold">Upcoming</span>
}

// Week days for display
const THIS_WEEK_DATES = ['2026-03-16', '2026-03-17', '2026-03-18', '2026-03-19', '2026-03-20', '2026-03-21', '2026-03-22']
const NEXT_WEEK_DATES = ['2026-03-23', '2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28', '2026-03-29']
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function SchedulePage() {
  const thisWeek = TEACHER_SCHEDULE.filter(s => THIS_WEEK_DATES.includes(s.date))
  const nextWeek = TEACHER_SCHEDULE.filter(s => NEXT_WEEK_DATES.includes(s.date))

  const thisWeekDone    = thisWeek.filter(s => s.status === 'done').length
  const thisWeekMissing = thisWeek.filter(s => s.status === 'missing-record').length
  const totalThisWeek   = thisWeek.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Schedule</h1>
        <p className="text-sm text-gray-500 mt-0.5">Week view · Mon 16 – Sun 22 March 2026</p>
      </div>

      {/* This week summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Sessions This Week',  value: totalThisWeek,   color: 'text-gray-800' },
          { label: 'Completed',           value: thisWeekDone,    color: 'text-green-600' },
          { label: 'Missing Record',      value: thisWeekMissing, color: thisWeekMissing > 0 ? 'text-amber-600' : 'text-gray-800' },
          { label: 'Next Week',           value: nextWeek.length, color: 'text-gray-800' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {thisWeekMissing > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700 flex items-center justify-between">
          <span>⚠ <strong>{thisWeekMissing} session{thisWeekMissing > 1 ? 's' : ''}</strong> missing attendance record this week</span>
          <Link href="/teacher/attendance" className="text-xs font-semibold text-amber-700 underline">Record Now</Link>
        </div>
      )}

      {/* This week timetable */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">This Week — Mon 16 to Sun 22 March</h2>
        <div className="grid grid-cols-7 gap-2">
          {THIS_WEEK_DATES.map((date, i) => {
            const daySessions = thisWeek.filter(s => s.date === date)
            const isToday     = date === '2026-03-21'
            return (
              <div key={date} className={cn('rounded-xl border p-2 min-h-[120px]', isToday ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-200 bg-white')}>
                <p className={cn('text-xs font-semibold mb-2 text-center', isToday ? 'text-indigo-600' : 'text-gray-400')}>
                  {DAY_LABELS[i]}
                  <br />
                  <span className="font-normal">{date.slice(8)}</span>
                  {isToday && <span className="block text-[9px] text-indigo-500">Today</span>}
                </p>
                <div className="space-y-1.5">
                  {daySessions.map(s => (
                    <div key={s.id} className={cn('rounded-lg border p-1.5 text-[10px] leading-tight', statusStyle(s.status))}>
                      <p className="font-bold text-gray-700 truncate">{s.classCode}</p>
                      <p className="text-gray-500">{s.startTime}</p>
                      <p className="mt-0.5">{statusBadge(s.status)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* This week session list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">This Week — Session Details</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {thisWeek.sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)).map(s => (
            <div key={s.id} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-700">{s.dayLabel} {s.date.slice(8)} · {s.startTime}–{s.endTime}</span>
                  {statusBadge(s.status)}
                </div>
                <p className="font-medium text-gray-800">{s.className}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.classCode} · {s.studentCount} students</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!s.attendanceRecorded && (
                  <Link href={`/teacher/attendance?classId=${s.classId}`}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap">
                    Take Attendance
                  </Link>
                )}
                <Link href={`/teacher/classes/${s.classId}`}
                  className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  View Class
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next week */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Next Week — Mon 23 to Sun 29 March</h2>
        <div className="grid grid-cols-7 gap-2">
          {NEXT_WEEK_DATES.map((date, i) => {
            const daySessions = nextWeek.filter(s => s.date === date)
            return (
              <div key={date} className="rounded-xl border border-gray-200 bg-white p-2 min-h-[120px]">
                <p className="text-xs font-semibold mb-2 text-center text-gray-400">
                  {DAY_LABELS[i]}<br /><span className="font-normal">{date.slice(8)}</span>
                </p>
                <div className="space-y-1.5">
                  {daySessions.map(s => (
                    <div key={s.id} className="rounded-lg border border-gray-200 bg-gray-50 p-1.5 text-[10px] leading-tight">
                      <p className="font-bold text-gray-600 truncate">{s.classCode}</p>
                      <p className="text-gray-400">{s.startTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

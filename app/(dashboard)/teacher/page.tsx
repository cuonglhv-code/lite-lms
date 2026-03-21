import Link from 'next/link'
import { TrendingUp, TrendingDown, ChevronRight, AlertCircle, Bell, Calendar, BookMarked, ClipboardCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TEACHER_CLASSES,
  TEACHER_STUDENTS,
  TEACHER_HW_TASKS,
  TEACHER_SCHEDULE,
  TEACHER_NOTIFICATIONS,
} from '@/lib/teacher-data'

// ── Helpers ────────────────────────────────────────────────────

function kpiColor(color: 'green' | 'amber' | 'red' | 'gray') {
  return { green: 'text-green-600', amber: 'text-amber-600', red: 'text-red-600', gray: 'text-gray-800' }[color]
}

function statusBadge(s: 'on-track' | 'at-risk' | 'critical') {
  const map = { 'on-track': 'bg-green-100 text-green-700', 'at-risk': 'bg-amber-100 text-amber-700', 'critical': 'bg-red-100 text-red-700' }
  const labels = { 'on-track': 'On Track', 'at-risk': 'At Risk', 'critical': 'Critical' }
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', map[s])}>{labels[s]}</span>
}

function riskBadge(r: 'ok' | 'at-risk' | 'critical') {
  if (r === 'critical') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">Critical</span>
  if (r === 'at-risk')  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">At Risk</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">OK</span>
}

function MiniBar({ value, good, warn, max = 100 }: { value: number; good: number; warn: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100)
  const color = value >= good ? 'bg-green-500' : value >= warn ? 'bg-amber-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-14 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={cn('h-1.5 rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className={cn('text-xs font-medium tabular-nums', value >= good ? 'text-green-700' : value >= warn ? 'text-amber-600' : 'text-red-600')}>
        {value}
      </span>
    </div>
  )
}

// ── Derived data ───────────────────────────────────────────────

const totalStudents   = TEACHER_STUDENTS.length
const atRiskStudents  = TEACHER_STUDENTS.filter(s => s.riskFlag !== 'ok').sort((a, b) => b.urgencyScore - a.urgencyScore)
const examSoon        = TEACHER_STUDENTS.filter(s => s.daysToExam !== null && s.daysToExam <= 14).sort((a, b) => (a.daysToExam ?? 99) - (b.daysToExam ?? 99))
const avgAttendance   = Math.round(TEACHER_STUDENTS.reduce((s, x) => s + x.attendancePct, 0) / totalStudents)
const avgBand         = (TEACHER_STUDENTS.reduce((s, x) => s + x.avgBand, 0) / totalStudents).toFixed(1)
const hwRate          = Math.round(TEACHER_HW_TASKS.filter(t => t.status !== 'closed').reduce((s, t) => s + (t.totalStudents > 0 ? t.submittedCount / t.totalStudents : 0), 0) / TEACHER_HW_TASKS.filter(t => t.status !== 'closed').length * 100)
const unreadCount     = TEACHER_NOTIFICATIONS.filter(n => !n.read).length
const todaySessions   = TEACHER_SCHEDULE.filter(s => s.date === '2026-03-21')
const overdueTasks    = TEACHER_HW_TASKS.filter(t => t.status === 'overdue')
const dueTodayTasks   = TEACHER_HW_TASKS.filter(t => t.status === 'due-today')
const ungradedTasks   = TEACHER_HW_TASKS.filter(t => t.submittedCount > t.gradedCount && t.status !== 'open')

// ── Page ───────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const kpis = [
    { label: 'My Classes',         value: TEACHER_CLASSES.length, color: 'gray' as const, href: '/teacher/classes',       trend: null },
    { label: 'Students I Teach',   value: totalStudents,           color: 'gray' as const, href: '/teacher/classes',       trend: null },
    { label: 'Avg Attendance (7d)',value: `${avgAttendance}%`,     color: avgAttendance >= 80 ? 'green' as const : avgAttendance >= 70 ? 'amber' as const : 'red' as const, href: '/teacher/attendance', trend: '−4% vs last week' },
    { label: 'HW Submission Rate', value: `${hwRate}%`,            color: hwRate >= 75 ? 'green' as const : hwRate >= 55 ? 'amber' as const : 'red' as const, href: '/teacher/homework', trend: '−8% vs last week' },
    { label: 'Avg IELTS Band',     value: avgBand,                 color: Number(avgBand) >= 6 ? 'green' as const : Number(avgBand) >= 5 ? 'amber' as const : 'red' as const, href: '/teacher/assessments', trend: null },
    { label: 'Students At Risk',   value: atRiskStudents.length,   color: atRiskStudents.length === 0 ? 'green' as const : atRiskStudents.length <= 2 ? 'amber' as const : 'red' as const, href: '/teacher/students', trend: null },
    { label: 'Exams ≤ 7 Days',     value: TEACHER_STUDENTS.filter(s => s.daysToExam !== null && s.daysToExam <= 7).length, color: 'amber' as const, href: '/teacher/students', trend: null },
    { label: 'Sessions This Week', value: TEACHER_SCHEDULE.filter(s => s.date >= '2026-03-16' && s.date <= '2026-03-22').length, color: 'gray' as const, href: '/teacher/schedule', trend: null },
  ]

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Saturday, 21 March 2026 · Good morning, Tran Thi B.</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map(kpi => (
          <Link key={kpi.label} href={kpi.href}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-500 font-medium truncate">{kpi.label}</p>
            <p className={cn('text-2xl font-bold mt-1', kpiColor(kpi.color))}>{kpi.value}</p>
            {kpi.trend && (
              <p className="flex items-center gap-1 text-xs mt-1 text-red-500">
                <TrendingDown className="w-3 h-3" />{kpi.trend}
              </p>
            )}
          </Link>
        ))}
      </div>

      {/* Today's Schedule + Homework Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Today's Schedule */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-semibold text-gray-900">Today's Schedule</h2>
            </div>
            <Link href="/teacher/schedule" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
              Full schedule <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {todaySessions.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              No classes scheduled today. Your next session is Monday at 08:00.
            </div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {todaySessions.map(s => (
                <li key={s.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-500 tabular-nums">{s.startTime}–{s.endTime}</span>
                        {s.status === 'missing-record' && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-semibold">⚠ No Record</span>
                        )}
                        {s.status === 'done' && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">Done</span>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800">{s.className}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{s.classCode} · {s.studentCount} students</p>
                      {!s.attendanceRecorded && (
                        <p className="text-xs text-amber-600 mt-1 font-medium">Attendance not recorded</p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      {!s.attendanceRecorded && (
                        <Link href={`/teacher/attendance?classId=${s.classId}`}
                          className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap">
                          Take Attendance
                        </Link>
                      )}
                      <Link href={`/teacher/classes/${s.classId}`}
                        className="text-xs border border-gray-200 text-gray-600 px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center">
                        View Roster
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Homework overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-semibold text-gray-900">Homework</h2>
            </div>
            <Link href="/teacher/homework" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="p-5 space-y-4">
            {overdueTasks.length > 0 && (
              <div>
                <p className="text-[10px] font-bold tracking-widest text-red-500 uppercase mb-2">Overdue</p>
                {overdueTasks.map(t => (
                  <div key={t.id} className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-medium text-gray-800 leading-snug">{t.name}</p>
                      <p className="text-[11px] text-gray-400">{t.classCode} · {t.submittedCount}/{t.totalStudents} submitted</p>
                    </div>
                    <Link href="/teacher/homework" className="text-xs text-red-600 font-semibold whitespace-nowrap">Grade →</Link>
                  </div>
                ))}
              </div>
            )}
            {dueTodayTasks.length > 0 && (
              <div>
                <p className="text-[10px] font-bold tracking-widest text-amber-500 uppercase mb-2">Due Today</p>
                {dueTodayTasks.map(t => (
                  <div key={t.id} className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs font-medium text-gray-800 leading-snug">{t.name}</p>
                      <p className="text-[11px] text-gray-400">{t.classCode} · {t.submittedCount}/{t.totalStudents} submitted</p>
                    </div>
                    <Link href="/teacher/homework" className="text-xs text-amber-600 font-semibold whitespace-nowrap">View →</Link>
                  </div>
                ))}
              </div>
            )}
            {overdueTasks.length === 0 && dueTodayTasks.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">You're all caught up! No homework needs attention.</p>
            )}
            <Link href="/teacher/homework"
              className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
              + Assign New Homework
            </Link>
          </div>
        </div>
      </div>

      {/* Class health table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">My Classes</h2>
          <Link href="/teacher/classes" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-50 bg-gray-50">
                <th className="text-left px-5 py-2.5 font-medium">Class</th>
                <th className="text-center px-4 py-2.5 font-medium">Students</th>
                <th className="text-left px-4 py-2.5 font-medium">Attendance</th>
                <th className="text-left px-4 py-2.5 font-medium">HW %</th>
                <th className="text-center px-4 py-2.5 font-medium">Avg Band</th>
                <th className="text-center px-4 py-2.5 font-medium">Exam</th>
                <th className="text-center px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {TEACHER_CLASSES.map(cls => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <Link href={`/teacher/classes/${cls.id}`} className="font-medium text-gray-800 hover:text-indigo-600">{cls.name}</Link>
                    <p className="text-xs text-gray-400">{cls.code} · {cls.schedule}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">{cls.studentsEnrolled}/{cls.capacity}</td>
                  <td className="px-4 py-3"><MiniBar value={cls.attendancePct} good={80} warn={70} /></td>
                  <td className="px-4 py-3"><MiniBar value={cls.hwPct} good={75} warn={55} /></td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('font-semibold', cls.avgBand >= 6 ? 'text-green-700' : cls.avgBand >= 5 ? 'text-amber-600' : 'text-red-600')}>
                      {cls.avgBand.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs">
                    {cls.daysToNearestExam !== null ? (
                      <span className={cn('font-semibold', cls.daysToNearestExam <= 14 ? 'text-red-600' : cls.daysToNearestExam <= 30 ? 'text-amber-600' : 'text-gray-500')}>
                        {cls.daysToNearestExam}d
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">{statusBadge(cls.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/teacher/attendance?classId=${cls.id}`} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Attendance</Link>
                      <Link href={`/teacher/classes/${cls.id}`} className="text-xs text-gray-500 hover:text-gray-700 font-medium">View</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* At-risk students + Exam countdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* At-risk students */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Students Needing Attention</h2>
            <Link href="/teacher/students" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          {atRiskStudents.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">No students at risk right now. Keep it up! 🎉</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-400 border-b border-gray-50">
                    <th className="text-left px-5 py-2 font-medium">Student</th>
                    <th className="text-left px-3 py-2 font-medium">Class</th>
                    <th className="text-center px-3 py-2 font-medium">Risk</th>
                    <th className="text-right px-5 py-2 font-medium">Urgency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {atRiskStudents.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-5 py-2.5">
                        <Link href={`/teacher/students/${s.id}`} className="font-medium text-gray-800 hover:text-indigo-600">{s.name}</Link>
                        <p className="text-[11px] text-gray-400 leading-snug mt-0.5">{s.suggestedAction}</p>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">{s.className.split('–')[0].trim()}</td>
                      <td className="px-3 py-2.5 text-center">{riskBadge(s.riskFlag)}</td>
                      <td className="px-5 py-2.5 text-right">
                        <span className={cn('font-bold tabular-nums', s.urgencyScore >= 80 ? 'text-red-600' : s.urgencyScore >= 50 ? 'text-amber-600' : 'text-gray-500')}>
                          {s.urgencyScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Exam countdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Upcoming Exams</h2>
            <p className="text-xs text-gray-400 mt-0.5">{examSoon.length} student{examSoon.length !== 1 ? 's' : ''} in next 14 days</p>
          </div>
          <ul className="divide-y divide-gray-50">
            {examSoon.length === 0 ? (
              <li className="px-5 py-6 text-sm text-gray-400 text-center">No exams in the next 14 days.</li>
            ) : examSoon.map(s => (
              <li key={s.id} className="px-5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.className}</p>
                    <p className="text-xs mt-1">
                      <span className={cn('font-semibold', s.daysToExam! <= 7 ? 'text-red-600' : 'text-amber-600')}>
                        {s.daysToExam} days
                      </span>
                      <span className="text-gray-400"> · Band {s.avgBand} / target {s.targetBand}</span>
                    </p>
                  </div>
                  <Link href={`/teacher/students/${s.id}`}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap shrink-0">
                    View →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Analytics strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Homework Completion', key: 'hwPct' as const, good: 75, warn: 55, unit: '%' },
          { title: 'Attendance This Week', key: 'attendancePct' as const, good: 80, warn: 70, unit: '%' },
          { title: 'Avg Band vs Target', key: 'avgBand' as const, good: 6, warn: 5, unit: '' },
        ].map(({ title, key, good, warn, unit }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-3">{title} by Class</h3>
            <div className="space-y-2">
              {TEACHER_CLASSES.map(cls => {
                const val = cls[key] as number
                const pct = key === 'avgBand' ? Math.round((val / 9) * 100) : val
                const color = val >= good ? 'bg-green-500' : val >= warn ? 'bg-amber-400' : 'bg-red-500'
                return (
                  <div key={cls.id} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-14 shrink-0 truncate">{cls.code}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className={cn('h-2 rounded-full', color)} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-10 text-right shrink-0">{val}{unit}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

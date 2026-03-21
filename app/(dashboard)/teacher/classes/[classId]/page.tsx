'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ClipboardCheck, BookMarked, BarChart2, Calendar, Users } from 'lucide-react'
import {
  TEACHER_SESSIONS,
  TEACHER_HW_TASKS, TEACHER_ASSESSMENTS,
  getClassById, getClassStudents,
} from '@/lib/teacher-data'

type Tab = 'overview' | 'roster' | 'attendance' | 'homework' | 'scores' | 'sessions'

function RiskBadge({ flag }: { flag: 'ok' | 'at-risk' | 'critical' }) {
  if (flag === 'critical') return <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">Critical</span>
  if (flag === 'at-risk')  return <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">At Risk</span>
  return <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">OK</span>
}

function HWStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    overdue:    'bg-red-100 text-red-700',
    'due-today':'bg-amber-100 text-amber-700',
    open:       'bg-blue-100 text-blue-700',
    closed:     'bg-green-100 text-green-700',
  }
  const labels: Record<string, string> = { overdue: 'Overdue', 'due-today': 'Due Today', open: 'Open', closed: 'Closed' }
  return <span className={cn('inline-flex px-2 py-0.5 rounded text-xs font-semibold', map[status] ?? 'bg-gray-100 text-gray-600')}>{labels[status] ?? status}</span>
}

export default function ClassDetailPage() {
  const params    = useParams()
  const classId   = params.classId as string
  const [tab, setTab] = useState<Tab>('overview')

  const cls       = getClassById(classId)
  const students  = getClassStudents(classId)
  const sessions  = TEACHER_SESSIONS.filter(s => s.classId === classId)
  const hwTasks   = TEACHER_HW_TASKS.filter(t => t.classId === classId)
  const assess    = TEACHER_ASSESSMENTS.filter(a => a.classId === classId)

  if (!cls) return (
    <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
      Class not found. <Link href="/teacher/classes" className="ml-2 text-indigo-600 hover:underline">Back to My Classes</Link>
    </div>
  )

  const statusMap = { 'on-track': 'bg-green-100 text-green-700', 'at-risk': 'bg-amber-100 text-amber-700', 'critical': 'bg-red-100 text-red-700' }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview',   label: 'Overview' },
    { key: 'roster',     label: 'Roster' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'homework',   label: 'Homework' },
    { key: 'scores',     label: 'Scores' },
    { key: 'sessions',   label: 'Sessions' },
  ]

  return (
    <div className="space-y-5">

      {/* Class header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold', statusMap[cls.status])}>
                {cls.status === 'on-track' ? 'On Track' : cls.status === 'at-risk' ? 'At Risk' : 'Critical'}
              </span>
              <span className="text-xs text-gray-400">{cls.code}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{cls.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{cls.schedule}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{cls.studentsEnrolled}/{cls.capacity}</span>
              {cls.daysToNearestExam !== null && (
                <span className={cn('font-semibold', cls.daysToNearestExam <= 14 ? 'text-red-600' : 'text-amber-600')}>
                  Nearest exam: {cls.daysToNearestExam} days
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Link href={`/teacher/attendance?classId=${classId}`}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              <ClipboardCheck className="w-3.5 h-3.5" />Take Attendance
            </Link>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BookMarked className="w-3.5 h-3.5" />Assign Homework
            </button>
            <Link href={`/teacher/assessments?classId=${classId}`}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart2 className="w-3.5 h-3.5" />Record Scores
            </Link>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b border-gray-200 bg-white rounded-t-lg overflow-hidden">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn(
              'px-5 py-3 text-sm font-medium border-b-2 transition-colors',
              tab === t.key
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {tab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Attendance', value: `${cls.attendancePct}%`, color: cls.attendancePct >= 80 ? 'text-green-600' : cls.attendancePct >= 70 ? 'text-amber-600' : 'text-red-600' },
              { label: 'HW Rate',    value: `${cls.hwPct}%`,         color: cls.hwPct >= 75 ? 'text-green-600' : cls.hwPct >= 55 ? 'text-amber-600' : 'text-red-600' },
              { label: 'Avg Band',   value: cls.avgBand.toFixed(1),  color: cls.avgBand >= 6 ? 'text-green-600' : cls.avgBand >= 5 ? 'text-amber-600' : 'text-red-600' },
              { label: 'At Risk',    value: students.filter(s => s.riskFlag !== 'ok').length, color: 'text-red-600' },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-xs text-gray-500 font-medium">{k.label}</p>
                <p className={cn('text-2xl font-bold mt-0.5', k.color)}>{k.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Sessions</h3>
            <div className="space-y-2">
              {sessions.filter(s => s.status !== 'upcoming').slice(0, 3).map(s => (
                <div key={s.id} className="flex items-center justify-between text-sm py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <span className="font-medium text-gray-700">{s.date}</span>
                    <span className="text-gray-400 ml-2 text-xs">{s.topicCovered || 'No note added'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {s.attendanceRecorded
                      ? <span className="text-green-600">✓ {s.presentCount}P · {s.lateCount}L · {s.absentCount}A</span>
                      : <span className="text-amber-600">⚠ No attendance</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Roster tab ── */}
      {tab === 'roster' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr className="text-xs text-gray-400">
                  <th className="text-left px-5 py-2.5 font-medium">Student</th>
                  <th className="text-center px-4 py-2.5 font-medium">Attendance</th>
                  <th className="text-center px-4 py-2.5 font-medium">Avg Band</th>
                  <th className="text-center px-4 py-2.5 font-medium">HW</th>
                  <th className="text-center px-4 py-2.5 font-medium">Exam</th>
                  <th className="text-center px-4 py-2.5 font-medium">Risk</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('font-medium text-sm', s.attendancePct >= 80 ? 'text-green-700' : s.attendancePct >= 70 ? 'text-amber-600' : 'text-red-600')}>
                        {s.attendancePct}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('font-medium text-sm', s.avgBand >= s.targetBand ? 'text-green-700' : s.avgBand >= s.targetBand - 0.5 ? 'text-amber-600' : 'text-red-600')}>
                        {s.avgBand.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">/{s.targetBand}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">{s.hwSubmitted}/{s.hwTotal}</td>
                    <td className="px-4 py-3 text-center text-xs">
                      {s.daysToExam !== null
                        ? <span className={cn('font-semibold', s.daysToExam <= 14 ? 'text-red-600' : 'text-amber-600')}>{s.daysToExam}d</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center"><RiskBadge flag={s.riskFlag} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/teacher/students/${s.id}`} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Attendance tab ── */}
      {tab === 'attendance' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">Overall attendance: <span className={cn('font-bold', cls.attendancePct >= 80 ? 'text-green-700' : cls.attendancePct >= 70 ? 'text-amber-600' : 'text-red-600')}>{cls.attendancePct}%</span></p>
            <Link href={`/teacher/attendance?classId=${classId}`}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              <ClipboardCheck className="w-3.5 h-3.5" />Take Attendance
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr className="text-xs text-gray-400">
                  <th className="text-left px-5 py-2.5 font-medium">Date</th>
                  <th className="text-left px-4 py-2.5 font-medium">Topic</th>
                  <th className="text-center px-4 py-2.5 font-medium">Present</th>
                  <th className="text-center px-4 py-2.5 font-medium">Late</th>
                  <th className="text-center px-4 py-2.5 font-medium">Absent</th>
                  <th className="text-center px-4 py-2.5 font-medium">Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sessions.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-700">{s.date}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">{s.topicCovered || '—'}</td>
                    <td className="px-4 py-3 text-center text-green-700 font-medium">{s.attendanceRecorded ? s.presentCount : '—'}</td>
                    <td className="px-4 py-3 text-center text-amber-600 font-medium">{s.attendanceRecorded ? s.lateCount : '—'}</td>
                    <td className="px-4 py-3 text-center text-red-600 font-medium">{s.attendanceRecorded ? s.absentCount : '—'}</td>
                    <td className="px-4 py-3 text-center">
                      {s.attendanceRecorded
                        ? <span className="text-green-600 text-xs font-medium">✓ Done</span>
                        : <span className="text-amber-500 text-xs font-medium">⚠ Missing</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Homework tab ── */}
      {tab === 'homework' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              + Assign Homework
            </button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr className="text-xs text-gray-400">
                  <th className="text-left px-5 py-2.5 font-medium">Task</th>
                  <th className="text-left px-4 py-2.5 font-medium">Type</th>
                  <th className="text-left px-4 py-2.5 font-medium">Due Date</th>
                  <th className="text-center px-4 py-2.5 font-medium">Submitted</th>
                  <th className="text-center px-4 py-2.5 font-medium">Graded</th>
                  <th className="text-center px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hwTasks.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{t.name}</td>
                    <td className="px-4 py-3"><span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded capitalize font-medium">{t.type}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{t.dueDate}</td>
                    <td className="px-4 py-3 text-center text-sm">{t.submittedCount}/{t.totalStudents}</td>
                    <td className="px-4 py-3 text-center text-sm">{t.gradedCount}/{t.submittedCount}</td>
                    <td className="px-4 py-3 text-center"><HWStatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link href="/teacher/homework" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        {t.submittedCount > t.gradedCount ? 'Grade' : 'View'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hwTasks.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No homework assigned yet.</p>}
          </div>
        </div>
      )}

      {/* ── Scores tab ── */}
      {tab === 'scores' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Link href={`/teacher/assessments?classId=${classId}`}
              className="px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              + Record Scores
            </Link>
          </div>
          {assess.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.date} · <span className="capitalize">{a.type}</span> · Avg: {a.avgBand} · {a.belowTargetCount} below target</p>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead className="border-b border-gray-50 bg-gray-50">
                  <tr className="text-xs text-gray-400">
                    <th className="text-left px-5 py-2 font-medium">Student</th>
                    <th className="text-center px-4 py-2 font-medium">Overall</th>
                    <th className="text-center px-4 py-2 font-medium">Reading</th>
                    <th className="text-center px-4 py-2 font-medium">Writing</th>
                    <th className="text-center px-4 py-2 font-medium">Listening</th>
                    <th className="text-center px-4 py-2 font-medium">Speaking</th>
                    <th className="text-center px-4 py-2 font-medium">vs Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {a.scores.map(sc => (
                    <tr key={sc.studentId} className={cn('hover:bg-gray-50', sc.belowTarget && 'bg-red-50/30')}>
                      <td className="px-5 py-2.5 font-medium text-gray-800">{sc.studentName}</td>
                      <td className="px-4 py-2.5 text-center font-bold text-gray-800">{sc.overall}</td>
                      <td className="px-4 py-2.5 text-center text-gray-500">{sc.reading ?? '—'}</td>
                      <td className="px-4 py-2.5 text-center text-gray-500">{sc.writing ?? '—'}</td>
                      <td className="px-4 py-2.5 text-center text-gray-500">{sc.listening ?? '—'}</td>
                      <td className="px-4 py-2.5 text-center text-gray-500">{sc.speaking ?? '—'}</td>
                      <td className="px-4 py-2.5 text-center">
                        <span className={cn('text-xs font-semibold', sc.belowTarget ? 'text-red-600' : 'text-green-600')}>
                          {sc.belowTarget ? `−${(sc.targetBand - sc.overall).toFixed(1)} 🔴` : '✓'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {assess.length === 0 && <p className="text-center py-8 text-sm text-gray-400 bg-white rounded-xl border border-gray-200">No assessments recorded yet.</p>}
        </div>
      )}

      {/* ── Sessions tab ── */}
      {tab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="px-3 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              + Add Session Note
            </button>
          </div>
          <div className="space-y-3">
            {sessions.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-800">{s.date} · {s.startTime}–{s.endTime}</span>
                      {s.attendanceRecorded
                        ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Attendance ✓</span>
                        : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-medium">No attendance</span>}
                    </div>
                    {s.topicCovered ? (
                      <>
                        <p className="text-sm text-gray-700"><span className="font-medium">Topic:</span> {s.topicCovered}</p>
                        {s.homeworkSet && <p className="text-sm text-gray-500 mt-1"><span className="font-medium">HW set:</span> {s.homeworkSet}</p>}
                        {s.notes && <p className="text-sm text-gray-400 mt-1 italic">{s.notes}</p>}
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 italic">No session note added.</p>
                    )}
                  </div>
                  {s.attendanceRecorded && (
                    <div className="text-xs text-gray-400 text-right shrink-0">
                      <p className="text-green-600 font-medium">{s.presentCount} Present</p>
                      <p className="text-amber-600">{s.lateCount} Late</p>
                      <p className="text-red-600">{s.absentCount} Absent</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {sessions.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No sessions recorded yet.</p>}
          </div>
        </div>
      )}

    </div>
  )
}

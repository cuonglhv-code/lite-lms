'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  TEACHER_STUDENTS,
  TEACHER_HW_TASKS,
  TEACHER_SUBMISSIONS,
  TEACHER_ASSESSMENTS,
  TEACHER_SESSIONS,
  type RiskFlag,
  type AttStatus,
} from '@/lib/teacher-data'

type TabKey = 'overview' | 'attendance' | 'scores' | 'homework' | 'notes'

function riskBanner(flag: RiskFlag, reasons: string[], action: string) {
  if (flag === 'ok') return null
  const isCritical = flag === 'critical'
  return (
    <div className={cn(
      'rounded-xl border px-4 py-3 text-sm',
      isCritical ? 'bg-red-50 border-red-200 text-red-800' : 'bg-amber-50 border-amber-200 text-amber-800'
    )}>
      <p className="font-bold mb-1">{isCritical ? '🔴 Critical Risk' : '⚠ At Risk'}</p>
      <ul className="list-disc list-inside space-y-0.5 text-xs">
        {reasons.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
      {action && <p className="mt-2 text-xs font-semibold">👉 {action}</p>}
    </div>
  )
}

function statCard(label: string, value: string | number, sub: string, color: string) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={cn('text-2xl font-bold mt-0.5', color)}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )
}

// Mini urgency bar
function UrgencyBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-red-500' : score >= 40 ? 'bg-amber-500' : 'bg-green-500'
  const text  = score >= 70 ? 'text-red-600' : score >= 40 ? 'text-amber-600' : 'text-green-600'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full bg-gray-100">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn('text-sm font-bold w-8 text-right', text)}>{score}</span>
    </div>
  )
}

// Attendance status chip
function AttChip({ status }: { status: AttStatus }) {
  if (status === 'present') return <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">P</span>
  if (status === 'late')    return <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">L</span>
  return <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">A</span>
}

// Mock attendance history for a student — derived from sessions
function getStudentAttendance(studentId: string, classId: string) {
  const sessions = TEACHER_SESSIONS.filter(s => s.classId === classId && s.attendanceRecorded)
  // Mock: s1 missed sessions 1,4,7; s3 missed 2,5
  const absences: Record<string, string[]> = {
    's1': ['sess1', 'sess3', 'sess5'],
    's3': ['sess2', 'sess5'],
  }
  const lates: Record<string, string[]> = {
    's9': ['sess4'],
    's14': ['sess3', 'sess6'],
  }
  return sessions.map(sess => ({
    date: sess.date,
    topic: sess.topicCovered,
    status: (absences[studentId] ?? []).includes(sess.id)
      ? 'absent' as AttStatus
      : (lates[studentId] ?? []).includes(sess.id)
        ? 'late' as AttStatus
        : 'present' as AttStatus,
  }))
}

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const [tab,  setTab]  = useState<TabKey>('overview')
  const [note, setNote] = useState('')
  const [savedNotes, setSavedNotes] = useState<{ text: string; date: string }[]>([
    { text: 'Discussed Task 2 structure weaknesses. Recommended extra practice on Problem-Solution essays.', date: '2026-03-14' },
    { text: 'Absent without notice. Contact attempted via phone — no response. Will follow up next session.', date: '2026-03-10' },
  ])

  const student = TEACHER_STUDENTS.find(s => s.id === studentId)
  if (!student) return (
    <div className="py-20 text-center">
      <p className="text-gray-400 text-lg">Student not found.</p>
      <Link href="/teacher/students" className="mt-4 inline-block text-indigo-600 text-sm font-medium">← Back to Students</Link>
    </div>
  )

  const submissions  = TEACHER_SUBMISSIONS.filter(s => s.studentId === student.id)
  const studentAssessments = TEACHER_ASSESSMENTS
    .filter(a => a.classId === student.classId)
    .map(a => ({ ...a, score: a.scores.find(sc => sc.studentId === student.id) }))
    .filter(a => a.score)

  const attendanceHistory = getStudentAttendance(student.id, student.classId)

  const attPct   = student.attendancePct
  const attColor = attPct >= 80 ? 'text-green-600' : attPct >= 70 ? 'text-amber-600' : 'text-red-600'
  const bandGap  = student.targetBand - student.avgBand
  const hwRate   = Math.round((student.hwSubmitted / student.hwTotal) * 100)

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'overview',   label: 'Overview' },
    { key: 'attendance', label: 'Attendance' },
    { key: 'scores',     label: 'Scores' },
    { key: 'homework',   label: 'Homework' },
    { key: 'notes',      label: 'Teacher Notes' },
  ]

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Back */}
      <Link href="/teacher/students" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
        ← All Students
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0',
              student.riskFlag === 'critical' ? 'bg-red-500' :
              student.riskFlag === 'at-risk'  ? 'bg-amber-500' : 'bg-indigo-500'
            )}>
              {student.name.split(' ').map(w => w[0]).slice(-2).join('')}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-sm text-gray-400">{student.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">{student.className} · Enrolled {student.enrolledDate}</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link
              href={`/teacher/attendance?classId=${student.classId}`}
              className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 font-medium"
            >
              Take Attendance
            </Link>
            <Link
              href="/teacher/homework"
              className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Grade Homework
            </Link>
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
          {statCard('Urgency Score',   student.urgencyScore,   'out of 100',
            student.urgencyScore >= 70 ? 'text-red-600' : student.urgencyScore >= 40 ? 'text-amber-600' : 'text-green-600')}
          {statCard('Attendance',      `${attPct}%`,            `${student.attendanceSessions}/${student.totalSessions} sessions`, attColor)}
          {statCard('Avg Band',        student.avgBand,         `Target ${student.targetBand}`,
            bandGap <= 0.5 ? 'text-green-600' : bandGap <= 1.0 ? 'text-amber-600' : 'text-red-600')}
          {statCard('HW Submitted',    `${student.hwSubmitted}/${student.hwTotal}`, `${hwRate}% rate`,
            hwRate >= 75 ? 'text-green-600' : hwRate >= 50 ? 'text-amber-600' : 'text-red-600')}
          {statCard('Exam',
            student.daysToExam != null ? `${student.daysToExam}d` : '—',
            student.examDate ? student.examDate : 'No exam set',
            student.daysToExam != null && student.daysToExam <= 14 ? 'text-red-600' : 'text-gray-700')}
        </div>
      </div>

      {/* Risk banner */}
      {riskBanner(student.riskFlag, student.riskReasons, student.suggestedAction)}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {/* Urgency breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Urgency Score Breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Attendance deficit (40%)</span>
                  <span>{attPct}% · {attPct >= 80 ? 'OK' : attPct >= 70 ? 'Below threshold' : 'Critical'}</span>
                </div>
                <UrgencyBar score={attPct >= 80 ? 10 : attPct >= 70 ? 40 : 80} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Band gap vs target (35%)</span>
                  <span>{student.avgBand} vs {student.targetBand} (−{bandGap.toFixed(1)})</span>
                </div>
                <UrgencyBar score={Math.min(100, Math.round(bandGap * 35))} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Exam urgency (25%)</span>
                  <span>{student.daysToExam != null ? `${student.daysToExam} days` : 'No exam set'}</span>
                </div>
                <UrgencyBar score={
                  student.daysToExam == null ? 0 :
                  student.daysToExam <= 14 ? 90 :
                  student.daysToExam <= 30 ? 50 : 20
                } />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm font-semibold text-gray-700">
                <span>Overall Urgency Score</span>
                <span className={cn(
                  student.urgencyScore >= 70 ? 'text-red-600' :
                  student.urgencyScore >= 40 ? 'text-amber-600' : 'text-green-600'
                )}>{student.urgencyScore}/100</span>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Student Profile</h3>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
              {[
                { label: 'Class',           value: student.className },
                { label: 'Email',           value: student.email },
                { label: 'Enrolled',        value: student.enrolledDate },
                { label: 'Target Band',     value: student.targetBand.toString() },
                { label: 'Current Avg',     value: student.avgBand.toString() },
                { label: 'Band Gap',        value: `−${bandGap.toFixed(1)}` },
                { label: 'Exam Date',       value: student.examDate ?? '—' },
                { label: 'Days to Exam',    value: student.daysToExam != null ? `${student.daysToExam} days` : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="text-gray-700 font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Attendance ─────────────────────────────────────────────── */}
      {tab === 'attendance' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Session Attendance History</p>
            <p className={cn('text-sm font-bold', attColor)}>{attPct}%</p>
          </div>
          {attendanceHistory.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No recorded sessions yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {attendanceHistory.map((rec, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{rec.date}</p>
                    <p className="text-xs text-gray-400">{rec.topic || 'No topic recorded'}</p>
                  </div>
                  <AttChip status={rec.status} />
                </li>
              ))}
            </ul>
          )}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex gap-6 text-sm">
            <span className="text-green-600 font-semibold">
              {attendanceHistory.filter(r => r.status === 'present').length} Present
            </span>
            <span className="text-amber-600 font-semibold">
              {attendanceHistory.filter(r => r.status === 'late').length} Late
            </span>
            <span className="text-red-600 font-semibold">
              {attendanceHistory.filter(r => r.status === 'absent').length} Absent
            </span>
          </div>
        </div>
      )}

      {/* ── Scores ─────────────────────────────────────────────────── */}
      {tab === 'scores' && (
        <div className="space-y-4">
          {studentAssessments.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-400 text-sm">No assessments recorded yet.</p>
            </div>
          ) : (
            studentAssessments.map(a => {
              const sc = a.score!
              const gap = sc.targetBand - sc.overall
              return (
                <div key={a.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.date} · {a.type} · {a.className}</p>
                  </div>
                  <div className="px-5 py-4">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
                      {[
                        { label: 'Overall',   value: sc.overall,   bold: true },
                        { label: 'Reading',   value: sc.reading  ?? '—', bold: false },
                        { label: 'Writing',   value: sc.writing  ?? '—', bold: false },
                        { label: 'Listening', value: sc.listening ?? '—', bold: false },
                        { label: 'Speaking',  value: sc.speaking  ?? '—', bold: false },
                        { label: 'Target',    value: sc.targetBand, bold: false },
                      ].map(({ label, value, bold }) => (
                        <div key={label}>
                          <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                          <p className={cn('text-lg font-bold',
                            bold
                              ? sc.belowTarget ? 'text-red-600' : 'text-green-600'
                              : 'text-gray-700'
                          )}>{value}</p>
                        </div>
                      ))}
                    </div>
                    {sc.belowTarget && (
                      <p className="mt-3 text-xs text-red-600 font-semibold bg-red-50 rounded-lg px-3 py-2">
                        🔴 Below target by {gap.toFixed(1)} band{gap !== 1 ? 's' : ''} — added to at-risk watch list
                      </p>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* ── Homework ──────────────────────────────────────────────── */}
      {tab === 'homework' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Homework Submissions</p>
            <p className={cn('text-sm font-bold',
              hwRate >= 75 ? 'text-green-600' : hwRate >= 50 ? 'text-amber-600' : 'text-red-600'
            )}>
              {student.hwSubmitted}/{student.hwTotal} submitted
            </p>
          </div>
          {submissions.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">No homework submissions recorded.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {submissions.map(sub => {
                const task = TEACHER_HW_TASKS.find(t => t.id === sub.taskId)
                return (
                  <li key={sub.id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{task?.name ?? 'Task'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Due {task?.dueDate} ·{' '}
                          {sub.subStatus === 'submitted'
                            ? <span className="text-green-600 font-semibold">Submitted {sub.submittedDate}</span>
                            : sub.subStatus === 'flagged'
                              ? <span className="text-amber-600 font-semibold">Flagged</span>
                              : <span className="text-red-600 font-semibold">Not submitted</span>
                          }
                        </p>
                        {sub.feedback && (
                          <p className="text-xs text-gray-500 mt-1 italic">"{sub.feedback}"</p>
                        )}
                      </div>
                      {sub.score != null ? (
                        <span className={cn('text-lg font-bold shrink-0',
                          sub.score >= 7 ? 'text-green-600' : sub.score >= 5 ? 'text-amber-600' : 'text-red-600'
                        )}>{sub.score}</span>
                      ) : sub.gradeStatus === 'ungraded' && sub.subStatus === 'submitted' ? (
                        <span className="text-xs text-gray-400 shrink-0">Ungraded</span>
                      ) : (
                        <span className="text-xs text-gray-300 shrink-0">—</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* ── Teacher Notes ─────────────────────────────────────────── */}
      {tab === 'notes' && (
        <div className="space-y-4">
          {/* Add note */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Add Note</h3>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a private note about this student — visible only to you..."
              rows={3}
              maxLength={400}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{note.length}/400</p>
              <button
                onClick={() => {
                  if (!note.trim()) return
                  setSavedNotes(prev => [{ text: note.trim(), date: '2026-03-21' }, ...prev])
                  setNote('')
                }}
                disabled={!note.trim()}
                className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-40"
              >
                Save Note
              </button>
            </div>
          </div>

          {/* Note history */}
          {savedNotes.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Note History</p>
              </div>
              <ul className="divide-y divide-gray-50">
                {savedNotes.map((n, i) => (
                  <li key={i} className="px-5 py-4">
                    <p className="text-xs text-gray-400 mb-1">{n.date} · You</p>
                    <p className="text-sm text-gray-700">{n.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

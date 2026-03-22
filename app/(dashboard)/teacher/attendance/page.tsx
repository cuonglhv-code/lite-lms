'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TEACHER_CLASSES, getClassStudents } from '@/lib/teacher-data'
import type { AttStatus } from '@/lib/teacher-data'

type StudentStatus = Record<string, AttStatus>

function TakeAttendanceContent() {
  const searchParams = useSearchParams()
  const classIdParam = searchParams.get('classId')

  const [classId,   setClassId]   = useState(classIdParam || TEACHER_CLASSES[0]?.id || '')
  const [statuses,  setStatuses]  = useState<StudentStatus>(() =>
    Object.fromEntries(getClassStudents(classIdParam || TEACHER_CLASSES[0]?.id || '').map(s => [s.id, 'present' as AttStatus]))
  )
  const [topic,     setTopic]     = useState('')
  const [note,      setNote]      = useState('')
  const [submitted, setSubmitted] = useState(false)

  const students = getClassStudents(classId)
  const cls      = TEACHER_CLASSES.find(c => c.id === classId)

  function handleClassChange(id: string) {
    setClassId(id)
    setStatuses(Object.fromEntries(getClassStudents(id).map(s => [s.id, 'present' as AttStatus])))
    setSubmitted(false)
  }

  function toggleStatus(studentId: string, status: AttStatus) {
    setStatuses(prev => ({ ...prev, [studentId]: status }))
  }

  function markAll(status: AttStatus) {
    setStatuses(Object.fromEntries(students.map(s => [s.id, status])))
  }

  const presentCount = Object.values(statuses).filter(s => s === 'present').length
  const lateCount    = Object.values(statuses).filter(s => s === 'late').length
  const absentCount  = Object.values(statuses).filter(s => s === 'absent').length

  function handleSubmit() {
    // In production: POST /api/attendance with classId, statuses, topic, note
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Attendance Recorded</h2>
          <p className="text-sm text-gray-500 mb-4">{cls?.name} · Today, 21 March 2026</p>
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="text-center"><p className="text-2xl font-bold text-green-600">{presentCount}</p><p className="text-gray-400">Present</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-amber-500">{lateCount}</p><p className="text-gray-400">Late</p></div>
            <div className="text-center"><p className="text-2xl font-bold text-red-600">{absentCount}</p><p className="text-gray-400">Absent</p></div>
          </div>
          {note && <p className="text-xs text-gray-400 mb-6 italic">&quot;{note}&quot;</p>}
          <div className="flex gap-3">
            <button onClick={() => setSubmitted(false)} className="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              Take Another
            </button>
            <a href="/teacher" className="flex-1 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Take Attendance</h1>
        <p className="text-sm text-gray-500 mt-0.5">Saturday, 21 March 2026</p>
      </div>

      {/* Class selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Class</label>
          <select
            value={classId}
            onChange={e => handleClassChange(e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {TEACHER_CLASSES.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Topic covered <span className="text-gray-300 font-normal normal-case tracking-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Writing Task 2 — Problem Solution structure"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            maxLength={120}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Student list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">{students.length} Students</p>
          <div className="flex gap-1.5">
            <button onClick={() => markAll('present')} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors">
              All Present
            </button>
            <button onClick={() => markAll('absent')} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">
              All Absent
            </button>
          </div>
        </div>

        <ul className="divide-y divide-gray-50">
          {students.map(s => {
            const status = statuses[s.id] ?? 'present'
            return (
              <li key={s.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                  {s.riskFlag !== 'ok' && (
                    <p className="text-[11px] text-red-400 font-medium">
                      {s.riskFlag === 'critical' ? '⚠ Critical — attendance already low' : 'At risk — monitor attendance'}
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5">
                  {(['present', 'late', 'absent'] as AttStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => toggleStatus(s.id, st)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                        status === st ? (
                          st === 'present' ? 'bg-green-600 text-white border-green-600' :
                          st === 'late'    ? 'bg-amber-500 text-white border-amber-500' :
                                             'bg-red-600 text-white border-red-600'
                        ) : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {st === 'present' ? 'P' : st === 'late' ? 'L' : 'A'}
                    </button>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Running count */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 px-5 py-3 flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
          <span className="text-sm font-semibold text-green-700">{presentCount} Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-sm font-semibold text-amber-600">{lateCount} Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span className="text-sm font-semibold text-red-600">{absentCount} Absent</span>
        </div>
      </div>

      {/* Session note */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Session note <span className="text-gray-300 font-normal normal-case tracking-normal">(optional — visible to manager)</span>
        </label>
        <textarea
          placeholder="Any observations, issues, or notes for this session..."
          value={note}
          onChange={e => setNote(e.target.value)}
          maxLength={300}
          rows={3}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{note.length}/300</p>
      </div>

      {/* Submit */}
      {absentCount >= 5 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
          ⚠ <strong>{absentCount} students absent</strong> — this will trigger at-risk alerts for affected students.
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Submit Attendance
      </button>
    </div>
  )
}

export default function TakeAttendancePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TakeAttendanceContent />
    </Suspense>
  )
}

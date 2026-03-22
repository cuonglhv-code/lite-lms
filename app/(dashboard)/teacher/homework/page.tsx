'use client'

import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Search, BookMarked } from 'lucide-react'
import { TEACHER_HW_TASKS, TEACHER_SUBMISSIONS } from '@/lib/teacher-data'

type TabKey = 'active' | 'submissions' | 'archived'

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = { homework: 'bg-blue-100 text-blue-700', test: 'bg-purple-100 text-purple-700', mock: 'bg-indigo-100 text-indigo-700' }
  return <span className={cn('inline-flex px-2 py-0.5 rounded text-xs font-semibold capitalize', map[type] ?? 'bg-gray-100 text-gray-600')}>{type}</span>
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { overdue: 'bg-red-100 text-red-700', 'due-today': 'bg-amber-100 text-amber-700', open: 'bg-blue-100 text-blue-700', closed: 'bg-green-100 text-green-700' }
  const labels: Record<string, string> = { overdue: 'Overdue', 'due-today': 'Due Today', open: 'Open', closed: 'Closed' }
  return <span className={cn('inline-flex px-2 py-0.5 rounded text-xs font-semibold', map[status] ?? 'bg-gray-100 text-gray-500')}>{labels[status] ?? status}</span>
}

function SubBadge({ status }: { status: string }) {
  if (status === 'submitted') return <span className="text-green-700 font-medium text-xs">✓ Submitted</span>
  if (status === 'flagged')   return <span className="text-amber-600 font-medium text-xs">🚩 Flagged</span>
  return <span className="text-red-500 font-medium text-xs">✗ Not submitted</span>
}

function HomeworkContent() {
  const searchParams = useSearchParams()
  const taskIdParam = searchParams.get('taskId')
  const tabParam = searchParams.get('tab') as TabKey | null

  const [tab,         setTab]         = useState<TabKey>(tabParam ?? 'active')
  const [search,      setSearch]      = useState('')
  const [showModal,   setShowModal]   = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(taskIdParam)
  const [gradingData, setGradingData] = useState<Record<string, { score: number | null; feedback: string }>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [saveSuccess, setSaveSuccess] = useState<{ id: string, msg: string } | null>(null)
  const [assignSuccess, setAssignSuccess] = useState('')

  // modal state
  const [taskName, setTaskName] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [modalClass, setModalClass] = useState('Foundation 1 – Class A')
  const [modalErr, setModalErr] = useState('')

  useEffect(() => {
    if (taskIdParam && tabParam) {
      setTab(tabParam)
      setSelectedTaskId(taskIdParam)
    }
  }, [taskIdParam, tabParam])

  const toggleFlag = (studentId: string) => {
    setFlagged(prev => {
      const next = new Set(prev)
      if (next.has(studentId)) {
        next.delete(studentId)
      } else {
        next.add(studentId)
      }
      return next
    })
  }

  const handleAssign = () => {
    if (!taskName.trim()) { setModalErr('Task name is required'); return }
    if (!dueDate) { setModalErr('Due date is required'); return }
    setModalErr('')
    setShowModal(false)
    setTaskName('')
    setDueDate('')
    setAssignSuccess(`✓ Homework assigned to ${modalClass}`)
    setTimeout(() => setAssignSuccess(''), 3000)
  }

  const activeTasks   = TEACHER_HW_TASKS.filter(t => t.status !== 'closed')
  const archivedTasks = TEACHER_HW_TASKS.filter(t => t.status === 'closed')
  const gradingTasks  = TEACHER_HW_TASKS.filter(t => t.submittedCount > t.gradedCount)

  const filteredActive  = activeTasks.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.classCode.toLowerCase().includes(search.toLowerCase()))
  const filteredArchive = archivedTasks.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))

  const overdueCount  = activeTasks.filter(t => t.status === 'overdue').length
  const dueTodayCount = activeTasks.filter(t => t.status === 'due-today').length
  const ungradedCount = TEACHER_HW_TASKS.reduce((s, t) => s + Math.max(0, t.submittedCount - t.gradedCount), 0)

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Homework</h1>
          <p className="text-sm text-gray-500 mt-0.5">{TEACHER_HW_TASKS.length} tasks across all classes</p>
        </div>
        <div className="flex items-center gap-4">
          {assignSuccess && <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">{assignSuccess}</span>}
          <button onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            + Assign Homework
          </button>
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Tasks',  value: activeTasks.length,  color: 'text-gray-800' },
          { label: 'Overdue',       value: overdueCount,        color: overdueCount > 0 ? 'text-red-600' : 'text-gray-800' },
          { label: 'Due Today',     value: dueTodayCount,       color: dueTodayCount > 0 ? 'text-amber-600' : 'text-gray-800' },
          { label: 'Ungraded',      value: ungradedCount,       color: ungradedCount > 0 ? 'text-amber-600' : 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {([['active', 'Active', activeTasks.length], ['submissions', 'Grade', ungradedCount], ['archived', 'Archived', archivedTasks.length]] as [TabKey, string, number][]).map(([key, label, count]) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn('px-5 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700')}>
            {label}
            <span className={cn('ml-1.5 text-xs px-1.5 py-0.5 rounded-full', tab === key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500')}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input type="search" placeholder="Search task or class…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-56" />
        </div>
      </div>

      {/* Active tab */}
      {tab === 'active' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr className="text-xs text-gray-400">
                  <th className="text-left px-5 py-2.5 font-medium">Task</th>
                  <th className="text-left px-4 py-2.5 font-medium">Class</th>
                  <th className="text-left px-4 py-2.5 font-medium">Type</th>
                  <th className="text-left px-4 py-2.5 font-medium">Due</th>
                  <th className="text-center px-4 py-2.5 font-medium">Submitted</th>
                  <th className="text-center px-4 py-2.5 font-medium">Graded</th>
                  <th className="text-center px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredActive.map(t => (
                  <tr key={t.id} className={cn('hover:bg-gray-50 transition-colors', t.status === 'overdue' && 'bg-red-50/20')}>
                    <td className="px-5 py-3 font-medium text-gray-800">{t.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{t.classCode}</td>
                    <td className="px-4 py-3"><TypeBadge type={t.type} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{t.dueDate}</td>
                    <td className="px-4 py-3 text-center text-sm">{t.submittedCount}/{t.totalStudents}</td>
                    <td className="px-4 py-3 text-center text-sm">{t.gradedCount}/{t.submittedCount}</td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setSelectedTaskId(t.id); setTab('submissions') }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        {t.submittedCount > t.gradedCount ? 'Grade' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredActive.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No active tasks found.</p>}
          </div>
        </div>
      )}

      {/* Grading tab */}
      {tab === 'submissions' && (
        <div className="space-y-4">
          {gradingTasks.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center py-12 text-gray-400">
              <BookMarked className="w-8 h-8 mb-2" />
              <p className="text-sm">All caught up — no submissions to grade.</p>
            </div>
          ) : (
            (() => {
              const tasksToShow = selectedTaskId
                ? TEACHER_HW_TASKS.filter(t => t.id === selectedTaskId)
                : gradingTasks
              return tasksToShow.map(task => {
                const subs = TEACHER_SUBMISSIONS.filter(s => s.taskId === task.id)
                const handleSaveAll = () => {
                  console.log('Grades Object:', gradingData)
                  const studentCount = Object.keys(gradingData).length
                  setSaveSuccess({ id: task.id, msg: `✓ Grades saved for ${studentCount || 0} students.` })
                  setTimeout(() => setSaveSuccess(null), 3000)
                }

                return (
                  <div key={task.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">{task.name}</p>
                        <p className="text-xs text-gray-400">{task.classCode} · Due {task.dueDate} · {task.submittedCount}/{task.totalStudents} submitted</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {saveSuccess?.id === task.id && <span className="text-sm text-green-600 font-medium">{saveSuccess.msg}</span>}
                        <button onClick={handleSaveAll} className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                          Save All
                        </button>
                      </div>
                    </div>
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-50">
                    <tr className="text-xs text-gray-400">
                      <th className="text-left px-5 py-2 font-medium">Student</th>
                      <th className="text-center px-4 py-2 font-medium">Status</th>
                      <th className="text-center px-4 py-2 font-medium">Score (0–9)</th>
                      <th className="text-left px-4 py-2 font-medium">Feedback</th>
                      <th className="text-center px-4 py-2 font-medium">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {subs.map(sub => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-5 py-2.5 font-medium text-gray-800">{sub.studentName}</td>
                        <td className="px-4 py-2.5 text-center"><SubBadge status={sub.subStatus} /></td>
                        <td className="px-4 py-2.5 text-center">
                          {sub.subStatus === 'submitted' || sub.subStatus === 'flagged' ? (
                            <input type="number" min={0} max={9} step={0.5}
                              value={gradingData[sub.id]?.score ?? sub.score ?? ''}
                              onChange={(e) => setGradingData({
                                ...gradingData,
                                [sub.id]: { ...gradingData[sub.id], score: e.target.value ? parseFloat(e.target.value) : null, feedback: gradingData[sub.id]?.feedback ?? sub.feedback ?? '' }
                              })}
                              placeholder="—"
                              className="w-16 text-center text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                          ) : <span className="text-gray-300 text-xs">Not submitted</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          {sub.subStatus !== 'not-submitted' && (
                            <input type="text" placeholder="Add feedback…"
                              value={gradingData[sub.id]?.feedback ?? sub.feedback ?? ''}
                              onChange={(e) => setGradingData({
                                ...gradingData,
                                [sub.id]: { ...gradingData[sub.id], feedback: e.target.value, score: gradingData[sub.id]?.score ?? sub.score ?? null }
                              })}
                              className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                            />
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button onClick={() => toggleFlag(sub.id)} className={cn('text-lg w-8 h-8 rounded-full hover:bg-gray-100 transition-colors', flagged.has(sub.id) ? 'text-red-500' : 'text-gray-300 hover:text-red-400')}>🚩</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                )
              })
            })()
          )}
        </div>
      )}

      {/* Archived tab */}
      {tab === 'archived' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-medium">Task</th>
                <th className="text-left px-4 py-2.5 font-medium">Class</th>
                <th className="text-left px-4 py-2.5 font-medium">Due</th>
                <th className="text-center px-4 py-2.5 font-medium">Submission Rate</th>
                <th className="text-center px-4 py-2.5 font-medium">Avg Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredArchive.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-700">{t.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{t.classCode}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{t.dueDate}</td>
                  <td className="px-4 py-3 text-center text-sm">{t.submittedCount}/{t.totalStudents}</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-700">{t.avgScore?.toFixed(1) ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredArchive.length === 0 && <p className="text-center py-8 text-sm text-gray-400">No archived tasks yet.</p>}
        </div>
      )}

      {/* Assign Homework Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Assign Homework</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Class*', type: 'select', options: ['Foundation 1 – Class A', 'IELTS Writing – Band 6'] },
              ].map(() => (
                <div key="class">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Class *</label>
                  <select value={modalClass} onChange={e => setModalClass(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                    <option>Foundation 1 – Class A</option>
                    <option>IELTS Writing – Band 6</option>
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Task Name *</label>
                <input type="text" placeholder="e.g. Writing Task 2 – Argument Essay" maxLength={80}
                  value={taskName} onChange={e => { setTaskName(e.target.value); setModalErr('') }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                {modalErr === 'Task name is required' && <p className="text-xs text-red-500 mt-1">{modalErr}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Type *</label>
                <div className="flex gap-2">
                  {['Homework', 'Test', 'Mock'].map(t => (
                    <label key={t} className="flex items-center gap-1.5 text-sm cursor-pointer">
                      <input type="radio" name="type" defaultChecked={t === 'Homework'} className="accent-indigo-600" />{t}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Due Date *</label>
                <input type="date" value={dueDate} onChange={e => { setDueDate(e.target.value); setModalErr('') }} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                {modalErr === 'Due date is required' && <p className="text-xs text-red-500 mt-1">{modalErr}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                <textarea rows={2} placeholder="Instructions for students (optional)…"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAssign}
                className="flex-1 py-2.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function HomeworkHubPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeworkContent />
    </Suspense>
  )
}

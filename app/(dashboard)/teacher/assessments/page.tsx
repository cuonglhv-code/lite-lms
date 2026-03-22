'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TEACHER_CLASSES, TEACHER_ASSESSMENTS, getClassStudents } from '@/lib/teacher-data'

type TabKey = 'record' | 'history'

function AssessmentsContent() {
  const searchParams = useSearchParams()
  const classIdParam = searchParams.get('classId')

  const [tab,       setTab]       = useState<TabKey>(classIdParam ? 'record' : 'history')
  const [classId,   setClassId]   = useState(classIdParam || TEACHER_CLASSES[0]?.id || '')
  const [assessType,setAssessType]= useState('mock')
  const [assessName,setAssessName]= useState('')
  const [date,      setDate]      = useState('2026-03-21')
  const [scores,    setScores]    = useState<Record<string, string>>({})
  const [saved,     setSaved]     = useState(false)
  const [savedDraft,setSavedDraft]= useState(false)

  useEffect(() => {
    if (classId) {
      const draft = localStorage.getItem(`assessment-draft-${classId}`)
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          setAssessType(parsed.assessType || 'mock')
          setAssessName(parsed.assessName || '')
          setDate(parsed.date || '2026-03-21')
          setScores(parsed.scores || {})
        } catch { }
      } else {
        setScores({})
        setAssessName('')
      }
    }
  }, [classId])

  const students   = getClassStudents(classId)

  function handleSave() {
    setSaved(true)
    localStorage.removeItem(`assessment-draft-${classId}`)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleSaveDraft() {
    localStorage.setItem(`assessment-draft-${classId}`, JSON.stringify({
      assessType, assessName, date, scores
    }))
    setSavedDraft(true)
    setTimeout(() => setSavedDraft(false), 3000)
  }

  const belowTarget = students.filter(s => {
    const score = parseFloat(scores[s.id] ?? '')
    return !isNaN(score) && score < s.targetBand - 0.5
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Assessments</h1>
        <p className="text-sm text-gray-500 mt-0.5">Record and review assessment scores</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Assessments Recorded', value: TEACHER_ASSESSMENTS.length, color: 'text-gray-800' },
          { label: 'Below Target',          value: TEACHER_ASSESSMENTS.reduce((s, a) => s + a.belowTargetCount, 0), color: 'text-red-600' },
          { label: 'Avg Band (IF1-A)',      value: TEACHER_ASSESSMENTS.find(a => a.classId === 'c1')?.avgBand ?? '—', color: 'text-amber-600' },
          { label: 'Avg Band (IW-B6)',      value: TEACHER_ASSESSMENTS.find(a => a.classId === 'c3')?.avgBand ?? '—', color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {([['history', 'Score History'], ['record', 'Record New Scores']] as [TabKey, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn('px-5 py-2.5 text-sm font-medium border-b-2 transition-colors',
              tab === key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700')}>
            {label}
          </button>
        ))}
      </div>

      {/* History tab */}
      {tab === 'history' && (
        <div className="space-y-4">
          {TEACHER_ASSESSMENTS.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{a.name}</p>
                  <p className="text-xs text-gray-400">
                    {a.date} · <span className="capitalize">{a.type}</span> · {a.className} ·
                    Avg <span className="font-medium text-gray-700">{a.avgBand}</span> ·
                    High <span className="text-green-600 font-medium">{a.highestBand}</span> ·
                    Low <span className="text-red-600 font-medium">{a.lowestBand}</span> ·
                    <span className="text-red-500 font-medium"> {a.belowTargetCount} below target</span>
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-50">
                    <tr className="text-xs text-gray-400">
                      <th className="text-left px-5 py-2 font-medium">Student</th>
                      <th className="text-center px-4 py-2 font-medium">Overall</th>
                      <th className="text-center px-4 py-2 font-medium">Reading</th>
                      <th className="text-center px-4 py-2 font-medium">Writing</th>
                      <th className="text-center px-4 py-2 font-medium">Listening</th>
                      <th className="text-center px-4 py-2 font-medium">Speaking</th>
                      <th className="text-center px-4 py-2 font-medium">Target</th>
                      <th className="text-center px-4 py-2 font-medium">Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {a.scores.map(sc => (
                      <tr key={sc.studentId} className={cn('hover:bg-gray-50', sc.belowTarget && 'bg-red-50/30')}>
                        <td className="px-5 py-2.5 font-medium text-gray-800">{sc.studentName}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={cn('font-bold', sc.overall >= sc.targetBand ? 'text-green-700' : 'text-red-600')}>{sc.overall}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center text-gray-500">{sc.reading ?? '—'}</td>
                        <td className="px-4 py-2.5 text-center text-gray-500">{sc.writing ?? '—'}</td>
                        <td className="px-4 py-2.5 text-center text-gray-500">{sc.listening ?? '—'}</td>
                        <td className="px-4 py-2.5 text-center text-gray-500">{sc.speaking ?? '—'}</td>
                        <td className="px-4 py-2.5 text-center text-gray-400">{sc.targetBand}</td>
                        <td className="px-4 py-2.5 text-center">
                          {sc.belowTarget
                            ? <span className="text-xs font-bold text-red-600">−{(sc.targetBand - sc.overall).toFixed(1)} 🔴</span>
                            : <span className="text-xs font-bold text-green-600">✓</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record tab */}
      {tab === 'record' && (
        <div className="space-y-5 max-w-3xl">
          {/* Assessment selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Assessment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Class *</label>
                <select value={classId} onChange={e => { setClassId(e.target.value); setScores({}) }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  {TEACHER_CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Assessment Type *</label>
                <select value={assessType} onChange={e => setAssessType(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <option value="mock">Mock Exam</option>
                  <option value="test">In-class Test</option>
                  <option value="placement">Placement Test</option>
                  <option value="in-class">Quick Quiz</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Assessment Name *</label>
                <input type="text" value={assessName} onChange={e => setAssessName(e.target.value)}
                  placeholder="e.g. Mock Exam – Full Paper 2"
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>
          </div>

          {/* Score entry grid */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">Enter Scores — {students.length} students</p>
              <p className="text-xs text-gray-400">IELTS band scale: 0–9 (step 0.5)</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-gray-50">
                <tr className="text-xs text-gray-400">
                  <th className="text-left px-5 py-2.5 font-medium">Student</th>
                  <th className="text-center px-4 py-2.5 font-medium">Overall *</th>
                  <th className="text-center px-4 py-2.5 font-medium">Reading</th>
                  <th className="text-center px-4 py-2.5 font-medium">Writing</th>
                  <th className="text-center px-4 py-2.5 font-medium">Listening</th>
                  <th className="text-center px-4 py-2.5 font-medium">Speaking</th>
                  <th className="text-center px-4 py-2.5 font-medium">Target</th>
                  <th className="text-center px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map(s => {
                  const score = parseFloat(scores[s.id] ?? '')
                  const below = !isNaN(score) && score < s.targetBand - 0.5
                  return (
                    <tr key={s.id} className={cn('hover:bg-gray-50', below && 'bg-red-50/30')}>
                      <td className="px-5 py-2.5 font-medium text-gray-800">{s.name}</td>
                      <td className="px-4 py-2.5 text-center">
                        <input type="number" min={0} max={9} step={0.5}
                          value={scores[s.id] ?? ''}
                          onChange={e => setScores(prev => ({ ...prev, [s.id]: e.target.value }))}
                          placeholder="—"
                          className={cn('w-16 text-center text-sm border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-400',
                            below ? 'border-red-300 bg-red-50' : 'border-gray-200')}
                        />
                      </td>
                      {['R', 'W', 'L', 'S'].map(sk => (
                        <td key={sk} className="px-4 py-2.5 text-center">
                          <input type="number" min={0} max={9} step={0.5} placeholder="—"
                            className="w-14 text-center text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                        </td>
                      ))}
                      <td className="px-4 py-2.5 text-center text-xs text-gray-400">{s.targetBand}</td>
                      <td className="px-4 py-2.5 text-center">
                        {!isNaN(score)
                          ? below
                            ? <span className="text-xs font-bold text-red-600">🔴 Below</span>
                            : <span className="text-xs font-bold text-green-600">✓ OK</span>
                          : <span className="text-gray-300 text-xs">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {belowTarget.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
              ⚠ <strong>{belowTarget.length} student{belowTarget.length > 1 ? 's' : ''} below target band</strong> — they will be added to the at-risk watch list on save.
            </div>
          )}

          {saved && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
              ✓ Scores saved for {students.length} students.
            </div>
          )}

          {savedDraft && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
              ✓ Draft saved. You can continue later.
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSaveDraft} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
              Save Draft
            </button>
            <button onClick={handleSave}
              className="flex-1 py-2.5 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium">
              Save All Scores
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AssessmentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AssessmentsContent />
    </Suspense>
  )
}

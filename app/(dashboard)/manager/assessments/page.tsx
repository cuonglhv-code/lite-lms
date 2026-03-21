'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ClipboardList, Search } from 'lucide-react'
import {
  ADMIN_ASSESSMENTS,
  type AdminAssessment,
  type AssessmentType,
  type AssessmentStatus,
} from '@/lib/admin-data'

// ── Helpers ────────────────────────────────────────────────────

function TypeBadge({ type }: { type: AssessmentType }) {
  const map: Record<AssessmentType, string> = {
    homework: 'bg-blue-100 text-blue-700',
    test:     'bg-purple-100 text-purple-700',
    mock:     'bg-indigo-100 text-indigo-700',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize', map[type])}>
      {type}
    </span>
  )
}

function StatusBadge({ status }: { status: AssessmentStatus }) {
  const map: Record<AssessmentStatus, string> = {
    upcoming: 'bg-gray-100 text-gray-600',
    open:     'bg-blue-100 text-blue-700',
    graded:   'bg-green-100 text-green-700',
    overdue:  'bg-red-100 text-red-700',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize', map[status])}>
      {status}
    </span>
  )
}

function SubmissionBar({ received, total }: { received: number; total: number }) {
  const pct = total > 0 ? Math.round((received / total) * 100) : 0
  const color = pct >= 80 ? 'bg-green-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={cn('h-1.5 rounded-full', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-600 tabular-nums">{received}/{total}</span>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────

type TabKey = 'all' | AssessmentType | 'overdue'

export default function ManagerAssessmentsPage() {
  const [tab,    setTab]    = useState<TabKey>('all')
  const [search, setSearch] = useState('')

  const filtered = ADMIN_ASSESSMENTS.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.className.toLowerCase().includes(search.toLowerCase())) return false
    if (tab === 'overdue') return a.status === 'overdue'
    if (tab !== 'all')     return a.type === tab
    return true
  })

  const tabCounts: Record<TabKey, number> = {
    all:      ADMIN_ASSESSMENTS.length,
    homework: ADMIN_ASSESSMENTS.filter(a => a.type === 'homework').length,
    test:     ADMIN_ASSESSMENTS.filter(a => a.type === 'test').length,
    mock:     ADMIN_ASSESSMENTS.filter(a => a.type === 'mock').length,
    overdue:  ADMIN_ASSESSMENTS.filter(a => a.status === 'overdue').length,
  }

  const totalSubmissions = ADMIN_ASSESSMENTS.reduce((s, a) => s + a.submissionsReceived, 0)
  const totalExpected    = ADMIN_ASSESSMENTS.reduce((s, a) => s + a.submissionsTotal, 0)
  const overallRate      = totalExpected > 0 ? Math.round((totalSubmissions / totalExpected) * 100) : 0
  const gradedCount      = ADMIN_ASSESSMENTS.filter(a => a.status === 'graded').length
  const overdueCount     = tabCounts.overdue

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Assessments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ADMIN_ASSESSMENTS.length} assessments across all classes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          + New Assessment
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Assessments', value: ADMIN_ASSESSMENTS.length, color: 'text-gray-800' },
          { label: 'Submission Rate',   value: `${overallRate}%`,         color: overallRate >= 80 ? 'text-green-600' : overallRate >= 60 ? 'text-amber-600' : 'text-red-600' },
          { label: 'Graded',            value: gradedCount,               color: 'text-green-600' },
          { label: 'Overdue',           value: overdueCount,              color: overdueCount > 0 ? 'text-red-600' : 'text-gray-800' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 pb-0">
        {([['all','All'], ['homework','Homework'], ['test','Test'], ['mock','Mock'], ['overdue','Overdue']] as [TabKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
            <span className={cn('ml-1.5 text-xs px-1.5 py-0.5 rounded-full', tab === key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500')}>
              {tabCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="search"
            placeholder="Search assessment or class…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
          />
        </div>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-medium">Assessment</th>
                <th className="text-left px-4 py-2.5 font-medium">Class</th>
                <th className="text-left px-4 py-2.5 font-medium">Teacher</th>
                <th className="text-left px-4 py-2.5 font-medium">Type</th>
                <th className="text-left px-4 py-2.5 font-medium">Due Date</th>
                <th className="text-left px-4 py-2.5 font-medium">Submissions</th>
                <th className="text-center px-4 py-2.5 font-medium">Avg Score</th>
                <th className="text-center px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(a => (
                <tr key={a.id} className={cn('hover:bg-gray-50 transition-colors', a.status === 'overdue' && 'bg-red-50/20')}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{a.name}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{a.className}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{a.teacher}</td>
                  <td className="px-4 py-3"><TypeBadge type={a.type} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{a.dueDate}</td>
                  <td className="px-4 py-3">
                    <SubmissionBar received={a.submissionsReceived} total={a.submissionsTotal} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {a.avgScore !== null ? (
                      <span className={cn('font-semibold', a.avgScore >= 6 ? 'text-green-600' : a.avgScore >= 5 ? 'text-amber-600' : 'text-red-600')}>
                        {a.avgScore.toFixed(1)}
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <ClipboardList className="w-8 h-8 mb-2" />
            <p className="text-sm">No assessments found</p>
          </div>
        )}
      </div>
    </div>
  )
}

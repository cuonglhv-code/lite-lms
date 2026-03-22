'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ADMIN_STUDENTS,
  type AdminStudent,
  type PaymentStatus,
} from '@/lib/admin-data'
import { AddStudentModal } from '@/components/modals/AddStudentModal'

// ── Helpers ────────────────────────────────────────────────────

function RiskBadge({ flag }: { flag: AdminStudent['riskFlag'] }) {
  if (flag === 'critical') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">Critical</span>
  if (flag === 'at-risk')  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">At Risk</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">OK</span>
}

function PayBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    paid:    'bg-green-100 text-green-700',
    partial: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-600',
  }
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize', map[status])}>{status}</span>
}

function UrgencyPill({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-red-600' : score >= 50 ? 'bg-amber-500' : 'bg-green-500'
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={cn('h-1.5 rounded-full', color)} style={{ width: `${score}%` }} />
      </div>
      <span className={cn('text-xs font-bold tabular-nums', score >= 80 ? 'text-red-600' : score >= 50 ? 'text-amber-600' : 'text-green-600')}>
        {score}
      </span>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────

type RiskFilter = '' | 'critical' | 'at-risk' | 'ok'
type SortKey = 'name' | 'urgencyScore' | 'attendancePct' | 'avgScore' | 'daysToExam'

export default function ManagerStudentsPage() {
  const router = useRouter()
  const [search,      setSearch]      = useState('')
  const [riskFilter,  setRiskFilter]  = useState<RiskFilter>('')
  const [classFilter, setClassFilter] = useState('')
  const [sortKey,     setSortKey]     = useState<SortKey>('urgencyScore')
  const [sortAsc,     setSortAsc]     = useState(false)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)

  const classes = Array.from(new Set(ADMIN_STUDENTS.map(s => s.className)))

  const filtered = ADMIN_STUDENTS
    .filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.email.toLowerCase().includes(search.toLowerCase())) return false
      if (riskFilter && s.riskFlag !== riskFilter) return false
      if (classFilter && s.className !== classFilter) return false
      return true
    })
    .sort((a, b) => {
      let av: number | string = a[sortKey] ?? 999
      let bv: number | string = b[sortKey] ?? 999
      if (sortKey === 'name') { av = a.name; bv = b.name }
      if (typeof av === 'string' && typeof bv === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(key === 'name') }
  }

  function SortTh({ label, k }: { label: string; k: SortKey }) {
    return (
      <th
        className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 cursor-pointer select-none whitespace-nowrap hover:text-gray-700"
        onClick={() => toggleSort(k)}
      >
        {label} {sortKey === k ? (sortAsc ? '↑' : '↓') : ''}
      </th>
    )
  }

  const critical = ADMIN_STUDENTS.filter(s => s.riskFlag === 'critical').length
  const atRisk   = ADMIN_STUDENTS.filter(s => s.riskFlag === 'at-risk').length
  const examSoon = ADMIN_STUDENTS.filter(s => s.daysToExam !== null && s.daysToExam <= 30).length

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ADMIN_STUDENTS.length} enrolled students</p>
        </div>
        <button 
          onClick={() => setShowAddStudentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Student
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: ADMIN_STUDENTS.length, color: 'text-gray-800' },
          { label: 'Critical Risk',  value: critical, color: 'text-red-600' },
          { label: 'At Risk',        value: atRisk,   color: 'text-amber-600' },
          { label: 'Exams ≤ 30d',    value: examSoon, color: 'text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="search"
            placeholder="Search name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52"
          />
        </div>
        <select
          value={riskFilter}
          onChange={e => setRiskFilter(e.target.value as RiskFilter)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All risk levels</option>
          <option value="critical">Critical</option>
          <option value="at-risk">At Risk</option>
          <option value="ok">OK</option>
        </select>
        <select
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 max-w-48"
        >
          <option value="">All classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <SortTh label="Student" k="name" />
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Class</th>
                <SortTh label="Attendance" k="attendancePct" />
                <SortTh label="Avg Band" k="avgScore" />
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">HW</th>
                <SortTh label="Exam" k="daysToExam" />
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Payment</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Risk</th>
                <SortTh label="Urgency" k="urgencyScore" />
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.id} onClick={() => router.push(`/manager/students/${s.id}`)} className={cn('hover:bg-gray-50 transition-colors cursor-pointer', s.riskFlag === 'critical' && 'bg-red-50/30')}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{s.className}</td>
                  <td className="px-4 py-3">
                    <span className={cn('font-medium', s.attendancePct >= 80 ? 'text-green-700' : s.attendancePct >= 70 ? 'text-amber-600' : 'text-red-600')}>
                      {s.attendancePct}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('font-medium', s.avgScore >= s.targetBand ? 'text-green-700' : s.avgScore >= s.targetBand - 0.5 ? 'text-amber-600' : 'text-red-600')}>
                      {s.avgScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">/ {s.targetBand}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {s.hwSubmitted}/{s.hwTotal}
                  </td>
                  <td className="px-4 py-3 text-xs text-center whitespace-nowrap">
                    {s.daysToExam !== null ? (
                      <span className={cn('font-semibold', s.daysToExam <= 14 ? 'text-red-600' : s.daysToExam <= 30 ? 'text-amber-600' : 'text-gray-500')}>
                        {s.daysToExam}d
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3"><PayBadge status={s.paymentStatus} /></td>
                  <td className="px-4 py-3"><RiskBadge flag={s.riskFlag} /></td>
                  <td className="px-4 py-3"><UrgencyPill score={s.urgencyScore} /></td>
                  <td className="px-4 py-3 max-w-[160px]">
                    {s.suggestedAction ? (
                      <p className="text-xs text-gray-500 leading-snug">{s.suggestedAction}</p>
                    ) : <span className="text-xs text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-sm">No students match your filters</p>
          </div>
        )}
      </div>

      {showAddStudentModal && (
        <AddStudentModal onClose={() => setShowAddStudentModal(false)} />
      )}
    </div>
  )
}

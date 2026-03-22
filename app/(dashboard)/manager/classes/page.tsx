'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users, Calendar, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateClassModal } from '@/components/modals/CreateClassModal'
import {
  ADMIN_CLASSES,
  type AdminClass,
  type AdminStatusBadge,
} from '@/lib/admin-data'

// ── Helpers ────────────────────────────────────────────────────

function StatusBadge({ s }: { s: AdminStatusBadge }) {
  const map: Record<AdminStatusBadge, string> = {
    'on-track': 'bg-green-100 text-green-700',
    'at-risk':  'bg-amber-100 text-amber-700',
    'critical': 'bg-red-100 text-red-700',
    'completed':'bg-blue-100 text-blue-700',
    'upcoming': 'bg-gray-100 text-gray-600',
  }
  const labels: Record<AdminStatusBadge, string> = {
    'on-track': 'On Track', 'at-risk': 'At Risk', 'critical': 'Critical',
    'completed': 'Completed', 'upcoming': 'Upcoming',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', map[s])}>
      {labels[s]}
    </span>
  )
}

function MiniBar({ value, good, warn }: { value: number; good: number; warn: number }) {
  const color = value >= good ? 'bg-green-500' : value >= warn ? 'bg-amber-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={cn('h-1.5 rounded-full', color)} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className={cn('text-xs font-medium tabular-nums', value >= good ? 'text-green-700' : value >= warn ? 'text-amber-600' : 'text-red-600')}>
        {value}%
      </span>
    </div>
  )
}

// ── Summary strip ──────────────────────────────────────────────

function SummaryStrip({ classes }: { classes: AdminClass[] }) {
  const total      = classes.length
  const critical   = classes.filter(c => c.status === 'critical').length
  const atRisk     = classes.filter(c => c.status === 'at-risk').length
  const onTrack    = classes.filter(c => c.status === 'on-track').length
  const avgHw      = Math.round(classes.reduce((s, c) => s + c.hwPct, 0) / total)
  const avgAtt     = Math.round(classes.reduce((s, c) => s + c.attendancePct, 0) / total)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {[
        { label: 'Total Classes',  value: total,   color: 'text-gray-800' },
        { label: 'Critical',       value: critical, color: 'text-red-600' },
        { label: 'At Risk',        value: atRisk,   color: 'text-amber-600' },
        { label: 'On Track',       value: onTrack,  color: 'text-green-600' },
        { label: 'Avg HW %',       value: `${avgHw}%`, color: avgHw >= 75 ? 'text-green-600' : 'text-amber-600' },
        { label: 'Avg Attendance', value: `${avgAtt}%`, color: avgAtt >= 80 ? 'text-green-600' : 'text-amber-600' },
      ].map(s => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 font-medium">{s.label}</p>
          <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
        </div>
      ))}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────

type SortKey = 'name' | 'hwPct' | 'avgScore' | 'attendancePct' | 'daysToExam'

export default function ManagerClassesPage() {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  
  const [search,     setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminStatusBadge | ''>('')
  const [teacherFilter, setTeacherFilter] = useState('')
  const [sortKey,    setSortKey]    = useState<SortKey>('name')
  const [sortAsc,    setSortAsc]    = useState(true)

  const teachers = Array.from(new Set(ADMIN_CLASSES.map(c => c.teacher)))

  const filtered = ADMIN_CLASSES
    .filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.code.toLowerCase().includes(search.toLowerCase())) return false
      if (statusFilter && c.status !== statusFilter) return false
      if (teacherFilter && c.teacher !== teacherFilter) return false
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
    else { setSortKey(key); setSortAsc(true) }
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

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ADMIN_CLASSES.length} active classes</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          + New Class
        </button>
      </div>

      {/* Summary */}
      <SummaryStrip classes={ADMIN_CLASSES} />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="search"
            placeholder="Search class or code…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as AdminStatusBadge | '')}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All statuses</option>
          <option value="critical">Critical</option>
          <option value="at-risk">At Risk</option>
          <option value="on-track">On Track</option>
        </select>
        <select
          value={teacherFilter}
          onChange={e => setTeacherFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All teachers</option>
          {teachers.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <SortTh label="Class" k="name" />
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Teacher</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Schedule</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400">Students</th>
                <SortTh label="HW %" k="hwPct" />
                <SortTh label="Avg Band" k="avgScore" />
                <SortTh label="Attendance" k="attendancePct" />
                <SortTh label="Exam" k="daysToExam" />
                <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(cls => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/manager/classes/${cls.id}`)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{cls.name}</p>
                    <p className="text-xs text-gray-400">{cls.code} · {cls.courseLevel}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{cls.teacher}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cls.schedule}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600">{cls.studentsEnrolled}/{cls.capacity}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <MiniBar value={cls.hwPct} good={75} warn={60} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('font-semibold', cls.avgScore >= 6 ? 'text-green-700' : cls.avgScore >= 5 ? 'text-amber-600' : 'text-red-600')}>
                      {cls.avgScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <MiniBar value={cls.attendancePct} good={80} warn={70} />
                  </td>
                  <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                    {cls.daysToExam !== null ? (
                      <span className={cn('font-semibold', cls.daysToExam <= 14 ? 'text-red-600' : cls.daysToExam <= 30 ? 'text-amber-600' : 'text-gray-500')}>
                        {cls.daysToExam}d
                      </span>
                    ) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge s={cls.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <BookOpen className="w-8 h-8 mb-2" />
            <p className="text-sm">No classes match your filters</p>
          </div>
        )}
      </div>

      {showCreate && <CreateClassModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

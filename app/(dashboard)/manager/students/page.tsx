'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStudents } from '../actions'
import { AddStudentModal } from '@/components/modals/AddStudentModal'

// ── Helpers ────────────────────────────────────────────────────

function RiskBadge({ flag }: { flag: string }) {
  if (flag === 'critical') return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">Critical</span>
  if (flag === 'at-risk')  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">At Risk</span>
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">OK</span>
}

// ── Page ───────────────────────────────────────────────────────

export default function ManagerStudentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)

  useEffect(() => {
    async function loadData() {
      const res = await getStudents()
      if (res.success) {
        setStudents(res.data)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  )

  if (loading) return <div className="p-8 text-center text-gray-400">Loading students...</div>

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500 mt-0.5">{students.length} enrolled students</p>
        </div>
        <button 
          onClick={() => setShowAddStudentModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Add Student
        </button>
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
        <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Student</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Class</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Attendance</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Avg Band</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Risk</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => {
                const enrolment = s.enrolments?.[0]
                const attendancePct = s.attendance?.length 
                  ? Math.round((s.attendance.filter((a: any) => a.status === 'Present').length / s.attendance.length) * 100)
                  : 0
                const avgScore = s.assessments?.length
                  ? (s.assessments.reduce((sum: number, a: any) => sum + Number(a.score || 0), 0) / s.assessments.length).toFixed(1)
                  : 'N/A'

                return (
                  <tr key={s.id} onClick={() => router.push(`/manager/students/${s.id}`)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{enrolment?.class?.class_name || 'Not enrolled'}</td>
                    <td className="px-4 py-3">
                      <span className={cn('font-medium', attendancePct >= 80 ? 'text-green-700' : attendancePct >= 70 ? 'text-amber-600' : 'text-red-600')}>
                        {attendancePct}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-indigo-600">{avgScore}</span>
                    </td>
                    <td className="px-4 py-3"><RiskBadge flag="ok" /></td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-indigo-600 font-bold hover:underline">View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <Users className="w-8 h-8 mb-2" />
            <p className="text-sm">No students match your search</p>
          </div>
        )}
      </div>

      {showAddStudentModal && (
        <AddStudentModal onClose={() => setShowAddStudentModal(false)} />
      )}
    </div>
  )
}

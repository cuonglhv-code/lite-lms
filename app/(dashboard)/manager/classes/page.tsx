'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users, Calendar, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CreateClassModal } from '@/components/modals/CreateClassModal'
import { getClasses } from '../actions'

// ── Helpers ────────────────────────────────────────────────────

function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    'On Track': 'bg-green-100 text-green-700',
    'At Risk':  'bg-amber-100 text-amber-700',
    'Critical': 'bg-red-100 text-red-700',
    'Completed':'bg-blue-100 text-blue-700',
    'Upcoming': 'bg-gray-100 text-gray-600',
    'Open for enrolment': 'bg-green-100 text-green-700',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', map[s] || 'bg-gray-100 text-gray-600')}>
      {s}
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

// ── Page ───────────────────────────────────────────────────────

export default function ManagerClassesPage() {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [classes, setClasses] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadData() {
      const res = await getClasses()
      if (res.success) {
        setClasses(res.data)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  const filtered = classes.filter(c => 
    c.class_name.toLowerCase().includes(search.toLowerCase()) || 
    c.class_code.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="p-8 text-center text-gray-400">Loading classes...</div>

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{classes.length} active classes</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          + New Class
        </button>
      </div>

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
        <span className="ml-auto text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Class</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Teacher</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Schedule</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400">Students</th>
                <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(cls => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/manager/classes/${cls.id}`)}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{cls.class_name}</p>
                    <p className="text-xs text-gray-400">{cls.class_code} · {cls.course?.level}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{cls.teacher?.name || 'Unassigned'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cls.schedule}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-gray-600">{cls.enrolments?.length}/{cls.capacity}</span>
                    </div>
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
            <p className="text-sm">No classes match your search</p>
          </div>
        )}
      </div>

      {showCreate && <CreateClassModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}

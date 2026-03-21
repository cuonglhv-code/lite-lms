'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { ClassWithTeacher, AssignmentWithSubmission } from '@/lib/types'
import ClassHeader from '@/components/student/ClassHeader'
import AssignmentCard from '@/components/student/AssignmentCard'

type Filter = 'all' | 'not_submitted' | 'submitted' | 'returned'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'not_submitted', label: 'Not submitted' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'returned', label: 'Returned' },
]

export default function ClassAssignmentsPage() {
  const { classId } = useParams<{ classId: string }>()
  const [cls, setCls] = useState<ClassWithTeacher | null>(null)
  const [assignments, setAssignments] = useState<AssignmentWithSubmission[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [clsRes, assignRes] = await Promise.all([
        fetch(`/api/classes/${classId}`).then(r => r.json()),
        fetch(`/api/student/class/${classId}/assignments`).then(r => r.json()),
      ])
      setCls(clsRes)
      setAssignments(Array.isArray(assignRes) ? assignRes : [])
      setLoading(false)
    }
    load()
  }, [classId])

  const filtered = assignments.filter(a => {
    if (filter === 'all') return true
    const status = a.submission?.status ?? 'not_submitted'
    return status === filter
  })

  if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading…</div>
  if (!cls) return <div className="text-red-500 text-sm">Class not found.</div>

  return (
    <div className="space-y-6">
      <ClassHeader cls={cls} />

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {f.label}
            {f.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-75">
                ({assignments.filter(a => (a.submission?.status ?? 'not_submitted') === f.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Assignment list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-400 text-sm">No assignments in this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <AssignmentCard
              key={a.id}
              assignment={a}
              classId={classId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

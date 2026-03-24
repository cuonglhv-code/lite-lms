'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useParams } from 'next/navigation'
import type { ClassWithTeacher, AssignmentWithSubmission } from '@/lib/types'
import ClassHeader from '@/components/student/ClassHeader'
import AssignmentCard from '@/components/student/AssignmentCard'
import { ClipboardList, PenLine } from 'lucide-react'

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
  const pathname = usePathname()
  const isActivities = pathname.includes('/activities')

  useEffect(() => {
    async function load() {
      try {
        const [clsRes, assignRes] = await Promise.all([
          fetch(`/api/classes/${classId}`).then(r => {
            if (!r.ok) throw new Error('Failed to fetch class')
            return r.json()
          }),
          fetch(`/api/student/class/${classId}/assignments`).then(r => {
            if (!r.ok) throw new Error('Failed to fetch assignments')
            return r.json()
          }),
        ])
        setCls(clsRes)
        setAssignments(Array.isArray(assignRes) ? assignRes : [])
      } catch (error) {
        console.error('Load class error:', error)
        setCls(null)
        setAssignments([])
      } finally {
        setLoading(false)
      }
    }
    if (classId) load()
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
      
      {/* Course Sub-navigation */}
      <div className="flex border-b border-[var(--color-border)] mb-4">
        <Link
          href={`/student/class/${classId}`}
          className={`px-6 py-3 border-b-2 text-sm flex items-center gap-2 transition-all ${
            !isActivities
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-bold'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)] font-medium'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Assignments
        </Link>
        <Link
          href={`/courses/${cls.course_id}/activities`}
          className={`px-6 py-3 border-b-2 text-sm flex items-center gap-2 transition-all ${
            isActivities
              ? 'border-[var(--color-primary)] text-[var(--color-primary)] font-bold'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border)] font-medium'
          }`}
        >
          <PenLine className="w-4 h-4" />
          IELTS Writing Tasks
        </Link>
      </div>

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

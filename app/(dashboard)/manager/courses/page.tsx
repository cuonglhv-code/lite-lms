'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, Users, TrendingUp } from 'lucide-react'
import { CreateCourseModal } from '@/components/modals/CreateCourseModal'
import { EditCourseModal } from '@/components/modals/EditCourseModal'
import {
  ADMIN_COURSES,
  type AdminCourse,
  type CourseStatus,
} from '@/lib/admin-data'

// ── Helpers ────────────────────────────────────────────────────

function StatusBadge({ status }: { status: CourseStatus }) {
  const map: Record<CourseStatus, string> = {
    active:   'bg-green-100 text-green-700',
    draft:    'bg-gray-100 text-gray-600',
    archived: 'bg-red-100 text-red-600',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize', map[status])}>
      {status}
    </span>
  )
}

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)
}

function CourseCard({ course: c, onEdit, onViewClasses }: { course: AdminCourse, onEdit: (c: AdminCourse) => void, onViewClasses: (c: AdminCourse) => void }) {
  return (
    <div className={cn(
      'bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow',
      c.status === 'draft' && 'opacity-75'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-snug">{c.name}</p>
            <p className="text-xs text-gray-400">{c.code} · {c.level}</p>
          </div>
        </div>
        <StatusBadge status={c.status} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-base font-bold text-gray-800">{c.activeClasses}</p>
          <p className="text-[10px] text-gray-400">Classes</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <Users className="w-3 h-3 text-gray-400" />
            <p className="text-base font-bold text-gray-800">{c.studentsEnrolled}</p>
          </div>
          <p className="text-[10px] text-gray-400">Students</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            <p className="text-base font-bold text-green-600">+{c.avgBandGain}</p>
          </div>
          <p className="text-[10px] text-gray-400">Avg gain</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
        <span>{c.durationWeeks} weeks</span>
        <span className="font-medium text-gray-700">{formatVND(c.basePrice)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button onClick={() => onEdit(c)} className="flex-1 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
          Edit
        </button>
        <button onClick={() => onViewClasses(c)} className="flex-1 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          View Classes
        </button>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────

export default function ManagerCoursesPage() {
  const router = useRouter()
  const [showCreate, setShowCreate] = useState(false)
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null)

  const active   = ADMIN_COURSES.filter(c => c.status === 'active')
  const draft    = ADMIN_COURSES.filter(c => c.status === 'draft')
  const totalStudents = ADMIN_COURSES.reduce((s, c) => s + c.studentsEnrolled, 0)
  const avgGain  = (ADMIN_COURSES.filter(c => c.status === 'active').reduce((s, c) => s + c.avgBandGain, 0) / active.length).toFixed(1)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ADMIN_COURSES.length} courses in catalogue</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          + New Course
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Courses',    value: active.length,   color: 'text-green-600' },
          { label: 'Draft',             value: draft.length,    color: 'text-gray-500' },
          { label: 'Total Students',    value: totalStudents,   color: 'text-gray-800' },
          { label: 'Avg Band Gain',     value: `+${avgGain}`,   color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Active courses */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Active Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {active.map(c => <CourseCard key={c.id} course={c} onEdit={setEditingCourse} onViewClasses={(course) => router.push(`/manager/classes?course=${course.id}`)} />)}
        </div>
      </div>

      {/* Draft courses */}
      {draft.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3">Draft / Upcoming</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {draft.map(c => <CourseCard key={c.id} course={c} onEdit={setEditingCourse} onViewClasses={(course) => router.push(`/manager/classes?course=${course.id}`)} />)}
          </div>
        </div>
      )}

      {/* Comparison table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Course Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-50 bg-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-medium">Course</th>
                <th className="text-center px-4 py-2.5 font-medium">Level</th>
                <th className="text-center px-4 py-2.5 font-medium">Duration</th>
                <th className="text-center px-4 py-2.5 font-medium">Classes</th>
                <th className="text-center px-4 py-2.5 font-medium">Students</th>
                <th className="text-center px-4 py-2.5 font-medium">Avg Band Gain</th>
                <th className="text-right px-5 py-2.5 font-medium">Price</th>
                <th className="text-center px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ADMIN_COURSES.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.code}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">{c.level}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">{c.durationWeeks}w</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-700">{c.activeClasses}</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-700">{c.studentsEnrolled}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-green-600">+{c.avgBandGain}</span>
                  </td>
                  <td className="px-5 py-3 text-right text-xs text-gray-600">{formatVND(c.basePrice)}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && <CreateCourseModal onClose={() => setShowCreate(false)} />}
      {editingCourse && <EditCourseModal course={editingCourse} onClose={() => setEditingCourse(null)} />}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'
import CourseCard from './CourseCard'
import Link from 'next/link'
import type { CourseSummary } from '@/lib/types'

const PAGE_SIZE = 3

interface Props {
  courses: CourseSummary[]
}

export default function CourseList({ courses }: Props) {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(courses.length / PAGE_SIZE)
  const slice = courses.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const from = page * PAGE_SIZE + 1
  const to = Math.min((page + 1) * PAGE_SIZE, courses.length)

  if (courses.length === 0) {
    return (
      <section className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
        <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No enrolled courses yet.</p>
        <p className="text-gray-400 text-sm mt-1">Contact your academic manager to get enrolled.</p>
      </section>
    )
  }

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">
          My Courses
          <span className="ml-2 text-sm font-normal text-gray-400">({courses.length})</span>
        </h2>
        <Link href="/student/courses" className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors">
          View all →
        </Link>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {slice.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Showing {from}–{to} of {courses.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100
                         disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded-md text-xs font-medium transition-colors
                  ${i === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100
                         disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

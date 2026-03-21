'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import {
  Video, BookOpen, Headphones, PenLine, Dumbbell,
  MoreVertical, Clock, Sparkles,
} from 'lucide-react'
import type { CourseSummary } from '@/lib/types'
import type { ActivityType } from '@/lib/dashboard-data'

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  video:     <Video     className="w-3.5 h-3.5" />,
  reading:   <BookOpen  className="w-3.5 h-3.5" />,
  listening: <Headphones className="w-3.5 h-3.5" />,
  writing:   <PenLine   className="w-3.5 h-3.5" />,
  practice:  <Dumbbell  className="w-3.5 h-3.5" />,
}

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  video:     'Video',
  reading:   'Reading',
  listening: 'Listening',
  writing:   'Writing',
  practice:  'Practice',
}

function OverflowMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={e => { e.preventDefault(); setOpen(o => !o) }}
        className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="More options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            View syllabus
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Unenroll
          </button>
        </div>
      )}
    </div>
  )
}

interface Props {
  course: CourseSummary
}

export default function CourseCard({ course }: Props) {
  const pct = course.percentComplete

  // Progress bar color
  const barColor = pct >= 80 ? 'bg-green-500' : pct >= 40 ? 'bg-indigo-500' : 'bg-amber-400'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Row 1: provider + class code + overflow */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-400 flex-1 truncate">{course.courseName}</span>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-100
                         rounded-full px-2 py-0.5 shrink-0">
          {course.classCode}
        </span>
        <OverflowMenu />
      </div>

      {/* Row 2: Course title (links to class page) */}
      <Link
        href={`/student/class/${course.id}`}
        className="block text-base font-semibold text-gray-900 hover:text-indigo-700 transition-colors
                   leading-snug mb-3 line-clamp-2"
      >
        {course.title}
      </Link>

      {/* Row 3: Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Row 4: % + estimated completion */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span className="font-semibold text-gray-700">{pct}% complete</span>
        <span>Est. {course.estimatedCompletion}</span>
      </div>

      {/* Row 5: Next activity chip or all done */}
      {course.nextActivity ? (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
          <span className="text-indigo-400 shrink-0">
            {ACTIVITY_ICONS[course.nextActivity.type]}
          </span>
          <div className="min-w-0 flex-1">
            <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {ACTIVITY_LABELS[course.nextActivity.type]} · Next up
            </span>
            <p className="text-sm text-gray-700 font-medium truncate">
              {course.nextActivity.title}
            </p>
          </div>
          <span className="flex items-center gap-0.5 text-xs text-gray-400 shrink-0">
            <Clock className="w-3 h-3" />
            {course.nextActivity.durationMinutes}m
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
          <Sparkles className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-700">All caught up!</span>
        </div>
      )}

      {/* Teacher + schedule */}
      <p className="text-xs text-gray-400 mt-3">
        {course.teacherName}{course.schedule ? ` · ${course.schedule}` : ''}
      </p>
    </div>
  )
}

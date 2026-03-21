import Link from 'next/link'
import type { ClassWithTeacher } from '@/lib/types'

// Generate a consistent accent color from a string
function accentFromCode(code: string) {
  const palette = [
    { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    { bg: 'bg-amber-500',   light: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200'   },
    { bg: 'bg-sky-500',     light: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200'     },
    { bg: 'bg-rose-500',    light: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200'    },
    { bg: 'bg-violet-500',  light: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200'  },
  ]
  const idx = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length
  return palette[idx]
}

interface Props {
  cls: ClassWithTeacher
}

export default function ClassCard({ cls }: Props) {
  const accent = accentFromCode(cls.class_code)

  return (
    <Link
      href={`/student/class/${cls.id}`}
      className="group block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all overflow-hidden"
    >
      {/* Color strip */}
      <div className={`h-2 ${accent.bg}`} />

      <div className="p-5">
        <h2 className="font-semibold text-gray-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
          {cls.class_name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{cls.course_name}</p>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Teacher: <span className="font-medium text-gray-700">{cls.teacher_name}</span>
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${accent.light} ${accent.text} border ${accent.border}`}>
            {cls.class_code}
          </span>
        </div>

        {cls.schedule && (
          <p className="text-xs text-gray-400 mt-2">{cls.schedule}</p>
        )}
      </div>
    </Link>
  )
}

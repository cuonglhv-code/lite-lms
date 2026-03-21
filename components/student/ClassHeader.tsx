import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { ClassWithTeacher } from '@/lib/types'

interface Props {
  cls: ClassWithTeacher
}

export default function ClassHeader({ cls }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="h-2 bg-indigo-500" />
      <div className="px-6 py-5">
        <Link
          href="/student"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-indigo-600 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          My Classes
        </Link>
        <h1 className="text-xl font-bold text-gray-900">{cls.class_name}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {cls.course_name} · Teacher: <span className="font-medium text-gray-700">{cls.teacher_name}</span>
        </p>
        {cls.schedule && (
          <p className="text-xs text-gray-400 mt-1">{cls.schedule}</p>
        )}
      </div>
    </div>
  )
}

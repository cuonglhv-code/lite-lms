import { ENROLLED_COURSES } from '@/lib/student-data'
import Link from 'next/link'
import { ArrowRight, BookOpen } from 'lucide-react'

export const metadata = { title: 'My Courses – Jaxtina LMS' }

export default function StudentCoursesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
        <p className="text-sm text-gray-500 mt-1">Courses you are currently enrolled in.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ENROLLED_COURSES.map(c => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 flex-1 space-y-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-2">{c.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Teacher: {c.teacher}</p>
                <p className="text-xs text-gray-500">Next class: {c.nextClass}</p>
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{c.percentComplete}% Complete</span>
                  <span>ETA: {c.eta}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 transition-all rounded-full" style={{ width: `${c.percentComplete}%` }} />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-100 mt-auto">
              <Link href={`/student/class/${c.classId}`} className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Continue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

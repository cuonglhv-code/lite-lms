"use client"

import { CATALOG_COURSES } from '@/lib/student-data'
import { BookOpen } from 'lucide-react'

export default function StudentCatalogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
        <p className="text-sm text-gray-500 mt-1">Browse and enrol in new courses to expand your learning.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATALOG_COURSES.map(c => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-5 flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-100 text-gray-600">
                  {c.level}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 line-clamp-2">{c.title}</h3>
                <p className="text-xs text-gray-400 mt-1">Duration: {c.duration}</p>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {c.description}
              </p>
            </div>
            <div className="p-4 border-t border-gray-100 mt-auto">
              <button 
                onClick={() => alert(`Enrolment requested for ${c.title}`)}
                className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Enrol Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

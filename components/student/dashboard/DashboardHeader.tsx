// Sticky top navigation header for the student-facing LMS shell

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Bell } from 'lucide-react'
import UserMenu from '@/components/dashboard/UserMenu'

interface Props {
  userName: string
  userEmail: string
  userInitial: string
}

export default function DashboardHeader({ userName, userEmail, userInitial }: Props) {
  const [searchVal, setSearchVal] = useState('')

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link href="/student" className="flex items-center gap-2 shrink-0">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-gray-900 text-lg tracking-tight hidden sm:block">
            Jaxtina<span className="text-indigo-600">LMS</span>
          </span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium" aria-label="Main navigation">
          <Link href="/student" className="px-3 py-2 rounded-md text-indigo-600 bg-indigo-50 font-semibold">
            My Learning
          </Link>
          <Link href="/student" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
            Courses
          </Link>
          <Link href="/student" className="px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
            Catalog
          </Link>
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-sm relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search lessons, topics, tests…"
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            aria-label="Search"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <button
            aria-label="Notifications"
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" aria-hidden="true" />
          </button>

          <UserMenu userName={userName} userEmail={userEmail} userInitial={userInitial} />
        </div>
      </div>
    </header>
  )
}

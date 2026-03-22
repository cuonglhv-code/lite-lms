// Sticky top navigation header for the student-facing LMS shell

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Search, Bell } from 'lucide-react'
import UserMenu from '@/components/dashboard/UserMenu'
import { NOTIFICATIONS, SEARCH_ITEMS } from '@/lib/student-data'

interface Props {
  userName: string
  userEmail: string
  userInitial: string
}

export default function DashboardHeader({ userName, userEmail, userInitial }: Props) {
  const [searchVal, setSearchVal] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [readNotifs, setReadNotifs] = useState(new Set(NOTIFICATIONS.filter(n => n.read).map(n => n.id)))

  const filteredSearch = SEARCH_ITEMS.filter(s => s.title.toLowerCase().includes(searchVal.toLowerCase()))
  const unreadCount = NOTIFICATIONS.length - readNotifs.size

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
          <Link href="/student" className="px-3 py-2 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
            My Learning
          </Link>
          <Link href="/student/courses" className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600">
            Courses
          </Link>
          <Link href="/student/catalog" className="px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-600">
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
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            aria-label="Search"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
          {showSearch && searchVal && (
            <div className="absolute top-12 left-0 w-full bg-white border rounded-xl shadow-lg p-2 z-50">
              {filteredSearch.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No results found.</p>
              ) : (
                filteredSearch.map(s => (
                  <Link key={s.id} href={s.href} className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.type}</p>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2 shrink-0 relative">
          <button
            aria-label="Notifications"
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" aria-hidden="true" />}
          </button>
          
          {showNotifs && (
            <div className="absolute top-12 right-0 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
                <button onClick={() => setReadNotifs(new Set(NOTIFICATIONS.map(n => n.id)))} className="text-xs text-indigo-600 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {NOTIFICATIONS.length === 0 ? (
                   <p className="text-sm text-gray-500 text-center py-4">No notifications.</p>
                ) : NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors ${readNotifs.has(n.id) ? 'opacity-60' : ''}`}>
                    <p className="font-semibold text-sm text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{n.body}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{n.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <UserMenu userName={userName} userEmail={userEmail} userInitial={userInitial} />
        </div>
      </div>
    </header>
  )
}

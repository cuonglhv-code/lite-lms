'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { BookOpen, LogOut } from 'lucide-react'
import { CenterSwitcher } from './CenterSwitcher'
import {
  MANAGER_NAV_GROUPS,
  TEACHER_NAV_GROUPS,
  type NavBadges,
} from '@/lib/nav-config'

// Mock badge values — replace with real data fetch when DB is wired
const MOCK_BADGES: NavBadges = {
  atRiskCount: 5,
  pendingEnrolments: 2,
  overduePayments: 3,
  unreadNotifications: 5,
  ungradedHomework: 2,
}

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-red-100 text-red-700 text-[11px] font-semibold flex items-center justify-center tabular-nums">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function Sidebar({ role, userName }: { role: string; userName: string }) {
  const pathname = usePathname()
  const groups = role === 'manager' || role === 'admin' || role === 'academic_manager' ? MANAGER_NAV_GROUPS : TEACHER_NAV_GROUPS

  function isActive(href: string) {
    if (href === '/manager' || href === '/teacher') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-gray-200 shrink-0">
        <BookOpen className="w-5 h-5 text-indigo-600 shrink-0" />
        <span className="font-bold text-gray-900 text-base tracking-tight">
          Jaxtina<span className="text-indigo-600">LMS</span>
        </span>
      </div>

      <div className="px-3 pt-4">
        <CenterSwitcher />
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {groups.map(group => (
          <div key={group.label} className="mb-5">
            <p className="px-2 mb-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase select-none">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href)
                const Icon = item.icon
                const badgeCount = item.badgeKey ? MOCK_BADGES[item.badgeKey] : 0
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-colors',
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <Icon
                        className={cn('w-4 h-4 shrink-0', active ? 'text-indigo-600' : 'text-gray-400')}
                      />
                      <span className="flex-1">{item.label}</span>
                      {badgeCount > 0 && <Badge count={badgeCount} />}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-200">
        <div className="px-2 mb-2">
          <p className="text-xs font-medium text-gray-700 truncate">{userName}</p>
          <p className="text-[11px] text-gray-400 capitalize">{role}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign out
        </button>
      </div>
    </aside>
  )
}

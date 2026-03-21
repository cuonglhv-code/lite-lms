'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const managerLinks = [
  { href: '/manager',          label: 'Dashboard' },
  { href: '/manager/classes',  label: 'All Classes' },
  { href: '/manager/students', label: 'All Students' },
]

const teacherLinks = [
  { href: '/teacher',         label: 'My Dashboard' },
  { href: '/teacher/classes', label: 'My Classes' },
]

export default function Sidebar({ role, userName }: { role: string; userName: string }) {
  const pathname = usePathname()
  const links = role === 'manager' ? managerLinks : teacherLinks

  return (
    <aside className="w-56 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="text-lg font-bold text-indigo-600">Jaxtina LMS</div>
        <div className="text-xs text-gray-500 mt-0.5 capitalize">{role}</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === link.href || pathname.startsWith(link.href + '/')
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <div className="text-xs text-gray-500 mb-2 truncate">{userName}</div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full text-left text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded hover:bg-red-50"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}

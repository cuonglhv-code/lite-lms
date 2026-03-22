// Full-featured avatar dropdown menu: profile header, nav links, upgrade strip

'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ChevronDown, User, ShoppingBag, Settings, Bell,
  Trophy, HelpCircle, LogOut,
} from 'lucide-react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { PROFILE_USER } from '@/lib/profile-data'

interface Props {
  userName: string
  userEmail: string
  userInitial: string
}

const NAV_ITEMS = [
  { icon: User,        label: 'Profile',         href: '/dashboard/profile',        badge: false },
  { icon: ShoppingBag, label: 'My Purchases',    href: '/dashboard/purchases',      badge: false },
  { icon: Settings,    label: 'Settings',        href: '/dashboard/settings',       badge: false },
  { icon: Bell,        label: 'Updates',         href: '/dashboard/updates',        badge: true  },
  { icon: Trophy,      label: 'Accomplishments', href: '/dashboard/accomplishments', badge: false },
  { icon: HelpCircle,  label: 'Help Center',     href: '/dashboard/help',           badge: false },
] as const

async function signOut() {
  const csrfRes = await fetch('/api/auth/csrf')
  const { csrfToken } = await csrfRes.json()
  await fetch('/api/auth/signout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `csrfToken=${csrfToken}`,
  })
  window.location.href = '/login'
}

export default function UserMenu({ userName, userEmail, userInitial }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { hasUpdates } = PROFILE_USER

  useOnClickOutside(ref, () => setOpen(false))

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
        className="flex items-center gap-1.5 p-1 rounded-full hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm select-none">
          {userInitial}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="menu"
          aria-label="User menu"
          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50
                     origin-top-right transition-all duration-150 ease-out"
        >
          {/* ── Profile header ── */}
          <div className="px-4 pt-4 pb-3 flex items-start gap-3" aria-hidden="true">
            <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              <span className="inline-block mt-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">
                {PROFILE_USER.goal.targetBand}
              </span>
            </div>
          </div>

          <div className="h-px bg-gray-100 mx-2" />

          {/* ── Nav items ── */}
          <ul className="py-1.5 px-1" role="none">
            {NAV_ITEMS.map(({ icon: Icon, label, href, badge }) => (
              <li key={href} role="none">
                <Link
                  href={href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-700
                             hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:bg-gray-50"
                >
                  <Icon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {badge && hasUpdates && (
                    <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-label="New updates" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="h-px bg-gray-100 mx-2" />

          {/* ── Log out ── */}
          <div className="py-1.5 px-1">
            <button
              role="menuitem"
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600
                         hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:bg-red-50"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

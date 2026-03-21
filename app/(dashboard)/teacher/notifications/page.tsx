'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TEACHER_NOTIFICATIONS, type NotifType, type NotifPriority } from '@/lib/teacher-data'

type FilterKey = 'all' | NotifType

function priorityStyle(p: NotifPriority) {
  if (p === 'critical') return 'border-l-red-500 bg-red-50/40'
  if (p === 'high')     return 'border-l-amber-500 bg-amber-50/40'
  if (p === 'medium')   return 'border-l-indigo-400 bg-indigo-50/20'
  return 'border-l-gray-300 bg-white'
}

function priorityDot(p: NotifPriority) {
  if (p === 'critical') return 'bg-red-500'
  if (p === 'high')     return 'bg-amber-500'
  if (p === 'medium')   return 'bg-indigo-400'
  return 'bg-gray-300'
}

function priorityLabel(p: NotifPriority) {
  if (p === 'critical') return <span className="text-[10px] font-bold uppercase tracking-wide text-red-600 bg-red-100 px-1.5 py-0.5 rounded">Critical</span>
  if (p === 'high')     return <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">High</span>
  if (p === 'medium')   return <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded">Medium</span>
  return <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Info</span>
}

function typeIcon(t: NotifType) {
  if (t === 'exam')       return '🎯'
  if (t === 'attendance') return '📋'
  if (t === 'homework')   return '📝'
  return '🔔'
}

const FILTER_TABS: { key: FilterKey; label: string }[] = [
  { key: 'all',        label: 'All' },
  { key: 'exam',       label: 'Exam' },
  { key: 'attendance', label: 'Attendance' },
  { key: 'homework',   label: 'Homework' },
  { key: 'admin',      label: 'Admin' },
]

export default function NotificationsPage() {
  const [filter,    setFilter]    = useState<FilterKey>('all')
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [readSet,   setReadSet]   = useState<Set<string>>(
    new Set(TEACHER_NOTIFICATIONS.filter(n => n.read).map(n => n.id))
  )

  function dismiss(id: string) {
    setDismissed(prev => new Set(prev).add(id))
  }

  function markRead(id: string) {
    setReadSet(prev => new Set(prev).add(id))
  }

  function markAllRead() {
    setReadSet(new Set(TEACHER_NOTIFICATIONS.map(n => n.id)))
  }

  const visible = TEACHER_NOTIFICATIONS.filter(n => {
    if (dismissed.has(n.id)) return false
    if (filter !== 'all' && n.type !== filter) return false
    return true
  })

  const criticalCount  = TEACHER_NOTIFICATIONS.filter(n => n.priority === 'critical' && !n.read && !dismissed.has(n.id)).length
  const highCount      = TEACHER_NOTIFICATIONS.filter(n => n.priority === 'high' && !n.read && !dismissed.has(n.id)).length
  const totalUnread    = TEACHER_NOTIFICATIONS.filter(n => !readSet.has(n.id) && !dismissed.has(n.id)).length

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalUnread > 0 ? `${totalUnread} unread` : 'All caught up'} · Alerts, reminders &amp; flags
          </p>
        </div>
        {totalUnread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold shrink-0 mt-1"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Critical', value: criticalCount, color: criticalCount > 0 ? 'text-red-600' : 'text-gray-800', bg: criticalCount > 0 ? 'border-red-200 bg-red-50/50' : 'border-gray-200 bg-white' },
          { label: 'High',     value: highCount,     color: highCount > 0 ? 'text-amber-600' : 'text-gray-800', bg: highCount > 0 ? 'border-amber-200 bg-amber-50/50' : 'border-gray-200 bg-white' },
          { label: 'Unread',   value: totalUnread,   color: totalUnread > 0 ? 'text-indigo-600' : 'text-gray-800', bg: 'border-gray-200 bg-white' },
        ].map(s => (
          <div key={s.label} className={cn('rounded-xl border p-4', s.bg)}>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {FILTER_TABS.map(({ key, label }) => {
          const count = key === 'all'
            ? TEACHER_NOTIFICATIONS.filter(n => !dismissed.has(n.id)).length
            : TEACHER_NOTIFICATIONS.filter(n => n.type === key && !dismissed.has(n.id)).length
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5',
                filter === key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {label}
              {count > 0 && (
                <span className={cn(
                  'text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none',
                  filter === key ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                )}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Notification list */}
      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-base font-semibold text-gray-700">All clear!</p>
          <p className="text-sm text-gray-400 mt-1">No notifications in this category.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visible.map(n => {
            const isRead = readSet.has(n.id)
            return (
              <div
                key={n.id}
                className={cn(
                  'rounded-xl border-l-4 border border-gray-200 px-4 py-3.5 flex gap-3 transition-opacity',
                  priorityStyle(n.priority),
                  isRead && 'opacity-60'
                )}
              >
                {/* Dot */}
                <div className="pt-1 shrink-0">
                  <span className={cn('w-2 h-2 rounded-full block', priorityDot(n.priority))} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm">{typeIcon(n.type)}</span>
                    {priorityLabel(n.priority)}
                    {!isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                    )}
                  </div>
                  <p className={cn('text-sm font-semibold text-gray-800 leading-snug', isRead && 'font-medium text-gray-600')}>
                    {n.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <Link
                      href={n.actionHref}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline"
                    >
                      {n.actionLabel} →
                    </Link>
                    <span className="text-gray-200 text-xs">|</span>
                    {!isRead && (
                      <button
                        onClick={() => markRead(n.id)}
                        className="text-xs text-gray-400 hover:text-gray-600 font-medium"
                      >
                        Mark read
                      </button>
                    )}
                    {!isRead && <span className="text-gray-200 text-xs">|</span>}
                    <button
                      onClick={() => dismiss(n.id)}
                      className="text-xs text-gray-400 hover:text-red-500 font-medium"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="shrink-0 text-right">
                  <p className="text-[11px] text-gray-400 whitespace-nowrap">{n.createdAt}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {dismissed.size > 0 && (
        <p className="text-center text-xs text-gray-400">
          {dismissed.size} dismissed notification{dismissed.size > 1 ? 's' : ''} hidden.{' '}
          <button
            onClick={() => setDismissed(new Set())}
            className="text-indigo-500 hover:underline font-medium"
          >
            Restore all
          </button>
        </p>
      )}
    </div>
  )
}

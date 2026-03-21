'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CreditCard, Search, TrendingDown } from 'lucide-react'
import {
  ADMIN_PAYMENTS,
  FINANCE_KPIS,
  type PaymentStatus,
} from '@/lib/admin-data'

// ── Helpers ────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    paid:    'bg-green-100 text-green-700',
    partial: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize', map[status])}>
      {status}
    </span>
  )
}

function formatVND(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)
}

function CollectionBar({ collected, total }: { collected: number; total: number }) {
  const pct = total > 0 ? Math.round((collected / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>Collection Rate</span>
        <span className={cn('font-semibold', pct >= 90 ? 'text-green-600' : pct >= 75 ? 'text-amber-600' : 'text-red-600')}>{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-2 rounded-full', pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-amber-400' : 'bg-red-500')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────

type TabKey = 'all' | 'overdue' | 'partial' | 'paid'

export default function ManagerFinancePage() {
  const [tab,    setTab]    = useState<TabKey>('all')
  const [search, setSearch] = useState('')

  const filtered = ADMIN_PAYMENTS.filter(p => {
    if (search && !p.studentName.toLowerCase().includes(search.toLowerCase()) && !p.className.toLowerCase().includes(search.toLowerCase())) return false
    if (tab !== 'all') return p.status === tab
    return true
  })

  const tabCounts: Record<TabKey, number> = {
    all:     ADMIN_PAYMENTS.length,
    overdue: ADMIN_PAYMENTS.filter(p => p.status === 'overdue').length,
    partial: ADMIN_PAYMENTS.filter(p => p.status === 'partial').length,
    paid:    ADMIN_PAYMENTS.filter(p => p.status === 'paid').length,
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Finance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fee collection and payment tracking</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          Record Payment
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue',  value: formatVND(FINANCE_KPIS.totalRevenue),  color: 'text-gray-800' },
          { label: 'Collected',      value: formatVND(FINANCE_KPIS.collected),     color: 'text-green-600' },
          { label: 'Outstanding',    value: formatVND(FINANCE_KPIS.outstanding),   color: 'text-red-600' },
          { label: 'Overdue Count',  value: FINANCE_KPIS.overdueCount,             color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-xl font-bold mt-0.5 leading-tight', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Collection progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Collection Progress</h2>
            <p className="text-xs text-gray-400 mt-0.5">This billing period</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <TrendingDown className="w-3.5 h-3.5" />
            −6% vs last month
          </div>
        </div>
        <CollectionBar collected={FINANCE_KPIS.collected} total={FINANCE_KPIS.totalRevenue} />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{formatVND(FINANCE_KPIS.collected)} collected</span>
          <span>{formatVND(FINANCE_KPIS.outstanding)} remaining</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        {([['all','All'], ['overdue','Overdue'], ['partial','Partial'], ['paid','Paid']] as [TabKey, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            {label}
            <span className={cn('ml-1.5 text-xs px-1.5 py-0.5 rounded-full', tab === key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500')}>
              {tabCounts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="search"
            placeholder="Search student or class…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 w-60"
          />
        </div>
        <span className="ml-auto text-xs text-gray-400">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-medium">Student</th>
                <th className="text-left px-4 py-2.5 font-medium">Class</th>
                <th className="text-right px-4 py-2.5 font-medium">Amount Due</th>
                <th className="text-right px-4 py-2.5 font-medium">Paid</th>
                <th className="text-right px-4 py-2.5 font-medium">Balance</th>
                <th className="text-left px-4 py-2.5 font-medium">Due Date</th>
                <th className="text-center px-4 py-2.5 font-medium">Overdue</th>
                <th className="text-left px-4 py-2.5 font-medium">Last Payment</th>
                <th className="text-center px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className={cn('hover:bg-gray-50 transition-colors', p.status === 'overdue' && 'bg-red-50/20')}>
                  <td className="px-5 py-3 font-medium text-gray-800">{p.studentName}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{p.className}</td>
                  <td className="px-4 py-3 text-right text-xs text-gray-600">{formatVND(p.amountDue)}</td>
                  <td className="px-4 py-3 text-right text-xs text-green-600 font-medium">{formatVND(p.amountPaid)}</td>
                  <td className="px-4 py-3 text-right text-xs">
                    <span className={cn('font-semibold', p.balance > 0 ? 'text-red-600' : 'text-gray-400')}>
                      {formatVND(p.balance)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{p.dueDate}</td>
                  <td className="px-4 py-3 text-center">
                    {p.daysOverdue > 0 ? (
                      <span className={cn('text-xs font-semibold', p.daysOverdue >= 14 ? 'text-red-600' : 'text-amber-600')}>
                        {p.daysOverdue}d
                      </span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {p.lastPaymentDate ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-right">
                    {p.balance > 0 && (
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap">
                        Record
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 text-gray-400">
            <CreditCard className="w-8 h-8 mb-2" />
            <p className="text-sm">No payment records found</p>
          </div>
        )}
      </div>
    </div>
  )
}

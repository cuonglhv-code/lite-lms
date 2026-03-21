import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Minus,
  AlertTriangle, AlertCircle, Info, Bell,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ADMIN_KPIS,
  ADMIN_ALERTS,
  ADMIN_CLASSES,
  ADMIN_STUDENTS,
  type AdminKPI,
  type AdminAlert,
  type AdminStatusBadge,
} from '@/lib/admin-data'

// ── Helpers ────────────────────────────────────────────────────

function statusBadge(s: AdminStatusBadge) {
  const map: Record<AdminStatusBadge, string> = {
    'on-track': 'bg-green-100 text-green-700',
    'at-risk':  'bg-amber-100 text-amber-700',
    'critical': 'bg-red-100 text-red-700',
    'completed':'bg-blue-100 text-blue-700',
    'upcoming': 'bg-gray-100 text-gray-600',
  }
  const labels: Record<AdminStatusBadge, string> = {
    'on-track': 'On Track',
    'at-risk':  'At Risk',
    'critical': 'Critical',
    'completed':'Completed',
    'upcoming': 'Upcoming',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', map[s])}>
      {labels[s]}
    </span>
  )
}

function alertIcon(priority: AdminAlert['priority']) {
  if (priority === 'critical') return <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
  if (priority === 'high')     return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
  if (priority === 'medium')   return <Bell className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
  return <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
}

function alertBorder(priority: AdminAlert['priority']) {
  if (priority === 'critical') return 'border-l-red-500'
  if (priority === 'high')     return 'border-l-amber-400'
  if (priority === 'medium')   return 'border-l-blue-400'
  return 'border-l-gray-300'
}

function KPICard({ kpi }: { kpi: AdminKPI }) {
  const colorMap: Record<AdminKPI['color'], string> = {
    green: 'text-green-600',
    amber: 'text-amber-600',
    red:   'text-red-600',
    gray:  'text-gray-700',
  }
  return (
    <Link
      href={kpi.href}
      title={kpi.tooltip}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
    >
      <p className="text-xs text-gray-500 font-medium truncate">{kpi.label}</p>
      <p className={cn('text-2xl font-bold mt-1', colorMap[kpi.color])}>{kpi.value}</p>
      {kpi.trend && (
        <p className={cn('flex items-center gap-1 text-xs mt-1.5', kpi.trendUp ? 'text-green-600' : 'text-red-500')}>
          {kpi.trendUp
            ? <TrendingUp className="w-3 h-3" />
            : kpi.trend.startsWith('−') || kpi.trend.startsWith('-')
              ? <TrendingDown className="w-3 h-3" />
              : <Minus className="w-3 h-3" />
          }
          {kpi.trend}
        </p>
      )}
    </Link>
  )
}

// ── Page ───────────────────────────────────────────────────────

export default function ManagerDashboard() {
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const criticalAlerts = ADMIN_ALERTS.filter(a => a.priority === 'critical' || a.priority === 'high')
  const otherAlerts    = ADMIN_ALERTS.filter(a => a.priority === 'medium' || a.priority === 'info')
  const atRiskStudents = ADMIN_STUDENTS.filter(s => s.riskFlag !== 'ok').sort((a, b) => b.urgencyScore - a.urgencyScore)

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Academic Overview</h1>
        <p className="text-sm text-gray-500 mt-0.5">{today}</p>
      </div>

      {/* KPI grid — 5 × 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ADMIN_KPIS.map(kpi => <KPICard key={kpi.label} kpi={kpi} />)}
      </div>

      {/* Alerts + At-risk side by side */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Alert panel */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Action Required</h2>
            <span className="text-xs text-gray-400">{criticalAlerts.length + otherAlerts.length} alerts</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {[...criticalAlerts, ...otherAlerts].map(alert => (
              <li key={alert.id} className={cn('flex gap-3 px-5 py-3 border-l-4', alertBorder(alert.priority))}>
                {alertIcon(alert.priority)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 leading-snug">{alert.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{alert.createdAt}</p>
                </div>
                <Link
                  href={alert.actionHref}
                  className="shrink-0 text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap mt-0.5"
                >
                  {alert.actionLabel} →
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* At-risk students */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">At-Risk Students</h2>
            <Link href="/manager/students" className="text-xs text-indigo-600 hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-50">
                  <th className="text-left px-5 py-2 font-medium">Student</th>
                  <th className="text-left px-3 py-2 font-medium">Class</th>
                  <th className="text-center px-3 py-2 font-medium">Risk</th>
                  <th className="text-right px-5 py-2 font-medium">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {atRiskStudents.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-2.5">
                      <p className="font-medium text-gray-800">{s.name}</p>
                      <p className="text-xs text-gray-400">{s.suggestedAction}</p>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs whitespace-nowrap">{s.className}</td>
                    <td className="px-3 py-2.5 text-center">
                      {statusBadge(s.riskFlag === 'critical' ? 'critical' : 'at-risk')}
                    </td>
                    <td className="px-5 py-2.5 text-right">
                      <span className={cn(
                        'font-bold tabular-nums',
                        s.urgencyScore >= 80 ? 'text-red-600' :
                        s.urgencyScore >= 50 ? 'text-amber-600' : 'text-gray-600'
                      )}>{s.urgencyScore}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Class health table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Class Health</h2>
          <Link href="/manager/classes" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-50">
                <th className="text-left px-5 py-2 font-medium">Class</th>
                <th className="text-left px-3 py-2 font-medium">Teacher</th>
                <th className="text-center px-3 py-2 font-medium">HW %</th>
                <th className="text-center px-3 py-2 font-medium">Avg Band</th>
                <th className="text-center px-3 py-2 font-medium">Attendance</th>
                <th className="text-center px-3 py-2 font-medium">Exam</th>
                <th className="text-center px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ADMIN_CLASSES.map(cls => (
                <tr key={cls.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-2.5">
                    <Link href="/manager/classes" className="font-medium text-gray-800 hover:text-indigo-600">
                      {cls.name}
                    </Link>
                    <p className="text-xs text-gray-400">{cls.code} · {cls.studentsEnrolled}/{cls.capacity}</p>
                  </td>
                  <td className="px-3 py-2.5 text-gray-500 text-xs whitespace-nowrap">{cls.teacher}</td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn('font-medium', cls.hwPct >= 75 ? 'text-green-600' : cls.hwPct >= 60 ? 'text-amber-600' : 'text-red-600')}>
                      {cls.hwPct}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn('font-medium', cls.avgScore >= 6 ? 'text-green-600' : cls.avgScore >= 5 ? 'text-amber-600' : 'text-red-600')}>
                      {cls.avgScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className={cn('font-medium', cls.attendancePct >= 80 ? 'text-green-600' : cls.attendancePct >= 70 ? 'text-amber-600' : 'text-red-600')}>
                      {cls.attendancePct}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-center text-xs text-gray-500 whitespace-nowrap">
                    {cls.daysToExam !== null ? (
                      <span className={cn(cls.daysToExam <= 14 ? 'text-red-600 font-semibold' : cls.daysToExam <= 30 ? 'text-amber-600' : 'text-gray-500')}>
                        {cls.daysToExam}d
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-2.5 text-center">{statusBadge(cls.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'HW Completion', key: 'hwPct' as const, good: 75, warn: 60, unit: '%' },
          { title: 'Avg Band Score', key: 'avgScore' as const, good: 6, warn: 5, unit: '' },
          { title: 'Attendance', key: 'attendancePct' as const, good: 80, warn: 70, unit: '%' },
        ].map(({ title, key, good, warn, unit }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 mb-3">{title} by Class</h3>
            <div className="space-y-2">
              {ADMIN_CLASSES.map(cls => {
                const val = cls[key] as number
                const pct = key === 'avgScore' ? Math.round((val / 9) * 100) : val
                const color = val >= good ? 'bg-green-500' : val >= warn ? 'bg-amber-400' : 'bg-red-500'
                return (
                  <div key={cls.id} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-16 shrink-0 truncate">{cls.code}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div className={cn('h-2 rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-10 text-right shrink-0">
                      {val}{unit}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

import { cn } from '@/lib/utils'
import { Mail, BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import {
  ADMIN_TEACHERS,
  type AdminTeacher,
  type LoadBadge,
} from '@/lib/admin-data'

// ── Helpers ────────────────────────────────────────────────────

function LoadBadgeUI({ badge }: { badge: LoadBadge }) {
  const map: Record<LoadBadge, string> = {
    light:    'bg-blue-100 text-blue-700',
    normal:   'bg-green-100 text-green-700',
    heavy:    'bg-amber-100 text-amber-700',
    overload: 'bg-red-100 text-red-700',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize', map[badge])}>
      {badge}
    </span>
  )
}

function MetricBar({ value, good, warn }: { value: number; good: number; warn: number }) {
  const color = value >= good ? 'bg-green-500' : value >= warn ? 'bg-amber-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className={cn('h-1.5 rounded-full', color)} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className={cn('text-xs font-medium tabular-nums', value >= good ? 'text-green-700' : value >= warn ? 'text-amber-600' : 'text-red-600')}>
        {value}%
      </span>
    </div>
  )
}

function TeacherCard({ teacher: t }: { teacher: AdminTeacher }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
            {t.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{t.name}</p>
            <a href={`mailto:${t.email}`} className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
              <Mail className="w-3 h-3" /> {t.email}
            </a>
          </div>
        </div>
        <LoadBadgeUI badge={t.loadBadge} />
      </div>

      {/* Qualifications & subjects */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {t.subjects.map(s => (
          <span key={s} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">{s}</span>
        ))}
        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs">{t.qualifications}</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4 text-center">
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-lg font-bold text-gray-800">{t.studentsTotal}</p>
          <p className="text-[10px] text-gray-400">Students</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-lg font-bold text-gray-800">{t.hoursPerWeek}h</p>
          <p className="text-[10px] text-gray-400">Per week</p>
        </div>
        <div className="bg-gray-50 rounded-lg py-2">
          <p className="text-lg font-bold text-gray-800">{t.avgStudentScore.toFixed(1)}</p>
          <p className="text-[10px] text-gray-400">Avg band</p>
        </div>
      </div>

      {/* Performance metrics */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">HW Review Rate</span>
          <MetricBar value={t.hwReviewRate} good={85} warn={70} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Attendance Recording</span>
          <MetricBar value={t.attendanceRecordRate} good={90} warn={75} />
        </div>
      </div>

      {/* Classes */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Classes</p>
        <div className="space-y-1">
          {t.classes.map(cls => (
            <div key={cls.id} className="flex items-center gap-2">
              <BookOpen className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600">{cls.name}</span>
              <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{cls.code}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          Active {t.lastActive}
        </div>
        <div className="flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 className="w-3 h-3" />
          {t.status}
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────

export default function ManagerTeachersPage() {
  const totalStudents = ADMIN_TEACHERS.reduce((s, t) => s + t.studentsTotal, 0)
  const avgHwReview   = Math.round(ADMIN_TEACHERS.reduce((s, t) => s + t.hwReviewRate, 0) / ADMIN_TEACHERS.length)
  const avgAttRecord  = Math.round(ADMIN_TEACHERS.reduce((s, t) => s + t.attendanceRecordRate, 0) / ADMIN_TEACHERS.length)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Teachers</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ADMIN_TEACHERS.length} active teachers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          + Add Teacher
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Teachers',       value: ADMIN_TEACHERS.length, color: 'text-gray-800' },
          { label: 'Total Students',        value: totalStudents,         color: 'text-gray-800' },
          { label: 'Avg HW Review Rate',    value: `${avgHwReview}%`,     color: avgHwReview >= 85 ? 'text-green-600' : 'text-amber-600' },
          { label: 'Avg Attendance Record', value: `${avgAttRecord}%`,    color: avgAttRecord >= 90 ? 'text-green-600' : 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Teacher cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {ADMIN_TEACHERS.map(t => <TeacherCard key={t.id} teacher={t} />)}
      </div>
    </div>
  )
}

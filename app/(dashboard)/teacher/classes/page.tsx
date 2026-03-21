import Link from 'next/link'
import { ClipboardCheck, BookMarked, BarChart2, Users, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TEACHER_CLASSES, TEACHER_STUDENTS } from '@/lib/teacher-data'

function StatusBadge({ s }: { s: 'on-track' | 'at-risk' | 'critical' }) {
  const map    = { 'on-track': 'bg-green-100 text-green-700', 'at-risk': 'bg-amber-100 text-amber-700', 'critical': 'bg-red-100 text-red-700' }
  const labels = { 'on-track': 'On Track', 'at-risk': 'At Risk', 'critical': 'Critical' }
  return <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', map[s])}>{labels[s]}</span>
}

export default function TeacherClassesPage() {
  const critical = TEACHER_CLASSES.filter(c => c.status === 'critical').length
  const atRisk   = TEACHER_CLASSES.filter(c => c.status === 'at-risk').length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Classes</h1>
          <p className="text-sm text-gray-500 mt-0.5">{TEACHER_CLASSES.length} active classes · {TEACHER_STUDENTS.length} students total</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Classes',  value: TEACHER_CLASSES.length, color: 'text-gray-800' },
          { label: 'Critical',       value: critical,                color: critical > 0 ? 'text-red-600' : 'text-gray-800' },
          { label: 'At Risk',        value: atRisk,                  color: atRisk > 0 ? 'text-amber-600' : 'text-gray-800' },
          { label: 'Total Students', value: TEACHER_STUDENTS.length, color: 'text-gray-800' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {TEACHER_CLASSES.map(cls => {
          const students    = TEACHER_STUDENTS.filter(s => s.classId === cls.id)
          const atRiskCount = students.filter(s => s.riskFlag !== 'ok').length
          return (
            <div key={cls.id} className={cn(
              'bg-white rounded-xl border overflow-hidden hover:shadow-md transition-shadow',
              cls.status === 'critical' ? 'border-red-200' : cls.status === 'at-risk' ? 'border-amber-200' : 'border-gray-200'
            )}>
              <div className="px-5 pt-5 pb-4 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{cls.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{cls.code} · {cls.level} · {cls.course}</p>
                  </div>
                  <StatusBadge s={cls.status} />
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />{cls.schedule}
                </div>
              </div>

              <div className="px-5 py-4 grid grid-cols-3 gap-3">
                {[
                  { label: 'Attendance', value: cls.attendancePct, good: 80, warn: 70, unit: '%' },
                  { label: 'HW Rate',    value: cls.hwPct,         good: 75, warn: 55, unit: '%' },
                ].map(m => (
                  <div key={m.label}>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">{m.label}</p>
                    <span className={cn('text-sm font-bold', m.value >= m.good ? 'text-green-700' : m.value >= m.warn ? 'text-amber-600' : 'text-red-600')}>
                      {m.value}{m.unit}
                    </span>
                    <div className="mt-1.5 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                      <div className={cn('h-1 rounded-full', m.value >= m.good ? 'bg-green-500' : m.value >= m.warn ? 'bg-amber-400' : 'bg-red-500')}
                        style={{ width: `${m.value}%` }} />
                    </div>
                  </div>
                ))}
                <div>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-1">Avg Band</p>
                  <span className={cn('text-sm font-bold', cls.avgBand >= 6 ? 'text-green-700' : cls.avgBand >= 5 ? 'text-amber-600' : 'text-red-600')}>
                    {cls.avgBand.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-400"> / {cls.targetBand}</span>
                </div>
              </div>

              <div className="px-5 pb-3 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{cls.studentsEnrolled}/{cls.capacity}</div>
                {atRiskCount > 0 && <span className="text-red-500 font-medium">{atRiskCount} at risk</span>}
                {cls.daysToNearestExam !== null && (
                  <span className={cn('font-semibold', cls.daysToNearestExam <= 14 ? 'text-red-600' : 'text-amber-600')}>
                    Exam in {cls.daysToNearestExam} days
                  </span>
                )}
              </div>

              <div className="px-5 pb-5 grid grid-cols-2 gap-2">
                <Link href={`/teacher/classes/${cls.id}`}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                  View Class
                </Link>
                <Link href={`/teacher/attendance?classId=${cls.id}`}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                  <ClipboardCheck className="w-3.5 h-3.5" />Take Attendance
                </Link>
                <Link href={`/teacher/classes/${cls.id}?tab=homework`}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookMarked className="w-3.5 h-3.5" />Homework
                </Link>
                <Link href={`/teacher/classes/${cls.id}?tab=scores`}
                  className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <BarChart2 className="w-3.5 h-3.5" />Scores
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

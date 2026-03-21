import Link from 'next/link'
import { cn } from '@/lib/utils'
import { TEACHER_STUDENTS, TEACHER_CLASSES, type RiskFlag } from '@/lib/teacher-data'

function riskBadge(flag: RiskFlag) {
  if (flag === 'critical') return <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase tracking-wide">Critical</span>
  if (flag === 'at-risk')  return <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase tracking-wide">At Risk</span>
  return <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wide">On Track</span>
}

function attColor(pct: number) {
  if (pct >= 80) return 'text-green-600'
  if (pct >= 70) return 'text-amber-600'
  return 'text-red-600'
}

function bandColor(band: number, target: number) {
  const gap = target - band
  if (gap <= 0.5) return 'text-green-600'
  if (gap <= 1.0) return 'text-amber-600'
  return 'text-red-600'
}

export default function StudentsPage() {
  const totalStudents  = TEACHER_STUDENTS.length
  const criticalCount  = TEACHER_STUDENTS.filter(s => s.riskFlag === 'critical').length
  const atRiskCount    = TEACHER_STUDENTS.filter(s => s.riskFlag === 'at-risk').length
  const onTrackCount   = TEACHER_STUDENTS.filter(s => s.riskFlag === 'ok').length

  // Sort by urgency descending
  const sorted = [...TEACHER_STUDENTS].sort((a, b) => b.urgencyScore - a.urgencyScore)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Students</h1>
        <p className="text-sm text-gray-500 mt-0.5">All students across your classes, sorted by urgency</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: totalStudents, color: 'text-gray-800' },
          { label: 'Critical',       value: criticalCount, color: criticalCount > 0 ? 'text-red-600' : 'text-gray-800' },
          { label: 'At Risk',        value: atRiskCount,   color: atRiskCount > 0 ? 'text-amber-600' : 'text-gray-800' },
          { label: 'On Track',       value: onTrackCount,  color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl font-bold mt-0.5', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Class tabs summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TEACHER_CLASSES.map(cls => {
          const classStudents  = TEACHER_STUDENTS.filter(s => s.classId === cls.id)
          const classCritical  = classStudents.filter(s => s.riskFlag === 'critical').length
          const classAtRisk    = classStudents.filter(s => s.riskFlag === 'at-risk').length
          return (
            <div key={cls.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">{cls.name}</p>
                <p className="text-xs text-gray-400">{cls.code} · {classStudents.length} students</p>
              </div>
              <div className="flex gap-2">
                {classCritical > 0 && (
                  <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-lg">
                    {classCritical} Critical
                  </span>
                )}
                {classAtRisk > 0 && (
                  <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">
                    {classAtRisk} At Risk
                  </span>
                )}
                {classCritical === 0 && classAtRisk === 0 && (
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">
                    All OK
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Student table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">All Students — sorted by urgency</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-medium">Student</th>
                <th className="text-left px-4 py-2.5 font-medium">Class</th>
                <th className="text-center px-4 py-2.5 font-medium">Status</th>
                <th className="text-center px-4 py-2.5 font-medium">Urgency</th>
                <th className="text-center px-4 py-2.5 font-medium">Attendance</th>
                <th className="text-center px-4 py-2.5 font-medium">Avg Band</th>
                <th className="text-center px-4 py-2.5 font-medium">Target</th>
                <th className="text-center px-4 py-2.5 font-medium">HW</th>
                <th className="text-center px-4 py-2.5 font-medium">Exam</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map(s => (
                <tr key={s.id} className={cn('hover:bg-gray-50',
                  s.riskFlag === 'critical' && 'bg-red-50/20',
                  s.riskFlag === 'at-risk'  && 'bg-amber-50/20',
                )}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-600 font-medium">{s.className.split('–')[0].trim()}</p>
                  </td>
                  <td className="px-4 py-3 text-center">{riskBadge(s.riskFlag)}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex items-center gap-1">
                      <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn('h-full rounded-full',
                            s.urgencyScore >= 70 ? 'bg-red-500' :
                            s.urgencyScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                          )}
                          style={{ width: `${s.urgencyScore}%` }}
                        />
                      </div>
                      <span className={cn('text-xs font-bold',
                        s.urgencyScore >= 70 ? 'text-red-600' :
                        s.urgencyScore >= 40 ? 'text-amber-600' : 'text-gray-500'
                      )}>{s.urgencyScore}</span>
                    </div>
                  </td>
                  <td className={cn('px-4 py-3 text-center text-sm font-semibold', attColor(s.attendancePct))}>
                    {s.attendancePct}%
                    <p className="text-[10px] text-gray-400 font-normal">{s.attendanceSessions}/{s.totalSessions}</p>
                  </td>
                  <td className={cn('px-4 py-3 text-center text-sm font-bold', bandColor(s.avgBand, s.targetBand))}>
                    {s.avgBand}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{s.targetBand}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn('text-xs font-medium',
                      (s.hwSubmitted / s.hwTotal) >= 0.75 ? 'text-green-600' :
                      (s.hwSubmitted / s.hwTotal) >= 0.5  ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {s.hwSubmitted}/{s.hwTotal}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {s.daysToExam != null ? (
                      <span className={cn('text-xs font-semibold',
                        s.daysToExam <= 14 ? 'text-red-600' : 'text-gray-600'
                      )}>
                        {s.daysToExam}d
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/teacher/students/${s.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold whitespace-nowrap"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

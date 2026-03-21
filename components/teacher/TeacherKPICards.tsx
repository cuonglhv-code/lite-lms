import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ClassStats, StudentStats } from '@/lib/types'

export function ClassKPICards({ stats }: { stats: ClassStats }) {
  const cards = [
    { title: 'Active Students',    value: stats.activeStudents },
    { title: 'Homework %',         value: `${(stats.homeworkCompletion * 100).toFixed(0)}%` },
    { title: 'Avg Score',          value: `${(stats.avgScore * 100).toFixed(0)}%` },
    { title: 'Attendance',         value: `${(stats.attendanceRate * 100).toFixed(0)}%` },
    { title: 'Days to Exam',       value: stats.daysToNextExam ?? '—' },
    { title: 'Overdue Homework',   value: stats.overdueHomework },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
      {cards.map(c => (
        <Card key={c.title}>
          <CardHeader className="pb-1"><CardTitle className="text-xs text-gray-500">{c.title}</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{c.value}</div></CardContent>
        </Card>
      ))}
    </div>
  )
}

export function StudentKPICards({ stats }: { stats: StudentStats }) {
  const cards = [
    { title: 'Homework %',    value: `${(stats.homeworkCompletion * 100).toFixed(0)}%` },
    { title: 'Avg Score',     value: `${(stats.avgScore * 100).toFixed(0)}%` },
    { title: 'Attendance',    value: `${(stats.attendanceRate * 100).toFixed(0)}%` },
    { title: 'Total Tasks',   value: stats.totalTasks },
    { title: 'Missing HW',    value: stats.missingHomework },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {cards.map(c => (
        <Card key={c.title} className="border-indigo-100">
          <CardHeader className="pb-1"><CardTitle className="text-xs text-gray-500">{c.title}</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{c.value}</div></CardContent>
        </Card>
      ))}
    </div>
  )
}

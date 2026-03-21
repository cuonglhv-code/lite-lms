import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ManagerDashboardData } from '@/lib/types'

function scoreToIeltsBand(ratio: number): string {
  const band = ratio * 9
  return band.toFixed(1)
}

export default function ManagerKPICards({ data }: { data: ManagerDashboardData }) {
  const cards = [
    { title: 'Active Students',       value: data.totalActiveStudents },
    { title: 'Classes Running',        value: data.totalClasses },
    { title: 'Homework Completion',    value: `${(data.overallHomeworkCompletion * 100).toFixed(0)}%` },
    { title: 'Avg Score (IELTS band)', value: scoreToIeltsBand(data.overallAvgScore) },
    { title: 'Exams in 30 Days',       value: data.studentsExamIn30Days },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cards.map(c => (
        <Card key={c.title}>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium text-gray-500">{c.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

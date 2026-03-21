import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { AtRiskStudent } from '@/lib/types'
import { cn } from '@/lib/utils'

export default function AtRiskStudents({ students }: { students: AtRiskStudent[] }) {
  if (students.length === 0) return (
    <p className="text-sm text-gray-400 text-center py-4">No at-risk students</p>
  )

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Attendance %</TableHead>
            <TableHead>Avg Score</TableHead>
            <TableHead>Days to Exam</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s, i) => {
            const critical = s.attendanceRate < 0.60 || s.avgScore < 0.40
            return (
              <TableRow key={i} className={cn(critical ? 'bg-red-50' : 'bg-orange-50')}>
                <TableCell className="font-medium">{s.studentName}</TableCell>
                <TableCell>{s.className}</TableCell>
                <TableCell>{s.teacherName}</TableCell>
                <TableCell className={s.attendanceRate < 0.70 ? 'text-red-600 font-semibold' : ''}>
                  {(s.attendanceRate * 100).toFixed(0)}%
                </TableCell>
                <TableCell className={s.avgScore < 0.50 ? 'text-red-600 font-semibold' : ''}>
                  {(s.avgScore * 100).toFixed(0)}%
                </TableCell>
                <TableCell>{s.daysToExam ?? '—'}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

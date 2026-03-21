'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { ClassSummary } from '@/lib/types'

function statusBadge(s: ClassSummary['statusIndicator']) {
  if (s === 'critical') return <Badge variant="destructive">Critical</Badge>
  if (s === 'at-risk')  return <Badge className="bg-yellow-500 hover:bg-yellow-600">At risk</Badge>
  return <Badge className="bg-green-500 hover:bg-green-600">On track</Badge>
}

export default function ClassComparisonTable({
  data, teacherFilter, levelFilter,
}: {
  data: ClassSummary[]
  teacherFilter: string
  levelFilter: string
}) {
  const router = useRouter()
  const [sortKey, setSortKey]   = useState<keyof ClassSummary>('className')
  const [sortDir, setSortDir]   = useState<'asc' | 'desc'>('asc')

  function toggleSort(key: keyof ClassSummary) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = data
    .filter(c => !teacherFilter || c.teacherName === teacherFilter)
    .filter(c => !levelFilter   || c.classCode.startsWith(levelFilter))
    .sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      return sortDir === 'asc'
        ? av < bv ? -1 : av > bv ? 1 : 0
        : av > bv ? -1 : av < bv ? 1 : 0
    })

  const th = (key: keyof ClassSummary, label: string) => (
    <TableHead
      className="cursor-pointer select-none whitespace-nowrap"
      onClick={() => toggleSort(key)}
    >
      {label} {sortKey === key ? (sortDir === 'asc' ? '↑' : '↓') : ''}
    </TableHead>
  )

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {th('classCode',          'Class')}
            {th('teacherName',        'Teacher')}
            {th('activeStudents',     'Students')}
            {th('homeworkCompletion', 'HW %')}
            {th('avgScore',           'Avg Score')}
            {th('attendanceRate',     'Attendance %')}
            {th('daysToExam',         'Days to Exam')}
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map(c => (
            <TableRow
              key={c.classCode}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/manager/classes/${c.classCode}`)}
            >
              <TableCell className="font-medium">{c.className}</TableCell>
              <TableCell>{c.teacherName}</TableCell>
              <TableCell>{c.activeStudents}</TableCell>
              <TableCell>{(c.homeworkCompletion * 100).toFixed(0)}%</TableCell>
              <TableCell>{(c.avgScore * 100).toFixed(0)}%</TableCell>
              <TableCell>{(c.attendanceRate * 100).toFixed(0)}%</TableCell>
              <TableCell>{c.daysToExam ?? '—'}</TableCell>
              <TableCell>{statusBadge(c.statusIndicator)}</TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow><TableCell colSpan={8} className="text-center text-gray-400 py-6">No classes</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

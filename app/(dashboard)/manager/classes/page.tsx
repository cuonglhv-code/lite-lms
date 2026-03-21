'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Class } from '@/lib/types'

export default function ManagerClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(setClasses)
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">All Classes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.class_name}</TableCell>
              <TableCell>{c.course_name}</TableCell>
              <TableCell>{c.teacher_name}</TableCell>
              <TableCell>{c.schedule}</TableCell>
              <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

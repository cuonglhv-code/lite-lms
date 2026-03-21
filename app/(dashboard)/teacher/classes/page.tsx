'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Class } from '@/lib/types'

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then(setClasses)
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">My Classes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Schedule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map(c => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.class_name}</TableCell>
              <TableCell>{c.course_name}</TableCell>
              <TableCell>{c.schedule}</TableCell>
              <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
              <TableCell>
                <Link href={`/teacher/classes/${c.id}`} className="text-indigo-600 hover:underline text-sm">
                  Open
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

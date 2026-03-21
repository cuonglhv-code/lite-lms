'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { Student } from '@/lib/types'

export default function ManagerStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    fetch('/api/students').then(r => r.json()).then(setStudents)
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">All Students</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.student_code}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

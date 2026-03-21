'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Student, AttendanceStatus } from '@/lib/types'

const STATUSES: AttendanceStatus[] = ['Present', 'Absent', 'Late', 'Excused']

export default function AttendanceForm({
  classId, students, onSaved,
}: { classId: string; students: Student[]; onSaved: () => void }) {
  const [date,    setDate]    = useState(new Date().toISOString().slice(0, 10))
  const [records, setRecords] = useState<Record<string, AttendanceStatus>>(() =>
    Object.fromEntries(students.map(s => [s.id, 'Present']))
  )
  const [loading, setLoading] = useState(false)

  function setStatus(studentId: string, status: AttendanceStatus) {
    setRecords(r => ({ ...r, [studentId]: status }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const payload = students.map(s => ({
      class_id: classId, student_id: s.id, session_date: date, status: records[s.id] ?? 'Present',
    }))
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setLoading(false)
    onSaved()
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1">
        <Label>Session Date</Label>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-40" required />
      </div>
      <div className="space-y-2">
        {students.map(s => (
          <div key={s.id} className="flex items-center gap-3">
            <span className="text-sm w-48 truncate">{s.name}</span>
            <Select value={records[s.id]} onValueChange={v => setStatus(s.id, v as AttendanceStatus)}>
              <SelectTrigger className="w-36 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving…' : 'Save Attendance'}
      </Button>
    </form>
  )
}

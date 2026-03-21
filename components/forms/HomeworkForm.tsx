'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Student } from '@/lib/types'

export default function HomeworkForm({
  classId, students, onCreated,
}: { classId: string; students: Student[]; onCreated: () => void }) {
  const [title,     setTitle]     = useState('')
  const [skill,     setSkill]     = useState('')
  const [studentId, setStudentId] = useState('')
  const [dueDate,   setDueDate]   = useState('')
  const [loading,   setLoading]   = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/homework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ class_id: classId, student_id: studentId || undefined, title, skill, due_date: dueDate }),
    })
    setLoading(false)
    setTitle(''); setSkill(''); setStudentId(''); setDueDate('')
    onCreated()
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3">
      <div className="col-span-2 space-y-1">
        <Label>Title</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Reading Practice Test 1" required />
      </div>
      <div className="space-y-1">
        <Label>Student</Label>
        <Select value={studentId} onValueChange={v => setStudentId(v ?? '')}>
          <SelectTrigger><SelectValue placeholder="All students" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All students</SelectItem>
            {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Skill</Label>
        <Select value={skill} onValueChange={v => setSkill(v ?? '')}>
          <SelectTrigger><SelectValue placeholder="Select skill" /></SelectTrigger>
          <SelectContent>
            {['Reading','Writing','Listening','Speaking'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Due Date</Label>
        <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>
      <div className="flex items-end">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Saving…' : 'Add Homework'}
        </Button>
      </div>
    </form>
  )
}

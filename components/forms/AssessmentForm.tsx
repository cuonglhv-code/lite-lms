'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Student } from '@/lib/types'

export default function AssessmentForm({
  classId, students, onCreated,
}: { classId: string; students: Student[]; onCreated: () => void }) {
  const [name,      setName]      = useState('')
  const [type,      setType]      = useState('Mock Test')
  const [studentId, setStudentId] = useState('')
  const [date,      setDate]      = useState(new Date().toISOString().slice(0, 10))
  const [maxScore,  setMaxScore]  = useState('100')
  const [score,     setScore]     = useState('')
  const [comment,   setComment]   = useState('')
  const [loading,   setLoading]   = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        class_id: classId, student_id: studentId,
        assessment_name: name, assessment_type: type, assessment_date: date,
        max_score: Number(maxScore), score: score ? Number(score) : undefined,
        teacher_comment: comment,
      }),
    })
    setLoading(false)
    setName(''); setScore(''); setComment('')
    onCreated()
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-3">
      <div className="col-span-2 space-y-1">
        <Label>Assessment Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Full Mock 1" required />
      </div>
      <div className="space-y-1">
        <Label>Student</Label>
        <Select value={studentId} onValueChange={v => setStudentId(v ?? '')}>
          <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
          <SelectContent>
            {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Type</Label>
        <Select value={type} onValueChange={v => setType(v ?? type)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {['Mock Test','Mini Test','Quiz','Speaking Test','Writing Task'].map(t =>
              <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Date</Label>
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div className="space-y-1">
        <Label>Score / {maxScore}</Label>
        <div className="flex gap-1">
          <Input type="number" value={score} onChange={e => setScore(e.target.value)} placeholder="Score" className="flex-1" />
          <Input type="number" value={maxScore} onChange={e => setMaxScore(e.target.value)} className="w-20" />
        </div>
      </div>
      <div className="col-span-2 space-y-1">
        <Label>Comment</Label>
        <Textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} />
      </div>
      <div className="col-span-2">
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Saving…' : 'Add Assessment'}
        </Button>
      </div>
    </form>
  )
}

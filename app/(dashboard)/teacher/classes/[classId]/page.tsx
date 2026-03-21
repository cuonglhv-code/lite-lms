'use client'

import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import HomeworkForm from '@/components/forms/HomeworkForm'
import AssessmentForm from '@/components/forms/AssessmentForm'
import AttendanceForm from '@/components/forms/AttendanceForm'
import ResourceUploadForm from '@/components/forms/ResourceUploadForm'
import type { Class, Student, Homework, Assessment, Attendance, Resource } from '@/lib/types'

const HW_STATUS_COLORS: Record<string, string> = {
  Checked: 'bg-green-100 text-green-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Late: 'bg-yellow-100 text-yellow-700',
  Missing: 'bg-red-100 text-red-700',
  Assigned: 'bg-gray-100 text-gray-700',
  'Not assigned': 'bg-gray-50 text-gray-400',
}

export default function ClassDetailPage({ params }: { params: { classId: string } }) {
  const { classId } = params
  const [cls,         setCls]        = useState<Class | null>(null)
  const [students,    setStudents]   = useState<Student[]>([])
  const [homework,    setHomework]   = useState<Homework[]>([])
  const [assessments, setAssessments]= useState<Assessment[]>([])
  const [attendance,  setAttendance] = useState<Attendance[]>([])
  const [resources,   setResources]  = useState<Resource[]>([])
  const [dialog,      setDialog]     = useState<'hw' | 'assess' | 'att' | 'res' | null>(null)

  async function load() {
    const [clsRes, stuRes, hwRes, asRes, attRes, resRes] = await Promise.all([
      fetch(`/api/classes/${classId}`).then(r => r.json()),
      fetch(`/api/students?classId=${classId}`).then(r => r.json()),
      fetch(`/api/homework?classId=${classId}`).then(r => r.json()),
      fetch(`/api/assessments?classId=${classId}`).then(r => r.json()),
      fetch(`/api/attendance?classId=${classId}`).then(r => r.json()),
      fetch(`/api/resources?classId=${classId}`).then(r => r.json()),
    ])
    setCls(clsRes); setStudents(stuRes); setHomework(hwRes)
    setAssessments(asRes); setAttendance(attRes); setResources(resRes)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load() }, [classId])

  async function updateHwStatus(id: string, status: string) {
    await fetch('/api/homework', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    load()
  }

  if (!cls) return <div className="text-gray-400 text-sm">Loading…</div>

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{cls.class_name}</h1>
        <p className="text-sm text-gray-500">{cls.schedule} · {cls.status} · Teacher: {cls.teacher_name}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="homework" className="flex-1">Homework</TabsTrigger>
          <TabsTrigger value="assessments" className="flex-1">Assessments</TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1">Attendance</TabsTrigger>
          <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
        </TabsList>

        {/* ── Overview ── */}
        <TabsContent value="overview" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.student_code}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* ── Homework ── */}
        <TabsContent value="homework" className="pt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setDialog('hw')}>+ Add Homework</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homework.map(h => (
                <TableRow key={h.id}>
                  <TableCell>{h.student_name}</TableCell>
                  <TableCell>{h.title}</TableCell>
                  <TableCell>{h.skill}</TableCell>
                  <TableCell>{h.due_date?.slice(0, 10) ?? '—'}</TableCell>
                  <TableCell>
                    <Select value={h.status} onValueChange={v => updateHwStatus(h.id, v ?? h.status)}>
                      <SelectTrigger className={`h-7 text-xs w-32 ${HW_STATUS_COLORS[h.status] ?? ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {['Not assigned','Assigned','Submitted','Late','Missing','Checked'].map(s =>
                          <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* ── Assessments ── */}
        <TabsContent value="assessments" className="pt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setDialog('assess')}>+ Add Assessment</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map(a => (
                <TableRow key={a.id}>
                  <TableCell>{a.student_name}</TableCell>
                  <TableCell>{a.assessment_name}</TableCell>
                  <TableCell>{a.assessment_type}</TableCell>
                  <TableCell>{a.assessment_date?.slice(0, 10)}</TableCell>
                  <TableCell>
                    {a.score !== null ? `${a.score} / ${a.max_score}` : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* ── Attendance ── */}
        <TabsContent value="attendance" className="pt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setDialog('att')}>+ Log Session</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map(a => (
                <TableRow key={a.id}>
                  <TableCell>{a.session_date?.slice(0, 10)}</TableCell>
                  <TableCell>{a.student_name}</TableCell>
                  <TableCell>
                    <Badge className={
                      a.status === 'Present' ? 'bg-green-100 text-green-700' :
                      a.status === 'Late'    ? 'bg-yellow-100 text-yellow-700' :
                      a.status === 'Excused' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }>{a.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* ── Resources ── */}
        <TabsContent value="resources" className="pt-4 space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setDialog('res')}>+ Add Resource</Button>
          </div>
          <div className="space-y-2">
            {resources.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 border rounded text-sm">
                <div className="flex-1">
                  <div className="font-medium">{r.title}</div>
                  <div className="text-xs text-gray-400">{r.resource_type} · {r.uploader_name}</div>
                </div>
                {(r.url || r.blob_url) && (
                  <a href={r.blob_url ?? r.url ?? '#'} target="_blank" className="text-indigo-600 hover:underline text-xs">
                    Open
                  </a>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Dialogs ── */}
      <Dialog open={dialog === 'hw'} onOpenChange={o => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Homework</DialogTitle></DialogHeader>
          <HomeworkForm classId={classId} students={students} onCreated={() => { setDialog(null); load() }} />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === 'assess'} onOpenChange={o => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Assessment</DialogTitle></DialogHeader>
          <AssessmentForm classId={classId} students={students} onCreated={() => { setDialog(null); load() }} />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === 'att'} onOpenChange={o => !o && setDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Log Attendance</DialogTitle></DialogHeader>
          <AttendanceForm classId={classId} students={students} onSaved={() => { setDialog(null); load() }} />
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === 'res'} onOpenChange={o => !o && setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Resource</DialogTitle></DialogHeader>
          <ResourceUploadForm classId={classId} onCreated={() => { setDialog(null); load() }} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

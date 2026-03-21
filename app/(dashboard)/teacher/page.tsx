'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClassKPICards, StudentKPICards } from '@/components/teacher/TeacherKPICards'
import DonutChart from '@/components/charts/DonutChart'
import LineChartWidget from '@/components/charts/LineChart'
import type { Class, Student, TeacherDashboardData, Homework, Assessment } from '@/lib/types'

export default function TeacherDashboard() {
  useSession()
  const [classes,    setClasses]    = useState<Class[]>([])
  const [students,   setStudents]   = useState<Student[]>([])
  const [classId,    setClassId]    = useState('')
  const [studentId,  setStudentId]  = useState('')
  const [dashData,   setDashData]   = useState<TeacherDashboardData | null>(null)
  const [homework,   setHomework]   = useState<Homework[]>([])
  const [assessments,setAssessments]= useState<Assessment[]>([])

  useEffect(() => {
    fetch('/api/classes').then(r => r.json()).then((cls: Class[]) => {
      setClasses(cls)
      if (cls.length > 0) setClassId(cls[0].id)
    })
  }, [])

  useEffect(() => {
    if (!classId) return
    fetch(`/api/students?classId=${classId}`).then(r => r.json()).then(setStudents)
    fetch(`/api/dashboard/teacher?classId=${classId}`).then(r => r.json()).then(setDashData)
    fetch(`/api/homework?classId=${classId}`).then(r => r.json()).then(setHomework)
    setStudentId('')
  }, [classId])

  useEffect(() => {
    if (!classId || !studentId) return
    fetch(`/api/dashboard/teacher?classId=${classId}&studentId=${studentId}`).then(r => r.json()).then(setDashData)
    fetch(`/api/assessments?classId=${classId}`).then(r => r.json()).then((all: Assessment[]) =>
      setAssessments(all.filter(a => a.student_id === studentId))
    )
  }, [studentId, classId])

  // Donut data from homework statuses
  const hwStatusMap: Record<string, number> = {}
  homework.forEach(h => { hwStatusMap[h.status] = (hwStatusMap[h.status] ?? 0) + 1 })
  const donutData = Object.entries(hwStatusMap).map(([name, value]) => ({ name, value }))

  // Line chart data from assessments
  const lineData = assessments
    .filter(a => a.score !== null)
    .map(a => ({ date: a.assessment_date.slice(0, 10), score: (Number(a.score) / Number(a.max_score)) * 100 }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Dashboard</h1>
        <div className="flex gap-2">
          <Select value={classId} onValueChange={v => setClassId(v ?? '')}>
            <SelectTrigger className="w-48 text-sm"><SelectValue placeholder="Select class" /></SelectTrigger>
            <SelectContent>
              {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={studentId} onValueChange={v => setStudentId(v ?? '')}>
            <SelectTrigger className="w-48 text-sm"><SelectValue placeholder="All students" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All students</SelectItem>
              {students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {dashData && <ClassKPICards stats={dashData.classStats} />}
      {dashData?.studentStats && <StudentKPICards stats={dashData.studentStats} />}

      <div className="flex gap-4">
        <DonutChart data={donutData} title="Homework Status Distribution" />
        {studentId && lineData.length > 0 && (
          <LineChartWidget data={lineData} title="Assessment Scores Over Time" />
        )}
      </div>
    </div>
  )
}

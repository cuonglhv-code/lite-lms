'use client'

import { useEffect, useState } from 'react'
import ManagerKPICards from '@/components/dashboard/ManagerKPICards'
import ClassComparisonTable from '@/components/dashboard/ClassComparisonTable'
import AtRiskStudents from '@/components/dashboard/AtRiskStudents'
import BarChartWidget from '@/components/charts/BarChart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ManagerDashboardData } from '@/lib/types'

export default function ManagerDashboard() {
  const [data,          setData]          = useState<ManagerDashboardData | null>(null)
  const [teacherFilter, setTeacherFilter] = useState('')
  const [levelFilter,   setLevelFilter]   = useState('')

  useEffect(() => {
    fetch('/api/dashboard/manager').then(r => r.json()).then(setData)
  }, [])

  if (!data) return <div className="text-gray-400 text-sm">Loading…</div>

  const teachers  = Array.from(new Set(data.classSummaries.map(c => c.teacherName)))
  const hwData    = data.classSummaries.map(c => ({ name: c.classCode, value: c.homeworkCompletion * 100 }))
  const scoreData = data.classSummaries.map(c => ({ name: c.classCode, value: c.avgScore * 100 }))
  const attData   = data.classSummaries.map(c => ({ name: c.classCode, value: c.attendanceRate * 100 }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Academic Manager Dashboard</h1>
        <div className="flex gap-2">
          <Select value={teacherFilter} onValueChange={v => setTeacherFilter(v ?? '')}>
            <SelectTrigger className="w-40 text-sm"><SelectValue placeholder="All teachers" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All teachers</SelectItem>
              {teachers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={v => setLevelFilter(v ?? '')}>
            <SelectTrigger className="w-40 text-sm"><SelectValue placeholder="All levels" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All levels</SelectItem>
              <SelectItem value="IF">Foundation</SelectItem>
              <SelectItem value="IB">Booster</SelectItem>
              <SelectItem value="IA">Achiever</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ManagerKPICards data={data} />

      <div>
        <h2 className="text-base font-semibold mb-3">Class Overview</h2>
        <ClassComparisonTable data={data.classSummaries} teacherFilter={teacherFilter} levelFilter={levelFilter} />
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">Charts</h2>
        <div className="flex gap-4">
          <BarChartWidget data={hwData}    title="Homework Completion %" thresholdGood={80} thresholdWarn={65} />
          <BarChartWidget data={scoreData} title="Avg Assessment Score %"  thresholdGood={65} thresholdWarn={50} />
          <BarChartWidget data={attData}   title="Attendance Rate %"        thresholdGood={80} thresholdWarn={70} />
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold mb-3">At-Risk Students</h2>
        <AtRiskStudents students={data.atRiskStudents} />
      </div>
    </div>
  )
}

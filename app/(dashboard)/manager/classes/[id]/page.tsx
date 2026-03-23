'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Users, 
  BookOpen, 
  Calendar, 
  Award, 
  Clock, 
  GraduationCap,
  CalendarCheck2,
  BookMarked
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getClassDetails } from '../../actions'

type Tab = 'overview' | 'students' | 'assessments' | 'attendance' | 'sessions'

interface Student {
  id: string
  name: string
  email: string
}

interface Enrolment {
  student: Student
  target_exam_date: string | Date | null
}

interface Assessment {
  id: string
  assessment_date: string | Date
  assessment_type: string | null
  assessment_name: string | null
  score: number | string | null
}

interface AttendanceRecord {
  id: string
  session_date: string | Date
  status: string
  student: { name: string }
}

interface Homework {
  id: string
  status: string
}

interface ClassData {
  id: string
  class_name: string
  class_code: string
  status: string
  capacity: number
  schedule: string
  course: { name: string }
  teacher: { name: string } | null
  enrolments: Enrolment[]
  assessments: Assessment[]
  attendance: AttendanceRecord[]
  homework: Homework[]
}

export default function ClassDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [classData, setClassData] = useState<ClassData | null>(null)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const res = await getClassDetails(id)
      if (res.success && res.data) {
        setClassData(res.data as unknown as ClassData)
      } else {
        console.error(res.error)
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  )

  if (!classData) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-bold text-gray-900">Class not found</h2>
      <button onClick={() => router.back()} className="mt-4 text-indigo-600 hover:underline">Go back</button>
    </div>
  )

  const {
    class_name,
    class_code,
    course,
    teacher,
    schedule,
    capacity,
    status,
    enrolments,
    assessments,
    attendance,
    homework
  } = classData

  // Calculations
  const enrolledCount = enrolments?.length || 0
  const avgBand = assessments?.length 
    ? (assessments.reduce((sum: number, a: Assessment) => sum + Number(a.score || 0), 0) / assessments.length).toFixed(1)
    : 'N/A'
  
  const hwTotal = homework?.length || 0
  const hwSubmitted = homework?.filter((h: Homework) => h.status === 'Submitted' || h.status === 'Graded').length || 0
  const hwPct = hwTotal ? Math.round((hwSubmitted / hwTotal) * 100) : 0

  const attTotal = attendance?.length || 0
  const attPresent = attendance?.filter((a: AttendanceRecord) => a.status === 'Present').length || 0
  const attPct = attTotal ? Math.round((attPresent / attTotal) * 100) : 0

  const examDates = enrolments?.map((e: Enrolment) => e.target_exam_date).filter(Boolean) as (string | Date)[]
  const nextExamDate = examDates?.length 
    ? new Date(Math.min(...examDates.map((d: string | Date) => new Date(d).getTime()))).toLocaleDateString()
    : 'No exams scheduled'

  const sessions = Array.from(new Set(attendance?.map((a: AttendanceRecord) => a.session_date.toString()))).sort((a: string, b: string) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{class_name}</h1>
            <p className="text-gray-500 font-medium">{class_code} • {course?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-semibold",
            status === 'Active' || status === 'Open for enrolment' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          )}>
            {status}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8 overflow-x-auto no-scrollbar">
        {['overview', 'students', 'assessments', 'attendance', 'sessions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={cn(
              "pb-4 text-sm font-medium capitalize tracking-wide transition-all relative whitespace-nowrap",
              activeTab === tab ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Avg Band', value: avgBand, icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'HW %', value: `${hwPct}%`, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Attendance', value: `${attPct}%`, icon: CalendarCheck2, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Enrolled', value: `${enrolledCount}/${capacity}`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg)}>
                      <stat.icon className={cn("w-5 h-5", stat.color)} />
                    </div>
                    <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Details Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-50">
                  <h3 className="font-bold text-gray-900">Class Information</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                  <InfoRow icon={Calendar} label="Schedule" value={schedule} />
                  <InfoRow icon={GraduationCap} label="Teacher" value={teacher?.name || 'Unassigned'} />
                  <InfoRow icon={BookMarked} label="Course" value={course?.name || 'N/A'} />
                  <InfoRow icon={Clock} label="Next Exam" value={nextExamDate} />
                </div>
              </div>
            </div>

            {/* Sidebar / Quick Actions */}
            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
                <h3 className="font-bold text-lg mb-2">Class Workload</h3>
                <p className="text-indigo-100 text-sm mb-4">Current progress relative to course duration.</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span>Curriculum Covered</span>
                      <span>65%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Student</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Avg Band</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Attendance</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">HW Completion</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {enrolments.map((en: Enrolment) => (
                    <tr 
                      key={en.student.id} 
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/manager/students/${en.student.id}`)}
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{en.student.name}</p>
                        <p className="text-xs text-gray-400">{en.student.email}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">7.0 (Mock)</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
                          </div>
                          <span className="text-xs font-bold text-gray-600">92%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">12/14</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-bold uppercase tracking-wider">Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'assessments' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessments.map((ass: Assessment) => (
              <div key={ass.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-xs font-bold text-gray-400">{new Date(ass.assessment_date).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{ass.assessment_type || 'General Assessment'}</h4>
                <p className="text-xs text-gray-500 mb-4">{ass.assessment_name || 'Class Evaluation'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="text-xs">
                    <span className="text-gray-400">Average:</span>
                    <span className="ml-1 font-bold text-gray-900">{ass.score || '0.0'}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Completed</span>
                </div>
              </div>
            ))}
            {assessments.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed">
                No assessments found for this class.
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Date</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Present Count</th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-600">Absentees</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sessions.map((date: string) => {
                    const sessionRecords = attendance.filter((a: AttendanceRecord) => a.session_date.toString() === date)
                    const present = sessionRecords.filter((a: AttendanceRecord) => a.status === 'Present').length
                    const absentees = sessionRecords.filter((a: AttendanceRecord) => a.status === 'Absent').map((a: AttendanceRecord) => a.student.name)
                    return (
                      <tr key={date} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-800">{new Date(date).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                            {present} / {sessionRecords.length}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {absentees.length > 0 ? (
                            <p className="text-xs text-red-500 font-medium">{absentees.join(', ')}</p>
                          ) : (
                            <span className="text-xs text-green-600 font-medium">All present</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            {sessions.map((date: string) => (
              <div key={date} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Day</span>
                    <span className="text-lg font-bold leading-none">{new Date(date).getDate()}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Topic: Introduction to Academic Writing Task 1</p>
                  </div>
                </div>
                <button className="text-indigo-600 text-sm font-bold hover:underline">View Notes</button>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="py-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed">
                No past sessions recorded.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center mt-0.5">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider leading-none">{label}</p>
        <p className="text-sm font-bold text-gray-700 mt-1">{value || 'Not set'}</p>
      </div>
    </div>
  )
}

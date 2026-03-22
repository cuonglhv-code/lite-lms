'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  TrendingUp, 
  Target, 
  AlertCircle, 
  LineChart, 
  Wallet,
  CheckCircle2,
  XCircle,
  Pencil,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStudentDetails } from '../../actions'
import { EditStudentModal } from '@/components/modals/EditStudentModal'
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

type Tab = 'profile' | 'progress' | 'attendance' | 'finance'

export default function StudentDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<any>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const res = await getStudentDetails(id)
      if (res.success) {
        setStudent(res.data)
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

  if (!student) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-bold text-gray-900">Student not found</h2>
      <button onClick={() => router.back()} className="mt-4 text-indigo-600 hover:underline">Go back</button>
    </div>
  )

  const {
    name,
    email,
    phone,
    created_at,
    enrolments,
    assessments,
    attendance,
    homework
  } = student

  // Progress logic
  const targetBand = 7.5 // default fallback or fetch from enrolment
  const currentBand = assessments?.length ? assessments[0].score : 5.5
  
  const chartData = assessments?.map((a: any) => ({
    date: new Date(a.assessment_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: Number(a.score)
  })).reverse() || []

  // Finance calc (MOCK as per typical structure)
  const tuitionFee = 8500000
  const paidAmount = 5000000
  const balance = tuitionFee - paidAmount

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-gray-400 text-sm font-medium">#{student.student_code}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-gray-400 text-sm font-medium">Joined {new Date(created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Profile
        </button>
      </div>

      {showEditModal && (
        <EditStudentModal 
          student={student} 
          onClose={() => setShowEditModal(false)}
          onSuccess={(updated) => setStudent({ ...student, ...updated })}
        />
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8 overflow-x-auto no-scrollbar pt-2">
        {['profile', 'progress', 'attendance', 'finance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={cn(
              "pb-4 text-sm font-bold capitalize tracking-wide transition-all relative",
              activeTab === tab ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-in fade-in duration-300" />
            )}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <ProfileInfo icon={Mail} label="Email Address" value={email} />
                  <ProfileInfo icon={Phone} label="Phone Number" value={phone} />
                  <ProfileInfo icon={AlertCircle} label="Risk Status" value="On Track" color="text-green-600" />
                  <ProfileInfo icon={TrendingUp} label="Urgency Score" value="15" color="text-green-600" />
                </div>
              </div>

              {/* Enrollment Info */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-50">
                  <h3 className="font-bold text-gray-900">Active Enrolments</h3>
                </div>
                <div className="p-8">
                  {enrolments?.map((en: any) => (
                    <div key={en.id} className="flex flex-wrap items-center justify-between gap-6 pb-6 mb-6 border-b last:border-0 last:pb-0 last:mb-0">
                      <div>
                        <h4 className="font-bold text-indigo-600">{en.class.class_name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">{en.class.class_code} • {en.class.course.name}</p>
                      </div>
                      <div className="flex gap-4 items-center">
                        <div className="text-right">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Teacher</p>
                          <p className="text-sm font-bold text-gray-800 mt-1">{en.class.teacher.name}</p>
                        </div>
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Action Panel */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between min-h-[300px]">
              <div>
                <h3 className="text-xl font-bold mb-2">Recommended Action</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Based on recent assessment performance and attendance, the student is performing well.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">Keep pushing</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider">Review Writing Task 2</span>
                </div>
              </div>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-2xl font-bold text-sm mt-8">
                Send Notification
              </button>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="Current Band" value={currentBand} icon={TrendingUp} color="indigo" />
              <StatCard label="Target Band" value={targetBand} icon={Target} color="amber" />
              <StatCard label="Score Gap" value={(targetBand - Number(currentBand)).toFixed(1)} icon={LineChart} color="sky" />
              <StatCard label="Total Tests" value={assessments?.length || 0} icon={Award} color="emerald" />
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-8">Performance Trajectory</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 9]} tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-50">
                <h3 className="font-bold text-gray-900">Detailed Assessment Log</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Date</th>
                      <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Type</th>
                      <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Score</th>
                      <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Gap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {assessments?.map((ass: any) => (
                      <tr key={ass.id}>
                        <td className="px-8 py-4 font-medium text-gray-700">{new Date(ass.assessment_date).toLocaleDateString()}</td>
                        <td className="px-8 py-4 font-bold text-gray-900">{ass.assessment_type || 'Test'}</td>
                        <td className="px-8 py-4">
                          <span className="font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">{ass.score}</span>
                        </td>
                        <td className="px-8 py-4">
                          <span className={cn(
                            "font-bold",
                            (targetBand - Number(ass.score)) > 0 ? "text-amber-600" : "text-emerald-600"
                          )}>
                            {(Number(ass.score) - targetBand).toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Date</th>
                      <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Class</th>
                      <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Status</th>
                      <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Comp. Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {attendance?.map((att: any, idx: number) => (
                      <tr key={att.id}>
                        <td className="px-8 py-4 font-medium text-gray-700">{new Date(att.session_date).toLocaleDateString()}</td>
                        <td className="px-8 py-4 text-gray-500 font-medium">{att.class.class_name}</td>
                        <td className="px-8 py-4">
                          {att.status === 'Present' ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                              <CheckCircle2 className="w-4 h-4" /> Present
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-red-500 font-bold">
                              <XCircle className="w-4 h-4" /> Absent
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-4 font-bold text-gray-800">
                           {Math.round(((attendance.length - idx - attendance.slice(idx).filter((x: any) => x.status === 'Absent').length) / (attendance.length - idx)) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 h-fit">
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full">Outstanding Balance</span>
              </div>
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Balance</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-bold tracking-tight">{balance.toLocaleString()}</span>
                  <span className="text-indigo-200 font-bold">VND</span>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                <div>
                  <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Tuition Fee</p>
                  <p className="font-bold mt-1">{tuitionFee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest">Amount Paid</p>
                  <p className="font-bold mt-1">{paidAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Payment Log</h3>
                <span className="text-xs font-bold text-indigo-600">History</span>
              </div>
              <div className="p-8 flex-1 space-y-6">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                       <CheckCircle2 className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="font-bold text-gray-800">Tuition Installment</p>
                       <p className="text-xs text-gray-400 font-medium">Paid via Transfer • Jan 12, 2024</p>
                     </div>
                   </div>
                   <p className="font-bold text-gray-900">+5,000,000</p>
                 </div>
              </div>
              <div className="p-8 bg-gray-50 border-t border-gray-100 text-center">
                <button className="text-sm font-bold text-indigo-600 hover:underline">Manual Payment Receipt</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileInfo({ icon: Icon, label, value, color = "text-gray-800" }: { icon: any, label: string, value: string, color?: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mt-1 border border-gray-100">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">{label}</p>
        <p className={cn("text-base font-bold mt-1", color)}>{value || '—'}</p>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: any, icon: any, color: string }) {
  const bgMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    sky: 'bg-sky-50 text-sky-600 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  }
  
  return (
    <div className={cn("bg-white p-6 rounded-3xl border shadow-sm", bgMap[color])}>
      <Icon className="w-5 h-5 mb-4" />
      <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  )
}

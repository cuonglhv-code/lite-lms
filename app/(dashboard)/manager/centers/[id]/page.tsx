'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  School, 
  BadgeDollarSign,
  Settings,
  Pencil
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getCenterDetails } from '../../actions'
import { EditCenterModal } from '@/components/modals/EditCenterModal'

type Tab = 'overview' | 'teachers' | 'students' | 'classes' | 'finance'

interface Teacher {
  id: string
  name: string | null
  email: string
}

interface Student {
  id: string
  name: string
  student_code: string
  email?: string | null
}

interface Class {
  id: string
  class_name: string
  class_code: string
  status: string
  capacity: number
  schedule: string
  teacher: { name: string | null } | null
}

interface Finance {
  id: string
  type: string
  description: string | null
  date: string | Date
  amount: number
}

interface CenterData {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  isActive: boolean
  teachers: Teacher[]
  students: Student[]
  classes: Class[]
  finances: Finance[]
}

export default function CenterDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [center, setCenter] = useState<CenterData | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const res = await getCenterDetails(id)
      if (res.success && res.data) {
        setCenter(res.data as unknown as CenterData)
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

  if (!center) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <h2 className="text-xl font-bold text-gray-900">Center not found</h2>
      <button onClick={() => router.back()} className="mt-4 text-indigo-600 hover:underline">Go back</button>
    </div>
  )

  const {
    name,
    address,
    phone,
    email,
    isActive,
    teachers,
    students,
    classes,
    finances
  } = center

  const teachersCount = teachers?.length || 0
  const studentsCount = students?.length || 0
  const activeClasses = classes?.filter((c: Class) => c.status !== 'Completed').length || 0
  
  const collectionRate = 88 // Mock calculation

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
            <p className="text-gray-500 font-medium">{address || 'No address set'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button className="p-2 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
             <Settings className="w-5 h-5 text-gray-400" />
           </button>
           <button 
             onClick={() => setShowEditModal(true)}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-xl text-white text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors"
           >
             <Pencil className="w-4 h-4" />
             Edit Center
           </button>
        </div>
      </div>

      {showEditModal && (
        <EditCenterModal 
          center={center} 
          onClose={() => setShowEditModal(false)}
          onSuccess={(updated) => setCenter({ ...center, ...updated })}
        />
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8 overflow-x-auto no-scrollbar">
        {['overview', 'teachers', 'students', 'classes', 'finance'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={cn(
              "pb-4 text-sm font-bold capitalize tracking-wide transition-all relative whitespace-nowrap",
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <CenterStatCard label="Teachers" value={teachersCount} icon={Users} color="indigo" />
               <CenterStatCard label="Students" value={studentsCount} icon={GraduationCap} color="emerald" />
               <CenterStatCard label="Active Classes" value={activeClasses} icon={School} color="amber" />
               <CenterStatCard label="Collection Rate" value={`${collectionRate}%`} icon={BadgeDollarSign} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-8">
                  <h3 className="font-bold text-lg text-gray-900">Center Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     <CenterInfoItem icon={MapPin} label="Full Address" value={address || ''} />
                     <CenterInfoItem icon={Phone} label="Office Phone" value={phone || ''} />
                     <CenterInfoItem icon={Mail} label="Contact Email" value={email || ''} />
                     <CenterInfoItem icon={ShieldCheck} label="Operational Status" value={isActive ? 'Fully Active' : 'Inactive'} />
                  </div>
               </div>

               <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Center Growth</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6">This center has grown by 12% in enrollment compared to last quarter.</p>
                    <div className="w-full bg-white/10 h-24 rounded-2xl flex items-end gap-1 p-4">
                       {[0.4, 0.6, 0.5, 0.8, 1].map((h, i) => (
                         <div key={i} className="flex-1 bg-white/20 rounded-t-lg transition-all hover:bg-white" style={{ height: `${h * 100}%` }} />
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'teachers' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Teacher</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Subjects</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Workload</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Avg Band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {teachers?.map((t: Teacher) => (
                     <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-4">
                           <p className="font-bold text-gray-800">{t.name}</p>
                           <p className="text-xs text-gray-400">{t.email}</p>
                        </td>
                        <td className="px-8 py-4 text-gray-500 font-medium">IELTS, TOEIC</td>
                        <td className="px-8 py-4">
                           <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500 rounded-full" style={{ width: '75%' }} />
                             </div>
                             <span className="text-xs font-bold text-gray-600">75%</span>
                           </div>
                        </td>
                        <td className="px-8 py-4 font-bold text-indigo-600">6.8</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Student</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Current Class</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Attendance</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {students?.map((s: Student) => (
                     <tr key={s.id} onClick={() => router.push(`/manager/students/${s.id}`)} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <td className="px-8 py-4">
                           <p className="font-bold text-gray-800">{s.name}</p>
                           <p className="text-xs text-gray-400">{s.email}</p>
                        </td>
                        <td className="px-8 py-4 text-gray-500 font-medium">IELTS Foundation</td>
                        <td className="px-8 py-4">
                           <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
                             </div>
                             <span className="text-xs font-bold text-gray-600">92%</span>
                           </div>
                        </td>
                        <td className="px-8 py-4 font-bold">
                           <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">OK</span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
             <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Class Name</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Teacher</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Schedule</th>
                    <th className="text-left px-8 py-4 font-bold text-gray-400 text-xs uppercase tracking-widest">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {classes?.map((c: Class) => (
                     <tr key={c.id} onClick={() => router.push(`/manager/classes/${c.id}`)} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <td className="px-8 py-4">
                           <p className="font-bold text-gray-800">{c.class_name}</p>
                           <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{c.status}</p>
                        </td>
                        <td className="px-8 py-4 text-gray-600 font-medium">{c.teacher?.name || 'Unassigned'}</td>
                        <td className="px-8 py-4 text-gray-400 font-medium">{c.schedule}</td>
                        <td className="px-8 py-4 font-bold text-gray-800">18 / {c.capacity}</td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h3 className="font-bold text-lg text-gray-900 mb-8">Revenue Summary</h3>
                <div className="space-y-6">
                   <FinanceBar label="Total Planned Fees" value={125000000} target={150000000} color="indigo" />
                   <FinanceBar label="Collected" value={110000000} target={125000000} color="emerald" />
                   <FinanceBar label="Outstanding" value={15000000} target={150000000} color="rose" />
                </div>
             </div>

             <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center">
                   <h3 className="font-bold text-gray-900">Recent Transactions</h3>
                   <button className="text-xs font-bold text-indigo-600">View All</button>
                </div>
                <div className="p-8 space-y-6">
                   {finances?.slice(0, 5).map((f: Finance) => (
                     <div key={f.id} className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <div className={cn(
                           "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                           f.type === 'Income' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                         )}>
                            {f.type === 'Income' ? '+' : '-'}
                         </div>
                         <div>
                            <p className="font-bold text-gray-800">{f.description || 'No description'}</p>
                            <p className="text-xs text-gray-400 font-medium">{new Date(f.date).toLocaleDateString()}</p>
                         </div>
                       </div>
                       <p className="font-black text-gray-900">{Number(f.amount).toLocaleString()} VND</p>
                     </div>
                   ))}
                   {finances?.length === 0 && <p className="text-center text-gray-400 py-12 font-medium">No recent transactions recorded.</p>}
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CenterStatCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: React.ElementType, color: string }) {
  const bgMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100'
  }
  
  return (
    <div className={cn("bg-white p-6 rounded-3xl border shadow-sm", bgMap[color])}>
      <Icon className="w-5 h-5 mb-4 p-1 bg-white/50 rounded-lg shadow-sm" />
      <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  )
}

function CenterInfoItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | null }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-100">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-none">{label}</p>
        <p className="text-sm font-bold text-gray-700 mt-1.5 leading-relaxed">{value || 'Not provided'}</p>
      </div>
    </div>
  )
}

function FinanceBar({ label, value, target, color }: { label: string, value: number, target: number, color: string }) {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500'
  }
  const pct = Math.round((value / target) * 100)
  
  return (
    <div>
       <div className="flex justify-between items-end mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
          <p className="text-sm font-black text-gray-900">{value.toLocaleString()} VND</p>
       </div>
       <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
          <div className={cn("h-full rounded-full transition-all duration-1000", colorMap[color])} style={{ width: `${pct}%` }} />
       </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { UserPlus } from 'lucide-react'
import { ADMIN_STUDENTS, type PaymentStatus, type AdminStudent } from '@/lib/admin-data'
import { EnrolStudentModal } from '@/components/modals/EnrolStudentModal'
import { ManageEnrolmentModal } from '@/components/modals/ManageEnrolmentModal'

function StatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, string> = {
    paid:    'bg-green-100 text-green-700',
    partial: 'bg-amber-100 text-amber-700',
    overdue: 'bg-red-100 text-red-700',
    pending: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold capitalize', map[status])}>
      {status}
    </span>
  )
}

export default function ManagerEnrolmentsPage() {
  const [showEnrolModal, setShowEnrolModal] = useState(false)
  const [managingStudent, setManagingStudent] = useState<AdminStudent | null>(null)
  const pending = ADMIN_STUDENTS.filter(s => s.paymentStatus === 'pending').length

  return (
    <div className="space-y-5">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Enrolments</h1>
          <p className="text-sm text-gray-500 mt-0.5">{ADMIN_STUDENTS.length} enrolled students · {pending} pending payment</p>
        </div>
        <button 
          onClick={() => setShowEnrolModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Enrol Student
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-medium">Student</th>
                <th className="text-left px-4 py-2.5 font-medium">Class</th>
                <th className="text-left px-4 py-2.5 font-medium">Teacher</th>
                <th className="text-left px-4 py-2.5 font-medium">Exam Date</th>
                <th className="text-center px-4 py-2.5 font-medium">Payment</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ADMIN_STUDENTS.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.className}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.teacher}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{s.examDate ?? '—'}</td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={s.paymentStatus} /></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setManagingStudent(s)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEnrolModal && (
        <EnrolStudentModal onClose={() => setShowEnrolModal(false)} />
      )}
      {managingStudent && (
        <ManageEnrolmentModal student={managingStudent} onClose={() => setManagingStudent(null)} />
      )}
    </div>
  )
}

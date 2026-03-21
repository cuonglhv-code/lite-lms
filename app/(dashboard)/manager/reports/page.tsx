import { cn } from '@/lib/utils'
import { BarChart2, Users, BookOpen, CreditCard, GraduationCap, FileText, Download, ExternalLink } from 'lucide-react'

// ── Report type cards ──────────────────────────────────────────

interface ReportType {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  tags: string[]
}

const REPORT_TYPES: ReportType[] = [
  {
    id: 'student-progress',
    title: 'Student Progress Report',
    description: 'Individual IELTS band trajectories, skill breakdowns, and target achievement rates across all enrolled students.',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
    tags: ['Per student', 'Band scores', 'Trends'],
  },
  {
    id: 'class-performance',
    title: 'Class Performance Report',
    description: 'Homework completion, attendance, average band scores, and class-level health ratings by teacher and level.',
    icon: GraduationCap,
    color: 'bg-indigo-50 text-indigo-600',
    tags: ['Per class', 'Comparisons', 'Teacher view'],
  },
  {
    id: 'assessment-analysis',
    title: 'Assessment Analysis',
    description: 'Submission rates, average scores by assessment type (HW / Test / Mock), overdue trends, and grade distributions.',
    icon: BarChart2,
    color: 'bg-purple-50 text-purple-600',
    tags: ['Submissions', 'Score dist.', 'Overdue'],
  },
  {
    id: 'financial-summary',
    title: 'Financial Summary',
    description: 'Fee collection rates, outstanding balances, overdue payments by class, and month-over-month revenue trends.',
    icon: CreditCard,
    color: 'bg-green-50 text-green-600',
    tags: ['Revenue', 'Overdue', 'MoM trends'],
  },
  {
    id: 'enrolment-report',
    title: 'Enrolment Report',
    description: 'New enrolments, class capacity utilisation, drop-out rates, and student source channels.',
    icon: BookOpen,
    color: 'bg-amber-50 text-amber-600',
    tags: ['New students', 'Capacity', 'Drop-outs'],
  },
  {
    id: 'at-risk-report',
    title: 'At-Risk Students Report',
    description: 'Urgency-ranked list of students at risk of failing, with attendance, score gaps, exam dates, and recommended interventions.',
    icon: FileText,
    color: 'bg-red-50 text-red-600',
    tags: ['Risk flags', 'Interventions', 'Exam urgency'],
  },
]

// ── Recent reports ─────────────────────────────────────────────

interface RecentReport {
  id: string
  name: string
  type: string
  generatedAt: string
  generatedBy: string
  size: string
}

const RECENT_REPORTS: RecentReport[] = [
  { id: 'r1', name: 'Class Performance – March 2026', type: 'Class Performance', generatedAt: '20 Mar 2026', generatedBy: 'Manager', size: '48 KB' },
  { id: 'r2', name: 'At-Risk Students – Week 12',     type: 'At-Risk Report',    generatedAt: '17 Mar 2026', generatedBy: 'Manager', size: '32 KB' },
  { id: 'r3', name: 'Financial Summary – Feb 2026',   type: 'Financial Summary', generatedAt: '3 Mar 2026',  generatedBy: 'Manager', size: '56 KB' },
  { id: 'r4', name: 'Student Progress – Q1 2026',     type: 'Student Progress',  generatedAt: '1 Mar 2026',  generatedBy: 'Manager', size: '124 KB' },
  { id: 'r5', name: 'Assessment Analysis – Feb 2026', type: 'Assessment',        generatedAt: '28 Feb 2026', generatedBy: 'Manager', size: '40 KB' },
]

// ── Page ───────────────────────────────────────────────────────

export default function ManagerReportsPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">Generate and download academic and operational reports</p>
      </div>

      {/* Report type grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Generate a Report</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {REPORT_TYPES.map(r => {
            const Icon = r.icon
            return (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', r.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{r.title}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{r.description}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {r.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">{t}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    Preview
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Download className="w-3 h-3" />
                    Export CSV
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent reports */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Recent Reports</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr className="text-xs text-gray-400">
                <th className="text-left px-5 py-2.5 font-medium">Report Name</th>
                <th className="text-left px-4 py-2.5 font-medium">Type</th>
                <th className="text-left px-4 py-2.5 font-medium">Generated</th>
                <th className="text-left px-4 py-2.5 font-medium">By</th>
                <th className="text-center px-4 py-2.5 font-medium">Size</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_REPORTS.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{r.name}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">{r.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.generatedAt}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{r.generatedBy}</td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">{r.size}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

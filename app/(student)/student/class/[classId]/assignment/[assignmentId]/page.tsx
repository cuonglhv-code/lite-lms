import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import {
  getStudentByUserId,
  getAssignmentById,
  getAssignmentAttachments,
  getClassById,
  getSubmission,
  getSubmissionFiles,
} from '@/lib/db/queries'
import Link from 'next/link'
import { Download, ArrowLeft, Calendar, Award } from 'lucide-react'
import YourWorkPanel from '@/components/student/YourWorkPanel'
import FeedbackPanel from '@/components/student/FeedbackPanel'
import type { SubmissionFile } from '@/lib/types'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function daysUntil(iso: string | null): { label: string; urgent: boolean } | null {
  if (!iso) return null
  const diff = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  if (diff < 0) return { label: `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? 's' : ''} late`, urgent: true }
  if (diff === 0) return { label: 'Due today', urgent: true }
  return { label: `Due in ${diff} day${diff !== 1 ? 's' : ''}`, urgent: diff <= 3 }
}

export default async function AssignmentDetailPage({
  params,
}: {
  params: { classId: string; assignmentId: string }
}) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role !== 'student') redirect('/')

  const student = await getStudentByUserId(session.user.id)
  if (!student) redirect('/student')

  const [assignment, cls, attachments] = await Promise.all([
    getAssignmentById(params.assignmentId),
    getClassById(params.classId),
    getAssignmentAttachments(params.assignmentId),
  ])

  if (!assignment || !cls) redirect(`/student/class/${params.classId}`)

  const submission = await getSubmission(params.assignmentId, student.id)
  const files: SubmissionFile[] = submission ? await getSubmissionFiles(submission.id) : []

  const dueMeta = daysUntil(assignment.due_at)

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href={`/student/class/${params.classId}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {cls.class_name}
      </Link>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
        {/* ── Left: Assignment details ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{assignment.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {assignment.due_at ? (
                  <>
                    Due {formatDate(assignment.due_at)}
                    {dueMeta && (
                      <span className={`ml-1 font-medium ${dueMeta.urgent ? 'text-red-500' : 'text-amber-500'}`}>
                        · {dueMeta.label}
                      </span>
                    )}
                  </>
                ) : 'No due date'}
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                {assignment.max_points} points
              </span>
            </div>
          </div>

          {/* Description */}
          {assignment.description && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Instructions</h2>
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{assignment.description}</p>
            </div>
          )}

          {/* Resources / attachments */}
          {attachments.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Resources ({attachments.length})
              </h2>
              <ul className="space-y-2">
                {attachments.map(att => (
                  <li key={att.id}>
                    <a
                      href={att.blob_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group"
                    >
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 shrink-0" />
                      <span className="text-sm text-gray-700 group-hover:text-indigo-700 truncate">
                        {att.filename}
                      </span>
                      <span className="ml-auto text-xs text-gray-400 shrink-0">Download</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Right: Your work + Feedback ── */}
        <div className="space-y-4">
          <YourWorkPanel
            assignmentId={params.assignmentId}
            initialSubmission={submission}
            initialFiles={files}
          />
          <FeedbackPanel submission={submission} maxPoints={Number(assignment.max_points)} />
        </div>
      </div>
    </div>
  )
}

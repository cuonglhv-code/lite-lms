'use client'

import { useRef, useState } from 'react'
import type { Submission, SubmissionFile, SubmissionStatus } from '@/lib/types'
import StatusBadge from './StatusBadge'
import { Upload, Paperclip, X, Loader2, CheckCircle } from 'lucide-react'

interface Props {
  assignmentId: string
  initialSubmission: Submission | null
  initialFiles: SubmissionFile[]
}

export default function YourWorkPanel({ assignmentId, initialSubmission, initialFiles }: Props) {
  const [submission, setSubmission] = useState<Submission | null>(initialSubmission)
  const [files, setFiles] = useState<SubmissionFile[]>(initialFiles)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const status: SubmissionStatus = submission?.status ?? 'not_submitted'
  const canEdit = status !== 'submitted' // can add/remove files if not_submitted or returned

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleFiles(selected: FileList | null) {
    if (!selected || selected.length === 0) return
    setUploading(true)

    for (const file of Array.from(selected)) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('assignmentId', assignmentId)

      const res = await fetch('/api/student/submissions/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        showToast(`Failed to upload ${file.name}`)
        continue
      }
      const data = await res.json()
      setFiles(prev => [...prev, data.submissionFile])
      // Keep submission state in sync
      if (!submission) {
        setSubmission({
          id: data.submissionId,
          assignment_id: assignmentId,
          student_id: '',
          submitted_at: null,
          status: 'not_submitted',
          content: null,
          grade: null,
          feedback_text: null,
          returned_at: null,
          created_at: new Date().toISOString(),
        })
      }
    }

    setUploading(false)
  }

  async function handleRemoveFile(fileId: string) {
    if (!submission) return
    await fetch('/api/student/submissions/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, submissionId: submission.id }),
    })
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  async function handleTurnIn() {
    setSubmitting(true)
    const res = await fetch('/api/student/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignmentId }),
    })
    if (res.ok) {
      const data = await res.json()
      setSubmission(data)
      showToast('Assignment turned in!')
    } else {
      showToast('Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  function handleResubmit() {
    // Allow editing again — status resets to not_submitted locally until re-submitted
    setSubmission(prev => prev ? { ...prev, status: 'not_submitted' } : null)
  }

  // Drag-and-drop handlers
  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }
  function onDragLeave() { setDragOver(false) }
  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Your work</h3>
        <StatusBadge status={status} />
      </div>

      {/* Submitted text content */}
      {submission?.content && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
          <p className="text-xs font-medium text-blue-600">Your response:</p>
          <p className="text-sm text-blue-900 whitespace-pre-wrap leading-relaxed">
            {submission.content}
          </p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map(f => (
            <li
              key={f.id}
              className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-sm"
            >
              <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
              <a
                href={f.blob_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-indigo-600 hover:underline truncate"
              >
                {f.filename}
              </a>
              {canEdit && (
                <button
                  onClick={() => handleRemoveFile(f.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Upload area (only when editable) */}
      {canEdit && (
        <>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
              dragOver
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                <span className="text-sm text-gray-500">Uploading…</span>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Drag & drop or <span className="text-indigo-600 font-medium">browse</span>
                </span>
                <span className="text-xs text-gray-400">PDF, DOCX, images, etc.</span>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
        </>
      )}

      {/* Action button */}
      <div>
        {status === 'not_submitted' && (
          <button
            onClick={handleTurnIn}
            disabled={submitting || uploading}
            className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {submitting ? 'Turning in…' : 'Turn in'}
          </button>
        )}

        {status === 'submitted' && (
          <button
            disabled
            className="w-full py-2.5 px-4 rounded-lg bg-gray-100 text-gray-400 text-sm font-semibold cursor-not-allowed"
          >
            Submitted — awaiting review
          </button>
        )}

        {status === 'returned' && (
          <button
            onClick={handleResubmit}
            className="w-full py-2.5 px-4 rounded-lg bg-white border-2 border-indigo-600 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition-colors"
          >
            Resubmit
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="text-xs text-center text-gray-600 bg-gray-100 rounded-lg px-3 py-2">
          {toast}
        </div>
      )}
    </div>
  )
}

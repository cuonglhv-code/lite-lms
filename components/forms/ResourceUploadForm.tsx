'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ResourceUploadForm({
  classId, onCreated,
}: { classId: string; onCreated: () => void }) {
  const [title,    setTitle]    = useState('')
  const [linkUrl,  setLinkUrl]  = useState('')
  const [file,     setFile]     = useState<File | null>(null)
  const [progress, setProgress] = useState<'idle' | 'uploading' | 'done'>('idle')
  const [blobUrl,  setBlobUrl]  = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return

    if (file) {
      setProgress('uploading')
      const fd = new FormData()
      fd.append('file', file)
      fd.append('classId', classId)
      fd.append('title', title)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      setBlobUrl(data.blob_url ?? '')
      setProgress('done')
    } else if (linkUrl) {
      await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, title, url: linkUrl }),
      })
    }

    setTitle(''); setLinkUrl(''); setFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setProgress('idle')
    onCreated()
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="space-y-1">
        <Label>Title</Label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Resource title" required />
      </div>

      <div className="space-y-1">
        <Label>Link URL (optional)</Label>
        <Input value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="https://…" type="url" />
      </div>

      <div
        className="border-2 border-dashed rounded-md p-4 text-center text-sm text-gray-400 cursor-pointer hover:border-indigo-400"
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
      >
        {file ? file.name : 'Drop a file here or click to browse'}
        <input ref={fileRef} type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      </div>

      {progress === 'uploading' && <p className="text-xs text-indigo-500">Uploading to Vercel Blob…</p>}
      {progress === 'done' && blobUrl && (
        <p className="text-xs text-green-600">Uploaded: <a href={blobUrl} target="_blank" className="underline">{blobUrl}</a></p>
      )}

      <Button type="submit" disabled={progress === 'uploading'}>
        {progress === 'uploading' ? 'Uploading…' : 'Add Resource'}
      </Button>
    </form>
  )
}

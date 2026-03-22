"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SessionProp {
  id: string
  date: string
  startTime: string
  endTime: string
}

export function AddSessionNoteModal({ classId, sessions, onClose, onSuccess }: { classId: string, sessions: SessionProp[], onClose: () => void, onSuccess: (msg: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState(sessions[0]?.id || '')
  const [topic, setTopic] = useState('')
  const [note, setNote] = useState('')

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    console.log("Add Session Note submitted:", { classId, session, topic, note })
    
    setTimeout(() => {
      setLoading(false)
      onSuccess("✓ Session note added.")
      onClose()
    }, 500)
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Session Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 pr-1">
            <div className="space-y-2">
              <Label>Session</Label>
              <select 
                value={session} 
                onChange={e => setSession(e.target.value)} 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {sessions.map((s: SessionProp) => (
                  <option key={s.id} value={s.id}>{s.date} ({s.startTime} - {s.endTime})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Topic Covered</Label>
              <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Grammar, Speaking Practice" />
            </div>
            <div className="space-y-2">
              <Label>Note</Label>
              <textarea 
                value={note} 
                onChange={e => setNote(e.target.value)} 
                maxLength={300} 
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" 
                rows={4} 
                placeholder="Session observations, problems, etc."
              />
              <p className="text-right text-xs text-gray-400 mt-1">{note.length}/300</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

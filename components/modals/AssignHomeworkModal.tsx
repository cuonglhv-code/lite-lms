"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AssignHomeworkModal({ classId, onClose }: { classId: string, onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    console.log("AssignHomeworkModal submitted:", Object.fromEntries(formData))
    
    setTimeout(() => {
      setLoading(false)
      alert("Homework assigned successfully!")
      onClose()
    }, 500)
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Assign Homework</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 pr-1">
            <div className="space-y-2">
              <Label htmlFor="classId">Class</Label>
              <Input id="classId" name="classId" value={classId} readOnly className="bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taskName">Task Name*</Label>
              <Input id="taskName" name="taskName" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-4 items-center mt-1">
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="type" value="Homework" required className="accent-indigo-600" /> Homework</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="type" value="Test" required className="accent-indigo-600" /> Test</label>
                <label className="flex items-center gap-2 text-sm"><input type="radio" name="type" value="Mock" required className="accent-indigo-600" /> Mock</label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date*</Label>
              <Input id="dueDate" name="dueDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <textarea id="description" name="description" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>Assign</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

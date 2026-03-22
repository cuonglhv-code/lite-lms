"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ADMIN_STUDENTS, ADMIN_CLASSES } from "@/lib/admin-data"

export function EnrolStudentModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    console.log("EnrolStudentModal submitted:", Object.fromEntries(formData))
    
    setTimeout(() => {
      setLoading(false)
      alert("Student enrolled successfully!")
      onClose()
    }, 500)
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Enrol Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="student_id">Student</Label>
              <select id="student_id" name="student_id" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                <option value="" disabled selected>Select a student...</option>
                {ADMIN_STUDENTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class_id">Class</Label>
              <select id="class_id" name="class_id" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                <option value="" disabled selected>Select a class...</option>
                {ADMIN_CLASSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="examDate">Exam Date</Label>
              <Input id="examDate" name="examDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <select id="paymentStatus" name="paymentStatus" className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>Enrol</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

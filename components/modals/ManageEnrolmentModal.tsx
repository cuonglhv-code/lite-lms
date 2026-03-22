"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import type { AdminStudent } from "@/lib/admin-data"

export function ManageEnrolmentModal({ student, onClose }: { student: AdminStudent; onClose: () => void }) {
  const [loading, setLoading] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    console.log("ManageEnrolmentModal submitted:", Object.fromEntries(formData))
    
    setTimeout(() => {
      setLoading(false)
      alert("Enrolment updated successfully!")
      onClose()
    }, 500)
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Manage Enrolment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Student:</span> {student.name}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Class:</span> {student.className}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Teacher:</span> {student.teacher}
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="examDate">Exam Date</Label>
              <Input id="examDate" name="examDate" type="date" defaultValue={student.examDate || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <select id="paymentStatus" name="paymentStatus" defaultValue={student.paymentStatus} className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

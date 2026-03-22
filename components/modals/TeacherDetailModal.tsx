"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { AdminTeacher } from "@/lib/admin-data"

export function TeacherDetailModal({ teacher, onClose }: { teacher: AdminTeacher; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Teacher Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <div>
            <span className="font-semibold">Name:</span> {teacher.name}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {teacher.email}
          </div>
          <div>
            <span className="font-semibold">Subjects:</span> {teacher.subjects.join(", ")}
          </div>
          <div>
            <span className="font-semibold">Qualifications:</span> {teacher.qualifications}
          </div>
          <div>
            <span className="font-semibold">Total Students:</span> {teacher.studentsTotal}
          </div>
          <div>
            <span className="font-semibold">Hours per Week:</span> {teacher.hoursPerWeek}
          </div>
          <div>
            <span className="font-semibold">Status:</span> <span className="capitalize">{teacher.status}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

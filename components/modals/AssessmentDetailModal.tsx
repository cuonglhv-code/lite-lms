"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { AdminAssessment } from "@/lib/admin-data"

export function AssessmentDetailModal({ assessment, onClose }: { assessment: AdminAssessment; onClose: () => void }) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assessment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <div>
            <span className="font-semibold">Name:</span> {assessment.name}
          </div>
          <div>
            <span className="font-semibold">Class:</span> {assessment.className}
          </div>
          <div>
            <span className="font-semibold">Type:</span> <span className="capitalize">{assessment.type}</span>
          </div>
          <div>
            <span className="font-semibold">Teacher:</span> {assessment.teacher}
          </div>
          <div>
            <span className="font-semibold">Due Date:</span> {assessment.dueDate}
          </div>
          <div>
            <span className="font-semibold">Submissions:</span> {assessment.submissionsReceived}/{assessment.submissionsTotal}
          </div>
          <div>
            <span className="font-semibold">Average Score:</span> {assessment.avgScore ?? "N/A"}
          </div>
          <div>
            <span className="font-semibold">Status:</span> <span className="capitalize">{assessment.status}</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

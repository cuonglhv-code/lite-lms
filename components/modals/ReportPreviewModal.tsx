"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function ReportPreviewModal({ title, data, onClose }: { title: string; data: any[]; onClose: () => void }) {
  if (!data || data.length === 0) return null
  const headers = Object.keys(data[0])

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title} - Preview (First 5 Rows)</DialogTitle>
        </DialogHeader>
        <div className="py-4 overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {headers.map(h => (
                  <th key={h} className="text-left px-4 py-2 font-medium text-gray-600 capitalize">{h.replace(/([A-Z])/g, ' $1')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {headers.map(h => (
                    <td key={h} className="px-4 py-2 text-gray-800 break-words max-w-xs">{String(row[h])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

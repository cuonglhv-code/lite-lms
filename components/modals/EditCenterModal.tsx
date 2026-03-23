"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateCenter } from "@/app/(dashboard)/manager/actions"

interface Center {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  isActive: boolean
}

export function EditCenterModal({ 
  center, 
  onClose, 
  onSuccess 
}: { 
  center: Center
  onClose: () => void 
  onSuccess: (updated: Partial<Center>) => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      isActive: formData.get("isActive") === "on",
    }

    const res = await updateCenter(center.id, data)
    
    if (res.success) {
      onSuccess(res.data as unknown as Partial<Center>)
      onClose()
    } else {
      setError(res.error || "Failed to update center")
    }
    setLoading(false)
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Center Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="name">Center Name</Label>
              <Input id="name" name="name" defaultValue={center.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={center.address || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={center.phone || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={center.email || ""} />
            </div>
            <div className="flex items-center gap-2">
              <input 
                id="isActive" 
                name="isActive" 
                type="checkbox" 
                defaultChecked={center.isActive} 
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <Label htmlFor="isActive">Active Status</Label>
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

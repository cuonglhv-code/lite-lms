"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TeacherSettingsPage() {
  const [displayName, setDisplayName] = useState("Tran Thi B")
  const [email] = useState("tran.b@jaxtina.edu.vn")
  const [alertsCritical, setAlertsCritical] = useState(true)
  const [alertsOverdue, setAlertsOverdue] = useState(false)
  const [alertsExam, setAlertsExam] = useState(true)
  const [defaultAssess, setDefaultAssess] = useState('Homework')
  const [success, setSuccess] = useState('')

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    console.log("Settings saved:", {
      displayName, email, alertsCritical, alertsOverdue, alertsExam, defaultAssess
    })
    setSuccess("✓ Settings saved.")
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your personal and academic preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-800 border-b pb-2">Profile</h2>
          <div className="space-y-4 max-w-sm">
            <div className="space-y-1.5">
              <Label htmlFor="displayName">Display Name</Label>
              <Input id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={email} readOnly className="bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-800 border-b pb-2">Preferences</h2>
          <div className="space-y-4">
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="defaultAssess">Default Assessment Type</Label>
              <select id="defaultAssess" value={defaultAssess} onChange={e => setDefaultAssess(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="Homework">Homework</option>
                <option value="Test">Test</option>
                <option value="Mock">Mock Exam</option>
              </select>
            </div>
            <div className="pt-2">
              <Label className="mb-3 block">Email Notifications</Label>
              <div className="space-y-3">
                <Label className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                  <input type="checkbox" checked={alertsCritical} onChange={e => setAlertsCritical(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
                  Alerts for critical students
                </Label>
                <Label className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                  <input type="checkbox" checked={alertsOverdue} onChange={e => setAlertsOverdue(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
                  Homework overdue reminders
                </Label>
                <Label className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                  <input type="checkbox" checked={alertsExam} onChange={e => setAlertsExam(e.target.checked)} className="accent-indigo-600 w-4 h-4" />
                  Exam countdown alerts
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit">Save Changes</Button>
          {success && <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">{success}</span>}
        </div>
      </form>
    </div>
  )
}

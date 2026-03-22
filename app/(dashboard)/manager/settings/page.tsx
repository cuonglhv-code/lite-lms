"use client"

import { useState } from "react"

export default function ManagerSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const [settings, setSettings] = useState({
    centreName: 'Jaxtina English Centre',
    managerEmail: 'manager@jaxtina.edu.vn',
    defaultExamTarget: '6.5',
    attendanceThreshold: '70%',
    financeCurrency: 'VND'
  })

  function handleSave() {
    setLoading(true)
    console.log("Saving settings...", settings)
    
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }, 500)
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Centre configuration and preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          <label className="text-sm font-medium text-gray-700 w-52 shrink-0">Centre Name</label>
          <input
            type="text"
            value={settings.centreName}
            onChange={(e) => setSettings({ ...settings, centreName: e.target.value })}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <label className="text-sm font-medium text-gray-700 w-52 shrink-0">Manager Email</label>
          <input
            type="email"
            value={settings.managerEmail}
            onChange={(e) => setSettings({ ...settings, managerEmail: e.target.value })}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <label className="text-sm font-medium text-gray-700 w-52 shrink-0">Default Exam Target</label>
          <input
            type="text"
            value={settings.defaultExamTarget}
            onChange={(e) => setSettings({ ...settings, defaultExamTarget: e.target.value })}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <label className="text-sm font-medium text-gray-700 w-52 shrink-0">At-Risk Attendance Threshold</label>
          <input
            type="text"
            value={settings.attendanceThreshold}
            onChange={(e) => setSettings({ ...settings, attendanceThreshold: e.target.value })}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <label className="text-sm font-medium text-gray-700 w-52 shrink-0">Finance Currency</label>
          <input
            type="text"
            value={settings.financeCurrency}
            onChange={(e) => setSettings({ ...settings, financeCurrency: e.target.value })}
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {success && <span className="text-sm text-green-600 font-medium">Settings saved!</span>}
        <button onClick={handleSave} disabled={loading} className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}

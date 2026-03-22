'use client'

import { useState, useEffect } from 'react'
import { Building2, ChevronDown, Check, Globe } from 'lucide-react'
import { useCenter } from '@/context/CenterContext'
import { cn } from '@/lib/utils'

export function CenterSwitcher() {
  const { centerId, centerName, setCenter, isFixed } = useCenter()
  const [open, setOpen] = useState(false)
  const [centers, setCenters] = useState<{id: string, name: string}[]>([])

  useEffect(() => {
    if (isFixed) return
    
    fetch('/api/centers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCenters(data)
      })
  }, [isFixed])

  if (isFixed) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
        <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
          <Building2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Current Center</p>
          <p className="text-xs font-bold text-indigo-900 truncate">{centerName}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mb-6">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
            {centerId ? <Building2 className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" /> : <Globe className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />}
          </div>
          <div className="text-left min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Teaching Area</p>
            <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{centerName}</p>
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-3 pb-2 mb-2 border-b border-gray-50">
              <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1">Switch Center</p>
            </div>
            
            <button
              onClick={() => { setCenter(null); setOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Globe className={cn("w-4 h-4", !centerId ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-400")} />
                <span className={cn("text-sm transition-colors", !centerId ? "font-bold text-indigo-900" : "text-gray-600 font-medium group-hover:text-indigo-600")}>
                  All Centers (HQ)
                </span>
              </div>
              {!centerId && <Check className="w-4 h-4 text-indigo-600" />}
            </button>

            {centers.map(c => (
              <button
                key={c.id}
                onClick={() => { setCenter(c.id, c.name); setOpen(false) }}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Building2 className={cn("w-4 h-4", centerId === c.id ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-400")} />
                  <span className={cn("text-sm transition-colors", centerId === c.id ? "font-bold text-indigo-900" : "text-gray-600 font-medium group-hover:text-indigo-600")}>
                    {c.name}
                  </span>
                </div>
                {centerId === c.id && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

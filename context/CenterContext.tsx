'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface CenterContextType {
  centerId: string | null
  centerName: string
  setCenter: (id: string | null, name?: string) => void
  isFixed: boolean
}

const CenterContext = createContext<CenterContextType | undefined>(undefined)

export function CenterProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null)
  const [selectedCenterName, setSelectedCenterName] = useState<string>('All Centers')
  const [isLoaded, setIsLoaded] = useState(false)

  // Determine if the center is fixed based on user role
  const user = session?.user as any
  const isFixed = user?.role === 'center_manager' || user?.role === 'teacher'
  const sessionCenterId = user?.centerId

  useEffect(() => {
    // 1. If fixed center, always use session value
    if (isFixed) {
      setSelectedCenterId(sessionCenterId)
      setSelectedCenterName(user?.centerName || 'My Center') // We might want to fetch the real name later
      return
    }

    // 2. If admin/manager, try to load from localStorage
    const savedId = localStorage.getItem('jaxtina_selected_center_id')
    const savedName = localStorage.getItem('jaxtina_selected_center_name')

    if (savedId) {
      setSelectedCenterId(savedId)
      setSelectedCenterName(savedName || 'Main Center')
    }
    
    setIsLoaded(true)
  }, [isFixed, sessionCenterId, user?.centerName])

  const setCenter = (id: string | null, name?: string) => {
    if (isFixed) return // Cannot change if fixed

    setSelectedCenterId(id)
    const newName = name || (id === null ? 'All Centers' : 'Center')
    setSelectedCenterName(newName)

    if (id) {
      localStorage.setItem('jaxtina_selected_center_id', id)
      localStorage.setItem('jaxtina_selected_center_name', newName)
    } else {
      localStorage.removeItem('jaxtina_selected_center_id')
      localStorage.removeItem('jaxtina_selected_center_name')
    }
  }

  return (
    <CenterContext.Provider 
      value={{ 
        centerId: isFixed ? sessionCenterId : selectedCenterId, 
        centerName: selectedCenterName, 
        setCenter,
        isFixed
      }}
    >
      {children}
    </CenterContext.Provider>
  )
}

export function useCenter() {
  const context = useContext(CenterContext)
  if (context === undefined) {
    throw new Error('useCenter must be used within a CenterProvider')
  }
  return context
}

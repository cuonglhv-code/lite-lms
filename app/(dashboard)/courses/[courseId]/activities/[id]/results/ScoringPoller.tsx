'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function ScoringPoller() {
  const router = useRouter()
  useEffect(() => {
    // router.refresh() re-fetches the server component data 
    // without a full browser reload or losing client state.
    const interval = setInterval(() => router.refresh(), 8000)
    return () => clearInterval(interval)
  }, [router])
  
  return null
}

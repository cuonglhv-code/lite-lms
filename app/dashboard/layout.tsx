// Auth-guarded layout wrapper for all /dashboard/* routes (profile, settings, etc.)

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import DashboardHeader from '@/components/student/dashboard/DashboardHeader'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  const userName    = session.user.name  ?? ''
  const userEmail   = session.user.email ?? ''
  const userInitial = (userName[0] ?? 'U').toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

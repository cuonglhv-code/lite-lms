import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import DashboardHeader from '@/components/student/dashboard/DashboardHeader'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role !== 'student') redirect('/')

  const userName = session.user.name ?? ''
  const userEmail = session.user.email ?? ''
  // For Vietnamese names (Family Middle Given), use first letter of given name (last token)
  const nameParts = userName.split(' ')
  const givenName = nameParts[nameParts.length - 1] || userName
  const userInitial = (givenName[0] ?? 'S').toUpperCase()

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

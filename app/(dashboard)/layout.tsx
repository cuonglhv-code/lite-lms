import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import { CenterProvider } from '@/context/CenterContext'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <CenterProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar role={session.user.role} userName={session.user.name} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </CenterProvider>
  )
}

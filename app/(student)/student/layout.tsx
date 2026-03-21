import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role !== 'student') redirect('/')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/student" className="text-lg font-bold text-indigo-600 hover:text-indigo-700">
              Jaxtina LMS
            </Link>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-widest border border-gray-200 rounded px-2 py-0.5">
              Student
            </span>
          </div>
          <span className="text-sm text-gray-600 font-medium">{session.user.name}</span>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

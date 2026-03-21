import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardIndexPage() {
  const session = await auth()
  if (!session) redirect('/login')
  redirect(session.user.role === 'manager' ? '/manager' : '/teacher')
}

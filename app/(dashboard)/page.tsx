import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardIndexPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role === 'manager') redirect('/manager')
  else if (session.user.role === 'student') redirect('/student')
  else redirect('/teacher')
}

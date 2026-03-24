import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { CreateActivityForm } from './CreateActivityForm'

export default async function CreateActivityPage() {
  const session = await auth()
  const isTeacher = ['teacher', 'admin', 'manager'].includes(session?.user?.role || '')
  
  if (!session?.user || !isTeacher) {
    redirect('/dashboard')
  }

  return <CreateActivityForm />
}

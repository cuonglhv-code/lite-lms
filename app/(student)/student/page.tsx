import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getStudentByUserId, getEnrolledClassesForStudent } from '@/lib/db/queries'
import ClassCard from '@/components/student/ClassCard'

export default async function MyClassesPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const student = await getStudentByUserId(session.user.id)
  if (!student) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Your account is not linked to a student record.</p>
        <p className="text-gray-400 text-sm mt-1">Please contact your teacher or academic manager.</p>
      </div>
    )
  }

  const classes = await getEnrolledClassesForStudent(student.id)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Classes</h1>

      {classes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">You are not enrolled in any classes yet.</p>
          <p className="text-gray-400 text-sm mt-1">Contact your academic manager to get enrolled.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map(cls => (
            <ClassCard key={cls.id} cls={cls} />
          ))}
        </div>
      )}
    </div>
  )
}

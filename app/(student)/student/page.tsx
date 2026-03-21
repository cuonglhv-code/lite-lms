import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getStudentByUserId, getStudentCourseSummaries, getMonthlyActivityMap } from '@/lib/db/queries'
import { DAILY_GOALS, WEEK_DAYS } from '@/lib/dashboard-data'
import GreetingHero from '@/components/student/dashboard/GreetingHero'
import TodayGoals from '@/components/student/dashboard/TodayGoals'
import LearningPlan from '@/components/student/dashboard/LearningPlan'
import HabitCalendar from '@/components/student/dashboard/HabitCalendar'
import CourseList from '@/components/student/dashboard/CourseList'

export default async function StudentDashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const student = await getStudentByUserId(session.user.id)
  const now = new Date()

  const [courses, calMap] = await Promise.all([
    student ? getStudentCourseSummaries(student.id) : Promise.resolve([]),
    student
      ? getMonthlyActivityMap(student.id, now.getFullYear(), now.getMonth() + 1)
      : Promise.resolve({}),
  ])

  // Annotate WEEK_DAYS with today (0=Mon…6=Sun)
  const todayIdx = (now.getDay() + 6) % 7
  const days = WEEK_DAYS.map((d, i) => ({ ...d, isToday: i === todayIdx }))

  if (!student) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Your account is not linked to a student record.</p>
        <p className="text-gray-400 text-sm mt-1">Please contact your teacher or academic manager.</p>
      </div>
    )
  }

  return (
    <>
      <GreetingHero
        userName={session.user.name ?? ''}
        goalText="IELTS Academic Band 7+"
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          <TodayGoals goals={DAILY_GOALS} />
          <LearningPlan days={days} />
          <CourseList courses={courses} />
        </div>

        {/* Sidebar */}
        <div>
          <HabitCalendar
            year={now.getFullYear()}
            month={now.getMonth() + 1}
            activityMap={calMap}
          />
        </div>
      </div>
    </>
  )
}

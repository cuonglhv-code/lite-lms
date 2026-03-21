// /dashboard/profile — learner profile page: sidebar + 4-tab main panel

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ProfileSidebar from '@/components/profile/ProfileSidebar'
import ProfileTabs from '@/components/profile/ProfileTabs'
import {
  PROFILE_USER, SKILL_SCORES, ENROLLED_COURSES,
  CERTIFICATES, BADGES, STATS, ACTIVITY_FEED, ACTIVITY_CALENDAR,
} from '@/lib/profile-data'

export const metadata = { title: 'My Profile – Jaxtina LMS' }

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect('/login')

  // Merge session identity into the mock profile for display
  const user = {
    ...PROFILE_USER,
    name:          session.user.name  ?? PROFILE_USER.name,
    email:         session.user.email ?? PROFILE_USER.email,
    avatarInitial: (session.user.name?.[0] ?? PROFILE_USER.avatarInitial).toUpperCase(),
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
      <ProfileSidebar user={user} />
      <ProfileTabs
        user={user}
        skillScores={SKILL_SCORES}
        enrolledCourses={ENROLLED_COURSES}
        certificates={CERTIFICATES}
        badges={BADGES}
        stats={STATS}
        activityFeed={ACTIVITY_FEED}
        activityCalendar={ACTIVITY_CALENDAR}
      />
    </div>
  )
}

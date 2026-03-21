// Tab container managing Overview / Learning Progress / Accomplishments / Activity tabs

'use client'

import { useState } from 'react'
import OverviewTab from './tabs/OverviewTab'
import ProgressTab from './tabs/ProgressTab'
import AccomplishmentsTab from './tabs/AccomplishmentsTab'
import ActivityTab from './tabs/ActivityTab'
import type {
  ProfileUser, SkillScore, EnrolledCourse,
  Certificate, Badge, ActivityItem,
} from '@/lib/profile-data'

type TabId = 'overview' | 'progress' | 'accomplishments' | 'activity'

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',        label: 'Overview' },
  { id: 'progress',        label: 'Learning Progress' },
  { id: 'accomplishments', label: 'Accomplishments' },
  { id: 'activity',        label: 'Activity' },
]

interface Props {
  user: ProfileUser
  skillScores: SkillScore[]
  enrolledCourses: EnrolledCourse[]
  certificates: Certificate[]
  badges: Badge[]
  stats: { coursesCompleted: number; totalHours: number; currentStreak: number; bestStreak: number }
  activityFeed: ActivityItem[]
  activityCalendar: Record<string, 0 | 1 | 2>
}

export default function ProfileTabs(props: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const { user, skillScores, enrolledCourses, certificates, badges, stats, activityFeed, activityCalendar } = props

  return (
    <div className="min-w-0">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto" role="tablist" aria-label="Profile sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors shrink-0
              ${activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'overview'        && <OverviewTab user={user} />}
        {activeTab === 'progress'        && <ProgressTab skillScores={skillScores} enrolledCourses={enrolledCourses} targetBand={user.goal.targetBand} />}
        {activeTab === 'accomplishments' && <AccomplishmentsTab certificates={certificates} badges={badges} stats={stats} />}
        {activeTab === 'activity'        && <ActivityTab activityCalendar={activityCalendar} activityFeed={activityFeed} />}
      </div>
    </div>
  )
}

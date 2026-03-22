// Mock data and types for the learner profile page and UserMenu dropdown

export interface ProfileUser {
  id: string
  name: string
  displayName: string
  email: string
  location: string
  language: string
  bio: string
  avatarInitial: string
  isPublic: boolean
  isPremium: boolean
  hasUpdates: boolean
  goal: {
    targetBand: string
    targetDate: string // ISO date
  }
  externalLinks: { label: string; url: string }[]
  studyPurposes: string[]
  desiredOutcome: string
  education: { institution: string; degree: string; year: number }[]
}

export interface SkillScore {
  skill: 'Reading' | 'Writing' | 'Listening' | 'Speaking'
  current: number // IELTS band, e.g. 6.5
  target: number
}

export interface EnrolledCourse {
  id: string
  name: string
  percentComplete: number
  eta: string
}

export interface Certificate {
  id: string
  courseName: string
  issueDate: string
  downloadUrl: string
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  earned: boolean
  earnedDate?: string
}

export interface ActivityItem {
  id: string
  type: 'video' | 'practice' | 'writing' | 'reading' | 'achievement' | 'listening'
  label: string
  duration?: string
  date: string
}

// ── Core user ─────────────────────────────────────────────────

export const PROFILE_USER: ProfileUser = {
  id: 'u001',
  name: 'Cuong Le',
  displayName: 'cuongle',
  email: 'cuong@example.com',
  location: 'Ho Chi Minh City, Vietnam',
  language: 'Vietnamese',
  bio: 'IELTS learner aiming for Band 7+. Focused on Writing Task 2 coherence and Speaking fluency. Engineering background, first attempt at academic IELTS.',
  avatarInitial: 'C',
  isPublic: true,
  isPremium: false,
  hasUpdates: true,
  goal: {
    targetBand: 'Band 7+',
    targetDate: '2026-06-15',
  },
  externalLinks: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/cuongle' },
    { label: 'GitHub',   url: 'https://github.com/cuongle' },
  ],
  studyPurposes: ['University Application', 'Career Advancement', 'Immigration'],
  desiredOutcome: "Achieve IELTS Academic Band 7+ to apply for UK master's programmes in 2026.",
  education: [
    { institution: 'University of Economics HCMC', degree: 'BSc Economics', year: 2023 },
  ],
}

// ── Learning progress ─────────────────────────────────────────

export const SKILL_SCORES: SkillScore[] = [
  { skill: 'Reading',   current: 6.5, target: 7.0 },
  { skill: 'Writing',   current: 5.5, target: 7.0 },
  { skill: 'Listening', current: 7.0, target: 7.5 },
  { skill: 'Speaking',  current: 6.0, target: 7.0 },
]

export const ENROLLED_COURSES: EnrolledCourse[] = [
  { id: '20000000-0000-0000-0000-000000000001', name: 'IELTS Writing Task 2 – Band 7 Strategy',    percentComplete: 22, eta: 'May 10, 2026' },
  { id: '30000000-0000-0000-0000-000000000001', name: 'IELTS Academic Reading – Speed & Accuracy', percentComplete: 45, eta: 'Apr 20, 2026' },
  { id: '40000000-0000-0000-0000-000000000001', name: 'IELTS Listening – Sections 3 & 4',          percentComplete: 8,  eta: 'Jun 1, 2026' },
]

// ── Accomplishments ───────────────────────────────────────────

export const CERTIFICATES: Certificate[] = [
  { id: 'cert1', courseName: 'IELTS Foundation – Complete Course', issueDate: 'Jan 12, 2026', downloadUrl: '#' },
]

export const BADGES: Badge[] = [
  { id: 'b1', name: 'First Lesson',   icon: '🎓', description: 'Completed your first lesson',          earned: true,  earnedDate: 'Jan 5, 2026' },
  { id: 'b2', name: '7-Day Streak',   icon: '🔥', description: '7 days in a row',                      earned: true,  earnedDate: 'Jan 12, 2026' },
  { id: 'b3', name: 'Writing Master', icon: '✍️', description: 'Submitted all writing task assignments', earned: false },
  { id: 'b4', name: 'Speed Reader',   icon: '📖', description: 'Finished a reading module in 7 days',   earned: false },
  { id: 'b5', name: 'Perfect Score',  icon: '⭐', description: 'Scored 100% on any practice test',      earned: false },
  { id: 'b6', name: '30-Day Streak',  icon: '🏆', description: '30 consecutive days of study',          earned: false },
]

export const STATS = {
  coursesCompleted: 1,
  totalHours: 24,
  currentStreak: 5,
  bestStreak: 7,
}

// ── Activity ──────────────────────────────────────────────────

export const ACTIVITY_FEED: ActivityItem[] = [
  { id: 'a1', type: 'video',       label: 'Watched: Essay Structure – Coherence & Cohesion', duration: '12 min', date: 'Today' },
  { id: 'a2', type: 'practice',    label: 'Completed: Reading Practice Test 3',              duration: '20 min', date: 'Today' },
  { id: 'a3', type: 'writing',     label: 'Submitted: Writing Task 2 Problem-Solution Essay', duration: '40 min', date: 'Yesterday' },
  { id: 'a4', type: 'video',       label: 'Watched: Matching Headings Strategy',             duration: '8 min',  date: 'Yesterday' },
  { id: 'a5', type: 'listening',   label: 'Completed: Listening Section 3 Drill',            duration: '15 min', date: '2 days ago' },
  { id: 'a6', type: 'achievement', label: 'Earned badge: 7-Day Streak 🔥',                  date: '3 days ago' },
  { id: 'a7', type: 'reading',     label: 'Completed: Reading Unit 4 – Summary Completion',  duration: '18 min', date: '4 days ago' },
]

// Calendar heatmap: ISO date string → 0 (none) | 1 (some) | 2 (all goals done)
export const ACTIVITY_CALENDAR: Record<string, 0 | 1 | 2> = {
  // January 2026
  '2026-01-05': 1, '2026-01-06': 2, '2026-01-07': 1, '2026-01-08': 1,
  '2026-01-12': 2, '2026-01-13': 2, '2026-01-14': 1, '2026-01-15': 2,
  '2026-01-19': 1, '2026-01-20': 2, '2026-01-21': 1,
  '2026-01-26': 2, '2026-01-27': 1, '2026-01-28': 2, '2026-01-29': 1,
  // February 2026
  '2026-02-02': 1, '2026-02-03': 2, '2026-02-04': 2, '2026-02-05': 1,
  '2026-02-09': 2, '2026-02-10': 2, '2026-02-11': 1, '2026-02-12': 2,
  '2026-02-16': 1, '2026-02-17': 2, '2026-02-18': 1,
  '2026-02-23': 2, '2026-02-24': 2, '2026-02-25': 1,
  // March 2026
  '2026-03-02': 1, '2026-03-03': 2, '2026-03-04': 1,
  '2026-03-09': 2, '2026-03-10': 1, '2026-03-11': 2,
  '2026-03-16': 2, '2026-03-17': 1, '2026-03-18': 2,
  '2026-03-19': 1, '2026-03-21': 1,
}

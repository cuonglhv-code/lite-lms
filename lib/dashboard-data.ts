// lib/dashboard-data.ts

export type ActivityType = 'video' | 'reading' | 'practice' | 'writing' | 'listening'

export interface DailyGoal {
  id: string
  label: string
  current: number
  target: number
  href: string
}

export interface WeekDay {
  label: string      // "Mon"
  fullLabel: string  // "Monday"
  goalSet: boolean
  done: boolean
  isToday: boolean
}

export const DAILY_GOALS: DailyGoal[] = [
  { id: 'items',   label: 'Complete any 3 learning items', current: 0, target: 3, href: '/student' },
  { id: 'writing', label: 'Complete 1 writing task',       current: 0, target: 1, href: '/student' },
  { id: 'videos',  label: 'Watch 2 videos',                current: 0, target: 2, href: '/student' },
]

// isToday is annotated at render time in the page based on new Date().getDay()
export const WEEK_DAYS: WeekDay[] = [
  { label: 'Mon', fullLabel: 'Monday',    goalSet: false, done: false, isToday: false },
  { label: 'Tue', fullLabel: 'Tuesday',   goalSet: false, done: false, isToday: false },
  { label: 'Wed', fullLabel: 'Wednesday', goalSet: false, done: false, isToday: false },
  { label: 'Thu', fullLabel: 'Thursday',  goalSet: false, done: false, isToday: false },
  { label: 'Fri', fullLabel: 'Friday',    goalSet: false, done: false, isToday: false },
  { label: 'Sat', fullLabel: 'Saturday',  goalSet: false, done: false, isToday: false },
  { label: 'Sun', fullLabel: 'Sunday',    goalSet: false, done: false, isToday: false },
]

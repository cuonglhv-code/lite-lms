// Navigation configuration for the admin/manager sidebar

import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  ClipboardList,
  ClipboardCheck,
  UserCheck,
  Users,
  UserPlus,
  CreditCard,
  BarChart2,
  Settings,
  CalendarDays,
  BookMarked,
  Bell,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  badgeKey?: keyof NavBadges
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export interface NavBadges {
  // Manager badges
  atRiskCount: number
  pendingEnrolments: number
  overduePayments: number
  // Teacher badges
  unreadNotifications: number
  ungradedHomework: number
}

export const MANAGER_NAV_GROUPS: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard',   href: '/manager',              icon: LayoutDashboard },
    ],
  },
  {
    label: 'ACADEMIC',
    items: [
      { label: 'Courses',     href: '/manager/courses',      icon: BookOpen },
      { label: 'Classes',     href: '/manager/classes',      icon: GraduationCap },
      { label: 'Assessments', href: '/manager/assessments',  icon: ClipboardList },
      { label: 'Teachers',    href: '/manager/teachers',     icon: UserCheck },
    ],
  },
  {
    label: 'STUDENTS',
    items: [
      { label: 'Students',    href: '/manager/students',     icon: Users,    badgeKey: 'atRiskCount' },
      { label: 'Enrolments',  href: '/manager/enrolments',   icon: UserPlus, badgeKey: 'pendingEnrolments' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { label: 'Finance',     href: '/manager/finance',      icon: CreditCard, badgeKey: 'overduePayments' },
      { label: 'Reports',     href: '/manager/reports',      icon: BarChart2 },
    ],
  },
  {
    label: 'ADMIN',
    items: [
      { label: 'Settings',    href: '/manager/settings',     icon: Settings },
    ],
  },
]

export const TEACHER_NAV_GROUPS: NavGroup[] = [
  {
    label: 'OVERVIEW',
    items: [
      { label: 'Dashboard',      href: '/teacher',               icon: LayoutDashboard },
      { label: 'My Schedule',    href: '/teacher/schedule',      icon: CalendarDays },
    ],
  },
  {
    label: 'TEACHING',
    items: [
      { label: 'My Classes',     href: '/teacher/classes',       icon: GraduationCap },
      { label: 'Attendance',     href: '/teacher/attendance',    icon: ClipboardCheck },
      { label: 'Homework',       href: '/teacher/homework',      icon: BookMarked,  badgeKey: 'ungradedHomework' },
      { label: 'Assessments',    href: '/teacher/assessments',   icon: BarChart2 },
    ],
  },
  {
    label: 'STUDENTS',
    items: [
      { label: 'My Students',    href: '/teacher/students',      icon: Users },
      { label: 'Notifications',  href: '/teacher/notifications', icon: Bell, badgeKey: 'unreadNotifications' },
    ],
  },
  {
    label: 'ADMIN',
    items: [
      { label: 'Settings',       href: '/teacher/settings',      icon: Settings },
    ],
  },
]

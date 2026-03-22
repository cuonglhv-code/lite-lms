// lib/student-data.ts

export const ENROLLED_COURSES = [
  { id: '20000000-0000-0000-0000-000000000001', classId: '20000000-0000-0000-0000-000000000001', name: 'IELTS Writing Task 2 – Band 7 Strategy', percentComplete: 22, eta: 'May 10, 2026', teacher: 'Tran Thi B', nextClass: 'Mon, 18:00' },
  { id: '30000000-0000-0000-0000-000000000001', classId: '30000000-0000-0000-0000-000000000001', name: 'IELTS Academic Reading – Speed & Accuracy', percentComplete: 45, eta: 'Apr 20, 2026', teacher: 'Nguyen Van A', nextClass: 'Wed, 19:00' },
  { id: '40000000-0000-0000-0000-000000000001', classId: '40000000-0000-0000-0000-000000000001', name: 'IELTS Listening – Sections 3 & 4', percentComplete: 8, eta: 'Jun 1, 2026', teacher: 'Le Thi C', nextClass: 'Fri, 18:00' },
]

export const CATALOG_COURSES = [
  { id: 'cat1', title: 'IELTS Speaking Masterclass', description: 'Advanced techniques for Band 7.5+ in Speaking.', level: 'Advanced', duration: '4 weeks' },
  { id: 'cat2', title: 'IELTS Foundation', description: 'Beginner friendly introduction to all four modules.', level: 'Beginner', duration: '8 weeks' },
  { id: 'cat3', title: 'Vocabulary Booster', description: 'Expand your lexical resource for IELTS.', level: 'Intermediate', duration: '6 weeks' },
]

export const NOTIFICATIONS = [
  { id: 'n1', title: 'New assignment posted', body: 'Writing Task 2 – Problem Solution', date: '2 hours ago', read: false },
  { id: 'n2', title: 'Assignment returned', body: 'Reading Practice Unit 4 graded (6.5/9.0)', date: '1 day ago', read: false },
  { id: 'n3', title: 'Class reminder', body: 'IELTS Writing starts in 30 minutes', date: '2 days ago', read: true },
]

export const SEARCH_ITEMS = [
  { id: 's1', title: 'Writing Task 2 Strategy', type: 'Lesson', href: '/student/class/20000000-0000-0000-0000-000000000001' },
  { id: 's2', title: 'IELTS Academic Reading', type: 'Course', href: '/student/courses' },
  { id: 's3', title: 'Listening Mock Test', type: 'Test', href: '/student/class/40000000-0000-0000-0000-000000000001' },
]

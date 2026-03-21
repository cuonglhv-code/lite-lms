// Mock data for all admin/manager pages
// Used until real DB queries are wired up

// ── Types ─────────────────────────────────────────────────────

export type AdminStatusBadge = 'on-track' | 'at-risk' | 'critical' | 'completed' | 'upcoming'
export type LoadBadge = 'light' | 'normal' | 'heavy' | 'overload'
export type PaymentStatus = 'paid' | 'partial' | 'overdue' | 'pending'
export type AssessmentType = 'homework' | 'test' | 'mock'
export type AssessmentStatus = 'upcoming' | 'open' | 'graded' | 'overdue'
export type TeacherStatus = 'active' | 'on-leave' | 'inactive'
export type CourseStatus = 'active' | 'draft' | 'archived'
export type AlertPriority = 'critical' | 'high' | 'medium' | 'info'

export interface AdminKPI {
  label: string
  value: string | number
  trend?: string
  trendUp?: boolean
  color: 'green' | 'amber' | 'red' | 'gray'
  tooltip: string
  href: string
}

export interface AdminAlert {
  id: string
  priority: AlertPriority
  title: string
  description: string
  actionLabel: string
  actionHref: string
  createdAt: string
}

export interface AdminClass {
  id: string
  name: string
  code: string
  course: string
  courseLevel: string
  teacher: string
  teacherId: string
  studentsEnrolled: number
  capacity: number
  schedule: string
  hwPct: number
  avgScore: number
  attendancePct: number
  examDate: string | null
  daysToExam: number | null
  status: AdminStatusBadge
}

export interface AdminStudent {
  id: string
  name: string
  email: string
  className: string
  classId: string
  teacher: string
  attendancePct: number
  avgScore: number
  targetBand: number
  hwSubmitted: number
  hwTotal: number
  examDate: string | null
  daysToExam: number | null
  paymentStatus: PaymentStatus
  riskFlag: 'ok' | 'at-risk' | 'critical'
  urgencyScore: number
  riskReasons: string[]
  suggestedAction: string
}

export interface AdminTeacher {
  id: string
  name: string
  email: string
  classes: { id: string; name: string; code: string }[]
  studentsTotal: number
  hoursPerWeek: number
  loadBadge: LoadBadge
  avgStudentScore: number
  hwReviewRate: number
  attendanceRecordRate: number
  lastActive: string
  status: TeacherStatus
  subjects: string[]
  qualifications: string
}

export interface AdminCourse {
  id: string
  name: string
  code: string
  level: string
  durationWeeks: number
  activeClasses: number
  studentsEnrolled: number
  avgBandGain: number
  basePrice: number
  status: CourseStatus
}

export interface AdminAssessment {
  id: string
  name: string
  type: AssessmentType
  className: string
  classId: string
  teacher: string
  dueDate: string
  submissionsReceived: number
  submissionsTotal: number
  avgScore: number | null
  graded: number
  status: AssessmentStatus
}

export interface AdminPayment {
  id: string
  studentName: string
  studentId: string
  className: string
  amountDue: number
  amountPaid: number
  balance: number
  dueDate: string
  daysOverdue: number
  lastPaymentDate: string | null
  status: PaymentStatus
}

// ── KPIs ──────────────────────────────────────────────────────

export const ADMIN_KPIS: AdminKPI[] = [
  {
    label: 'Active Students',
    value: 24,
    trend: '+3 this month',
    trendUp: true,
    color: 'gray',
    tooltip: 'Students currently enrolled in at least one active class.',
    href: '/manager/students',
  },
  {
    label: 'Classes Running',
    value: 6,
    trend: '+1 this month',
    trendUp: true,
    color: 'gray',
    tooltip: 'Classes with status Active.',
    href: '/manager/classes',
  },
  {
    label: 'HW Completion',
    value: '57%',
    trend: '−8% vs last week',
    trendUp: false,
    color: 'red',
    tooltip: 'Submissions ÷ total assignments issued across all classes this period.',
    href: '/manager/assessments',
  },
  {
    label: 'Centre Avg Band',
    value: '5.4',
    trend: '+0.1 vs last term',
    trendUp: true,
    color: 'amber',
    tooltip: 'Mean of the most recent assessment score per student, converted to IELTS band.',
    href: '/manager/students',
  },
  {
    label: 'Avg Attendance',
    value: '78%',
    trend: '−2% vs last week',
    trendUp: false,
    color: 'amber',
    tooltip: 'Sessions attended ÷ sessions held across all active classes.',
    href: '/manager/classes',
  },
  {
    label: 'At-Risk Students',
    value: 5,
    trend: '+2 vs last week',
    trendUp: false,
    color: 'red',
    tooltip: 'Students with attendance below 70% or average score below target band − 0.5.',
    href: '/manager/students',
  },
  {
    label: 'Exams in 30 Days',
    value: 7,
    color: 'amber',
    tooltip: 'Students with an IELTS exam date within the next 30 days.',
    href: '/manager/students',
  },
  {
    label: 'Overdue Payments',
    value: 3,
    color: 'red',
    tooltip: 'Payments past their due date that have not been settled.',
    href: '/manager/finance',
  },
  {
    label: 'Unrecorded Sessions',
    value: 2,
    color: 'amber',
    tooltip: 'Sessions held in the past 7 days with no attendance log submitted by the teacher.',
    href: '/manager/classes',
  },
  {
    label: 'Collection Rate',
    value: '84%',
    trend: '−6% vs last month',
    trendUp: false,
    color: 'amber',
    tooltip: 'Total fees collected ÷ total fees due this period.',
    href: '/manager/finance',
  },
]

// ── Alerts ────────────────────────────────────────────────────

export const ADMIN_ALERTS: AdminAlert[] = [
  {
    id: 'a1',
    priority: 'critical',
    title: 'Foundation 1-A: exam in 8 days, avg score 4.2',
    description: 'Class is critically below target with exam approaching fast.',
    actionLabel: 'View class',
    actionHref: '/manager/classes',
    createdAt: '2 minutes ago',
  },
  {
    id: 'a2',
    priority: 'critical',
    title: 'Nguyen Van A: 58% attendance, exam in 12 days',
    description: 'Student needs immediate intervention before exam day.',
    actionLabel: 'View student',
    actionHref: '/manager/students',
    createdAt: '15 minutes ago',
  },
  {
    id: 'a3',
    priority: 'high',
    title: 'Writing B2: no attendance recorded for 2 sessions',
    description: 'Teacher has not submitted attendance logs this week.',
    actionLabel: 'Contact teacher',
    actionHref: '/manager/teachers',
    createdAt: '1 hour ago',
  },
  {
    id: 'a4',
    priority: 'high',
    title: '3 students have payments overdue >7 days',
    description: 'Follow up required to avoid disruption to enrolment.',
    actionLabel: 'View finance',
    actionHref: '/manager/finance',
    createdAt: '3 hours ago',
  },
  {
    id: 'a5',
    priority: 'medium',
    title: '7 students sitting exams within 30 days',
    description: 'Ensure revision plans are in place for all exam candidates.',
    actionLabel: 'View students',
    actionHref: '/manager/students',
    createdAt: 'Today',
  },
  {
    id: 'a6',
    priority: 'medium',
    title: 'Foundation 1-A: HW completion dropped to 38%',
    description: 'Significant drop from last week\'s 65%. Teacher follow-up recommended.',
    actionLabel: 'View class',
    actionHref: '/manager/classes',
    createdAt: 'Today',
  },
  {
    id: 'a7',
    priority: 'info',
    title: '2 new students enrolled this week',
    description: 'Le Thi Mai and Pham Van Duc have been added to Foundation 1-B.',
    actionLabel: 'View enrolments',
    actionHref: '/manager/students',
    createdAt: 'Yesterday',
  },
]

// ── Classes ───────────────────────────────────────────────────

export const ADMIN_CLASSES: AdminClass[] = [
  {
    id: 'c1',
    name: 'Foundation 1 – Class A',
    code: 'IF1-A',
    course: 'IELTS Foundation',
    courseLevel: 'Foundation',
    teacher: 'Tran Thi B',
    teacherId: 't1',
    studentsEnrolled: 8,
    capacity: 12,
    schedule: 'Mon Wed Fri · 18:00–20:00',
    hwPct: 38,
    avgScore: 4.2,
    attendancePct: 65,
    examDate: '2026-03-29',
    daysToExam: 8,
    status: 'critical',
  },
  {
    id: 'c2',
    name: 'Foundation 1 – Class B',
    code: 'IF1-B',
    course: 'IELTS Foundation',
    courseLevel: 'Foundation',
    teacher: 'Le Van C',
    teacherId: 't2',
    studentsEnrolled: 10,
    capacity: 12,
    schedule: 'Tue Thu Sat · 08:00–10:00',
    hwPct: 72,
    avgScore: 5.0,
    attendancePct: 80,
    examDate: '2026-04-15',
    daysToExam: 25,
    status: 'at-risk',
  },
  {
    id: 'c3',
    name: 'IELTS Writing – Band 6',
    code: 'IW-B6',
    course: 'IELTS Writing Booster',
    courseLevel: 'Intermediate',
    teacher: 'Tran Thi B',
    teacherId: 't1',
    studentsEnrolled: 6,
    capacity: 10,
    schedule: 'Mon Wed · 08:00–10:00',
    hwPct: 83,
    avgScore: 5.8,
    attendancePct: 88,
    examDate: '2026-05-10',
    daysToExam: 50,
    status: 'on-track',
  },
  {
    id: 'c4',
    name: 'IELTS Academic – Advanced',
    code: 'IA-ADV',
    course: 'IELTS Academic Achiever',
    courseLevel: 'Advanced',
    teacher: 'Nguyen Thi D',
    teacherId: 't3',
    studentsEnrolled: 5,
    capacity: 8,
    schedule: 'Tue Thu · 18:00–20:30',
    hwPct: 90,
    avgScore: 6.5,
    attendancePct: 92,
    examDate: '2026-06-20',
    daysToExam: 91,
    status: 'on-track',
  },
  {
    id: 'c5',
    name: 'Writing B2 – Weekend',
    code: 'IWB2-WE',
    course: 'IELTS Writing Booster',
    courseLevel: 'Intermediate',
    teacher: 'Le Van C',
    teacherId: 't2',
    studentsEnrolled: 9,
    capacity: 12,
    schedule: 'Sat Sun · 09:00–11:00',
    hwPct: 55,
    avgScore: 4.8,
    attendancePct: 73,
    examDate: '2026-04-05',
    daysToExam: 15,
    status: 'at-risk',
  },
  {
    id: 'c6',
    name: 'Listening & Speaking – B1',
    code: 'ILS-B1',
    course: 'IELTS Skills Builder',
    courseLevel: 'Pre-Intermediate',
    teacher: 'Nguyen Thi D',
    teacherId: 't3',
    studentsEnrolled: 7,
    capacity: 10,
    schedule: 'Mon Fri · 17:00–19:00',
    hwPct: 78,
    avgScore: 5.5,
    attendancePct: 82,
    examDate: null,
    daysToExam: null,
    status: 'on-track',
  },
]

// ── Students ──────────────────────────────────────────────────

export const ADMIN_STUDENTS: AdminStudent[] = [
  {
    id: 's1',
    name: 'Nguyen Van A',
    email: 'vana@email.com',
    className: 'Foundation 1 – Class A',
    classId: 'c1',
    teacher: 'Tran Thi B',
    attendancePct: 58,
    avgScore: 4.0,
    targetBand: 6.0,
    hwSubmitted: 2,
    hwTotal: 8,
    examDate: '2026-03-29',
    daysToExam: 8,
    paymentStatus: 'overdue',
    riskFlag: 'critical',
    urgencyScore: 91,
    riskReasons: ['Low attendance', 'Below target', 'Exam soon'],
    suggestedAction: 'Immediate: contact student + guardian',
  },
  {
    id: 's2',
    name: 'Le Thi Hoa',
    email: 'hoa.le@email.com',
    className: 'Foundation 1 – Class B',
    classId: 'c2',
    teacher: 'Le Van C',
    attendancePct: 72,
    avgScore: 5.0,
    targetBand: 6.5,
    hwSubmitted: 5,
    hwTotal: 7,
    examDate: '2026-04-15',
    daysToExam: 25,
    paymentStatus: 'paid',
    riskFlag: 'at-risk',
    urgencyScore: 54,
    riskReasons: ['Below target'],
    suggestedAction: 'Assign mock test + extra writing practice',
  },
  {
    id: 's3',
    name: 'Pham Van Duc',
    email: 'duc.pham@email.com',
    className: 'Foundation 1 – Class A',
    classId: 'c1',
    teacher: 'Tran Thi B',
    attendancePct: 63,
    avgScore: 4.5,
    targetBand: 5.5,
    hwSubmitted: 3,
    hwTotal: 8,
    examDate: '2026-03-29',
    daysToExam: 8,
    paymentStatus: 'partial',
    riskFlag: 'at-risk',
    urgencyScore: 72,
    riskReasons: ['Low attendance', 'Exam soon'],
    suggestedAction: 'Schedule catch-up session',
  },
  {
    id: 's4',
    name: 'Tran Thi Mai',
    email: 'mai.tran@email.com',
    className: 'IELTS Academic – Advanced',
    classId: 'c4',
    teacher: 'Nguyen Thi D',
    attendancePct: 95,
    avgScore: 6.5,
    targetBand: 7.0,
    hwSubmitted: 9,
    hwTotal: 10,
    examDate: '2026-06-20',
    daysToExam: 91,
    paymentStatus: 'paid',
    riskFlag: 'ok',
    urgencyScore: 12,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's5',
    name: 'Hoang Van Long',
    email: 'long.hoang@email.com',
    className: 'IELTS Writing – Band 6',
    classId: 'c3',
    teacher: 'Tran Thi B',
    attendancePct: 88,
    avgScore: 5.5,
    targetBand: 6.5,
    hwSubmitted: 6,
    hwTotal: 7,
    examDate: '2026-05-10',
    daysToExam: 50,
    paymentStatus: 'paid',
    riskFlag: 'ok',
    urgencyScore: 28,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's6',
    name: 'Nguyen Thi Lan',
    email: 'lan.nguyen@email.com',
    className: 'Writing B2 – Weekend',
    classId: 'c5',
    teacher: 'Le Van C',
    attendancePct: 68,
    avgScore: 4.5,
    targetBand: 6.0,
    hwSubmitted: 4,
    hwTotal: 9,
    examDate: '2026-04-05',
    daysToExam: 15,
    paymentStatus: 'overdue',
    riskFlag: 'critical',
    urgencyScore: 85,
    riskReasons: ['Low attendance', 'Below target', 'Exam soon'],
    suggestedAction: 'Immediate: contact student + guardian',
  },
  {
    id: 's7',
    name: 'Do Minh Tuan',
    email: 'tuan.do@email.com',
    className: 'Listening & Speaking – B1',
    classId: 'c6',
    teacher: 'Nguyen Thi D',
    attendancePct: 84,
    avgScore: 5.5,
    targetBand: 6.0,
    hwSubmitted: 7,
    hwTotal: 8,
    examDate: null,
    daysToExam: null,
    paymentStatus: 'paid',
    riskFlag: 'ok',
    urgencyScore: 18,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's8',
    name: 'Vu Thi Phuong',
    email: 'phuong.vu@email.com',
    className: 'Foundation 1 – Class B',
    classId: 'c2',
    teacher: 'Le Van C',
    attendancePct: 77,
    avgScore: 5.2,
    targetBand: 6.0,
    hwSubmitted: 4,
    hwTotal: 7,
    examDate: '2026-04-15',
    daysToExam: 25,
    paymentStatus: 'pending',
    riskFlag: 'at-risk',
    urgencyScore: 46,
    riskReasons: ['Below target'],
    suggestedAction: 'Request teacher assessment review',
  },
]

// ── Teachers ──────────────────────────────────────────────────

export const ADMIN_TEACHERS: AdminTeacher[] = [
  {
    id: 't1',
    name: 'Tran Thi B',
    email: 'tran.b@jaxtina.edu.vn',
    classes: [
      { id: 'c1', name: 'Foundation 1 – Class A', code: 'IF1-A' },
      { id: 'c3', name: 'IELTS Writing – Band 6', code: 'IW-B6' },
    ],
    studentsTotal: 14,
    hoursPerWeek: 22,
    loadBadge: 'normal',
    avgStudentScore: 5.0,
    hwReviewRate: 88,
    attendanceRecordRate: 72,
    lastActive: '2 hours ago',
    status: 'active',
    subjects: ['Writing', 'Reading'],
    qualifications: 'CELTA, MA TESOL',
  },
  {
    id: 't2',
    name: 'Le Van C',
    email: 'le.c@jaxtina.edu.vn',
    classes: [
      { id: 'c2', name: 'Foundation 1 – Class B', code: 'IF1-B' },
      { id: 'c5', name: 'Writing B2 – Weekend', code: 'IWB2-WE' },
    ],
    studentsTotal: 19,
    hoursPerWeek: 28,
    loadBadge: 'heavy',
    avgStudentScore: 4.9,
    hwReviewRate: 75,
    attendanceRecordRate: 95,
    lastActive: '30 minutes ago',
    status: 'active',
    subjects: ['Writing', 'Speaking'],
    qualifications: 'DELTA, BA Education',
  },
  {
    id: 't3',
    name: 'Nguyen Thi D',
    email: 'nguyen.d@jaxtina.edu.vn',
    classes: [
      { id: 'c4', name: 'IELTS Academic – Advanced', code: 'IA-ADV' },
      { id: 'c6', name: 'Listening & Speaking – B1', code: 'ILS-B1' },
    ],
    studentsTotal: 12,
    hoursPerWeek: 18,
    loadBadge: 'normal',
    avgStudentScore: 6.0,
    hwReviewRate: 96,
    attendanceRecordRate: 98,
    lastActive: '1 day ago',
    status: 'active',
    subjects: ['Listening', 'Speaking', 'Reading'],
    qualifications: 'IELTS 8.5, BA English',
  },
]

// ── Courses ───────────────────────────────────────────────────

export const ADMIN_COURSES: AdminCourse[] = [
  {
    id: 'co1',
    name: 'IELTS Foundation',
    code: 'IF',
    level: 'Foundation',
    durationWeeks: 12,
    activeClasses: 2,
    studentsEnrolled: 18,
    avgBandGain: 0.8,
    basePrice: 3500000,
    status: 'active',
  },
  {
    id: 'co2',
    name: 'IELTS Writing Booster',
    code: 'IWB',
    level: 'Intermediate',
    durationWeeks: 8,
    activeClasses: 2,
    studentsEnrolled: 15,
    avgBandGain: 0.5,
    basePrice: 2800000,
    status: 'active',
  },
  {
    id: 'co3',
    name: 'IELTS Academic Achiever',
    code: 'IAA',
    level: 'Advanced',
    durationWeeks: 16,
    activeClasses: 1,
    studentsEnrolled: 5,
    avgBandGain: 1.2,
    basePrice: 5000000,
    status: 'active',
  },
  {
    id: 'co4',
    name: 'IELTS Skills Builder',
    code: 'ISB',
    level: 'Pre-Intermediate',
    durationWeeks: 10,
    activeClasses: 1,
    studentsEnrolled: 7,
    avgBandGain: 0.6,
    basePrice: 2500000,
    status: 'active',
  },
  {
    id: 'co5',
    name: 'IELTS Exam Intensive',
    code: 'IEI',
    level: 'Intermediate',
    durationWeeks: 4,
    activeClasses: 0,
    studentsEnrolled: 0,
    avgBandGain: 0.3,
    basePrice: 1800000,
    status: 'draft',
  },
]

// ── Assessments ───────────────────────────────────────────────

export const ADMIN_ASSESSMENTS: AdminAssessment[] = [
  {
    id: 'as1',
    name: 'Writing Task 2 – Problem Solution',
    type: 'homework',
    className: 'Foundation 1 – Class A',
    classId: 'c1',
    teacher: 'Tran Thi B',
    dueDate: '2026-03-18',
    submissionsReceived: 3,
    submissionsTotal: 8,
    avgScore: 4.1,
    graded: 3,
    status: 'overdue',
  },
  {
    id: 'as2',
    name: 'Mock Exam – Full Paper 1',
    type: 'mock',
    className: 'Foundation 1 – Class A',
    classId: 'c1',
    teacher: 'Tran Thi B',
    dueDate: '2026-03-25',
    submissionsReceived: 6,
    submissionsTotal: 8,
    avgScore: 4.3,
    graded: 6,
    status: 'graded',
  },
  {
    id: 'as3',
    name: 'Reading Practice – Unit 4',
    type: 'homework',
    className: 'Foundation 1 – Class B',
    classId: 'c2',
    teacher: 'Le Van C',
    dueDate: '2026-03-22',
    submissionsReceived: 9,
    submissionsTotal: 10,
    avgScore: 5.2,
    graded: 9,
    status: 'graded',
  },
  {
    id: 'as4',
    name: 'Band 6 Writing Assessment',
    type: 'test',
    className: 'IELTS Writing – Band 6',
    classId: 'c3',
    teacher: 'Tran Thi B',
    dueDate: '2026-03-28',
    submissionsReceived: 0,
    submissionsTotal: 6,
    avgScore: null,
    graded: 0,
    status: 'upcoming',
  },
  {
    id: 'as5',
    name: 'Advanced Mock – Academic Full',
    type: 'mock',
    className: 'IELTS Academic – Advanced',
    classId: 'c4',
    teacher: 'Nguyen Thi D',
    dueDate: '2026-03-20',
    submissionsReceived: 5,
    submissionsTotal: 5,
    avgScore: 6.6,
    graded: 5,
    status: 'graded',
  },
  {
    id: 'as6',
    name: 'Listening Drill – Section 3',
    type: 'homework',
    className: 'Listening & Speaking – B1',
    classId: 'c6',
    teacher: 'Nguyen Thi D',
    dueDate: '2026-03-24',
    submissionsReceived: 5,
    submissionsTotal: 7,
    avgScore: 5.5,
    graded: 5,
    status: 'open',
  },
]

// ── Payments ──────────────────────────────────────────────────

export const ADMIN_PAYMENTS: AdminPayment[] = [
  {
    id: 'p1',
    studentName: 'Nguyen Van A',
    studentId: 's1',
    className: 'Foundation 1 – Class A',
    amountDue: 3500000,
    amountPaid: 0,
    balance: 3500000,
    dueDate: '2026-03-01',
    daysOverdue: 20,
    lastPaymentDate: null,
    status: 'overdue',
  },
  {
    id: 'p2',
    studentName: 'Le Thi Hoa',
    studentId: 's2',
    className: 'Foundation 1 – Class B',
    amountDue: 3500000,
    amountPaid: 3500000,
    balance: 0,
    dueDate: '2026-03-01',
    daysOverdue: 0,
    lastPaymentDate: '2026-02-28',
    status: 'paid',
  },
  {
    id: 'p3',
    studentName: 'Pham Van Duc',
    studentId: 's3',
    className: 'Foundation 1 – Class A',
    amountDue: 3500000,
    amountPaid: 1750000,
    balance: 1750000,
    dueDate: '2026-03-10',
    daysOverdue: 11,
    lastPaymentDate: '2026-02-15',
    status: 'partial',
  },
  {
    id: 'p4',
    studentName: 'Tran Thi Mai',
    studentId: 's4',
    className: 'IELTS Academic – Advanced',
    amountDue: 5000000,
    amountPaid: 5000000,
    balance: 0,
    dueDate: '2026-03-01',
    daysOverdue: 0,
    lastPaymentDate: '2026-02-25',
    status: 'paid',
  },
  {
    id: 'p5',
    studentName: 'Hoang Van Long',
    studentId: 's5',
    className: 'IELTS Writing – Band 6',
    amountDue: 2800000,
    amountPaid: 2800000,
    balance: 0,
    dueDate: '2026-03-01',
    daysOverdue: 0,
    lastPaymentDate: '2026-03-01',
    status: 'paid',
  },
  {
    id: 'p6',
    studentName: 'Nguyen Thi Lan',
    studentId: 's6',
    className: 'Writing B2 – Weekend',
    amountDue: 2800000,
    amountPaid: 0,
    balance: 2800000,
    dueDate: '2026-03-05',
    daysOverdue: 16,
    lastPaymentDate: null,
    status: 'overdue',
  },
  {
    id: 'p7',
    studentName: 'Do Minh Tuan',
    studentId: 's7',
    className: 'Listening & Speaking – B1',
    amountDue: 2500000,
    amountPaid: 2500000,
    balance: 0,
    dueDate: '2026-03-01',
    daysOverdue: 0,
    lastPaymentDate: '2026-03-02',
    status: 'paid',
  },
  {
    id: 'p8',
    studentName: 'Vu Thi Phuong',
    studentId: 's8',
    className: 'Foundation 1 – Class B',
    amountDue: 3500000,
    amountPaid: 0,
    balance: 3500000,
    dueDate: '2026-03-15',
    daysOverdue: 6,
    lastPaymentDate: null,
    status: 'overdue',
  },
]

// ── Chart data helpers ─────────────────────────────────────────

export const HW_CHART_DATA = ADMIN_CLASSES.map(c => ({
  name: c.code,
  value: c.hwPct,
}))

export const SCORE_CHART_DATA = ADMIN_CLASSES.map(c => ({
  name: c.code,
  value: Math.round(c.avgScore * 10),
}))

export const ATTENDANCE_CHART_DATA = ADMIN_CLASSES.map(c => ({
  name: c.code,
  value: c.attendancePct,
}))

// ── Finance KPIs ───────────────────────────────────────────────

export const FINANCE_KPIS = {
  totalRevenue:    23600000,
  collected:       18350000,
  outstanding:     5250000,
  overdueCount:    3,
  collectionRate:  78,
}

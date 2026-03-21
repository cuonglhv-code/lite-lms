// ─────────────────────────────────────────────────────────────
// Mock data for the teacher portal
// Teacher: Tran Thi B — teaches IF1-A and IW-B6
// Replace with real DB queries when Prisma schema is wired
// ─────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────

export type RiskFlag      = 'ok' | 'at-risk' | 'critical'
export type HWStatus      = 'open' | 'due-today' | 'overdue' | 'closed'
export type SessionStatus = 'upcoming' | 'in-progress' | 'done' | 'missing-record'
export type AttStatus     = 'present' | 'late' | 'absent'
export type SubStatus     = 'submitted' | 'not-submitted' | 'flagged'
export type GradeStatus   = 'graded' | 'ungraded' | 'missing'
export type NotifPriority = 'critical' | 'high' | 'medium' | 'info'
export type NotifType     = 'homework' | 'attendance' | 'exam' | 'admin'
export type AssessType    = 'mock' | 'test' | 'placement' | 'in-class'

export interface TeacherClass {
  id: string
  name: string
  code: string
  course: string
  level: string
  schedule: string
  studentsEnrolled: number
  capacity: number
  attendancePct: number
  hwPct: number
  avgBand: number
  targetBand: number
  nearestExamDate: string | null
  daysToNearestExam: number | null
  status: 'on-track' | 'at-risk' | 'critical'
  lastSession: string
  nextSession: string
}

export interface TeacherStudent {
  id: string
  name: string
  email: string
  classId: string
  className: string
  enrolledDate: string
  targetBand: number
  examDate: string | null
  daysToExam: number | null
  attendancePct: number
  attendanceSessions: number   // sessions attended
  totalSessions: number        // sessions held
  avgBand: number
  hwSubmitted: number
  hwTotal: number
  riskFlag: RiskFlag
  urgencyScore: number
  riskReasons: string[]
  suggestedAction: string
}

export interface TeacherSession {
  id: string
  classId: string
  className: string
  classCode: string
  date: string          // 'YYYY-MM-DD'
  startTime: string     // 'HH:MM'
  endTime: string
  topicCovered: string
  homeworkSet: string
  notes: string
  status: SessionStatus
  attendanceRecorded: boolean
  presentCount: number
  lateCount: number
  absentCount: number
}

export interface TeacherHomeworkTask {
  id: string
  name: string
  classId: string
  className: string
  classCode: string
  type: 'homework' | 'test' | 'mock'
  assignedDate: string
  dueDate: string
  description: string
  resourceLink: string
  totalStudents: number
  submittedCount: number
  gradedCount: number
  avgScore: number | null
  status: HWStatus
}

export interface TeacherSubmission {
  id: string
  taskId: string
  studentId: string
  studentName: string
  submittedDate: string | null
  score: number | null
  feedback: string
  flagged: boolean
  subStatus: SubStatus
  gradeStatus: GradeStatus
}

export interface TeacherAssessment {
  id: string
  name: string
  classId: string
  className: string
  classCode: string
  type: AssessType
  date: string
  totalStudents: number
  avgBand: number
  highestBand: number
  lowestBand: number
  belowTargetCount: number
  scores: TeacherScore[]
}

export interface TeacherScore {
  studentId: string
  studentName: string
  overall: number
  reading: number | null
  writing: number | null
  listening: number | null
  speaking: number | null
  targetBand: number
  belowTarget: boolean
}

export interface TeacherNotification {
  id: string
  priority: NotifPriority
  type: NotifType
  title: string
  body: string
  actionLabel: string
  actionHref: string
  createdAt: string
  read: boolean
}

export interface TeacherScheduleItem {
  id: string
  classId: string
  className: string
  classCode: string
  date: string
  dayLabel: string
  startTime: string
  endTime: string
  studentCount: number
  status: SessionStatus
  attendanceRecorded: boolean
  sessionNoteAdded: boolean
}

export interface AttendanceRecord {
  sessionId: string
  date: string
  classId: string
  className: string
  students: { studentId: string; studentName: string; status: AttStatus }[]
}

// ── Teacher Info ───────────────────────────────────────────────

export const TEACHER_INFO = {
  id: 't1',
  name: 'Tran Thi B',
  email: 'tran.b@jaxtina.edu.vn',
  role: 'teacher' as const,
}

// ── Classes ───────────────────────────────────────────────────

export const TEACHER_CLASSES: TeacherClass[] = [
  {
    id: 'c1',
    name: 'Foundation 1 – Class A',
    code: 'IF1-A',
    course: 'IELTS Foundation',
    level: 'Foundation',
    schedule: 'Mon Wed Fri · 18:00–20:00',
    studentsEnrolled: 8,
    capacity: 12,
    attendancePct: 65,
    hwPct: 38,
    avgBand: 4.2,
    targetBand: 6.0,
    nearestExamDate: '2026-03-29',
    daysToNearestExam: 8,
    status: 'critical',
    lastSession: '2026-03-20',
    nextSession: '2026-03-23',
  },
  {
    id: 'c3',
    name: 'IELTS Writing – Band 6',
    code: 'IW-B6',
    course: 'IELTS Writing Booster',
    level: 'Intermediate',
    schedule: 'Mon Wed Sat · 08:00–10:00',
    studentsEnrolled: 6,
    capacity: 10,
    attendancePct: 82,
    hwPct: 72,
    avgBand: 5.5,
    targetBand: 6.5,
    nearestExamDate: '2026-04-20',
    daysToNearestExam: 30,
    status: 'at-risk',
    lastSession: '2026-03-21',
    nextSession: '2026-03-23',
  },
]

// ── Students ──────────────────────────────────────────────────

export const TEACHER_STUDENTS: TeacherStudent[] = [
  // IF1-A students
  {
    id: 's1',
    name: 'Nguyen Van A',
    email: 'vana@email.com',
    classId: 'c1',
    className: 'Foundation 1 – Class A',
    enrolledDate: '2026-01-05',
    targetBand: 6.0,
    examDate: '2026-03-29',
    daysToExam: 8,
    attendancePct: 58,
    attendanceSessions: 7,
    totalSessions: 12,
    avgBand: 4.0,
    hwSubmitted: 2,
    hwTotal: 8,
    riskFlag: 'critical',
    urgencyScore: 91,
    riskReasons: ['Attendance 58% — below 70% threshold', 'Band 4.0 vs target 6.0 (gap: −2.0)', 'Exam in 8 days'],
    suggestedAction: 'Immediate: contact student + guardian. Emergency catch-up before 29 March.',
  },
  {
    id: 's3',
    name: 'Pham Van Duc',
    email: 'duc.pham@email.com',
    classId: 'c1',
    className: 'Foundation 1 – Class A',
    enrolledDate: '2026-01-05',
    targetBand: 5.5,
    examDate: '2026-03-29',
    daysToExam: 8,
    attendancePct: 63,
    attendanceSessions: 8,
    totalSessions: 12,
    avgBand: 4.5,
    hwSubmitted: 3,
    hwTotal: 8,
    riskFlag: 'at-risk',
    urgencyScore: 72,
    riskReasons: ['Attendance 63% — below 70% threshold', 'Exam in 8 days'],
    suggestedAction: 'Schedule catch-up session. Focus on weak skills before exam.',
  },
  {
    id: 's9',
    name: 'Tran Thi Thu',
    email: 'thu.tran@email.com',
    classId: 'c1',
    className: 'Foundation 1 – Class A',
    enrolledDate: '2026-01-05',
    targetBand: 6.0,
    examDate: null,
    daysToExam: null,
    attendancePct: 72,
    attendanceSessions: 9,
    totalSessions: 12,
    avgBand: 5.0,
    hwSubmitted: 5,
    hwTotal: 8,
    riskFlag: 'at-risk',
    urgencyScore: 45,
    riskReasons: ['Band 5.0 vs target 6.0 (gap: −1.0)'],
    suggestedAction: 'Assign extra writing practice. Review Task 2 structure.',
  },
  {
    id: 's10',
    name: 'Le Quoc Bao',
    email: 'bao.le@email.com',
    classId: 'c1',
    className: 'Foundation 1 – Class A',
    enrolledDate: '2026-01-05',
    targetBand: 6.0,
    examDate: null,
    daysToExam: null,
    attendancePct: 85,
    attendanceSessions: 10,
    totalSessions: 12,
    avgBand: 5.5,
    hwSubmitted: 7,
    hwTotal: 8,
    riskFlag: 'ok',
    urgencyScore: 18,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's11',
    name: 'Do Thi Lan',
    email: 'lan.do@email.com',
    classId: 'c1',
    className: 'Foundation 1 – Class A',
    enrolledDate: '2026-01-05',
    targetBand: 6.0,
    examDate: null,
    daysToExam: null,
    attendancePct: 90,
    attendanceSessions: 11,
    totalSessions: 12,
    avgBand: 5.5,
    hwSubmitted: 8,
    hwTotal: 8,
    riskFlag: 'ok',
    urgencyScore: 12,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's12',
    name: 'Hoang Minh Duc',
    email: 'duc.hoang@email.com',
    classId: 'c1',
    className: 'Foundation 1 – Class A',
    enrolledDate: '2026-01-05',
    targetBand: 5.5,
    examDate: null,
    daysToExam: null,
    attendancePct: 88,
    attendanceSessions: 11,
    totalSessions: 12,
    avgBand: 5.0,
    hwSubmitted: 6,
    hwTotal: 8,
    riskFlag: 'ok',
    urgencyScore: 20,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's13',
    name: 'Nguyen Thu Ha',
    email: 'ha.nguyen@email.com',
    classId: 'c1',
    className: 'Foundation 1 – Class A',
    enrolledDate: '2026-01-05',
    targetBand: 6.0,
    examDate: null,
    daysToExam: null,
    attendancePct: 83,
    attendanceSessions: 10,
    totalSessions: 12,
    avgBand: 5.0,
    hwSubmitted: 5,
    hwTotal: 8,
    riskFlag: 'ok',
    urgencyScore: 22,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's14',
    name: 'Bui Van Nam',
    email: 'nam.bui@email.com',
    classId: 'c1',
    className: 'Foundation 1 – Class A',
    enrolledDate: '2026-01-05',
    targetBand: 6.0,
    examDate: null,
    daysToExam: null,
    attendancePct: 75,
    attendanceSessions: 9,
    totalSessions: 12,
    avgBand: 4.5,
    hwSubmitted: 4,
    hwTotal: 8,
    riskFlag: 'at-risk',
    urgencyScore: 38,
    riskReasons: ['Band 4.5 vs target 6.0 (gap: −1.5)'],
    suggestedAction: 'Extra mock test recommended. Monitor closely.',
  },
  // IW-B6 students
  {
    id: 's5',
    name: 'Hoang Van Long',
    email: 'long.hoang@email.com',
    classId: 'c3',
    className: 'IELTS Writing – Band 6',
    enrolledDate: '2026-02-01',
    targetBand: 6.5,
    examDate: '2026-05-10',
    daysToExam: 50,
    attendancePct: 88,
    attendanceSessions: 7,
    totalSessions: 8,
    avgBand: 5.5,
    hwSubmitted: 6,
    hwTotal: 7,
    riskFlag: 'ok',
    urgencyScore: 28,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's15',
    name: 'Pham Thi Quynh',
    email: 'quynh.pham@email.com',
    classId: 'c3',
    className: 'IELTS Writing – Band 6',
    enrolledDate: '2026-02-01',
    targetBand: 6.5,
    examDate: null,
    daysToExam: null,
    attendancePct: 92,
    attendanceSessions: 7,
    totalSessions: 8,
    avgBand: 6.0,
    hwSubmitted: 7,
    hwTotal: 7,
    riskFlag: 'ok',
    urgencyScore: 10,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's16',
    name: 'Le Van Minh',
    email: 'minh.le@email.com',
    classId: 'c3',
    className: 'IELTS Writing – Band 6',
    enrolledDate: '2026-02-01',
    targetBand: 6.5,
    examDate: null,
    daysToExam: null,
    attendancePct: 70,
    attendanceSessions: 6,
    totalSessions: 8,
    avgBand: 5.0,
    hwSubmitted: 4,
    hwTotal: 7,
    riskFlag: 'at-risk',
    urgencyScore: 52,
    riskReasons: ['Band 5.0 vs target 6.5 (gap: −1.5)', 'Attendance 70% — borderline'],
    suggestedAction: 'Book one-to-one writing session. Review feedback from last assignment.',
  },
  {
    id: 's17',
    name: 'Truong Thi Bich',
    email: 'bich.truong@email.com',
    classId: 'c3',
    className: 'IELTS Writing – Band 6',
    enrolledDate: '2026-02-01',
    targetBand: 6.0,
    examDate: null,
    daysToExam: null,
    attendancePct: 85,
    attendanceSessions: 7,
    totalSessions: 8,
    avgBand: 5.5,
    hwSubmitted: 6,
    hwTotal: 7,
    riskFlag: 'ok',
    urgencyScore: 15,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's18',
    name: 'Vo Thi Kim',
    email: 'kim.vo@email.com',
    classId: 'c3',
    className: 'IELTS Writing – Band 6',
    enrolledDate: '2026-02-01',
    targetBand: 6.5,
    examDate: null,
    daysToExam: null,
    attendancePct: 90,
    attendanceSessions: 7,
    totalSessions: 8,
    avgBand: 6.0,
    hwSubmitted: 7,
    hwTotal: 7,
    riskFlag: 'ok',
    urgencyScore: 8,
    riskReasons: [],
    suggestedAction: '',
  },
  {
    id: 's19',
    name: 'Dang Quoc Huy',
    email: 'huy.dang@email.com',
    classId: 'c3',
    className: 'IELTS Writing – Band 6',
    enrolledDate: '2026-02-01',
    targetBand: 6.0,
    examDate: '2026-04-20',
    daysToExam: 30,
    attendancePct: 68,
    attendanceSessions: 5,
    totalSessions: 8,
    avgBand: 4.5,
    hwSubmitted: 3,
    hwTotal: 7,
    riskFlag: 'at-risk',
    urgencyScore: 60,
    riskReasons: ['Attendance 68% — below threshold', 'Band 4.5 vs target 6.0 (gap: −1.5)', 'Exam in 30 days'],
    suggestedAction: 'Schedule extra session. Exam in 30 days — monitor weekly.',
  },
]

// ── Sessions ──────────────────────────────────────────────────

export const TEACHER_SESSIONS: TeacherSession[] = [
  // Past IF1-A sessions
  {
    id: 'ses1',
    classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A',
    date: '2026-03-20', dayLabel: 'Fri', startTime: '18:00', endTime: '20:00',
    topicCovered: 'Writing Task 2 — Problem-Solution essay structure',
    homeworkSet: 'Write a full Task 2 essay on technology topic (due 25 Mar)',
    notes: 'Nguyen Van A absent again. Students struggling with coherence.',
    status: 'done', attendanceRecorded: true, presentCount: 6, lateCount: 1, absentCount: 1,
  },
  {
    id: 'ses2',
    classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A',
    date: '2026-03-18', dayLabel: 'Wed', startTime: '18:00', endTime: '20:00',
    topicCovered: 'Reading skills — skimming and scanning techniques',
    homeworkSet: 'Reading Practice Unit 4 (due 24 Mar)',
    notes: 'Good engagement. Bui Van Nam improving with reading strategies.',
    status: 'done', attendanceRecorded: true, presentCount: 7, lateCount: 0, absentCount: 1,
  },
  {
    id: 'ses3',
    classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A',
    date: '2026-03-16', dayLabel: 'Mon', startTime: '18:00', endTime: '20:00',
    topicCovered: 'Mock exam — Full Paper 1',
    homeworkSet: 'Review mock paper corrections',
    notes: 'Results disappointing overall. Discussed individual feedback.',
    status: 'done', attendanceRecorded: true, presentCount: 7, lateCount: 1, absentCount: 0,
  },
  // Past IW-B6 sessions
  {
    id: 'ses4',
    classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6',
    date: '2026-03-21', dayLabel: 'Sat', startTime: '08:00', endTime: '10:00',
    topicCovered: '',
    homeworkSet: '',
    notes: '',
    status: 'missing-record', attendanceRecorded: false, presentCount: 0, lateCount: 0, absentCount: 0,
  },
  {
    id: 'ses5',
    classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6',
    date: '2026-03-18', dayLabel: 'Wed', startTime: '08:00', endTime: '10:00',
    topicCovered: 'Task 2 — Discursive essays and argument structure',
    homeworkSet: 'Listening Drill Section 3 (due 21 Mar)',
    notes: 'Pham Thi Quynh excellent progress. Le Van Minh needs extra support.',
    status: 'done', attendanceRecorded: true, presentCount: 5, lateCount: 1, absentCount: 0,
  },
  {
    id: 'ses6',
    classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6',
    date: '2026-03-16', dayLabel: 'Mon', startTime: '08:00', endTime: '10:00',
    topicCovered: 'Task 1 — Describing graphs and charts',
    homeworkSet: 'Chart description practice — line graph',
    notes: 'Strong session. Group dynamics improving.',
    status: 'done', attendanceRecorded: true, presentCount: 6, lateCount: 0, absentCount: 0,
  },
  // Upcoming sessions
  {
    id: 'ses7',
    classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6',
    date: '2026-03-23', dayLabel: 'Mon', startTime: '08:00', endTime: '10:00',
    topicCovered: '', homeworkSet: '', notes: '',
    status: 'upcoming', attendanceRecorded: false, presentCount: 0, lateCount: 0, absentCount: 0,
  },
  {
    id: 'ses8',
    classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A',
    date: '2026-03-23', dayLabel: 'Mon', startTime: '18:00', endTime: '20:00',
    topicCovered: '', homeworkSet: '', notes: '',
    status: 'upcoming', attendanceRecorded: false, presentCount: 0, lateCount: 0, absentCount: 0,
  },
]

// ── Homework Tasks ─────────────────────────────────────────────

export const TEACHER_HW_TASKS: TeacherHomeworkTask[] = [
  {
    id: 'hw1',
    name: 'Writing Task 2 – Problem Solution',
    classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A',
    type: 'homework',
    assignedDate: '2026-03-14', dueDate: '2026-03-18',
    description: 'Write a full IELTS Task 2 problem-solution essay on environmental issues.',
    resourceLink: '',
    totalStudents: 8, submittedCount: 3, gradedCount: 3, avgScore: 4.7,
    status: 'overdue',
  },
  {
    id: 'hw2',
    name: 'Listening Drill – Section 3',
    classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6',
    type: 'homework',
    assignedDate: '2026-03-18', dueDate: '2026-03-21',
    description: 'Complete IELTS Listening Section 3 drill from Cambridge 18 Test 2.',
    resourceLink: '',
    totalStudents: 6, submittedCount: 4, gradedCount: 0, avgScore: null,
    status: 'due-today',
  },
  {
    id: 'hw3',
    name: 'Reading Practice – Unit 4',
    classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A',
    type: 'homework',
    assignedDate: '2026-03-18', dueDate: '2026-03-24',
    description: 'Complete Reading Practice Unit 4 from course materials.',
    resourceLink: '',
    totalStudents: 8, submittedCount: 0, gradedCount: 0, avgScore: null,
    status: 'open',
  },
  {
    id: 'hw4',
    name: 'Essay Plan Practice',
    classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6',
    type: 'homework',
    assignedDate: '2026-03-21', dueDate: '2026-03-26',
    description: 'Prepare a full essay plan for a discursive IELTS Task 2 question.',
    resourceLink: '',
    totalStudents: 6, submittedCount: 0, gradedCount: 0, avgScore: null,
    status: 'open',
  },
  {
    id: 'hw5',
    name: 'Mock Test Prep Notes',
    classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A',
    type: 'homework',
    assignedDate: '2026-03-08', dueDate: '2026-03-15',
    description: 'Prepare revision notes covering all four IELTS skills.',
    resourceLink: '',
    totalStudents: 8, submittedCount: 6, gradedCount: 6, avgScore: 5.0,
    status: 'closed',
  },
]

// ── Homework Submissions ────────────────────────────────────────

export const TEACHER_SUBMISSIONS: TeacherSubmission[] = [
  // hw1 — Writing Task 2 (IF1-A), 3 submitted
  { id: 'sub1',  taskId: 'hw1', studentId: 's1',  studentName: 'Nguyen Van A',   submittedDate: null,         score: null, feedback: '', flagged: true,  subStatus: 'not-submitted', gradeStatus: 'missing' },
  { id: 'sub2',  taskId: 'hw1', studentId: 's3',  studentName: 'Pham Van Duc',   submittedDate: null,         score: null, feedback: '', flagged: false, subStatus: 'not-submitted', gradeStatus: 'missing' },
  { id: 'sub3',  taskId: 'hw1', studentId: 's9',  studentName: 'Tran Thi Thu',   submittedDate: '2026-03-17', score: 4.5,  feedback: 'Good structure but needs stronger topic sentences.', flagged: false, subStatus: 'submitted', gradeStatus: 'graded' },
  { id: 'sub4',  taskId: 'hw1', studentId: 's10', studentName: 'Le Quoc Bao',    submittedDate: '2026-03-17', score: 5.0,  feedback: 'Well-organised. Work on lexical range.', flagged: false, subStatus: 'submitted', gradeStatus: 'graded' },
  { id: 'sub5',  taskId: 'hw1', studentId: 's11', studentName: 'Do Thi Lan',     submittedDate: '2026-03-16', score: 5.5,  feedback: 'Excellent coherence. Slight grammar issues in para 2.', flagged: false, subStatus: 'submitted', gradeStatus: 'graded' },
  { id: 'sub6',  taskId: 'hw1', studentId: 's12', studentName: 'Hoang Minh Duc', submittedDate: null,         score: null, feedback: '', flagged: false, subStatus: 'not-submitted', gradeStatus: 'missing' },
  { id: 'sub7',  taskId: 'hw1', studentId: 's13', studentName: 'Nguyen Thu Ha',  submittedDate: null,         score: null, feedback: '', flagged: false, subStatus: 'not-submitted', gradeStatus: 'missing' },
  { id: 'sub8',  taskId: 'hw1', studentId: 's14', studentName: 'Bui Van Nam',    submittedDate: null,         score: null, feedback: '', flagged: false, subStatus: 'not-submitted', gradeStatus: 'missing' },
  // hw2 — Listening Drill (IW-B6), 4 submitted, 0 graded
  { id: 'sub9',  taskId: 'hw2', studentId: 's5',  studentName: 'Hoang Van Long',  submittedDate: '2026-03-20', score: null, feedback: '', flagged: false, subStatus: 'submitted', gradeStatus: 'ungraded' },
  { id: 'sub10', taskId: 'hw2', studentId: 's15', studentName: 'Pham Thi Quynh', submittedDate: '2026-03-19', score: null, feedback: '', flagged: false, subStatus: 'submitted', gradeStatus: 'ungraded' },
  { id: 'sub11', taskId: 'hw2', studentId: 's16', studentName: 'Le Van Minh',     submittedDate: null,         score: null, feedback: '', flagged: false, subStatus: 'not-submitted', gradeStatus: 'missing' },
  { id: 'sub12', taskId: 'hw2', studentId: 's17', studentName: 'Truong Thi Bich', submittedDate: '2026-03-20', score: null, feedback: '', flagged: false, subStatus: 'submitted', gradeStatus: 'ungraded' },
  { id: 'sub13', taskId: 'hw2', studentId: 's18', studentName: 'Vo Thi Kim',      submittedDate: '2026-03-21', score: null, feedback: '', flagged: false, subStatus: 'submitted', gradeStatus: 'ungraded' },
  { id: 'sub14', taskId: 'hw2', studentId: 's19', studentName: 'Dang Quoc Huy',   submittedDate: null,         score: null, feedback: '', flagged: false, subStatus: 'not-submitted', gradeStatus: 'missing' },
]

// ── Assessments ────────────────────────────────────────────────

export const TEACHER_ASSESSMENTS: TeacherAssessment[] = [
  {
    id: 'as1',
    name: 'Mock Exam – Full Paper 1',
    classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A',
    type: 'mock', date: '2026-03-16',
    totalStudents: 8, avgBand: 4.3, highestBand: 5.5, lowestBand: 3.5, belowTargetCount: 6,
    scores: [
      { studentId: 's1',  studentName: 'Nguyen Van A',   overall: 4.0, reading: 3.5, writing: 4.0, listening: 4.5, speaking: 4.0, targetBand: 6.0, belowTarget: true  },
      { studentId: 's3',  studentName: 'Pham Van Duc',   overall: 4.5, reading: 4.0, writing: 4.5, listening: 5.0, speaking: 4.5, targetBand: 5.5, belowTarget: true  },
      { studentId: 's9',  studentName: 'Tran Thi Thu',   overall: 4.5, reading: 4.5, writing: 4.5, listening: 5.0, speaking: 4.0, targetBand: 6.0, belowTarget: true  },
      { studentId: 's10', studentName: 'Le Quoc Bao',    overall: 5.0, reading: 5.0, writing: 5.0, listening: 5.5, speaking: 4.5, targetBand: 6.0, belowTarget: true  },
      { studentId: 's11', studentName: 'Do Thi Lan',     overall: 5.5, reading: 5.5, writing: 5.5, listening: 6.0, speaking: 5.0, targetBand: 6.0, belowTarget: false },
      { studentId: 's12', studentName: 'Hoang Minh Duc', overall: 4.0, reading: 3.5, writing: 4.0, listening: 4.5, speaking: 4.0, targetBand: 5.5, belowTarget: true  },
      { studentId: 's13', studentName: 'Nguyen Thu Ha',  overall: 4.5, reading: 4.5, writing: 4.0, listening: 5.0, speaking: 4.5, targetBand: 6.0, belowTarget: true  },
      { studentId: 's14', studentName: 'Bui Van Nam',    overall: 3.5, reading: 3.0, writing: 3.5, listening: 4.0, speaking: 3.5, targetBand: 6.0, belowTarget: true  },
    ],
  },
  {
    id: 'as2',
    name: 'Writing Assessment – Band 6',
    classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6',
    type: 'test', date: '2026-03-15',
    totalStudents: 6, avgBand: 5.6, highestBand: 6.5, lowestBand: 4.5, belowTargetCount: 3,
    scores: [
      { studentId: 's5',  studentName: 'Hoang Van Long',  overall: 5.5, reading: null, writing: 5.5, listening: null, speaking: null, targetBand: 6.5, belowTarget: true  },
      { studentId: 's15', studentName: 'Pham Thi Quynh',  overall: 6.5, reading: null, writing: 6.5, listening: null, speaking: null, targetBand: 6.5, belowTarget: false },
      { studentId: 's16', studentName: 'Le Van Minh',      overall: 4.5, reading: null, writing: 4.5, listening: null, speaking: null, targetBand: 6.5, belowTarget: true  },
      { studentId: 's17', studentName: 'Truong Thi Bich',  overall: 5.5, reading: null, writing: 5.5, listening: null, speaking: null, targetBand: 6.0, belowTarget: false },
      { studentId: 's18', studentName: 'Vo Thi Kim',       overall: 6.0, reading: null, writing: 6.0, listening: null, speaking: null, targetBand: 6.5, belowTarget: true  },
      { studentId: 's19', studentName: 'Dang Quoc Huy',    overall: 4.5, reading: null, writing: 4.5, listening: null, speaking: null, targetBand: 6.0, belowTarget: true  },
    ],
  },
]

// ── Schedule ───────────────────────────────────────────────────

export const TEACHER_SCHEDULE: TeacherScheduleItem[] = [
  // This week: Mon 16 – Sun 22 Mar
  { id: 'sch1', classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6', date: '2026-03-16', dayLabel: 'Mon', startTime: '08:00', endTime: '10:00', studentCount: 6, status: 'done',           attendanceRecorded: true,  sessionNoteAdded: true  },
  { id: 'sch2', classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A', date: '2026-03-16', dayLabel: 'Mon', startTime: '18:00', endTime: '20:00', studentCount: 8, status: 'done',           attendanceRecorded: true,  sessionNoteAdded: true  },
  { id: 'sch3', classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6', date: '2026-03-18', dayLabel: 'Wed', startTime: '08:00', endTime: '10:00', studentCount: 6, status: 'done',           attendanceRecorded: true,  sessionNoteAdded: true  },
  { id: 'sch4', classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A', date: '2026-03-18', dayLabel: 'Wed', startTime: '18:00', endTime: '20:00', studentCount: 8, status: 'done',           attendanceRecorded: true,  sessionNoteAdded: true  },
  { id: 'sch5', classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A', date: '2026-03-20', dayLabel: 'Fri', startTime: '18:00', endTime: '20:00', studentCount: 8, status: 'done',           attendanceRecorded: true,  sessionNoteAdded: false },
  { id: 'sch6', classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6', date: '2026-03-21', dayLabel: 'Sat', startTime: '08:00', endTime: '10:00', studentCount: 6, status: 'missing-record', attendanceRecorded: false, sessionNoteAdded: false },
  // Next week: Mon 23 – Sun 29 Mar
  { id: 'sch7', classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6', date: '2026-03-23', dayLabel: 'Mon', startTime: '08:00', endTime: '10:00', studentCount: 6, status: 'upcoming',       attendanceRecorded: false, sessionNoteAdded: false },
  { id: 'sch8', classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A', date: '2026-03-23', dayLabel: 'Mon', startTime: '18:00', endTime: '20:00', studentCount: 8, status: 'upcoming',       attendanceRecorded: false, sessionNoteAdded: false },
  { id: 'sch9', classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6', date: '2026-03-25', dayLabel: 'Wed', startTime: '08:00', endTime: '10:00', studentCount: 6, status: 'upcoming',       attendanceRecorded: false, sessionNoteAdded: false },
  { id: 'sch10',classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A', date: '2026-03-25', dayLabel: 'Wed', startTime: '18:00', endTime: '20:00', studentCount: 8, status: 'upcoming',       attendanceRecorded: false, sessionNoteAdded: false },
  { id: 'sch11',classId: 'c1', className: 'Foundation 1 – Class A', classCode: 'IF1-A', date: '2026-03-27', dayLabel: 'Fri', startTime: '18:00', endTime: '20:00', studentCount: 8, status: 'upcoming',       attendanceRecorded: false, sessionNoteAdded: false },
  { id: 'sch12',classId: 'c3', className: 'IELTS Writing – Band 6', classCode: 'IW-B6', date: '2026-03-28', dayLabel: 'Sat', startTime: '08:00', endTime: '10:00', studentCount: 6, status: 'upcoming',       attendanceRecorded: false, sessionNoteAdded: false },
]

// ── Notifications ──────────────────────────────────────────────

export const TEACHER_NOTIFICATIONS: TeacherNotification[] = [
  {
    id: 'n1',
    priority: 'critical', type: 'exam',
    title: 'Nguyen Van A: exam in 8 days, band 4.0 vs target 6.0',
    body: 'Foundation 1 – Class A · Gap of 2.0 bands · Immediate intervention needed.',
    actionLabel: 'View Student', actionHref: '/teacher/students/s1',
    createdAt: '2 minutes ago', read: false,
  },
  {
    id: 'n2',
    priority: 'critical', type: 'exam',
    title: 'Pham Van Duc: exam in 8 days, band 4.5 vs target 5.5',
    body: 'Foundation 1 – Class A · Gap of 1.0 band · Schedule catch-up session.',
    actionLabel: 'View Student', actionHref: '/teacher/students/s3',
    createdAt: '2 minutes ago', read: false,
  },
  {
    id: 'n3',
    priority: 'high', type: 'attendance',
    title: 'Nguyen Van A below 70% attendance',
    body: 'Currently 58% · Foundation 1 – Class A · 5 absences in last 12 sessions.',
    actionLabel: 'View Student', actionHref: '/teacher/students/s1',
    createdAt: '1 hour ago', read: false,
  },
  {
    id: 'n4',
    priority: 'high', type: 'homework',
    title: '5 students haven\'t submitted Writing Task 2',
    body: 'Due 18 Mar (overdue 3 days) · Foundation 1 – Class A · Nguyen Van A, Pham Van Duc +3.',
    actionLabel: 'View Submissions', actionHref: '/teacher/homework',
    createdAt: '3 hours ago', read: false,
  },
  {
    id: 'n5',
    priority: 'medium', type: 'homework',
    title: 'Grading overdue: Writing Task 2 – Problem Solution',
    body: 'Assigned 14 Mar · Due 18 Mar · 3 students submitted, none graded yet.',
    actionLabel: 'Grade Now', actionHref: '/teacher/homework',
    createdAt: 'Today', read: false,
  },
  {
    id: 'n6',
    priority: 'medium', type: 'homework',
    title: '2 students haven\'t submitted Listening Drill',
    body: 'Due today · IELTS Writing – Band 6 · Le Van Minh, Dang Quoc Huy.',
    actionLabel: 'View Submissions', actionHref: '/teacher/homework',
    createdAt: 'Today', read: true,
  },
  {
    id: 'n7',
    priority: 'medium', type: 'attendance',
    title: 'IW-B6: attendance not recorded for today\'s session',
    body: 'IELTS Writing – Band 6 · Sat 21 Mar 08:00–10:00 · Please record attendance.',
    actionLabel: 'Take Attendance', actionHref: '/teacher/attendance',
    createdAt: 'Today', read: false,
  },
  {
    id: 'n8',
    priority: 'info', type: 'admin',
    title: 'Dang Quoc Huy: exam in 30 days — monitor progress',
    body: 'IELTS Writing – Band 6 · Exam 20 April · Current band 4.5 vs target 6.0.',
    actionLabel: 'View Student', actionHref: '/teacher/students/s19',
    createdAt: 'Yesterday', read: true,
  },
]

// ── Derived helpers ────────────────────────────────────────────

export function getClassStudents(classId: string) {
  return TEACHER_STUDENTS.filter(s => s.classId === classId)
}

export function getTaskSubmissions(taskId: string) {
  return TEACHER_SUBMISSIONS.filter(s => s.taskId === taskId)
}

export function getStudentById(id: string) {
  return TEACHER_STUDENTS.find(s => s.id === id)
}

export function getClassById(id: string) {
  return TEACHER_CLASSES.find(c => c.id === id)
}

export const UNREAD_COUNT = TEACHER_NOTIFICATIONS.filter(n => !n.read && (n.priority === 'critical' || n.priority === 'high')).length
export const UNGRADED_COUNT = TEACHER_HW_TASKS.filter(t => t.submittedCount > t.gradedCount).length

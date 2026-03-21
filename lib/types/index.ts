// ============================================================
// Jaxtina Lite LMS – TypeScript Types
// ============================================================

export type UserRole = 'teacher' | 'manager' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
}

export interface Course {
  id: string
  code: string
  name: string
  level: string | null
  course_type: string | null
  duration_weeks: number | null
  tuition_fee: number | null
  active: boolean
}

export type ClassStatus = 'Planned' | 'Open for enrolment' | 'Full' | 'Ongoing' | 'Completed' | 'Cancelled'

export interface Class {
  id: string
  class_code: string
  class_name: string
  course_id: string | null
  teacher_id: string | null
  start_date: string | null
  end_date: string | null
  schedule: string | null
  capacity: number
  status: ClassStatus
  created_at: string
  // joined fields
  course_name?: string
  teacher_name?: string
}

export interface Student {
  id: string
  student_code: string
  name: string
  email: string | null
  phone: string | null
  created_at: string
}

export type EnrolmentStatus = 'Active' | 'On hold' | 'Completed' | 'Drop-out'

export interface Enrolment {
  id: string
  student_id: string
  class_id: string
  enrol_date: string
  target_exam_date: string | null
  status: EnrolmentStatus
  notes: string | null
  // joined fields
  student_name?: string
  student_code?: string
  class_name?: string
}

export type HomeworkStatus = 'Not assigned' | 'Assigned' | 'Submitted' | 'Late' | 'Missing' | 'Checked'

export interface Homework {
  id: string
  class_id: string
  student_id: string
  assigned_date: string
  title: string
  skill: string | null
  resource_url: string | null
  due_date: string | null
  status: HomeworkStatus
  score: number | null
  teacher_comment: string | null
  created_at: string
  // joined fields
  student_name?: string
  class_name?: string
}

export interface Assessment {
  id: string
  class_id: string
  student_id: string
  assessment_date: string
  assessment_type: string | null
  assessment_name: string | null
  max_score: number
  score: number | null
  teacher_comment: string | null
  created_at: string
  // joined fields
  student_name?: string
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused'

export interface Attendance {
  id: string
  class_id: string
  student_id: string
  session_date: string
  status: AttendanceStatus
  notes: string | null
  // joined fields
  student_name?: string
}

export interface Resource {
  id: string
  class_id: string | null
  title: string
  url: string | null
  blob_url: string | null
  resource_type: string | null
  uploaded_by: string | null
  created_at: string
  // joined fields
  uploader_name?: string
}

// ── Dashboard types ──────────────────────────────────────────

export type StatusIndicator = 'on-track' | 'at-risk' | 'critical'

export interface ClassSummary {
  classCode: string
  className: string
  teacherName: string
  activeStudents: number
  homeworkCompletion: number
  avgScore: number
  attendanceRate: number
  nextExamDate: string | null
  daysToExam: number | null
  statusIndicator: StatusIndicator
}

export interface AtRiskStudent {
  studentName: string
  className: string
  teacherName: string
  attendanceRate: number
  avgScore: number
  daysToExam: number | null
}

export interface ManagerDashboardData {
  totalActiveStudents: number
  totalClasses: number
  overallHomeworkCompletion: number
  overallAvgScore: number
  overallAttendanceRate: number
  studentsExamIn30Days: number
  classSummaries: ClassSummary[]
  atRiskStudents: AtRiskStudent[]
}

export interface ClassStats {
  activeStudents: number
  homeworkCompletion: number
  avgScore: number
  attendanceRate: number
  daysToNextExam: number | null
  overdueHomework: number
}

export interface StudentStats {
  homeworkCompletion: number
  avgScore: number
  attendanceRate: number
  totalTasks: number
  missingHomework: number
}

export interface TeacherDashboardData {
  classStats: ClassStats
  studentStats?: StudentStats
}

// ── Student interface types ───────────────────────────────────

export type SubmissionStatus = 'not_submitted' | 'submitted' | 'returned'

export interface Assignment {
  id: string
  class_id: string
  title: string
  description: string | null
  due_at: string | null
  max_points: number
  created_at: string
}

export interface AssignmentAttachment {
  id: string
  assignment_id: string
  filename: string
  mime_type: string | null
  blob_url: string
  created_at: string
}

export interface Submission {
  id: string
  assignment_id: string
  student_id: string
  submitted_at: string | null
  status: SubmissionStatus
  grade: number | null
  feedback_text: string | null
  returned_at: string | null
  created_at: string
}

export interface SubmissionFile {
  id: string
  submission_id: string
  filename: string
  mime_type: string | null
  blob_url: string
  uploaded_at: string
}

export interface ClassWithTeacher {
  id: string
  class_name: string
  class_code: string
  schedule: string | null
  status: string
  teacher_name: string
  course_name: string
}

export interface AssignmentWithSubmission extends Assignment {
  submission: Submission | null
}

export interface AssignmentWithDetails extends Assignment {
  attachments: AssignmentAttachment[]
  submission: (Submission & { files: SubmissionFile[] }) | null
}

// ── Learner Dashboard ──────────────────────────────────────────

export interface CourseSummary {
  id: string              // class id — links to /student/class/[id]
  title: string           // class_name
  courseName: string      // course_name (displayed as provider label)
  classCode: string
  teacherName: string
  schedule: string | null
  percentComplete: number // 0-100
  estimatedCompletion: string // formatted date or 'TBD'
  nextActivity: {
    title: string
    type: 'video' | 'reading' | 'practice' | 'writing' | 'listening'
    durationMinutes: number
  } | null
}

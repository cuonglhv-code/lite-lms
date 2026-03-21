import { sql } from '@vercel/postgres'
import type {
  User, Class, Student, Enrolment, Homework, Assessment, Attendance, Resource,
  ManagerDashboardData, TeacherDashboardData, ClassSummary, AtRiskStudent,
  StatusIndicator,
  Assignment, AssignmentAttachment, Submission, SubmissionFile,
  ClassWithTeacher, AssignmentWithSubmission,
} from '@/lib/types'

// ── Users ─────────────────────────────────────────────────────

export async function getUserByEmail(email: string): Promise<User | null> {
  const { rows } = await sql`SELECT id, name, email, role, created_at FROM users WHERE email = ${email}`
  return rows[0] as User ?? null
}

export async function getUserWithHash(email: string) {
  const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`
  return rows[0] ?? null
}

export async function getAllTeachers(): Promise<User[]> {
  const { rows } = await sql`SELECT id, name, email, role FROM users WHERE role = 'teacher' ORDER BY name`
  return rows as User[]
}

// ── Classes ───────────────────────────────────────────────────

export async function getAllClasses(): Promise<Class[]> {
  const { rows } = await sql`
    SELECT c.*, co.name AS course_name, u.name AS teacher_name
    FROM classes c
    LEFT JOIN courses co ON c.course_id = co.id
    LEFT JOIN users u ON c.teacher_id = u.id
    ORDER BY c.created_at DESC`
  return rows as Class[]
}

export async function getClassById(id: string): Promise<Class | null> {
  const { rows } = await sql`
    SELECT c.*, co.name AS course_name, u.name AS teacher_name
    FROM classes c
    LEFT JOIN courses co ON c.course_id = co.id
    LEFT JOIN users u ON c.teacher_id = u.id
    WHERE c.id = ${id}`
  return rows[0] as Class ?? null
}

export async function getClassesByTeacher(teacherId: string): Promise<Class[]> {
  const { rows } = await sql`
    SELECT c.*, co.name AS course_name
    FROM classes c
    LEFT JOIN courses co ON c.course_id = co.id
    WHERE c.teacher_id = ${teacherId}
    ORDER BY c.created_at DESC`
  return rows as Class[]
}

export async function createClass(data: {
  class_code: string; class_name: string; course_id: string; teacher_id: string;
  start_date: string; end_date: string; schedule: string; capacity: number; status: string
}): Promise<Class> {
  const { rows } = await sql`
    INSERT INTO classes (class_code, class_name, course_id, teacher_id, start_date, end_date, schedule, capacity, status)
    VALUES (${data.class_code}, ${data.class_name}, ${data.course_id}, ${data.teacher_id},
            ${data.start_date}, ${data.end_date}, ${data.schedule}, ${data.capacity}, ${data.status})
    RETURNING *`
  return rows[0] as Class
}

// ── Students ──────────────────────────────────────────────────

export async function getAllStudents(): Promise<Student[]> {
  const { rows } = await sql`SELECT * FROM students ORDER BY name`
  return rows as Student[]
}

export async function getStudentsByClass(classId: string): Promise<(Student & { enrolment_status: string; target_exam_date: string | null })[]> {
  const { rows } = await sql`
    SELECT s.*, e.status AS enrolment_status, e.target_exam_date
    FROM students s
    JOIN enrolments e ON e.student_id = s.id
    WHERE e.class_id = ${classId} AND e.status = 'Active'
    ORDER BY s.name`
  return rows as (Student & { enrolment_status: string; target_exam_date: string | null })[]
}

export async function createStudent(data: {
  student_code: string; name: string; email: string; phone: string
}): Promise<Student> {
  const { rows } = await sql`
    INSERT INTO students (student_code, name, email, phone)
    VALUES (${data.student_code}, ${data.name}, ${data.email}, ${data.phone})
    RETURNING *`
  return rows[0] as Student
}

// ── Enrolments ────────────────────────────────────────────────

export async function createEnrolment(data: {
  student_id: string; class_id: string; target_exam_date?: string; notes?: string
}): Promise<Enrolment> {
  const { rows } = await sql`
    INSERT INTO enrolments (student_id, class_id, target_exam_date, notes)
    VALUES (${data.student_id}, ${data.class_id}, ${data.target_exam_date ?? null}, ${data.notes ?? null})
    ON CONFLICT (student_id, class_id) DO NOTHING
    RETURNING *`
  return rows[0] as Enrolment
}

// ── Homework ──────────────────────────────────────────────────

export async function getHomeworkByClass(classId: string): Promise<Homework[]> {
  const { rows } = await sql`
    SELECT h.*, s.name AS student_name
    FROM homework h
    JOIN students s ON h.student_id = s.id
    WHERE h.class_id = ${classId}
    ORDER BY h.assigned_date DESC, s.name`
  return rows as Homework[]
}

export async function getHomeworkByStudent(classId: string, studentId: string): Promise<Homework[]> {
  const { rows } = await sql`
    SELECT * FROM homework
    WHERE class_id = ${classId} AND student_id = ${studentId}
    ORDER BY assigned_date DESC`
  return rows as Homework[]
}

export async function createHomework(data: {
  class_id: string; student_id: string; title: string; skill?: string;
  resource_url?: string; due_date?: string; status?: string
}): Promise<Homework> {
  const { rows } = await sql`
    INSERT INTO homework (class_id, student_id, title, skill, resource_url, due_date, status)
    VALUES (${data.class_id}, ${data.student_id}, ${data.title}, ${data.skill ?? null},
            ${data.resource_url ?? null}, ${data.due_date ?? null}, ${data.status ?? 'Assigned'})
    RETURNING *`
  return rows[0] as Homework
}

export async function updateHomeworkStatus(id: string, status: string, score?: number, comment?: string): Promise<void> {
  await sql`
    UPDATE homework SET status = ${status}, score = ${score ?? null}, teacher_comment = ${comment ?? null}
    WHERE id = ${id}`
}

// ── Assessments ───────────────────────────────────────────────

export async function getAssessmentsByClass(classId: string): Promise<Assessment[]> {
  const { rows } = await sql`
    SELECT a.*, s.name AS student_name
    FROM assessments a
    JOIN students s ON a.student_id = s.id
    WHERE a.class_id = ${classId}
    ORDER BY a.assessment_date DESC, s.name`
  return rows as Assessment[]
}

export async function getAssessmentsByStudent(classId: string, studentId: string): Promise<Assessment[]> {
  const { rows } = await sql`
    SELECT * FROM assessments
    WHERE class_id = ${classId} AND student_id = ${studentId}
    ORDER BY assessment_date ASC`
  return rows as Assessment[]
}

export async function createAssessment(data: {
  class_id: string; student_id: string; assessment_date: string;
  assessment_type?: string; assessment_name?: string; max_score?: number; score?: number; teacher_comment?: string
}): Promise<Assessment> {
  const { rows } = await sql`
    INSERT INTO assessments (class_id, student_id, assessment_date, assessment_type, assessment_name, max_score, score, teacher_comment)
    VALUES (${data.class_id}, ${data.student_id}, ${data.assessment_date}, ${data.assessment_type ?? null},
            ${data.assessment_name ?? null}, ${data.max_score ?? 100}, ${data.score ?? null}, ${data.teacher_comment ?? null})
    RETURNING *`
  return rows[0] as Assessment
}

// ── Attendance ────────────────────────────────────────────────

export async function getAttendanceByClass(classId: string, sessionDate?: string): Promise<Attendance[]> {
  if (sessionDate) {
    const { rows } = await sql`
      SELECT a.*, s.name AS student_name
      FROM attendance a JOIN students s ON a.student_id = s.id
      WHERE a.class_id = ${classId} AND a.session_date = ${sessionDate}
      ORDER BY s.name`
    return rows as Attendance[]
  }
  const { rows } = await sql`
    SELECT a.*, s.name AS student_name
    FROM attendance a JOIN students s ON a.student_id = s.id
    WHERE a.class_id = ${classId}
    ORDER BY a.session_date DESC, s.name`
  return rows as Attendance[]
}

export async function upsertAttendance(data: {
  class_id: string; student_id: string; session_date: string; status: string; notes?: string
}): Promise<void> {
  await sql`
    INSERT INTO attendance (class_id, student_id, session_date, status, notes)
    VALUES (${data.class_id}, ${data.student_id}, ${data.session_date}, ${data.status}, ${data.notes ?? null})
    ON CONFLICT (class_id, student_id, session_date)
    DO UPDATE SET status = EXCLUDED.status, notes = EXCLUDED.notes`
}

// ── Resources ─────────────────────────────────────────────────

export async function getResourcesByClass(classId: string): Promise<Resource[]> {
  const { rows } = await sql`
    SELECT r.*, u.name AS uploader_name
    FROM resources r
    LEFT JOIN users u ON r.uploaded_by = u.id
    WHERE r.class_id = ${classId}
    ORDER BY r.created_at DESC`
  return rows as Resource[]
}

export async function createResource(data: {
  class_id: string; title: string; url?: string; blob_url?: string;
  resource_type?: string; uploaded_by: string
}): Promise<Resource> {
  const { rows } = await sql`
    INSERT INTO resources (class_id, title, url, blob_url, resource_type, uploaded_by)
    VALUES (${data.class_id}, ${data.title}, ${data.url ?? null}, ${data.blob_url ?? null},
            ${data.resource_type ?? null}, ${data.uploaded_by})
    RETURNING *`
  return rows[0] as Resource
}

// ── Student interface queries ─────────────────────────────────

export async function getStudentByUserId(userId: string): Promise<Student | null> {
  const { rows } = await sql`SELECT * FROM students WHERE user_id = ${userId}`
  return rows[0] as Student ?? null
}

export async function getEnrolledClassesForStudent(studentId: string): Promise<ClassWithTeacher[]> {
  const { rows } = await sql`
    SELECT c.id, c.class_name, c.class_code, c.schedule, c.status,
           u.name AS teacher_name, co.name AS course_name
    FROM enrolments e
    JOIN classes c ON e.class_id = c.id
    LEFT JOIN users u ON c.teacher_id = u.id
    LEFT JOIN courses co ON c.course_id = co.id
    WHERE e.student_id = ${studentId} AND e.status = 'Active'
    ORDER BY c.class_name`
  return rows as ClassWithTeacher[]
}

export async function getAssignmentsByClass(classId: string): Promise<Assignment[]> {
  const { rows } = await sql`
    SELECT * FROM assignments WHERE class_id = ${classId}
    ORDER BY due_at ASC NULLS LAST, created_at DESC`
  return rows as Assignment[]
}

export async function getAssignmentsWithSubmissions(
  classId: string,
  studentId: string,
): Promise<AssignmentWithSubmission[]> {
  const { rows } = await sql`
    SELECT a.*,
           s.id AS sub_id, s.submitted_at, s.status AS sub_status,
           s.grade, s.feedback_text, s.returned_at
    FROM assignments a
    LEFT JOIN submissions s ON s.assignment_id = a.id AND s.student_id = ${studentId}
    WHERE a.class_id = ${classId}
    ORDER BY a.due_at ASC NULLS LAST, a.created_at DESC`

  return rows.map(r => ({
    id: r.id,
    class_id: r.class_id,
    title: r.title,
    description: r.description,
    due_at: r.due_at,
    max_points: Number(r.max_points),
    created_at: r.created_at,
    submission: r.sub_id ? {
      id: r.sub_id,
      assignment_id: r.id,
      student_id: studentId,
      submitted_at: r.submitted_at,
      status: r.sub_status,
      grade: r.grade !== null ? Number(r.grade) : null,
      feedback_text: r.feedback_text,
      returned_at: r.returned_at,
      created_at: r.created_at,
    } : null,
  })) as AssignmentWithSubmission[]
}

export async function getAssignmentById(id: string): Promise<Assignment | null> {
  const { rows } = await sql`SELECT * FROM assignments WHERE id = ${id}`
  return rows[0] as Assignment ?? null
}

export async function getAssignmentAttachments(assignmentId: string): Promise<AssignmentAttachment[]> {
  const { rows } = await sql`
    SELECT * FROM assignment_attachments WHERE assignment_id = ${assignmentId}
    ORDER BY created_at ASC`
  return rows as AssignmentAttachment[]
}

export async function getSubmission(
  assignmentId: string,
  studentId: string,
): Promise<Submission | null> {
  const { rows } = await sql`
    SELECT * FROM submissions WHERE assignment_id = ${assignmentId} AND student_id = ${studentId}`
  return rows[0] as Submission ?? null
}

export async function getSubmissionFiles(submissionId: string): Promise<SubmissionFile[]> {
  const { rows } = await sql`
    SELECT * FROM submission_files WHERE submission_id = ${submissionId}
    ORDER BY uploaded_at ASC`
  return rows as SubmissionFile[]
}

export async function upsertSubmission(
  assignmentId: string,
  studentId: string,
): Promise<Submission> {
  const { rows } = await sql`
    INSERT INTO submissions (assignment_id, student_id, submitted_at, status)
    VALUES (${assignmentId}, ${studentId}, NOW(), 'submitted')
    ON CONFLICT (assignment_id, student_id)
    DO UPDATE SET status = 'submitted', submitted_at = NOW()
    RETURNING *`
  return rows[0] as Submission
}

export async function createDraftSubmission(
  assignmentId: string,
  studentId: string,
): Promise<Submission> {
  const { rows } = await sql`
    INSERT INTO submissions (assignment_id, student_id, status)
    VALUES (${assignmentId}, ${studentId}, 'not_submitted')
    ON CONFLICT (assignment_id, student_id) DO UPDATE SET status = submissions.status
    RETURNING *`
  return rows[0] as Submission
}

export async function createSubmissionFile(data: {
  submission_id: string
  filename: string
  mime_type: string | null
  blob_url: string
}): Promise<SubmissionFile> {
  const { rows } = await sql`
    INSERT INTO submission_files (submission_id, filename, mime_type, blob_url)
    VALUES (${data.submission_id}, ${data.filename}, ${data.mime_type}, ${data.blob_url})
    RETURNING *`
  return rows[0] as SubmissionFile
}

export async function deleteSubmissionFile(id: string, submissionId: string): Promise<void> {
  await sql`DELETE FROM submission_files WHERE id = ${id} AND submission_id = ${submissionId}`
}

// ── Dashboard queries ─────────────────────────────────────────

export async function getManagerDashboardData(): Promise<ManagerDashboardData> {
  const today = new Date().toISOString().split('T')[0]

  // Active classes
  const { rows: classes } = await sql`
    SELECT c.id, c.class_code, c.class_name, c.end_date, u.name AS teacher_name
    FROM classes c
    LEFT JOIN users u ON c.teacher_id = u.id
    WHERE c.status IN ('Ongoing', 'Open for enrolment', 'Full')`

  const classSummaries: ClassSummary[] = []
  let totalActiveStudents = 0

  for (const cls of classes) {
    const { rows: [{ count: studentCount }] } = await sql`
      SELECT COUNT(*) FROM enrolments WHERE class_id = ${cls.id} AND status = 'Active'`

    const { rows: hwRows } = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status IN ('Submitted','Late','Checked')) AS done,
        COUNT(*) FILTER (WHERE status != 'Not assigned') AS total
      FROM homework WHERE class_id = ${cls.id}`

    const { rows: scoreRows } = await sql`
      SELECT AVG(score / NULLIF(max_score, 0)) AS avg FROM assessments WHERE class_id = ${cls.id} AND score IS NOT NULL`

    const { rows: attRows } = await sql`
      SELECT
        COUNT(*) FILTER (WHERE status IN ('Present','Late')) AS present,
        COUNT(*) AS total
      FROM attendance WHERE class_id = ${cls.id}`

    const hwDone = Number(hwRows[0]?.done ?? 0)
    const hwTotal = Number(hwRows[0]?.total ?? 0)
    const homeworkCompletion = hwTotal > 0 ? hwDone / hwTotal : 0
    const avgScore = Number(scoreRows[0]?.avg ?? 0)
    const attPresent = Number(attRows[0]?.present ?? 0)
    const attTotal = Number(attRows[0]?.total ?? 0)
    const attendanceRate = attTotal > 0 ? attPresent / attTotal : 0
    const active = Number(studentCount)

    const daysToExam = cls.end_date
      ? Math.ceil((new Date(cls.end_date).getTime() - new Date(today).getTime()) / 86400000)
      : null

    const statusIndicator: StatusIndicator =
      attendanceRate < 0.70 || avgScore < 0.50 ? 'critical'
      : attendanceRate < 0.80 || avgScore < 0.65 ? 'at-risk'
      : 'on-track'

    totalActiveStudents += active
    classSummaries.push({
      classCode: cls.class_code,
      className: cls.class_name,
      teacherName: cls.teacher_name,
      activeStudents: active,
      homeworkCompletion,
      avgScore,
      attendanceRate,
      nextExamDate: cls.end_date,
      daysToExam,
      statusIndicator,
    })
  }

  // Overall metrics
  const overallHomeworkCompletion = classSummaries.length
    ? classSummaries.reduce((s, c) => s + c.homeworkCompletion, 0) / classSummaries.length
    : 0
  const overallAvgScore = classSummaries.length
    ? classSummaries.reduce((s, c) => s + c.avgScore, 0) / classSummaries.length
    : 0
  const overallAttendanceRate = classSummaries.length
    ? classSummaries.reduce((s, c) => s + c.attendanceRate, 0) / classSummaries.length
    : 0

  const studentsExamIn30Days = classSummaries.filter(
    c => c.daysToExam !== null && c.daysToExam >= 0 && c.daysToExam <= 30
  ).reduce((s, c) => s + c.activeStudents, 0)

  // At-risk students
  const { rows: atRiskRows } = await sql`
    SELECT s.name AS student_name, c.class_name, u.name AS teacher_name,
           c.end_date,
           COUNT(att.*) FILTER (WHERE att.status IN ('Present','Late'))::float /
             NULLIF(COUNT(att.*), 0) AS attendance_rate,
           AVG(a.score / NULLIF(a.max_score, 0)) AS avg_score
    FROM enrolments e
    JOIN students s ON e.student_id = s.id
    JOIN classes c ON e.class_id = c.id
    LEFT JOIN users u ON c.teacher_id = u.id
    LEFT JOIN attendance att ON att.student_id = s.id AND att.class_id = c.id
    LEFT JOIN assessments a ON a.student_id = s.id AND a.class_id = c.id
    WHERE e.status = 'Active'
    GROUP BY s.name, c.class_name, u.name, c.end_date
    HAVING
      COUNT(att.*) FILTER (WHERE att.status IN ('Present','Late'))::float / NULLIF(COUNT(att.*), 0) < 0.70
      OR AVG(a.score / NULLIF(a.max_score, 0)) < 0.50`

  const atRiskStudents: AtRiskStudent[] = atRiskRows.map(r => ({
    studentName: r.student_name,
    className: r.class_name,
    teacherName: r.teacher_name,
    attendanceRate: Number(r.attendance_rate ?? 0),
    avgScore: Number(r.avg_score ?? 0),
    daysToExam: r.end_date
      ? Math.ceil((new Date(r.end_date).getTime() - new Date(today).getTime()) / 86400000)
      : null,
  }))

  return {
    totalActiveStudents,
    totalClasses: classes.length,
    overallHomeworkCompletion,
    overallAvgScore,
    overallAttendanceRate,
    studentsExamIn30Days,
    classSummaries,
    atRiskStudents,
  }
}

export async function getTeacherDashboardData(
  classId: string, studentId?: string
): Promise<TeacherDashboardData> {
  const today = new Date().toISOString().split('T')[0]

  const { rows: [cls] } = await sql`SELECT end_date FROM classes WHERE id = ${classId}`

  const { rows: [{ count: activeStudents }] } = await sql`
    SELECT COUNT(*) FROM enrolments WHERE class_id = ${classId} AND status = 'Active'`

  const { rows: [hwRow] } = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status IN ('Submitted','Late','Checked'))::float /
        NULLIF(COUNT(*) FILTER (WHERE status != 'Not assigned'), 0) AS completion,
      COUNT(*) FILTER (WHERE status IN ('Missing','Late') AND due_date < ${today}) AS overdue
    FROM homework WHERE class_id = ${classId}`

  const { rows: [scoreRow] } = await sql`
    SELECT AVG(score / NULLIF(max_score, 0)) AS avg FROM assessments
    WHERE class_id = ${classId} AND score IS NOT NULL`

  const { rows: [attRow] } = await sql`
    SELECT COUNT(*) FILTER (WHERE status IN ('Present','Late'))::float /
      NULLIF(COUNT(*), 0) AS rate
    FROM attendance WHERE class_id = ${classId}`

  const daysToNextExam = cls?.end_date
    ? Math.ceil((new Date(cls.end_date).getTime() - new Date(today).getTime()) / 86400000)
    : null

  const classStats = {
    activeStudents: Number(activeStudents),
    homeworkCompletion: Number(hwRow?.completion ?? 0),
    avgScore: Number(scoreRow?.avg ?? 0),
    attendanceRate: Number(attRow?.rate ?? 0),
    daysToNextExam,
    overdueHomework: Number(hwRow?.overdue ?? 0),
  }

  if (!studentId) return { classStats }

  const { rows: [sHwRow] } = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status IN ('Submitted','Late','Checked'))::float /
        NULLIF(COUNT(*) FILTER (WHERE status != 'Not assigned'), 0) AS completion,
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE status = 'Missing') AS missing
    FROM homework WHERE class_id = ${classId} AND student_id = ${studentId}`

  const { rows: [sScoreRow] } = await sql`
    SELECT AVG(score / NULLIF(max_score, 0)) AS avg FROM assessments
    WHERE class_id = ${classId} AND student_id = ${studentId} AND score IS NOT NULL`

  const { rows: [sAttRow] } = await sql`
    SELECT COUNT(*) FILTER (WHERE status IN ('Present','Late'))::float /
      NULLIF(COUNT(*), 0) AS rate
    FROM attendance WHERE class_id = ${classId} AND student_id = ${studentId}`

  return {
    classStats,
    studentStats: {
      homeworkCompletion: Number(sHwRow?.completion ?? 0),
      avgScore: Number(sScoreRow?.avg ?? 0),
      attendanceRate: Number(sAttRow?.rate ?? 0),
      totalTasks: Number(sHwRow?.total ?? 0),
      missingHomework: Number(sHwRow?.missing ?? 0),
    },
  }
}

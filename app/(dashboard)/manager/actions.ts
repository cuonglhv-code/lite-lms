'use server'

import { revalidatePath } from 'next/cache'
import { sql } from '@vercel/postgres'

// ── Course Actions ────────────────────────────────────────

export async function createCourse(data: {
  name: string
  code: string
  level: string
  durationWeeks: number
  basePrice: number
  description?: string
}) {
  try {
    const { rows } = await sql`
      INSERT INTO courses (name, code, level, duration_weeks, base_price, description)
      VALUES (${data.name}, ${data.code}, ${data.level}, ${data.durationWeeks},
              ${data.basePrice}, ${data.description ?? null})
      RETURNING *`
    revalidatePath('/manager/courses')
    return { success: true, data: rows[0] }
  } catch (error) {
    console.error('Create course error:', error)
    return { success: false, error: 'Failed to create course' }
  }
}

export async function updateCourse(id: string, data: {
  name?: string
  code?: string
  level?: string
  durationWeeks?: number
  basePrice?: number
  description?: string
}) {
  try {
    const updates: string[] = []
    const values: unknown[] = []

    if (data.name !== undefined) { updates.push(`name = $${updates.length + 1}`); values.push(data.name) }
    if (data.code !== undefined) { updates.push(`code = $${updates.length + 1}`); values.push(data.code) }
    if (data.level !== undefined) { updates.push(`level = $${updates.length + 1}`); values.push(data.level) }
    if (data.durationWeeks !== undefined) { updates.push(`duration_weeks = $${updates.length + 1}`); values.push(data.durationWeeks) }
    if (data.basePrice !== undefined) { updates.push(`base_price = $${updates.length + 1}`); values.push(data.basePrice) }
    if (data.description !== undefined) { updates.push(`description = $${updates.length + 1}`); values.push(data.description ?? null) }

    if (updates.length === 0) return { success: true, data: null }

    values.push(id)
    const query = `UPDATE courses SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`
    const { rows } = await sql.query(query, values)

    revalidatePath('/manager/courses')
    return { success: true, data: rows[0] }
  } catch (error) {
    console.error('Update course error:', error)
    return { success: false, error: 'Failed to update course' }
  }
}

export async function deleteCourse(id: string) {
  try {
    await sql`DELETE FROM courses WHERE id = ${id}`
    revalidatePath('/manager/courses')
    return { success: true }
  } catch (error) {
    console.error('Delete course error:', error)
    return { success: false, error: 'Failed to delete course' }
  }
}

// ── Class Actions ─────────────────────────────────────────

export async function createClass(data: {
  classCode: string
  className: string
  courseId: string
  teacherId: string
  startDate: string
  endDate: string
  schedule: string
  capacity: number
  status: string
}) {
  try {
    const { rows } = await sql`
      INSERT INTO classes (class_code, class_name, course_id, teacher_id, start_date, end_date, schedule, capacity, status)
      VALUES (${data.classCode}, ${data.className}, ${data.courseId}, ${data.teacherId},
              ${data.startDate}, ${data.endDate}, ${data.schedule}, ${data.capacity}, ${data.status})
      RETURNING *`
    revalidatePath('/manager/classes')
    return { success: true, data: rows[0] }
  } catch (error) {
    console.error('Create class error:', error)
    return { success: false, error: 'Failed to create class' }
  }
}

export async function updateClass(id: string, data: {
  className?: string
  courseId?: string
  teacherId?: string
  startDate?: string
  endDate?: string
  schedule?: string
  capacity?: number
  status?: string
}) {
  try {
    const updates: string[] = []
    const values: unknown[] = []

    if (data.className !== undefined) { updates.push(`class_name = $${updates.length + 1}`); values.push(data.className) }
    if (data.courseId !== undefined) { updates.push(`course_id = $${updates.length + 1}`); values.push(data.courseId) }
    if (data.teacherId !== undefined) { updates.push(`teacher_id = $${updates.length + 1}`); values.push(data.teacherId) }
    if (data.startDate !== undefined) { updates.push(`start_date = $${updates.length + 1}`); values.push(data.startDate) }
    if (data.endDate !== undefined) { updates.push(`end_date = $${updates.length + 1}`); values.push(data.endDate) }
    if (data.schedule !== undefined) { updates.push(`schedule = $${updates.length + 1}`); values.push(data.schedule) }
    if (data.capacity !== undefined) { updates.push(`capacity = $${updates.length + 1}`); values.push(data.capacity) }
    if (data.status !== undefined) { updates.push(`status = $${updates.length + 1}`); values.push(data.status) }

    if (updates.length === 0) return { success: true, data: null }

    values.push(id)
    const query = `UPDATE classes SET ${updates.join(', ')} WHERE id = $${values.length} RETURNING *`
    const { rows } = await sql.query(query, values)

    revalidatePath('/manager/classes')
    return { success: true, data: rows[0] }
  } catch (error) {
    console.error('Update class error:', error)
    return { success: false, error: 'Failed to update class' }
  }
}

// ── Enrolment Actions ─────────────────────────────────────

export async function enrolStudent(studentId: string, classId: string, targetExamDate?: string, notes?: string) {
  try {
    const { rows } = await sql`
      INSERT INTO enrolments (student_id, class_id, target_exam_date, notes)
      VALUES (${studentId}, ${classId}, ${targetExamDate ?? null}, ${notes ?? null})
      ON CONFLICT (student_id, class_id) DO NOTHING
      RETURNING *`
    revalidatePath('/manager/enrolments')
    return { success: true, data: rows[0] }
  } catch (error) {
    console.error('Enrol student error:', error)
    return { success: false, error: 'Failed to enrol student' }
  }
}

// ── Payment Actions ──────────────────────────────────────

export async function recordPayment(enrolmentId: string, amount: number, paymentDate: string, method: string) {
  try {
    const { rows } = await sql`
      INSERT INTO payments (enrolment_id, amount, payment_date, payment_method, status)
      VALUES (${enrolmentId}, ${amount}, ${paymentDate}, ${method}, 'completed')
      RETURNING *`
    revalidatePath('/manager/finance')
    return { success: true, data: rows[0] }
  } catch (error) {
    console.error('Record payment error:', error)
    return { success: false, error: 'Failed to record payment' }
  }
}

// ── Student/Teacher Actions ──────────────────────────────

export async function createStudent(data: {
  name: string
  email: string
  phone?: string
  targetBand?: string
}) {
  try {
    // Create user account first
    const hashedPassword = '$2a$10$dummy' // In production, hash properly
    const { rows: userRows } = await sql`
      INSERT INTO users (email, name, password_hash, role)
      VALUES (${data.email}, ${data.name}, ${hashedPassword}, 'student')
      ON CONFLICT (email) DO NOTHING
      RETURNING id`

    const userId = userRows[0]?.id

    // Create student profile
    const { rows: studentRows } = await sql`
      INSERT INTO students (user_id, name, email, phone)
      VALUES (${userId ?? null}, ${data.name}, ${data.email}, ${data.phone ?? null})
      RETURNING *`

    revalidatePath('/manager/students')
    return { success: true, data: studentRows[0] }
  } catch (error) {
    console.error('Create student error:', error)
    return { success: false, error: 'Failed to create student' }
  }
}

export async function createTeacher(data: {
  name: string
  email: string
  phone?: string
}) {
  try {
    // Create user account first
    const hashedPassword = '$2a$10$dummy' // In production, hash properly
    const { rows: userRows } = await sql`
      INSERT INTO users (email, name, password_hash, role)
      VALUES (${data.email}, ${data.name}, ${hashedPassword}, 'teacher')
      ON CONFLICT (email) DO NOTHING
      RETURNING id`

    revalidatePath('/manager/teachers')
    return { success: true, data: { id: userRows[0]?.id, email: data.email, name: data.name } }
  } catch (error) {
    console.error('Create teacher error:', error)
    return { success: false, error: 'Failed to create teacher' }
  }
}

// ── Export Actions ───────────────────────────────────────

export async function exportStudentsCSV(): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const { rows } = await sql`
      SELECT s.name, s.email, s.phone, c.class_name, u.name AS teacher_name, e.status
      FROM students s
      LEFT JOIN enrolments e ON e.student_id = s.id
      LEFT JOIN classes c ON c.id = e.class_id
      LEFT JOIN users u ON u.id = c.teacher_id
      ORDER BY s.name`

    if (rows.length === 0) return { success: true, data: 'Student,Email,Phone,Class,Teacher,Status\n' }

    const headers = ['Student', 'Email', 'Phone', 'Class', 'Teacher', 'Status']
    const csvLines = [headers.join(',')]

    rows.forEach((row: Record<string, string | null>) => {
      const values = [
        `"${row.name ?? ''}"`,
        `"${row.email ?? ''}"`,
        `"${row.phone ?? ''}"`,
        `"${row.class_name ?? ''}"`,
        `"${row.teacher_name ?? ''}"`,
        `"${row.status ?? ''}"`,
      ]
      csvLines.push(values.join(','))
    })

    return { success: true, data: csvLines.join('\n') }
  } catch (error) {
    console.error('Export students CSV error:', error)
    return { success: false, error: 'Failed to export CSV' }
  }
}

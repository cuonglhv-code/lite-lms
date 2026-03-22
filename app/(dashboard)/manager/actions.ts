'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { withCenter } from '@/lib/withCenter'

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
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const course = await prisma.course.create({
      data: {
        name: data.name,
        code: data.code,
        level: data.level,
        duration_weeks: data.durationWeeks,
        tuition_fee: data.basePrice,
        centerId: session.user.centerId,
      },
    })
    revalidatePath('/manager/courses')
    return { success: true, data: course }
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
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const course = await prisma.course.update({
      where: { 
        id,
        ...withCenter(session.user.centerId)
      },
      data: {
        name: data.name,
        code: data.code,
        level: data.level,
        duration_weeks: data.durationWeeks,
        tuition_fee: data.basePrice,
      },
    })

    revalidatePath('/manager/courses')
    return { success: true, data: course }
  } catch (error) {
    console.error('Update course error:', error)
    return { success: false, error: 'Failed to update course' }
  }
}

export async function deleteCourse(id: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    await prisma.course.delete({
      where: { 
        id,
        ...withCenter(session.user.centerId)
      },
    })
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
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const cls = await prisma.class.create({
      data: {
        class_code: data.classCode,
        class_name: data.className,
        course_id: data.courseId,
        teacher_id: data.teacherId,
        start_date: new Date(data.startDate),
        end_date: new Date(data.endDate),
        schedule: data.schedule,
        capacity: data.capacity,
        status: data.status,
        centerId: session.user.centerId,
      },
    })
    revalidatePath('/manager/classes')
    return { success: true, data: cls }
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
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const cls = await prisma.class.update({
      where: { 
        id,
        ...withCenter(session.user.centerId)
      },
      data: {
        class_name: data.className,
        course_id: data.courseId,
        teacher_id: data.teacherId,
        start_date: data.startDate ? new Date(data.startDate) : undefined,
        end_date: data.endDate ? new Date(data.endDate) : undefined,
        schedule: data.schedule,
        capacity: data.capacity,
        status: data.status,
      },
    })

    revalidatePath('/manager/classes')
    return { success: true, data: cls }
  } catch (error) {
    console.error('Update class error:', error)
    return { success: false, error: 'Failed to update class' }
  }
}

// ── Enrolment Actions ─────────────────────────────────────

export async function enrolStudent(studentId: string, classId: string, targetExamDate?: string, notes?: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const enrolment = await prisma.enrolment.upsert({
      where: {
        student_id_class_id: {
          student_id: studentId,
          class_id: classId,
        },
      },
      update: {
        target_exam_date: targetExamDate ? new Date(targetExamDate) : undefined,
        notes,
      },
      create: {
        student_id: studentId,
        class_id: classId,
        target_exam_date: targetExamDate ? new Date(targetExamDate) : undefined,
        notes,
        centerId: session.user.centerId,
      },
    })
    revalidatePath('/manager/enrolments')
    return { success: true, data: enrolment }
  } catch (error) {
    console.error('Enrol student error:', error)
    return { success: false, error: 'Failed to enrol student' }
  }
}

// ── Payment Actions ──────────────────────────────────────

export async function recordPayment(amount: number, type: string, description?: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const finance = await prisma.finance.create({
      data: {
        amount,
        type,
        description,
        centerId: session.user.centerId,
      },
    })

    revalidatePath('/manager/finance')
    return { success: true, data: finance }
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
}) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    // Create student profile directly (User creation would be separate usually, 
    // but here we follow the prompt's implied structure)
    const student = await prisma.student.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        centerId: session.user.centerId,
      },
    })

    revalidatePath('/manager/students')
    return { success: true, data: student }
  } catch (error) {
    console.error('Create student error:', error)
    return { success: false, error: 'Failed to create student' }
  }
}

export async function createTeacher(data: {
  name: string
  email: string
}) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const hashedPassword = '$2a$10$dummy' // Placeholder
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password_hash: hashedPassword,
        role: 'teacher',
        centerId: session.user.centerId,
      },
    })

    revalidatePath('/manager/teachers')
    return { success: true, data: user }
  } catch (error) {
    console.error('Create teacher error:', error)
    return { success: false, error: 'Failed to create teacher' }
  }
}

// ── Export Actions ───────────────────────────────────────

export async function exportStudentsCSV(): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const students = await prisma.student.findMany({
      where: withCenter(session.user.centerId),
      include: {
        enrolments: {
          include: {
            class: {
              include: {
                teacher: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    if (students.length === 0) return { success: true, data: 'Student,Email,Phone,Class,Teacher,Status\n' }

    const headers = ['Student', 'Email', 'Phone', 'Class', 'Teacher', 'Status']
    const csvLines = [headers.join(',')]

    students.forEach((s) => {
      const e = s.enrolments[0]
      const values = [
        `"${s.name ?? ''}"`,
        `"${s.email ?? ''}"`,
        `"${s.phone ?? ''}"`,
        `"${e?.class?.class_name ?? ''}"`,
        `"${e?.class?.teacher?.name ?? ''}"`,
        `"${e?.status ?? ''}"`,
      ]
      csvLines.push(values.join(','))
    })

    return { success: true, data: csvLines.join('\n') }
  } catch (error) {
    console.error('Export students CSV error:', error)
    return { success: false, error: 'Failed to export CSV' }
  }
}

// ── Center Actions ────────────────────────────────────────

export async function getCenters() {
  try {
    const session = await auth()
    if (!session) return { success: false, error: 'Unauthorized' }

    const centers = await prisma.center.findMany({
      include: {
        _count: {
          select: {
            teachers: true,
            students: true,
            classes: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return { success: true, data: centers }
  } catch (error) {
    console.error('Get centers error:', error)
    return { success: false, error: 'Failed to fetch centers' }
  }
}

export async function createCenter(data: {
  name: string
  address?: string
  phone?: string
  email?: string
}) {
  try {
    const session = await auth()
    const user = session?.user as any
    if (!session || (user.role !== 'admin' && user.role !== 'academic_manager' && user.role !== 'manager')) {
      return { success: false, error: 'Unauthorized' }
    }

    const center = await prisma.center.create({
      data: {
        name: data.name,
        address: data.address,
        phone: data.phone,
        email: data.email,
        isActive: true,
      }
    })

    revalidatePath('/manager/centers')
    return { success: true, data: center }
  } catch (error) {
    console.error('Create center error:', error)
    return { success: false, error: 'Failed to create center' }
  }
}

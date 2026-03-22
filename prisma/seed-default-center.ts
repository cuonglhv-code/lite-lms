import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration to default center...')

  // 1. Create a default center
  const defaultCenter = await prisma.center.upsert({
    where: { id: 'default-center' }, // Use a fixed ID or cuid
    update: {},
    create: {
      id: 'default-center',
      name: 'Main Center',
      address: 'Jaxtina Main Office',
      isActive: true,
    },
  })

  const centerId = defaultCenter.id
  console.log(`Created/Found default center: ${defaultCenter.name} (${centerId})`)

  // 2. Update existing records
  
  // Teachers (Users with role 'teacher')
  const teachersCount = await prisma.user.updateMany({
    where: { centerId: null },
    data: { centerId },
  })
  console.log(`Updated ${teachersCount.count} teachers`)

  // Students
  const studentsCount = await prisma.student.updateMany({
    where: { centerId: null },
    data: { centerId },
  })
  console.log(`Updated ${studentsCount.count} students`)

  // Classes
  const classesCount = await prisma.class.updateMany({
    where: { centerId: null },
    data: { centerId },
  })
  console.log(`Updated ${classesCount.count} classes`)

  // Courses
  const coursesCount = await prisma.course.updateMany({
    where: { centerId: null },
    data: { centerId },
  })
  console.log(`Updated ${coursesCount.count} courses`)

  // Enrolments
  const enrolmentsCount = await prisma.enrolment.updateMany({
    where: { centerId: null },
    data: { centerId },
  })
  console.log(`Updated ${enrolmentsCount.count} enrolments`)

  // Finance
  const financeCount = await prisma.finance.updateMany({
    where: { centerId: null },
    data: { centerId },
  })
  console.log(`Updated ${financeCount.count} finance records`)

  console.log('Migration completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

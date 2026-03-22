import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting center assignments fix...')

  // 1. Find the "Main Center"
  let mainCenter = await prisma.center.findFirst({
    where: { name: 'Main Center' }
  })

  // Fallback to the first center if "Main Center" isn't found
  if (!mainCenter) {
    mainCenter = await prisma.center.findFirst()
  }

  if (!mainCenter) {
    console.error('No centers found in the database. Please create a center first.')
    return
  }

  const centerId = mainCenter.id
  console.log(`Using center: ${mainCenter.name} (${centerId})`)

  // 2. Update Teachers (User with role 'teacher')
  const teachersCount = await prisma.user.updateMany({
    where: { centerId: null },
    data: { centerId }
  })
  console.log(`Updated ${teachersCount.count} teachers`)

  // 3. Update Students
  const studentsCount = await prisma.student.updateMany({
    where: { centerId: null },
    data: { centerId }
  })
  console.log(`Updated ${studentsCount.count} students`)

  // 4. Update Classes
  const classesCount = await prisma.class.updateMany({
    where: { centerId: null },
    data: { centerId }
  })
  console.log(`Updated ${classesCount.count} classes`)

  // 5. Update Courses
  const coursesCount = await prisma.course.updateMany({
    where: { centerId: null },
    data: { centerId }
  })
  console.log(`Updated ${coursesCount.count} courses`)

  // 6. Update Enrolments
  const enrolmentsCount = await prisma.enrolment.updateMany({
    where: { centerId: null },
    data: { centerId }
  })
  console.log(`Updated ${enrolmentsCount.count} enrolments`)

  console.log('Center assignments fix completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Assessment Bank templates...')

  const courses = await prisma.course.findMany()
  
  if (courses.length === 0) {
    console.log('No courses found. Please seed courses first.')
    return
  }

  const foundation = courses.find(c => c.name.includes('Foundation'))
  const writing = courses.find(c => c.name.includes('Writing Booster'))
  const achiever = courses.find(c => c.name.includes('Academic Achiever'))
  const skills = courses.find(c => c.name.includes('Skills Builder'))

  const templates = []

  if (foundation) {
    templates.push(
      { title: 'Task 1 – Bar Chart Description', type: 'Homework', skill: 'Writing', week: 2, targetBand: 4.5, durationMins: 45, courseId: foundation.id, description: 'Practice describing a bar chart comparing energy consumption.' },
      { title: 'Reading Practice – Unit 2', type: 'Homework', skill: 'Reading', week: 4, targetBand: 4.0, durationMins: 60, courseId: foundation.id, description: 'Focus on skimming and scanning techniques.' },
      { title: 'Foundation Progress Test 1', type: 'Test', skill: 'Full Paper', week: 6, targetBand: 4.5, durationMins: 120, courseId: foundation.id, description: 'Mid-term assessment covering units 1-5.' },
      { title: 'Foundation Mock Exam – Full Paper 1', type: 'Mock', skill: 'Full Paper', week: 10, targetBand: 5.0, durationMins: 180, courseId: foundation.id, description: 'End-of-course simulated IELTS exam.' }
    )
  }

  if (writing) {
    templates.push(
      { title: 'Task 2 – Opinion Essay Introduction', type: 'Homework', skill: 'Writing', week: 1, targetBand: 5.5, durationMins: 45, courseId: writing.id, description: 'Practice writing hook, background and thesis statement.' },
      { title: 'Task 2 – Problem Solution Essay', type: 'Homework', skill: 'Writing', week: 3, targetBand: 5.5, durationMins: 60, courseId: writing.id, description: 'Structure an essay on urban population growth issues.' },
      { title: 'Writing Band 6 Assessment', type: 'Test', skill: 'Writing', week: 5, targetBand: 6.0, durationMins: 60, courseId: writing.id, description: 'Timed Writing Task 2 with evaluation against Band 6 criteria.' },
      { title: 'Writing Mock – Full Task 1 & 2', type: 'Mock', skill: 'Writing', week: 7, targetBand: 6.0, durationMins: 90, courseId: writing.id, description: 'Simulated Writing module under exam conditions.' }
    )
  }

  if (achiever) {
    templates.push(
      { title: 'Academic Reading – Passage 1', type: 'Homework', skill: 'Reading', week: 2, targetBand: 6.0, durationMins: 60, courseId: achiever.id, description: 'True/False/Not Given and Summary Completion focus.' },
      { title: 'Academic Task 1 – Process Diagram', type: 'Homework', skill: 'Writing', week: 4, targetBand: 6.0, durationMins: 45, courseId: achiever.id, description: 'Describe the life cycle of a honey bee.' },
      { title: 'Academic Mock – Full Paper', type: 'Mock', skill: 'Full Paper', week: 8, targetBand: 6.5, durationMins: 180, courseId: achiever.id, description: 'Full mock exam for high-achieving students.' }
    )
  }

  if (skills) {
    templates.push(
      { title: 'Listening Drill – Section 1 & 2', type: 'Homework', skill: 'Listening', week: 1, targetBand: 5.0, durationMins: 30, courseId: skills.id, description: 'Practice identifying specific information and map labelling.' },
      { title: 'Speaking Part 1 & 2 Practice', type: 'Homework', skill: 'Speaking', week: 3, targetBand: 5.0, durationMins: 20, courseId: skills.id, description: 'Record answers to common Part 1 questions and a 2-minute cue card.' },
      { title: 'Skills Builder Progress Test', type: 'Test', skill: 'Full Paper', week: 6, targetBand: 5.5, durationMins: 120, courseId: skills.id, description: 'Comprehensive skills assessment.' }
    )
  }

  for (const t of templates) {
    await prisma.assessmentTemplate.upsert({
      where: { id: `seed-${t.title.replace(/\s+/g, '-').toLowerCase()}` },
      update: t,
      create: {
        id: `seed-${t.title.replace(/\s+/g, '-').toLowerCase()}`,
        ...t
      }
    })
  }

  console.log(`Successfully seeded ${templates.length} templates!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

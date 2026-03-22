import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding authentication users directly for the audit...')
  const hash = await bcrypt.hash('password123', 10)

  const users = [
    { id: '00000000-0000-0000-0000-000000000001', name: 'Academic Manager', email: 'manager@jaxtina.com', password_hash: hash, role: 'manager' },
    { id: '00000000-0000-0000-0000-000000000002', name: 'Linh Nguyen', email: 'linh@jaxtina.com', password_hash: hash, role: 'manager' },
    { id: '00000000-0000-0000-0000-000000000003', name: 'Sarah Mitchell', email: 'sarah@jaxtina.com', password_hash: hash, role: 'teacher' },
    { id: '00000000-0000-0000-0000-000000000004', name: 'James Tran', email: 'james@jaxtina.com', password_hash: hash, role: 'teacher' },
    // Also explicitly create the students in the User table so they can actually authenticate
    { id: '00000000-0000-0000-0000-000000000010', name: 'Nguyen Thi Mai', email: 'mai.nguyen@email.com', password_hash: hash, role: 'student' },
    { id: '00000000-0000-0000-0000-000000000011', name: 'Tran Van Duc', email: 'duc.tran@email.com', password_hash: hash, role: 'student' }
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { password_hash: hash, role: u.role },
      create: u
    })
  }

  console.log('Successfully seeded all auditor accounts!')
}

main().catch(console.error).finally(() => prisma.$disconnect())

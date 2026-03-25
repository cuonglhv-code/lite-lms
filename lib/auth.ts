import NextAuth, { Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { JWT } from 'next-auth/jwt'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // ... same as before ...
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { centerManagers: { select: { centerId: true, role: true }, take: 1 } }
        })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password as string, user.password_hash)
        if (!valid) return null
        let centerId: string | null = user.centerId
        let role: string = user.role
        if (user.role === 'center_manager') {
          const cm = user.centerManagers[0]
          if (cm) { centerId = cm.centerId; role = cm.role }
        } else if (user.role === 'admin' || user.role === 'academic_manager') {
          centerId = null
        }
        return { id: user.id, name: user.name, email: user.email, role, centerId }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role as string
        token.centerId = (user as { centerId?: string | null }).centerId as string | null
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id   = token.sub as string
        session.user.role = token.role as string
        session.user.centerId = token.centerId as string | null
      }
      return session
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
})

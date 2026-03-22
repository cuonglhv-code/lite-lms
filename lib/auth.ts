import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            centerManagers: {
              select: { centerId: true, role: true },
              take: 1
            }
          }
        })

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password as string, user.password_hash)
        if (!valid) return null

        // Determine centerId based on role
        let centerId: string | null = user.centerId
        let role: string = user.role

        if (user.role === 'center_manager') {
          const cm = user.centerManagers[0]
          if (cm) {
            centerId = cm.centerId
            role = cm.role // Use the specific role from CenterManager if needed
          }
        } else if (user.role === 'admin' || user.role === 'academic_manager') {
          centerId = null // All access
        }

        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role, 
          centerId 
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.centerId = (user as any).centerId
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id   = token.sub as string
        (session.user as any).role = token.role as string
        (session.user as any).centerId = token.centerId as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
})

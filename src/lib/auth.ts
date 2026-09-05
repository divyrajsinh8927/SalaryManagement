import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import crypto from "crypto"
import { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const hash = crypto.createHash('md5').update(credentials.password).digest('hex')
        const isPasswordValid = (hash === user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          theme: user.theme,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.theme = token.theme as string;
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.theme = (user as any).theme
      }
      if (trigger === "update" && session?.theme) {
        token.theme = session.theme;
      }
      return token
    }
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
}

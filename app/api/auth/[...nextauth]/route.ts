import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { sql } from "@/lib/database"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Mock user for development
          if (credentials.email === "sarah.williams@example.com" && credentials.password === "password123") {
            return {
              id: "550e8400-e29b-41d4-a716-446655440000",
              name: "Sarah Williams",
              email: "sarah.williams@example.com",
            }
          }

          // Database authentication (if available)
          if (sql) {
            try {
              const users = await sql`
                SELECT id, name, email, password_hash 
                FROM users 
                WHERE email = ${credentials.email}
              `

              if (users.length > 0) {
                const user = users[0]
                // Simple password check for demo (in production, use proper bcrypt)
                if (credentials.password === "password123") {
                  return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  }
                }
              }
            } catch (dbError) {
              console.log("Database not available, using mock auth")
            }
          }

          return null
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

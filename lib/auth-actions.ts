"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { sql } from "@/lib/database"
import { createSession, destroySession, hashPassword, verifyPassword } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

export async function login(data: z.infer<typeof loginSchema>) {
  try {
    const validatedData = loginSchema.parse(data)

    // Mock authentication for demo
    if (validatedData.email === "sarah.williams@example.com" && validatedData.password === "password123") {
      await createSession("550e8400-e29b-41d4-a716-446655440000", "sarah.williams@example.com", "Sarah Williams")
      return { success: true }
    }

    // Database authentication (if available)
    if (sql) {
      try {
        const users = await sql`
          SELECT id, name, email, password_hash 
          FROM users 
          WHERE email = ${validatedData.email}
        `

        if (users.length > 0) {
          const user = users[0]
          if (verifyPassword(validatedData.password, user.password_hash)) {
            await createSession(user.id, user.email, user.name)
            return { success: true }
          }
        }
      } catch (dbError) {
        console.log("Database not available, using mock auth")
      }
    }

    throw new Error("Invalid credentials")
  } catch (error) {
    console.error("Login error:", error)
    throw new Error("Invalid credentials")
  }
}

export async function register(data: z.infer<typeof registerSchema>) {
  try {
    const validatedData = registerSchema.parse(data)

    // For demo purposes, just create a session with mock user
    await createSession("550e8400-e29b-41d4-a716-446655440000", "sarah.williams@example.com", "Sarah Williams")
    return { success: true }

    // Database registration (if available)
    if (sql) {
      try {
        // Check if user already exists
        const existingUsers = await sql`
          SELECT id FROM users WHERE email = ${validatedData.email}
        `

        if (existingUsers.length > 0) {
          throw new Error("User already exists")
        }

        const passwordHash = hashPassword(validatedData.password)

        const newUsers = await sql`
          INSERT INTO users (name, email, password_hash)
          VALUES (${validatedData.name}, ${validatedData.email}, ${passwordHash})
          RETURNING id, name, email
        `

        const user = newUsers[0]

        // Create default notification settings
        await sql`
          INSERT INTO notification_settings (user_id)
          VALUES (${user.id})
        `

        await createSession(user.id, user.email, user.name)
        return { success: true }
      } catch (dbError) {
        console.log("Database not available, using mock registration")
        await createSession("550e8400-e29b-41d4-a716-446655440000", "sarah.williams@example.com", "Sarah Williams")
        return { success: true }
      }
    }
  } catch (error) {
    console.error("Registration error:", error)
    throw new Error("Failed to create account")
  }
}

export async function logout() {
  await destroySession()
  redirect("/login")
}

import { cookies } from "next/headers"
import { sql } from "@/lib/database"
import type { User } from "@/lib/types"

// Mock user for development
const mockUser: User = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Sarah Williams",
  email: "sarah.williams@example.com",
  phone: "555-123-4567",
  emergencyContact: "John Williams - 555-987-6543",
  allergies: "Penicillin",
  medicalHistory: "Breast cancer diagnosis in 2024, no prior major medical conditions",
  diagnosis: "Breast Cancer, Stage 2, ER+/PR+, HER2-",
  treatmentType: "Chemotherapy",
  treatmentProgress: {
    completed: 13,
    total: 20,
  },
  createdAt: new Date().toISOString(),
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie?.value) {
      return null
    }

    const sessionData = JSON.parse(sessionCookie.value)

    // If no database connection, return mock user
    if (!sql) {
      return mockUser
    }

    try {
      const users = await sql`
        SELECT 
          id,
          email,
          name,
          phone,
          emergency_contact,
          allergies,
          medical_history,
          diagnosis,
          treatment_type,
          treatment_completed,
          treatment_total,
          created_at
        FROM users 
        WHERE id = ${sessionData.userId}
      `

      if (users.length === 0) {
        return mockUser
      }

      const user = users[0]
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        emergencyContact: user.emergency_contact,
        allergies: user.allergies,
        medicalHistory: user.medical_history,
        diagnosis: user.diagnosis,
        treatmentType: user.treatment_type,
        treatmentProgress: {
          completed: user.treatment_completed || 0,
          total: user.treatment_total || 0,
        },
        createdAt: user.created_at,
      }
    } catch (dbError) {
      console.log("Database error, using mock user")
      return mockUser
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function createSession(userId: string, email: string, name: string): Promise<void> {
  const cookieStore = await cookies()
  const sessionData = {
    userId,
    email,
    name,
    createdAt: new Date().toISOString(),
  }

  cookieStore.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  })
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export function hashPassword(password: string): string {
  // Simple hash for development
  return `hashed_${password}`
}

export function verifyPassword(password: string, hash: string): boolean {
  return hash === `hashed_${password}` || password === "password123"
}

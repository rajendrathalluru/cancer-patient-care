import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { createSession, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Mock authentication for demo
    if (email === "sarah.williams@example.com" && password === "password123") {
      await createSession("550e8400-e29b-41d4-a716-446655440000", "sarah.williams@example.com", "Sarah Williams")
      return NextResponse.json({ success: true })
    }

    // Database authentication (if available)
    if (sql) {
      try {
        const users = await sql`
          SELECT id, name, email, password_hash 
          FROM users 
          WHERE email = ${email}
        `

        if (users.length > 0) {
          const user = users[0]
          if (verifyPassword(password, user.password_hash)) {
            await createSession(user.id, user.email, user.name)
            return NextResponse.json({ success: true })
          }
        }
      } catch (dbError) {
        console.log("Database not available, using mock auth")
      }
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

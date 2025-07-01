import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/database"
import { createSession, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // For demo purposes, just create a session with mock user
    await createSession("550e8400-e29b-41d4-a716-446655440000", "sarah.williams@example.com", "Sarah Williams")
    return NextResponse.json({ success: true })

    // Database registration (if available)
    if (sql) {
      try {
        // Check if user exists
        const existingUsers = await sql`
          SELECT id FROM users WHERE email = ${email}
        `

        if (existingUsers.length > 0) {
          return NextResponse.json({ error: "User already exists" }, { status: 409 })
        }

        // Create user
        const passwordHash = hashPassword(password)
        const newUsers = await sql`
          INSERT INTO users (name, email, password_hash)
          VALUES (${name}, ${email}, ${passwordHash})
          RETURNING id, name, email
        `

        const user = newUsers[0]
        await createSession(user.id, user.email, user.name)
        return NextResponse.json({ success: true })
      } catch (dbError) {
        console.log("Database not available, using mock registration")
      }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

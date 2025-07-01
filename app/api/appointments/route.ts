import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAppointments } from "@/lib/appointments"
import { addAppointment } from "@/lib/appointment-actions"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const appointments = await getAppointments(user.id)
    return NextResponse.json(appointments)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const appointment = await addAppointment(data)
    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getSymptoms } from "@/lib/symptoms"
import { addSymptom } from "@/lib/symptom-actions"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const symptoms = await getSymptoms(user.id)
    return NextResponse.json(symptoms)
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
    const symptom = await addSymptom(data)
    return NextResponse.json(symptom, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

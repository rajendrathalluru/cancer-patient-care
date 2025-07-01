import { sql } from "@/lib/database"
import type { Symptom } from "@/lib/types"

// Mock data for development
const mockSymptoms: Symptom[] = [
  {
    id: "1",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Fatigue",
    severity: "moderate",
    notes: "Felt tired after short walk, needed to rest for 1 hour",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Nausea",
    severity: "mild",
    notes: "Slight nausea after breakfast, subsided with medication",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Pain",
    severity: "mild",
    notes: "Slight joint pain in the morning, improved throughout the day",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
]

export async function getSymptoms(userId: string): Promise<Symptom[]> {
  try {
    if (!sql) {
      console.log("Using mock symptom data")
      return mockSymptoms.filter((symptom) => symptom.userId === userId)
    }

    const symptoms = await sql`
      SELECT 
        id,
        user_id,
        name,
        severity,
        notes,
        timestamp
      FROM symptoms 
      WHERE user_id = ${userId}
      ORDER BY timestamp DESC
    `

    return symptoms.map((symptom) => ({
      id: symptom.id,
      userId: symptom.user_id,
      name: symptom.name,
      severity: symptom.severity as "mild" | "moderate" | "severe",
      notes: symptom.notes,
      timestamp: symptom.timestamp,
    }))
  } catch (error) {
    console.error("Error fetching symptoms:", error)
    return mockSymptoms.filter((symptom) => symptom.userId === userId)
  }
}

export async function getSymptomById(id: string, userId: string): Promise<Symptom | null> {
  try {
    if (!sql) {
      return mockSymptoms.find((symptom) => symptom.id === id && symptom.userId === userId) || null
    }

    const symptoms = await sql`
      SELECT 
        id,
        user_id,
        name,
        severity,
        notes,
        timestamp
      FROM symptoms 
      WHERE id = ${id} AND user_id = ${userId}
    `

    if (symptoms.length === 0) {
      return null
    }

    const symptom = symptoms[0]
    return {
      id: symptom.id,
      userId: symptom.user_id,
      name: symptom.name,
      severity: symptom.severity as "mild" | "moderate" | "severe",
      notes: symptom.notes,
      timestamp: symptom.timestamp,
    }
  } catch (error) {
    console.error("Error fetching symptom:", error)
    return mockSymptoms.find((symptom) => symptom.id === id && symptom.userId === userId) || null
  }
}

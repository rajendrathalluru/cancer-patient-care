import { sql } from "@/lib/database"
import type { Medication } from "@/lib/types"

// Mock data for development
const mockMedications: Medication[] = [
  {
    id: "1",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Tamoxifen",
    dosage: "20mg",
    frequency: "Once daily",
    time: "08:00",
    status: "taken",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Ondansetron",
    dosage: "8mg",
    frequency: "As needed for nausea",
    time: "12:00",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Dexamethasone",
    dosage: "4mg",
    frequency: "Twice daily",
    time: "20:00",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Vitamin D",
    dosage: "1000 IU",
    frequency: "Once daily",
    time: "08:00",
    status: "missed",
    createdAt: new Date().toISOString(),
  },
]

export async function getMedications(userId: string): Promise<Medication[]> {
  try {
    if (!sql) {
      console.log("Using mock medication data")
      return mockMedications.filter((med) => med.userId === userId)
    }

    const medications = await sql`
      SELECT 
        id,
        user_id,
        name,
        dosage,
        frequency,
        time,
        status,
        created_at
      FROM medications 
      WHERE user_id = ${userId}
      ORDER BY time ASC
    `

    return medications.map((med) => ({
      id: med.id,
      userId: med.user_id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time,
      status: med.status as "taken" | "pending" | "missed",
      createdAt: med.created_at,
    }))
  } catch (error) {
    console.error("Error fetching medications:", error)
    return mockMedications.filter((med) => med.userId === userId)
  }
}

export async function getMedicationById(id: string, userId: string): Promise<Medication | null> {
  try {
    if (!sql) {
      return mockMedications.find((med) => med.id === id && med.userId === userId) || null
    }

    const medications = await sql`
      SELECT 
        id,
        user_id,
        name,
        dosage,
        frequency,
        time,
        status,
        created_at
      FROM medications 
      WHERE id = ${id} AND user_id = ${userId}
    `

    if (medications.length === 0) {
      return null
    }

    const med = medications[0]
    return {
      id: med.id,
      userId: med.user_id,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time,
      status: med.status as "taken" | "pending" | "missed",
      createdAt: med.created_at,
    }
  } catch (error) {
    console.error("Error fetching medication:", error)
    return mockMedications.find((med) => med.id === id && med.userId === userId) || null
  }
}

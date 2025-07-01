"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

const addSymptomSchema = z.object({
  name: z.string().min(2),
  severity: z.enum(["mild", "moderate", "severe"]),
  notes: z.string().min(1),
})

export async function addSymptom(data: z.infer<typeof addSymptomSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const validatedData = addSymptomSchema.parse(data)

    const newSymptoms = await sql`
      INSERT INTO symptoms (user_id, name, severity, notes, timestamp)
      VALUES (${user.id}, ${validatedData.name}, ${validatedData.severity}, ${validatedData.notes}, NOW())
      RETURNING *
    `

    const symptom = newSymptoms[0]

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/symptoms")

    return {
      id: symptom.id,
      userId: symptom.user_id,
      name: symptom.name,
      severity: symptom.severity as "mild" | "moderate" | "severe",
      notes: symptom.notes,
      timestamp: symptom.timestamp,
    }
  } catch (error) {
    console.error("Error adding symptom:", error)
    throw new Error("Failed to add symptom")
  }
}

export async function deleteSymptom(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    await sql`
      DELETE FROM symptoms 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/symptoms")
    return { success: true }
  } catch (error) {
    console.error("Error deleting symptom:", error)
    throw new Error("Failed to delete symptom")
  }
}

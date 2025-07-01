"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

const addMedicationSchema = z.object({
  name: z.string().min(2),
  dosage: z.string().min(1),
  frequency: z.string().min(1),
  time: z.string().min(1),
})

export async function addMedication(data: z.infer<typeof addMedicationSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const validatedData = addMedicationSchema.parse(data)

    if (!sql) {
      console.log("Mock: Adding medication", validatedData)
      // Return mock response
      revalidatePath("/dashboard")
      revalidatePath("/dashboard/medications")
      return {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        name: validatedData.name,
        dosage: validatedData.dosage,
        frequency: validatedData.frequency,
        time: validatedData.time,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      }
    }

    const newMedications = await sql`
      INSERT INTO medications (user_id, name, dosage, frequency, time, status)
      VALUES (${user.id}, ${validatedData.name}, ${validatedData.dosage}, ${validatedData.frequency}, ${validatedData.time}, 'pending')
      RETURNING *
    `

    const medication = newMedications[0]

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/medications")

    return {
      id: medication.id,
      userId: medication.user_id,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      time: medication.time,
      status: medication.status as "taken" | "pending" | "missed",
      createdAt: medication.created_at,
    }
  } catch (error) {
    console.error("Error adding medication:", error)
    throw new Error("Failed to add medication")
  }
}

export async function updateMedicationStatus(id: string, status: "taken" | "missed" | "pending") {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    if (!sql) {
      console.log("Mock: Updating medication status", { id, status })
      revalidatePath("/dashboard")
      revalidatePath("/dashboard/medications")
      return { success: true }
    }

    await sql`
      UPDATE medications 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${user.id}
    `

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/medications")
    return { success: true }
  } catch (error) {
    console.error("Error updating medication status:", error)
    throw new Error("Failed to update medication status")
  }
}

export async function deleteMedication(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    if (!sql) {
      console.log("Mock: Deleting medication", { id })
      revalidatePath("/dashboard")
      revalidatePath("/dashboard/medications")
      return { success: true }
    }

    await sql`
      DELETE FROM medications 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/medications")
    return { success: true }
  } catch (error) {
    console.error("Error deleting medication:", error)
    throw new Error("Failed to delete medication")
  }
}

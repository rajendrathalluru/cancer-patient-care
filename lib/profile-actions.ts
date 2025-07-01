"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

const updateProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
  allergies: z.string().optional(),
  medicalHistory: z.string().optional(),
})

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const validatedData = updateProfileSchema.parse(data)

    await sql`
      UPDATE users 
      SET 
        name = ${validatedData.name},
        email = ${validatedData.email},
        phone = ${validatedData.phone || null},
        emergency_contact = ${validatedData.emergencyContact || null},
        allergies = ${validatedData.allergies || null},
        medical_history = ${validatedData.medicalHistory || null},
        updated_at = NOW()
      WHERE id = ${user.id}
    `

    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    throw new Error("Failed to update profile")
  }
}

export async function updateTreatmentProgress(completed: number, total: number) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    await sql`
      UPDATE users 
      SET 
        treatment_completed = ${completed},
        treatment_total = ${total},
        updated_at = NOW()
      WHERE id = ${user.id}
    `

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/treatment")
    return { success: true }
  } catch (error) {
    console.error("Error updating treatment progress:", error)
    throw new Error("Failed to update treatment progress")
  }
}

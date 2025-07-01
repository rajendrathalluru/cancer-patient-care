"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

const addCareTeamMemberSchema = z.object({
  name: z.string().min(2),
  role: z.string().min(1),
  contact: z.string().optional(),
})

export async function getCareTeam(userId: string) {
  try {
    const careTeam = await sql`
      SELECT id, name, role, contact
      FROM care_team 
      WHERE user_id = ${userId}
      ORDER BY created_at ASC
    `

    return careTeam
  } catch (error) {
    console.error("Error fetching care team:", error)
    return []
  }
}

export async function addCareTeamMember(data: z.infer<typeof addCareTeamMemberSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const validatedData = addCareTeamMemberSchema.parse(data)

    const newMembers = await sql`
      INSERT INTO care_team (user_id, name, role, contact)
      VALUES (${user.id}, ${validatedData.name}, ${validatedData.role}, ${validatedData.contact || null})
      RETURNING *
    `

    revalidatePath("/dashboard/profile")
    return newMembers[0]
  } catch (error) {
    console.error("Error adding care team member:", error)
    throw new Error("Failed to add care team member")
  }
}

export async function deleteCareTeamMember(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    await sql`
      DELETE FROM care_team 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error) {
    console.error("Error deleting care team member:", error)
    throw new Error("Failed to delete care team member")
  }
}

"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

const addAppointmentSchema = z.object({
  doctorName: z.string().min(2),
  type: z.string().min(1),
  date: z.string(),
  isVirtual: z.boolean(),
  location: z.string().optional(),
})

export async function addAppointment(data: z.infer<typeof addAppointmentSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const validatedData = addAppointmentSchema.parse(data)

    const newAppointments = await sql`
      INSERT INTO appointments (user_id, doctor_name, type, date, is_virtual, location, status)
      VALUES (
        ${user.id}, 
        ${validatedData.doctorName}, 
        ${validatedData.type}, 
        ${validatedData.date}, 
        ${validatedData.isVirtual}, 
        ${validatedData.location || null},
        'scheduled'
      )
      RETURNING *
    `

    const appointment = newAppointments[0]

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/appointments")

    return {
      id: appointment.id,
      userId: appointment.user_id,
      doctorName: appointment.doctor_name,
      type: appointment.type,
      date: appointment.date,
      isVirtual: appointment.is_virtual,
      location: appointment.location,
      status: appointment.status,
      createdAt: appointment.created_at,
    }
  } catch (error) {
    console.error("Error adding appointment:", error)
    throw new Error("Failed to add appointment")
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    await sql`
      UPDATE appointments 
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${user.id}
    `

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/appointments")
    return { success: true }
  } catch (error) {
    console.error("Error updating appointment status:", error)
    throw new Error("Failed to update appointment status")
  }
}

export async function deleteAppointment(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    await sql`
      DELETE FROM appointments 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/appointments")
    return { success: true }
  } catch (error) {
    console.error("Error deleting appointment:", error)
    throw new Error("Failed to delete appointment")
  }
}

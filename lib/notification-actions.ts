"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

const updateNotificationSettingsSchema = z.object({
  medicationReminders: z.boolean(),
  appointmentReminders: z.boolean(),
  symptomTracking: z.boolean(),
  treatmentUpdates: z.boolean(),
  resourceUpdates: z.boolean(),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  textNotifications: z.boolean(),
})

export async function getNotificationSettings(userId: string) {
  try {
    const settings = await sql`
      SELECT 
        medication_reminders,
        appointment_reminders,
        symptom_tracking,
        treatment_updates,
        resource_updates,
        email_notifications,
        push_notifications,
        text_notifications
      FROM notification_settings 
      WHERE user_id = ${userId}
    `

    if (settings.length === 0) {
      // Create default settings if none exist
      await sql`
        INSERT INTO notification_settings (user_id)
        VALUES (${userId})
      `

      return {
        medicationReminders: true,
        appointmentReminders: true,
        symptomTracking: true,
        treatmentUpdates: true,
        resourceUpdates: false,
        emailNotifications: true,
        pushNotifications: true,
        textNotifications: false,
      }
    }

    const setting = settings[0]
    return {
      medicationReminders: setting.medication_reminders,
      appointmentReminders: setting.appointment_reminders,
      symptomTracking: setting.symptom_tracking,
      treatmentUpdates: setting.treatment_updates,
      resourceUpdates: setting.resource_updates,
      emailNotifications: setting.email_notifications,
      pushNotifications: setting.push_notifications,
      textNotifications: setting.text_notifications,
    }
  } catch (error) {
    console.error("Error fetching notification settings:", error)
    return null
  }
}

export async function updateNotificationSettings(data: z.infer<typeof updateNotificationSettingsSchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const validatedData = updateNotificationSettingsSchema.parse(data)

    await sql`
      UPDATE notification_settings 
      SET 
        medication_reminders = ${validatedData.medicationReminders},
        appointment_reminders = ${validatedData.appointmentReminders},
        symptom_tracking = ${validatedData.symptomTracking},
        treatment_updates = ${validatedData.treatmentUpdates},
        resource_updates = ${validatedData.resourceUpdates},
        email_notifications = ${validatedData.emailNotifications},
        push_notifications = ${validatedData.pushNotifications},
        text_notifications = ${validatedData.textNotifications},
        updated_at = NOW()
      WHERE user_id = ${user.id}
    `

    revalidatePath("/dashboard/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating notification settings:", error)
    throw new Error("Failed to update notification settings")
  }
}

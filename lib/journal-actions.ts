"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sql } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

const addJournalEntrySchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
})

export async function addJournalEntry(data: z.infer<typeof addJournalEntrySchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const validatedData = addJournalEntrySchema.parse(data)

    const newEntries = await sql`
      INSERT INTO journal_entries (user_id, title, content, timestamp)
      VALUES (${user.id}, ${validatedData.title}, ${validatedData.content}, NOW())
      RETURNING *
    `

    const entry = newEntries[0]

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/journal")

    return {
      id: entry.id,
      userId: entry.user_id,
      title: entry.title,
      content: entry.content,
      timestamp: entry.timestamp,
    }
  } catch (error) {
    console.error("Error adding journal entry:", error)
    throw new Error("Failed to add journal entry")
  }
}

export async function updateJournalEntry(id: string, data: z.infer<typeof addJournalEntrySchema>) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    const validatedData = addJournalEntrySchema.parse(data)

    await sql`
      UPDATE journal_entries 
      SET title = ${validatedData.title}, content = ${validatedData.content}
      WHERE id = ${id} AND user_id = ${user.id}
    `

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/journal")
    return { success: true }
  } catch (error) {
    console.error("Error updating journal entry:", error)
    throw new Error("Failed to update journal entry")
  }
}

export async function deleteJournalEntry(id: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error("Unauthorized")
    }

    await sql`
      DELETE FROM journal_entries 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/journal")
    return { success: true }
  } catch (error) {
    console.error("Error deleting journal entry:", error)
    throw new Error("Failed to delete journal entry")
  }
}

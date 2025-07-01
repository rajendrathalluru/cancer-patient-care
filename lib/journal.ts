import { sql } from "@/lib/database"
import type { JournalEntry } from "@/lib/types"

// Mock data for development
const mockJournalEntries: JournalEntry[] = [
  {
    id: "1",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    title: "Today I felt stronger",
    content:
      "Was able to go for a short walk in the park. The fresh air felt amazing and I didn't feel as tired as usual. The new medication seems to be helping with the side effects.",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    title: "Post-treatment reflections",
    content:
      "The side effects were milder this time. Tried the new anti-nausea medication and it worked much better than the previous one. Feeling hopeful about the progress.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  try {
    if (!sql) {
      console.log("Using mock journal data")
      return mockJournalEntries.filter((entry) => entry.userId === userId)
    }

    const entries = await sql`
      SELECT 
        id,
        user_id,
        title,
        content,
        timestamp
      FROM journal_entries 
      WHERE user_id = ${userId}
      ORDER BY timestamp DESC
    `

    return entries.map((entry) => ({
      id: entry.id,
      userId: entry.user_id,
      title: entry.title,
      content: entry.content,
      timestamp: entry.timestamp,
    }))
  } catch (error) {
    console.error("Error fetching journal entries:", error)
    return mockJournalEntries.filter((entry) => entry.userId === userId)
  }
}

export async function getJournalEntryById(id: string, userId: string): Promise<JournalEntry | null> {
  try {
    if (!sql) {
      return mockJournalEntries.find((entry) => entry.id === id && entry.userId === userId) || null
    }

    const entries = await sql`
      SELECT 
        id,
        user_id,
        title,
        content,
        timestamp
      FROM journal_entries 
      WHERE id = ${id} AND user_id = ${userId}
    `

    if (entries.length === 0) {
      return null
    }

    const entry = entries[0]
    return {
      id: entry.id,
      userId: entry.user_id,
      title: entry.title,
      content: entry.content,
      timestamp: entry.timestamp,
    }
  } catch (error) {
    console.error("Error fetching journal entry:", error)
    return mockJournalEntries.find((entry) => entry.id === id && entry.userId === userId) || null
  }
}

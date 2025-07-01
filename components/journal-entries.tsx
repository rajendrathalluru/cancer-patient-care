"use client"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import type { JournalEntry } from "@/lib/types"

interface JournalEntriesProps {
  entries: JournalEntry[]
  showAll?: boolean
}

export function JournalEntries({ entries, showAll = false }: JournalEntriesProps) {
  const router = useRouter()
  const displayEntries = showAll ? entries : entries.slice(0, 2)

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="text-sm font-medium">No journal entries yet</div>
        <p className="mt-1 text-sm text-muted-foreground">Start recording your thoughts and experiences</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 bg-transparent"
          onClick={() => router.push("/dashboard/journal")}
        >
          Create First Entry
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {displayEntries.map((entry) => (
        <div key={entry.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{entry.title}</div>
            <div className="text-xs text-muted-foreground">{format(new Date(entry.timestamp), "MMM d")}</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{entry.content}</p>
        </div>
      ))}

      {!showAll && entries.length > 2 && (
        <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => router.push("/dashboard/journal")}>
          View All Entries
        </Button>
      )}
    </div>
  )
}

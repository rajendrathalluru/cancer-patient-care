import { redirect } from "next/navigation"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { getJournalEntries } from "@/lib/journal"
import { DashboardShell } from "@/components/dashboard-shell"
import { JournalEntries } from "@/components/journal-entries"
import { AddJournalEntryDialog } from "@/components/add-journal-entry-dialog"

export default async function JournalPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const journalEntries = await getJournalEntries(user.id)

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
          <p className="text-muted-foreground mt-1">Record your thoughts and experiences throughout your journey</p>
        </div>
        <AddJournalEntryDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </AddJournalEntryDialog>
      </div>

      <div className="mt-6">
        <JournalEntries entries={journalEntries} showAll />
      </div>
    </DashboardShell>
  )
}

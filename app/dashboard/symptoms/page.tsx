import { redirect } from "next/navigation"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { getSymptoms } from "@/lib/symptoms"
import { DashboardShell } from "@/components/dashboard-shell"
import { SymptomTracker } from "@/components/symptom-tracker"
import { AddSymptomDialog } from "@/components/add-symptom-dialog"
import { SymptomChart } from "@/components/symptom-chart"

export default async function SymptomsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const symptoms = await getSymptoms(user.id)

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Symptoms</h1>
          <p className="text-muted-foreground mt-1">Track and monitor your symptoms over time</p>
        </div>
        <AddSymptomDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Log Symptom
          </Button>
        </AddSymptomDialog>
      </div>

      <div className="mt-6 grid gap-6">
        <SymptomChart symptoms={symptoms} />
        <SymptomTracker symptoms={symptoms} showAll />
      </div>
    </DashboardShell>
  )
}

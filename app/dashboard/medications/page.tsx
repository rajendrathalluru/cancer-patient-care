import { redirect } from "next/navigation"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { getMedications } from "@/lib/medications"
import { DashboardShell } from "@/components/dashboard-shell"
import { MedicationList } from "@/components/medication-list"
import { AddMedicationDialog } from "@/components/add-medication-dialog"

export default async function MedicationsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const medications = await getMedications(user.id)

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
          <p className="text-muted-foreground mt-1">Manage and track your medication schedule</p>
        </div>
        <AddMedicationDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </AddMedicationDialog>
      </div>

      <div className="mt-6">
        <MedicationList medications={medications} showAll />
      </div>
    </DashboardShell>
  )
}

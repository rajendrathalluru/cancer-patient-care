import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard-shell"
import { TreatmentProgress } from "@/components/treatment-progress"
import { TreatmentPlan } from "@/components/treatment-plan"
import { TreatmentNotes } from "@/components/treatment-notes"

export default async function TreatmentPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Treatment Plan</h1>
        <p className="text-muted-foreground mt-1">Track your treatment progress and plan</p>
      </div>

      <div className="mt-6 grid gap-6">
        <TreatmentProgress user={user} />
        <div className="grid gap-6 md:grid-cols-2">
          <TreatmentPlan user={user} />
          <TreatmentNotes user={user} />
        </div>
      </div>
    </DashboardShell>
  )
}

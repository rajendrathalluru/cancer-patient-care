import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard-shell"
import { ResourcesList } from "@/components/resources-list"
import { ResourceCategories } from "@/components/resource-categories"

export default async function ResourcesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
        <p className="text-muted-foreground mt-1">Helpful information and support for your cancer journey</p>
      </div>

      <div className="mt-6 grid gap-6">
        <ResourceCategories />
        <ResourcesList showAll />
      </div>
    </DashboardShell>
  )
}

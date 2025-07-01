import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileForm } from "@/components/profile-form"
import { CareTeamSettings } from "@/components/care-team-settings"
import { NotificationSettings } from "@/components/notification-settings"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <DashboardShell>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="mt-6 grid gap-6">
        <ProfileForm user={user} />
        <div className="grid gap-6 md:grid-cols-2">
          <CareTeamSettings user={user} />
          <NotificationSettings user={user} />
        </div>
      </div>
    </DashboardShell>
  )
}

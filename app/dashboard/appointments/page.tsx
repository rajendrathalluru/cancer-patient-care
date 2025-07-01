import { redirect } from "next/navigation"
import { CalendarPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"
import { getAppointments } from "@/lib/appointments"
import { DashboardShell } from "@/components/dashboard-shell"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { AddAppointmentDialog } from "@/components/add-appointment-dialog"
import { AppointmentCalendar } from "@/components/appointment-calendar"

export default async function AppointmentsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const appointments = await getAppointments(user.id)

  return (
    <DashboardShell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <p className="text-muted-foreground mt-1">Schedule and manage your medical appointments</p>
        </div>
        <AddAppointmentDialog>
          <Button>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        </AddAppointmentDialog>
      </div>

      <div className="mt-6 grid gap-6">
        <AppointmentCalendar appointments={appointments} />
        <UpcomingAppointments appointments={appointments} showAll />
      </div>
    </DashboardShell>
  )
}

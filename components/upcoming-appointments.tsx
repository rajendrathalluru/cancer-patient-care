"use client"
import { CalendarPlus, MapPin, Phone, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AddAppointmentDialog } from "@/components/add-appointment-dialog"
import type { Appointment } from "@/lib/types"

interface UpcomingAppointmentsProps {
  appointments: Appointment[]
  showAll?: boolean
}

export function UpcomingAppointments({ appointments = [], showAll = false }: UpcomingAppointmentsProps) {
  const sortedAppointments = [...appointments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const displayAppointments = showAll ? sortedAppointments : sortedAppointments.slice(0, 3)

  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Schedule and manage your medical appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayAppointments.length > 0 ? (
            displayAppointments.map((appointment) => (
              <div key={appointment.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="grid gap-1">
                    <div className="font-medium">{appointment.doctorName}</div>
                    <div className="text-sm text-muted-foreground">{appointment.type}</div>
                  </div>
                  <div className="flex h-8 items-center rounded-full bg-primary/10 px-3 text-sm font-medium text-primary">
                    {new Date(appointment.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                  {appointment.isVirtual ? (
                    <div className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      Virtual Appointment
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {appointment.location || "Location TBD"}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Contact
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Reschedule
                  </Button>
                  {appointment.isVirtual ? (
                    <Button size="sm" className="w-full">
                      Join Call
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full">
                      Confirm
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="text-sm font-medium">No appointments scheduled</div>
              <p className="mt-1 text-sm text-muted-foreground">Schedule your first appointment</p>
              <AddAppointmentDialog>
                <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Schedule Appointment
                </Button>
              </AddAppointmentDialog>
            </div>
          )}
        </div>
      </CardContent>
      {!showAll && (
        <CardFooter>
          <AddAppointmentDialog>
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <CalendarPlus className="h-4 w-4" />
              Schedule New Appointment
            </Button>
          </AddAppointmentDialog>
        </CardFooter>
      )}
    </Card>
  )
}

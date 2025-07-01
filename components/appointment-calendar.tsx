"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Appointment } from "@/lib/types"

interface AppointmentCalendarProps {
  appointments: Appointment[]
}

export function AppointmentCalendar({ appointments }: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  // Get all days to display in the calendar (including previous/next month days)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return isSameDay(appointmentDate, day)
    })
  }

  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Appointment Calendar</CardTitle>
            <CardDescription>View and manage your scheduled appointments</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <div className="text-lg font-semibold min-w-[140px] text-center">{format(currentMonth, "MMMM yyyy")}</div>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 bg-transparent">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground mb-2">
          {weekdays.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day) => {
            const dayAppointments = getAppointmentsForDay(day)
            const isToday = isSameDay(day, new Date())
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isPastDay = day < new Date() && !isToday

            return (
              <div
                key={day.toString()}
                className={`
                  min-h-[80px] flex flex-col items-start justify-start p-1 rounded-md border transition-colors
                  ${isCurrentMonth ? "bg-card border-border" : "bg-muted/40 text-muted-foreground border-transparent"}
                  ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}
                  ${isPastDay ? "opacity-60" : ""}
                  ${dayAppointments.length > 0 && isCurrentMonth ? "bg-primary/5" : ""}
                `}
              >
                <div className={`text-sm font-medium ${isToday ? "text-primary" : ""}`}>{format(day, "d")}</div>

                {/* Appointments for this day */}
                {dayAppointments.length > 0 && (
                  <div className="mt-1 w-full space-y-1">
                    {dayAppointments.slice(0, 2).map((appointment) => (
                      <div
                        key={appointment.id}
                        className={`
                          text-[10px] truncate rounded px-1 py-0.5 text-left
                          ${
                            appointment.isVirtual
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          }
                        `}
                        title={`${format(new Date(appointment.date), "h:mm a")} - ${appointment.type} with ${appointment.doctorName}`}
                      >
                        <div className="font-medium">{format(new Date(appointment.date), "h:mm a")}</div>
                        <div className="truncate">{appointment.type}</div>
                      </div>
                    ))}

                    {/* Show count if more than 2 appointments */}
                    {dayAppointments.length > 2 && (
                      <div className="text-[10px] text-muted-foreground text-center py-0.5">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30"></div>
            <span>In-person</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-blue-100 dark:bg-blue-900/30"></div>
            <span>Virtual</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded ring-2 ring-primary"></div>
            <span>Today</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

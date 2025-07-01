import { sql } from "@/lib/database"
import type { Appointment } from "@/lib/types"

// Mock data for development
const mockAppointments: Appointment[] = [
  {
    id: "1",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    doctorName: "Dr. Johnson",
    type: "Follow-up Consultation",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    isVirtual: false,
    location: "Memorial Cancer Center",
    status: "scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    doctorName: "Dr. Martinez",
    type: "Nutrition Consultation",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isVirtual: true,
    location: null,
    status: "scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    doctorName: "Infusion Center",
    type: "Chemotherapy Session 14",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    isVirtual: false,
    location: "Memorial Cancer Center - Infusion Unit",
    status: "scheduled",
    createdAt: new Date().toISOString(),
  },
]

export async function getAppointments(userId: string): Promise<Appointment[]> {
  try {
    if (!sql) {
      console.log("Using mock appointment data")
      return mockAppointments.filter((appointment) => appointment.userId === userId)
    }

    const appointments = await sql`
      SELECT 
        id,
        user_id,
        doctor_name,
        type,
        date,
        is_virtual,
        location,
        status,
        created_at
      FROM appointments 
      WHERE user_id = ${userId}
      ORDER BY date ASC
    `

    return appointments.map((appointment) => ({
      id: appointment.id,
      userId: appointment.user_id,
      doctorName: appointment.doctor_name,
      type: appointment.type,
      date: appointment.date,
      isVirtual: appointment.is_virtual,
      location: appointment.location,
      status: appointment.status,
      createdAt: appointment.created_at,
    }))
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return mockAppointments.filter((appointment) => appointment.userId === userId)
  }
}

export async function getAppointmentById(id: string, userId: string): Promise<Appointment | null> {
  try {
    if (!sql) {
      return mockAppointments.find((appointment) => appointment.id === id && appointment.userId === userId) || null
    }

    const appointments = await sql`
      SELECT 
        id,
        user_id,
        doctor_name,
        type,
        date,
        is_virtual,
        location,
        status,
        created_at
      FROM appointments 
      WHERE id = ${id} AND user_id = ${userId}
    `

    if (appointments.length === 0) {
      return null
    }

    const appointment = appointments[0]
    return {
      id: appointment.id,
      userId: appointment.user_id,
      doctorName: appointment.doctor_name,
      type: appointment.type,
      date: appointment.date,
      isVirtual: appointment.is_virtual,
      location: appointment.location,
      status: appointment.status,
      createdAt: appointment.created_at,
    }
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return mockAppointments.find((appointment) => appointment.id === id && appointment.userId === userId) || null
  }
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  emergencyContact?: string
  allergies?: string
  medicalHistory?: string
  diagnosis?: string
  treatmentType?: string
  treatmentProgress?: {
    completed: number
    total: number
  }
  createdAt: string
}

export interface Medication {
  id: string
  userId: string
  name: string
  dosage: string
  frequency: string
  time: string
  status: "taken" | "pending" | "missed"
  createdAt: string
}

export interface Symptom {
  id: string
  userId: string
  name: string
  severity: "mild" | "moderate" | "severe"
  notes: string
  timestamp: string
}

export interface Appointment {
  id: string
  userId: string
  doctorName: string
  type: string
  date: string
  isVirtual: boolean
  location?: string
  status?: string
  createdAt: string
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  timestamp: string
}

export interface CareTeamMember {
  id: string
  userId: string
  name: string
  role: string
  contact?: string
  createdAt: string
}

export interface NotificationSettings {
  medicationReminders: boolean
  appointmentReminders: boolean
  symptomTracking: boolean
  treatmentUpdates: boolean
  resourceUpdates: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  textNotifications: boolean
}

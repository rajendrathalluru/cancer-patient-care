import { redirect } from "next/navigation"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCurrentUser } from "@/lib/auth"
import { getMedications } from "@/lib/medications"
import { getSymptoms } from "@/lib/symptoms"
import { getAppointments } from "@/lib/appointments"
import { getJournalEntries } from "@/lib/journal"
import { DashboardShell } from "@/components/dashboard-shell"
import { MedicationList } from "@/components/medication-list"
import { SymptomTracker } from "@/components/symptom-tracker"
import { UpcomingAppointments } from "@/components/upcoming-appointments"
import { JournalEntries } from "@/components/journal-entries"
import { ResourcesList } from "@/components/resources-list"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const medications = await getMedications(user.id)
  const symptoms = await getSymptoms(user.id)
  const appointments = await getAppointments(user.id)
  const journalEntries = await getJournalEntries(user.id)

  // Calculate medication adherence
  const takenMeds = medications.filter((med) => med.status === "taken").length
  const totalMeds = medications.length
  const adherencePercentage = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 100

  // Calculate treatment progress
  const completedSessions = user.treatmentProgress?.completed || 0
  const totalSessions = user.treatmentProgress?.total || 0
  const progressPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

  // Get next appointment
  const nextAppointment =
    appointments.length > 0
      ? appointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
      : null

  // Determine current symptom severity
  const recentSymptoms = symptoms.slice(0, 5)
  const severityLevels = {
    mild: 1,
    moderate: 2,
    severe: 3,
  }

  let overallSeverity = "None"
  if (recentSymptoms.length > 0) {
    const avgSeverity =
      recentSymptoms.reduce((sum, symptom) => sum + severityLevels[symptom.severity], 0) / recentSymptoms.length
    overallSeverity = avgSeverity <= 1 ? "Mild" : avgSeverity <= 2 ? "Moderate" : "Severe"
  }

  return (
    <DashboardShell>
      <div className="grid gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground mt-1">Here's your health summary for today.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white dark:bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Treatment Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressPercentage}%</div>
              <Progress value={progressPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedSessions} of {totalSessions} {user.treatmentType || "treatment"} sessions completed
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              {nextAppointment ? (
                <>
                  <div className="text-2xl font-bold">
                    {new Date(nextAppointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {nextAppointment.doctorName} - {nextAppointment.type}
                  </p>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">No upcoming appointments</div>
              )}
            </CardContent>
            {nextAppointment && (
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            )}
          </Card>

          <Card className="bg-white dark:bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Medication Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adherencePercentage}%</div>
              <Progress value={adherencePercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {takenMeds} of {totalMeds} doses taken on time
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Symptom Severity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallSeverity}</div>
              <p className="text-xs text-muted-foreground">Based on your recent symptom logs</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                Log Symptoms
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="medications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>
          <TabsContent value="medications" className="border-none p-0 pt-4">
            <MedicationList medications={medications} />
          </TabsContent>
          <TabsContent value="symptoms" className="border-none p-0 pt-4">
            <SymptomTracker symptoms={symptoms} />
          </TabsContent>
          <TabsContent value="appointments" className="border-none p-0 pt-4">
            <UpcomingAppointments appointments={appointments} />
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Journal</CardTitle>
              <CardDescription>Record your thoughts and experiences</CardDescription>
            </CardHeader>
            <CardContent>
              <JournalEntries entries={journalEntries.slice(0, 2)} />
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Entry
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-white dark:bg-background">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Helpful information and support</CardDescription>
            </CardHeader>
            <CardContent>
              <ResourcesList />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent">
                View All Resources
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

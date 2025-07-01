import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/types"

interface TreatmentNotesProps {
  user: User
}

export function TreatmentNotes({ user }: TreatmentNotesProps) {
  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <CardTitle>Treatment Notes</CardTitle>
        <CardDescription>Notes from your healthcare team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">Dr. Johnson - Oncology</div>
            <div className="text-xs text-muted-foreground">June 25, 2025</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Patient is responding well to treatment. Blood counts are within normal range. Continue with current
            medication regimen. Next chemotherapy session scheduled for July 3.
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">Dr. Martinez - Nutrition</div>
            <div className="text-xs text-muted-foreground">June 20, 2025</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Patient reports improved appetite. Recommended increasing protein intake and staying well-hydrated. Provided
            resources for managing taste changes. Follow-up in 3 weeks.
          </p>
        </div>

        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">Sarah Wilson - Nurse Navigator</div>
            <div className="text-xs text-muted-foreground">June 15, 2025</div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Discussed side effect management strategies. Patient reports mild fatigue but is managing daily activities.
            Encouraged participation in support group. Provided resources for transportation assistance.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

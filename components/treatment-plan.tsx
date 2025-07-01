import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { User } from "@/lib/types"

interface TreatmentPlanProps {
  user: User
}

export function TreatmentPlan({ user }: TreatmentPlanProps) {
  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <CardTitle>Treatment Plan</CardTitle>
        <CardDescription>Your personalized cancer treatment plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Diagnosis</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {user.diagnosis || "Breast Cancer, Stage 2, ER+/PR+, HER2-"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Treatment Type</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {user.treatmentType || "Chemotherapy followed by surgery and radiation"}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium">Treatment Schedule</h3>
          <ul className="text-sm text-muted-foreground mt-1 space-y-2">
            <li className="flex items-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
              <span>Chemotherapy: 4 cycles of AC, followed by 12 cycles of Taxol</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
              <span>Surgery: Lumpectomy with sentinel lymph node biopsy</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
              <span>Radiation: 4 weeks of daily treatments</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
              <span>Hormone Therapy: Tamoxifen for 5-10 years</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium">Care Team</h3>
          <ul className="text-sm text-muted-foreground mt-1 space-y-2">
            <li className="flex items-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
              <span>Dr. Johnson - Medical Oncologist (Primary)</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
              <span>Dr. Smith - Surgical Oncologist</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
              <span>Dr. Martinez - Radiation Oncologist</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></span>
              <span>Sarah Wilson - Oncology Nurse Navigator</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

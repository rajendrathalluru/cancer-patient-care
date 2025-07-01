"use client"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { User } from "@/lib/types"

interface TreatmentProgressProps {
  user: User
}

export function TreatmentProgress({ user }: TreatmentProgressProps) {
  const completedSessions = user.treatmentProgress?.completed || 0
  const totalSessions = user.treatmentProgress?.total || 0
  const progressPercentage = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

  // Generate sessions array for visualization
  const sessions = Array.from({ length: totalSessions }, (_, i) => ({
    number: i + 1,
    completed: i < completedSessions,
    current: i === completedSessions,
    date: new Date(Date.now() + (i - completedSessions) * 7 * 24 * 60 * 60 * 1000),
  }))

  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <CardTitle>Treatment Progress</CardTitle>
        <CardDescription>Track your {user.treatmentType || "treatment"} progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium">Overall Progress</div>
              <div className="text-sm font-medium">{progressPercentage}%</div>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="mt-1 text-xs text-muted-foreground">
              {completedSessions} of {totalSessions} sessions completed
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-4">Treatment Timeline</div>
            <div className="flex flex-wrap gap-2">
              {sessions.map((session) => (
                <div key={session.number} className="flex flex-col items-center">
                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full border-2
                      ${
                        session.completed
                          ? "border-primary bg-primary text-primary-foreground"
                          : session.current
                            ? "border-primary text-primary"
                            : "border-muted-foreground/20 text-muted-foreground"
                      }
                    `}
                  >
                    {session.completed ? <CheckCircle2 className="h-5 w-5" /> : <span>{session.number}</span>}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {session.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" className="bg-transparent">
              View Treatment Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

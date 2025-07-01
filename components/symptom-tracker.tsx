"use client"
import { BarChart, Calendar, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddSymptomDialog } from "@/components/add-symptom-dialog"
import type { Symptom } from "@/lib/types"

interface SymptomTrackerProps {
  symptoms?: Symptom[]
  showAll?: boolean
}

export function SymptomTracker({ symptoms = [], showAll = false }: SymptomTrackerProps) {
  // Safely handle the slice operation
  const displaySymptoms = showAll ? symptoms : (symptoms || []).slice(0, 3)

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-700"
      case "moderate":
        return "bg-amber-100 text-amber-700"
      case "severe":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const SymptomList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <AddSymptomDialog>
          <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent">
            <PlusCircle className="h-3.5 w-3.5" />
            Log Symptom
          </Button>
        </AddSymptomDialog>
      </div>

      {displaySymptoms.length > 0 ? (
        <div className="grid gap-3">
          {displaySymptoms.map((symptom) => (
            <div key={symptom.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{symptom.name}</div>
                <div
                  className={`flex h-6 items-center gap-1 rounded-full px-2 text-xs font-medium ${getSeverityClass(symptom.severity)}`}
                >
                  {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{symptom.notes}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                Logged at{" "}
                {new Date(symptom.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="text-sm font-medium">No symptoms logged yet</div>
          <p className="mt-1 text-sm text-muted-foreground">Log your symptoms to track your health</p>
          <AddSymptomDialog>
            <Button variant="outline" size="sm" className="mt-4 bg-transparent">
              <PlusCircle className="mr-2 h-4 w-4" />
              Log First Symptom
            </Button>
          </AddSymptomDialog>
        </div>
      )}
    </div>
  )

  const SymptomChart = () => (
    <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <BarChart className="h-10 w-10 text-muted-foreground" />
        <div className="font-medium">Symptom Trends</div>
        <div className="text-sm text-muted-foreground">
          View your symptom severity trends over time to identify patterns
        </div>
        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
          Generate Chart
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader className={showAll ? "flex flex-row items-center justify-between" : ""}>
        <div>
          <CardTitle>Symptom Tracker</CardTitle>
          <CardDescription>Monitor and record your symptoms</CardDescription>
        </div>
        {showAll && (
          <Tabs defaultValue="list" className="w-[180px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </CardHeader>
      <CardContent>
        {showAll ? (
          <Tabs defaultValue="list">
            <TabsList className="grid w-[180px] grid-cols-2 mb-4">
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="mt-0">
              <SymptomList />
            </TabsContent>
            <TabsContent value="chart" className="mt-0">
              <SymptomChart />
            </TabsContent>
          </Tabs>
        ) : (
          <SymptomList />
        )}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <div className="flex w-full items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Tip:</span> Track symptoms at the same time each day for
            consistent monitoring
          </div>
          <Button variant="outline" size="sm" className="bg-transparent">
            View History
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

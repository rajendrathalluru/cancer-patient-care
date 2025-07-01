"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AddMedicationDialog } from "@/components/add-medication-dialog"
import { updateMedicationStatus } from "@/lib/medication-actions"
import { useToast } from "@/hooks/use-toast"
import type { Medication } from "@/lib/types"

interface MedicationListProps {
  medications?: Medication[]
  showAll?: boolean
}

export function MedicationList({ medications = [], showAll = false }: MedicationListProps) {
  const { toast } = useToast()
  const [localMedications, setLocalMedications] = useState(medications)

  const handleStatusUpdate = async (id: string, status: "taken" | "missed" | "pending") => {
    try {
      await updateMedicationStatus(id, status)

      setLocalMedications((prev) => prev.map((med) => (med.id === id ? { ...med, status } : med)))

      toast({
        title: "Status updated",
        description: `Medication marked as ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update medication status",
        variant: "destructive",
      })
    }
  }

  // Safely handle the slice operation
  const displayMedications = showAll ? localMedications : (localMedications || []).slice(0, 4)

  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <CardTitle>Medication Schedule</CardTitle>
        <CardDescription>Track your medication schedule and adherence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayMedications.length > 0 ? (
            <div className="grid gap-4">
              {displayMedications.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="grid gap-1">
                    <div className="font-medium">{medication.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {medication.dosage} - {medication.frequency}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {medication.status === "taken" ? (
                      <div className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        <Check className="mr-1 h-3 w-3" />
                        Taken
                      </div>
                    ) : medication.status === "pending" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 gap-1 text-xs bg-transparent"
                        onClick={() => handleStatusUpdate(medication.id, "taken")}
                      >
                        <Check className="h-3 w-3" />
                        Mark as Taken
                      </Button>
                    ) : (
                      <div className="flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        <X className="mr-1 h-3 w-3" />
                        Missed
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">{medication.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <div className="text-sm font-medium">No medications added yet</div>
              <p className="mt-1 text-sm text-muted-foreground">Add your medications to track your schedule</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <AddMedicationDialog>
          <Button className="w-full">Add Medication</Button>
        </AddMedicationDialog>
      </CardFooter>
    </Card>
  )
}

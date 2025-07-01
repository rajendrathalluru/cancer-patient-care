"use client"

import type React from "react"
import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addMedication } from "@/lib/medication-actions"
import { useToast } from "@/hooks/use-toast"

export function AddMedicationDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    if (!formData.dosage) {
      newErrors.dosage = "Dosage is required"
    }
    if (!formData.frequency) {
      newErrors.frequency = "Frequency is required"
    }
    if (!formData.time) {
      newErrors.time = "Time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    startTransition(async () => {
      try {
        await addMedication(formData)
        toast({
          title: "Medication added",
          description: "Your medication has been added successfully.",
        })
        setFormData({ name: "", dosage: "", frequency: "", time: "" })
        setErrors({})
        setOpen(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add medication. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
          <DialogDescription>Add a new medication to your schedule</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              placeholder="e.g., Tamoxifen"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              placeholder="e.g., 20mg"
              value={formData.dosage}
              onChange={(e) => handleInputChange("dosage", e.target.value)}
              className={errors.dosage ? "border-red-500" : ""}
            />
            {errors.dosage && <p className="text-sm text-red-500">{errors.dosage}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select onValueChange={(value) => handleInputChange("frequency", value)} value={formData.frequency}>
              <SelectTrigger className={errors.frequency ? "border-red-500" : ""}>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Once daily">Once daily</SelectItem>
                <SelectItem value="Twice daily">Twice daily</SelectItem>
                <SelectItem value="Three times daily">Three times daily</SelectItem>
                <SelectItem value="Every other day">Every other day</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="As needed">As needed</SelectItem>
              </SelectContent>
            </Select>
            {errors.frequency && <p className="text-sm text-red-500">{errors.frequency}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              className={errors.time ? "border-red-500" : ""}
            />
            {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Medication"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

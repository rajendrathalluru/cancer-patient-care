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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addSymptom } from "@/lib/symptom-actions"
import { useToast } from "@/hooks/use-toast"

export function AddSymptomDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    name: "",
    severity: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }
    if (!formData.severity) {
      newErrors.severity = "Severity is required"
    }
    if (!formData.notes) {
      newErrors.notes = "Notes are required"
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
        await addSymptom(formData)
        toast({
          title: "Symptom logged",
          description: "Your symptom has been logged successfully.",
        })
        setFormData({ name: "", severity: "", notes: "" })
        setErrors({})
        setOpen(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to log symptom. Please try again.",
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
          <DialogTitle>Log Symptom</DialogTitle>
          <DialogDescription>Record a new symptom to track your health</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Symptom Name</Label>
            <Input
              id="name"
              placeholder="e.g., Fatigue, Nausea, Pain"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select onValueChange={(value) => handleInputChange("severity", value)} value={formData.severity}>
              <SelectTrigger className={errors.severity ? "border-red-500" : ""}>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="severe">Severe</SelectItem>
              </SelectContent>
            </Select>
            {errors.severity && <p className="text-sm text-red-500">{errors.severity}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Describe your symptom in detail..."
              className={`min-h-[100px] ${errors.notes ? "border-red-500" : ""}`}
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
            {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging..." : "Log Symptom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

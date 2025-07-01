"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addAppointment } from "@/lib/appointment-actions"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  doctorName: z.string().min(2, { message: "Doctor name must be at least 2 characters" }),
  type: z.string().min(1, { message: "Appointment type is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  isVirtual: z.boolean().default(false),
  location: z.string().optional(),
})

export function AddAppointmentDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctorName: "",
      type: "",
      date: "",
      time: "",
      isVirtual: false,
      location: "",
    },
  })

  const isVirtual = form.watch("isVirtual")

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        // Combine date and time
        const dateTime = new Date(`${values.date}T${values.time}`)

        await addAppointment({
          ...values,
          date: dateTime.toISOString(),
        })

        toast({
          title: "Appointment scheduled",
          description: "Your appointment has been scheduled successfully.",
        })
        form.reset()
        setOpen(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to schedule appointment. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
          <DialogDescription>Add a new appointment to your calendar</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="doctorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor/Provider Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Johnson" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Follow-up Consultation">Follow-up Consultation</SelectItem>
                      <SelectItem value="Chemotherapy Session">Chemotherapy Session</SelectItem>
                      <SelectItem value="Radiation Therapy">Radiation Therapy</SelectItem>
                      <SelectItem value="Imaging/Scan">Imaging/Scan</SelectItem>
                      <SelectItem value="Blood Work">Blood Work</SelectItem>
                      <SelectItem value="Nutrition Consultation">Nutrition Consultation</SelectItem>
                      <SelectItem value="Therapy Session">Therapy Session</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isVirtual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Virtual Appointment</FormLabel>
                    <FormDescription>This is a telehealth appointment conducted online</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {!isVirtual && (
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Memorial Cancer Center" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

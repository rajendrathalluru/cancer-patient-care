"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getNotificationSettings, updateNotificationSettings } from "@/lib/notification-actions"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

interface NotificationSettingsProps {
  user: User
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    medicationReminders: true,
    appointmentReminders: true,
    symptomTracking: true,
    treatmentUpdates: true,
    resourceUpdates: false,
    emailNotifications: true,
    pushNotifications: true,
    textNotifications: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [user.id])

  const loadSettings = async () => {
    try {
      const userSettings = await getNotificationSettings(user.id)
      if (userSettings) {
        setSettings(userSettings)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = (setting: string) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof typeof settings],
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateNotificationSettings(settings)
      toast({
        title: "Success",
        description: "Notification settings updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-background">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Manage how and when you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Notification Types</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="medication-reminders" className="flex flex-col">
                <span>Medication Reminders</span>
                <span className="text-xs text-muted-foreground">
                  Get reminded when it's time to take your medication
                </span>
              </Label>
              <Switch
                id="medication-reminders"
                checked={settings.medicationReminders}
                onCheckedChange={() => handleToggle("medicationReminders")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="appointment-reminders" className="flex flex-col">
                <span>Appointment Reminders</span>
                <span className="text-xs text-muted-foreground">Get notified about upcoming appointments</span>
              </Label>
              <Switch
                id="appointment-reminders"
                checked={settings.appointmentReminders}
                onCheckedChange={() => handleToggle("appointmentReminders")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="symptom-tracking" className="flex flex-col">
                <span>Symptom Tracking</span>
                <span className="text-xs text-muted-foreground">Daily reminders to log your symptoms</span>
              </Label>
              <Switch
                id="symptom-tracking"
                checked={settings.symptomTracking}
                onCheckedChange={() => handleToggle("symptomTracking")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="treatment-updates" className="flex flex-col">
                <span>Treatment Updates</span>
                <span className="text-xs text-muted-foreground">Updates about your treatment plan</span>
              </Label>
              <Switch
                id="treatment-updates"
                checked={settings.treatmentUpdates}
                onCheckedChange={() => handleToggle("treatmentUpdates")}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium">Delivery Methods</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col">
                <span>Email Notifications</span>
                <span className="text-xs text-muted-foreground">Receive notifications via email</span>
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col">
                <span>Push Notifications</span>
                <span className="text-xs text-muted-foreground">Receive browser push notifications</span>
              </Label>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle("pushNotifications")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="text-notifications" className="flex flex-col">
                <span>Text Messages</span>
                <span className="text-xs text-muted-foreground">Receive notifications via SMS</span>
              </Label>
              <Switch
                id="text-notifications"
                checked={settings.textNotifications}
                onCheckedChange={() => handleToggle("textNotifications")}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} disabled={isSaving} className="w-full">
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

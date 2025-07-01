"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCareTeam, addCareTeamMember, deleteCareTeamMember } from "@/lib/care-team-actions"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@/lib/types"

interface CareTeamSettingsProps {
  user: User
}

export function CareTeamSettings({ user }: CareTeamSettingsProps) {
  const { toast } = useToast()
  const [careTeam, setCareTeam] = useState<any[]>([])
  const [newMember, setNewMember] = useState({ name: "", role: "", contact: "" })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCareTeam()
  }, [user.id])

  const loadCareTeam = async () => {
    try {
      const team = await getCareTeam(user.id)
      setCareTeam(team)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load care team",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) return

    try {
      const member = await addCareTeamMember(newMember)
      setCareTeam([...careTeam, member])
      setNewMember({ name: "", role: "", contact: "" })
      toast({
        title: "Success",
        description: "Care team member added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add care team member",
        variant: "destructive",
      })
    }
  }

  const handleRemoveMember = async (id: string) => {
    try {
      await deleteCareTeamMember(id)
      setCareTeam(careTeam.filter((member) => member.id !== id))
      toast({
        title: "Success",
        description: "Care team member removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove care team member",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-background">
        <CardHeader>
          <CardTitle>Care Team</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-white dark:bg-background">
      <CardHeader>
        <CardTitle>Care Team</CardTitle>
        <CardDescription>Manage your healthcare providers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {careTeam.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-muted-foreground">{member.role}</div>
                {member.contact && <div className="text-xs text-muted-foreground mt-1">{member.contact}</div>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveMember(member.id)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <div className="text-sm font-medium">Add Team Member</div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Provider name"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  placeholder="Specialty/Role"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contact">Contact (optional)</Label>
              <Input
                id="contact"
                value={newMember.contact}
                onChange={(e) => setNewMember({ ...newMember, contact: e.target.value })}
                placeholder="Phone or email"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full gap-1 bg-transparent"
          onClick={handleAddMember}
          disabled={!newMember.name || !newMember.role}
        >
          <PlusCircle className="h-4 w-4" />
          Add Team Member
        </Button>
      </CardFooter>
    </Card>
  )
}

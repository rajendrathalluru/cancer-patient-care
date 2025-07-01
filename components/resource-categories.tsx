"use client"

import { useRouter } from "next/navigation"
import { BookOpen, HeartPulse, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ResourceCategories() {
  const router = useRouter()

  const categories = [
    {
      id: "education",
      title: "Educational Resources",
      description: "Learn about cancer types, treatments, and research",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      id: "wellness",
      title: "Wellness & Self-Care",
      description: "Resources for physical and emotional wellbeing",
      icon: HeartPulse,
      color: "text-green-500",
    },
    {
      id: "support",
      title: "Support Networks",
      description: "Connect with others on similar journeys",
      icon: Users,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id} className="bg-white dark:bg-background">
          <CardHeader className="pb-2">
            <category.icon className={`h-8 w-8 ${category.color}`} />
            <CardTitle className="mt-2">{category.title}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => router.push(`/dashboard/resources?category=${category.id}`)}
            >
              Browse Resources
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

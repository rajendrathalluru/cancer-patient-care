import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface ResourcesListProps {
  showAll?: boolean
}

export function ResourcesList({ showAll = false }: ResourcesListProps) {
  const resources = [
    {
      id: "1",
      title: "Understanding Your Treatment",
      description: "A comprehensive guide to chemotherapy and radiation therapy.",
      url: "#",
      category: "Education",
    },
    {
      id: "2",
      title: "Nutrition During Treatment",
      description: "Tips for maintaining proper nutrition during cancer treatment.",
      url: "#",
      category: "Wellness",
    },
    {
      id: "3",
      title: "Local Support Groups",
      description: "Connect with others who understand what you're going through.",
      url: "#",
      category: "Support",
    },
    {
      id: "4",
      title: "Managing Treatment Side Effects",
      description: "Strategies for coping with common side effects of cancer treatment.",
      url: "#",
      category: "Education",
    },
    {
      id: "5",
      title: "Financial Assistance Programs",
      description: "Resources for financial support during your cancer journey.",
      url: "#",
      category: "Support",
    },
    {
      id: "6",
      title: "Mindfulness and Meditation",
      description: "Techniques to reduce stress and improve mental wellbeing.",
      url: "#",
      category: "Wellness",
    },
  ]

  const displayResources = showAll ? resources : resources.slice(0, 3)

  return (
    <div className="grid gap-2">
      {displayResources.map((resource) => (
        <Link
          key={resource.id}
          href={resource.url}
          className="rounded-lg border p-3 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{resource.title}</div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
          <div className="mt-2 text-xs inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary">
            {resource.category}
          </div>
        </Link>
      ))}
    </div>
  )
}

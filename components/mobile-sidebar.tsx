"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  FileText,
  Heart,
  LayoutDashboard,
  Menu,
  PenLine,
  PieChart,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function MobileSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/appointments",
      icon: CalendarDays,
      label: "Appointments",
      active: pathname === "/dashboard/appointments",
    },
    {
      href: "/dashboard/medications",
      icon: Heart,
      label: "Medications",
      active: pathname === "/dashboard/medications",
    },
    {
      href: "/dashboard/symptoms",
      icon: PieChart,
      label: "Symptoms",
      active: pathname === "/dashboard/symptoms",
    },
    {
      href: "/dashboard/journal",
      icon: PenLine,
      label: "Journal",
      active: pathname === "/dashboard/journal",
    },
    {
      href: "/dashboard/treatment",
      icon: Stethoscope,
      label: "Treatment",
      active: pathname === "/dashboard/treatment",
    },
    {
      href: "/dashboard/resources",
      icon: FileText,
      label: "Resources",
      active: pathname === "/dashboard/resources",
    },
    {
      href: "/dashboard/support",
      icon: Users,
      label: "Support",
      active: pathname === "/dashboard/support",
    },
    {
      href: "/dashboard/profile",
      icon: Settings,
      label: "Settings",
      active: pathname === "/dashboard/profile",
    },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden bg-transparent">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[280px]">
        <div className="flex items-center gap-2 font-semibold mb-6 mt-4">
          <Heart className="h-5 w-5 text-primary" />
          <span className="text-primary">CareCompanion</span>
        </div>
        <nav className="grid gap-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary",
                route.active ? "bg-primary/10 text-primary" : "text-muted-foreground",
              )}
            >
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  FileText,
  Heart,
  LayoutDashboard,
  PenLine,
  PieChart,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"

export function DashboardSidebar() {
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
    <aside className="hidden w-[250px] flex-col border-r bg-background px-4 py-6 md:flex">
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
    </aside>
  )
}

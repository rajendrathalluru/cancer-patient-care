import Link from "next/link"
import { Bell, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 lg:px-8">
      <MobileSidebar />
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <Heart className="h-5 w-5 text-primary" />
        <span className="text-primary">CareCompanion</span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
              <span className="sr-only">Toggle notification menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Medication reminder: Take Tamoxifen at 8:00 PM</DropdownMenuItem>
            <DropdownMenuItem>Dr. Johnson added a note to your last visit</DropdownMenuItem>
            <DropdownMenuItem>Appointment reminder: July 3rd at 10:00 AM</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  )
}

import Link from "next/link"
import { redirect } from "next/navigation"
import { Heart } from "lucide-react"

import { getCurrentUser } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

export default async function LoginPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">CareCompanion</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">Support for your cancer treatment journey</p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow-sm sm:rounded-lg sm:px-10">
            <LoginForm />
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-2 text-muted-foreground">New to CareCompanion?</span>
                </div>
              </div>
              <div className="mt-6 text-center text-sm">
                <Link href="/register" className="font-medium text-primary hover:text-primary/80">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

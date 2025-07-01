import Link from "next/link"
import { redirect } from "next/navigation"
import { Heart } from "lucide-react"

import { getCurrentUser } from "@/lib/auth"
import { RegisterForm } from "@/components/register-form"

export default async function RegisterPage() {
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
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Create your account</h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join CareCompanion to manage your cancer treatment journey
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow-sm sm:rounded-lg sm:px-10">
            <RegisterForm />
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

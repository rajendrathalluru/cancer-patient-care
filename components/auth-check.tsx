"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthCheckProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthCheck({ children, requireAuth = false }: AuthCheckProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user")
        const isAuth = response.ok
        setIsAuthenticated(isAuth)

        if (requireAuth && !isAuth) {
          router.push("/login")
        } else if (
          !requireAuth &&
          isAuth &&
          (window.location.pathname === "/login" || window.location.pathname === "/register")
        ) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        if (requireAuth) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requireAuth])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const { pathname } = request.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Protect API routes
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  // Redirect to dashboard if already logged in
  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/medications/:path*",
    "/api/symptoms/:path*",
    "/api/appointments/:path*",
    "/api/journal/:path*",
    "/api/user/:path*",
    "/login",
    "/register",
  ],
}

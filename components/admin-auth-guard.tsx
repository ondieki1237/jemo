"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setIsLoading(false)
      return
    }

    // Check if user is authenticated
    const authToken = localStorage.getItem("adminAuth")
    
    if (authToken === "true") {
      setIsAuthenticated(true)
      setIsLoading(false)
    } else {
      router.push("/admin/login")
    }
  }, [pathname, router])

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

export function useAuth() {
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminEmail")
    router.push("/admin/login")
  }

  const isAuthenticated = () => {
    return localStorage.getItem("adminAuth") === "true"
  }

  const getAdminEmail = () => {
    return localStorage.getItem("adminEmail") || ""
  }

  return { logout, isAuthenticated, getAdminEmail }
}

"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { useAuth } from "@/components/admin-auth-guard"
import { LogOut, User } from "lucide-react"

interface AdminLayoutWrapperProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AdminLayoutWrapper({ children, title, description }: AdminLayoutWrapperProps) {
  const { logout, getAdminEmail } = useAuth()
  const adminEmail = getAdminEmail()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1">
        {(title || description) && (
          <header className="bg-card border-b border-border sticky top-0 z-20">
            <div className="px-6 py-6 flex items-center justify-between">
              <div>
                {title && <h1 className="font-serif text-3xl font-bold">{title}</h1>}
                {description && <p className="text-foreground/60 mt-1">{description}</p>}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-foreground/70">
                  <User className="w-4 h-4" />
                  <span>{adminEmail}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </header>
        )}
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

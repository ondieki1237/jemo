"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles,
  BookOpen,
  Calendar,
  ChevronRight,
  Home,
  Search
} from "lucide-react"
import { useAuth } from "./admin-auth-guard"
import { cn } from "@/lib/utils"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Set sidebar open by default on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Requests", href: "/admin/requests" },
    { icon: DollarSign, label: "Invoices", href: "/admin/invoices" },
    { icon: Sparkles, label: "Services", href: "/admin/services" },
    { icon: Users, label: "Clients", href: "/admin/clients" },
    { icon: BookOpen, label: "Blog Posts", href: "/admin/blog" },
    { icon: Calendar, label: "Events", href: "/admin/events" },
    { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // Get current page title
  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => isActive(item.href))
    return currentItem?.label || "Admin"
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-40 h-screen w-72 lg:w-64",
          "bg-gradient-to-b from-primary via-primary to-blue-800",
          "text-primary-foreground shadow-2xl",
          "transition-transform duration-300 ease-out",
          "flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="font-serif text-lg font-bold text-white">B</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-primary" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold block">Boom Admin</span>
              <span className="text-xs text-white/60">Management Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    "group relative overflow-hidden",
                    active
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {/* Active indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-r-full" />
                  )}

                  <item.icon className={cn(
                    "w-5 h-5 transition-transform shrink-0",
                    active ? "text-yellow-400" : "group-hover:scale-110"
                  )} />

                  <span className="font-medium flex-1 truncate">{item.label}</span>

                  <ChevronRight className={cn(
                    "w-4 h-4 opacity-0 -translate-x-2 transition-all shrink-0",
                    "group-hover:opacity-100 group-hover:translate-x-0",
                    active && "opacity-100 translate-x-0"
                  )} />
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-white/10 space-y-1">
          {/* View Website Link */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">View Website</span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:gap-4 min-w-0">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors shrink-0"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div className="min-w-0">
                <h1 className="text-lg lg:text-xl font-bold text-gray-900 truncate">
                  {getCurrentPageTitle()}
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  Boom Audio Visuals Admin
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-3 shrink-0">
              {/* Search button - hidden on mobile */}
              <button className="hidden sm:flex p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Search className="w-5 h-5 text-gray-500" />
              </button>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* User avatar */}
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminShell

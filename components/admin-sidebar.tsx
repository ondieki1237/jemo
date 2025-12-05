"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
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
  Sparkles,
  BookOpen,
  Calendar,
  ChevronRight,
  Home
} from "lucide-react"
import { useAuth } from "@/components/admin-auth-guard"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin", badge: null },
    { icon: FileText, label: "Requests", href: "/admin/requests", badge: null },
    { icon: DollarSign, label: "Invoices", href: "/admin/invoices", badge: null },
    { icon: Sparkles, label: "Services", href: "/admin/services", badge: null },
    { icon: Users, label: "Clients", href: "/admin/clients", badge: null },
    { icon: BookOpen, label: "Blog Posts", href: "/admin/blog", badge: null },
    { icon: Calendar, label: "Events", href: "/admin/events", badge: null },
    { icon: TrendingUp, label: "Analytics", href: "/admin/analytics", badge: null },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-primary to-blue-700 text-primary-foreground shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all active:scale-95"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <span className="font-serif text-sm font-bold text-white">B</span>
            </div>
            <span className="font-serif text-lg font-bold">Boom Admin</span>
          </Link>

          <Link href="/" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </div>

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
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <span className="font-serif text-lg font-bold text-white">B</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-primary" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold block">Boom Admin</span>
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
                    "w-5 h-5 transition-transform",
                    active ? "text-yellow-400" : "group-hover:scale-110"
                  )} />

                  <span className="font-medium flex-1">{item.label}</span>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-yellow-400 text-primary rounded-full">
                      {item.badge}
                    </span>
                  )}

                  <ChevronRight className={cn(
                    "w-4 h-4 opacity-0 -translate-x-2 transition-all",
                    "group-hover:opacity-100 group-hover:translate-x-0",
                    active && "opacity-100 translate-x-0"
                  )} />
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10 space-y-2">
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
    </>
  )
}

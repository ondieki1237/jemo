"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, DollarSign, Users, TrendingUp, Settings, LogOut, Menu, X, Sparkles, BookOpen, Calendar } from "lucide-react"
import { useAuth } from "@/components/admin-auth-guard"

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { logout } = useAuth()

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Requests & Quotes", href: "/admin/requests" },
    { icon: DollarSign, label: "Invoices & Payments", href: "/admin/invoices" },
    { icon: Sparkles, label: "Services", href: "/admin/services" },
    { icon: Users, label: "Clients", href: "/admin/clients" },
    { icon: BookOpen, label: "Blog Posts", href: "/admin/blog" },
    { icon: Calendar, label: "Events", href: "/admin/events" },
    { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-primary-foreground rounded-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-primary-foreground/10">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent/20 rounded-sm flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-accent">B</span>
            </div>
            <span className="font-serif text-xl font-bold">Boom Admin</span>
          </Link>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-primary-foreground/20" : "hover:bg-primary-foreground/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary-foreground/10">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}

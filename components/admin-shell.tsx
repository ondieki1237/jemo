"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, FileText, DollarSign, Users, TrendingUp, Settings, LogOut, Menu, X, FileCheck } from "lucide-react"
import { useAuth } from "./admin-auth-guard"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { logout } = useAuth()

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Requests", href: "/admin/requests" },
    { icon: FileCheck, label: "Quotations", href: "/admin/quotes" },
    { icon: DollarSign, label: "Invoices & Payments", href: "/admin/invoices" },
    { icon: Users, label: "Clients", href: "/admin/clients" },
    { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-primary text-primary-foreground transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-primary-foreground/10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent/20 rounded-sm flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-accent">B</span>
            </div>
            <span className="font-serif text-xl font-bold">Boom Admin</span>
          </div>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
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

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-secondary/50 rounded"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="font-serif text-2xl font-bold">Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-secondary/50 rounded">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-8">{children}</main>
      </div>
    </div>
  )
}

export default AdminShell

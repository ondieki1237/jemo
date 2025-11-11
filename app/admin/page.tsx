"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart3, FileText, DollarSign, Users, TrendingUp, Settings, LogOut, Menu, X } from "lucide-react"

interface DashboardStats {
  totalRequests: number
  totalQuotes: number
  totalInvoicesPaid: number
  activeTicketSales: number
  monthlyRevenue: number
  conversionRate: number
}

const mockStats: DashboardStats = {
  totalRequests: 48,
  totalQuotes: 42,
  totalInvoicesPaid: 38,
  activeTicketSales: 2150,
  monthlyRevenue: 5420000,
  conversionRate: 87.5,
}

const recentRequests = [
  { id: "R-001", client: "Jane Smith", services: "Event Planning, Sound", date: "2025-01-18", status: "pending" },
  { id: "R-002", client: "Tech Corp", services: "LED Screens", date: "2025-01-17", status: "quoted" },
  { id: "R-003", client: "Wedding Co", services: "Full Package", date: "2025-01-16", status: "approved" },
  { id: "R-004", client: "Music Festival", services: "Sound, Lighting", date: "2025-01-15", status: "invoiced" },
]

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Requests & Quotes", href: "/admin/requests" },
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
          <button className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg hover:bg-primary-foreground/10 transition-colors">
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
              <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
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

        {/* Content */}
        <main className="p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-card border border-border p-6 rounded-lg">
              <p className="text-sm text-foreground/60 mb-2">Total Requests</p>
              <p className="text-3xl font-bold text-accent">{mockStats.totalRequests}</p>
              <p className="text-xs text-foreground/50 mt-2">This month</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-lg">
              <p className="text-sm text-foreground/60 mb-2">Quotes Issued</p>
              <p className="text-3xl font-bold text-accent">{mockStats.totalQuotes}</p>
              <p className="text-xs text-foreground/50 mt-2">{mockStats.conversionRate}% conversion</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-lg">
              <p className="text-sm text-foreground/60 mb-2">Invoices Paid</p>
              <p className="text-3xl font-bold text-accent">{mockStats.totalInvoicesPaid}</p>
              <p className="text-xs text-foreground/50 mt-2">This month</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-lg">
              <p className="text-sm text-foreground/60 mb-2">Tickets Sold</p>
              <p className="text-3xl font-bold text-accent">{mockStats.activeTicketSales.toLocaleString()}</p>
              <p className="text-xs text-foreground/50 mt-2">Active events</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-lg md:col-span-2 lg:col-span-1">
              <p className="text-sm text-foreground/60 mb-2">Monthly Revenue</p>
              <p className="text-2xl font-bold text-accent">KES {(mockStats.monthlyRevenue / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-foreground/50 mt-2">+12% vs last month</p>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl font-bold">Recent Service Requests</h2>
                <Link href="/admin/requests" className="text-accent text-sm font-semibold hover:text-accent/80">
                  View All
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/5 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">
                      Request ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Services</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => {
                    const statusColors = {
                      pending: "bg-yellow-100 text-yellow-800",
                      quoted: "bg-blue-100 text-blue-800",
                      approved: "bg-green-100 text-green-800",
                      invoiced: "bg-purple-100 text-purple-800",
                    }
                    return (
                      <tr key={request.id} className="border-b border-border hover:bg-secondary/5 transition-colors">
                        <td className="px-6 py-4 font-semibold text-accent">{request.id}</td>
                        <td className="px-6 py-4 text-foreground">{request.client}</td>
                        <td className="px-6 py-4 text-sm text-foreground/70">{request.services}</td>
                        <td className="px-6 py-4 text-sm text-foreground/70">{request.date}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[request.status as keyof typeof statusColors]}`}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/requests/${request.id}`}
                            className="text-accent hover:text-accent/80 text-sm font-semibold"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/requests/new"
              className="bg-accent text-accent-foreground p-6 rounded-lg hover:bg-accent/90 transition-colors"
            >
              <h3 className="font-serif text-lg font-bold mb-2">Create New Quote</h3>
              <p className="text-sm opacity-90">Generate a quotation for a service request</p>
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-secondary text-secondary-foreground p-6 rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <h3 className="font-serif text-lg font-bold mb-2">View Analytics</h3>
              <p className="text-sm opacity-90">Track business metrics and performance</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}

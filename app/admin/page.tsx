"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, FileText, DollarSign, Users, TrendingUp, Settings, LogOut, Menu, X } from "lucide-react"
import { useAuth } from "@/components/admin-auth-guard"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'

interface DashboardStats {
  totalRequests: number
  totalQuotes: number
  totalInvoicesPaid: number
  activeTicketSales: number
  monthlyRevenue: number
  conversionRate: number
}

interface Request {
  _id: string
  firstName: string
  lastName: string
  selectedServices: string[]
  createdAt: string
  status: string
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalRequests: 0,
    totalQuotes: 0,
    totalInvoicesPaid: 0,
    activeTicketSales: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  })
  const [recentRequests, setRecentRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch requests
      const requestsRes = await fetch("/api/requests")
      const requestsData = await requestsRes.json()
      const requests = requestsData.requests || []

      // Fetch quotations
      const quotesRes = await fetch("/api/quotations")
      const quotesData = await quotesRes.json()
      const quotes = quotesData.quotations || []

      // Fetch invoices
      const invoicesRes = await fetch("/api/invoices")
      const invoicesData = await invoicesRes.json()
      const invoices = invoicesData.invoices || []

      // Calculate stats
      const paidInvoices = invoices.filter((inv: any) => inv.paymentStatus === "paid")
      const totalRevenue = paidInvoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)

      setStats({
        totalRequests: requests.length,
        totalQuotes: quotes.length,
        totalInvoicesPaid: paidInvoices.length,
        activeTicketSales: 0,
        monthlyRevenue: totalRevenue,
        conversionRate: requests.length > 0 ? (quotes.length / requests.length) * 100 : 0,
      })

      // Get recent requests (last 5)
      setRecentRequests(requests.slice(0, 5))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Requests & Quotes", href: "/admin/requests" },
    { icon: DollarSign, label: "Invoices & Payments", href: "/admin/invoices" },
    { icon: Users, label: "Clients", href: "/admin/clients" },
    { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Total Requests</p>
                <p className="text-3xl font-bold text-accent">{stats.totalRequests}</p>
                <p className="text-xs text-foreground/50 mt-2">All time</p>
              </div>
              <BarChart3 className="w-8 h-8 text-foreground/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Quotes Issued</p>
                <p className="text-3xl font-bold text-accent">{stats.totalQuotes}</p>
                <p className="text-xs text-foreground/50 mt-2">{stats.conversionRate.toFixed(1)}% conversion</p>
              </div>
              <FileText className="w-8 h-8 text-foreground/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Invoices Paid</p>
                <p className="text-3xl font-bold text-accent">{stats.totalInvoicesPaid}</p>
                <p className="text-xs text-foreground/50 mt-2">Completed</p>
              </div>
              <DollarSign className="w-8 h-8 text-foreground/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Tickets Sold</p>
                <p className="text-3xl font-bold text-accent">{stats.activeTicketSales.toLocaleString()}</p>
                <p className="text-xs text-foreground/50 mt-2">Coming soon</p>
              </div>
              <Users className="w-8 h-8 text-foreground/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="p-4 md:col-span-2 lg:col-span-1">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Total Revenue</p>
                <p className="text-2xl font-bold text-accent">KES {(stats.monthlyRevenue / 1000).toFixed(0)}K</p>
                <p className="text-xs text-foreground/50 mt-2">From paid invoices</p>
              </div>
              <TrendingUp className="w-8 h-8 text-foreground/40" />
            </div>
          </CardContent>
        </Card>
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Services</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-foreground/60 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">Loading requests...</td>
                </tr>
              ) : recentRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">No requests yet</td>
                </tr>
              ) : (
                recentRequests.map((request) => {
                  const statusColors = {
                    pending: "bg-yellow-100 text-yellow-800",
                    quoted: "bg-blue-100 text-blue-800",
                    approved: "bg-green-100 text-green-800",
                    invoiced: "bg-purple-100 text-purple-800",
                  }
                  return (
                    <tr key={request._id} className="border-b border-border hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-accent">{request._id.slice(-8)}</td>
                      <td className="px-6 py-4 text-foreground">{request.firstName} {request.lastName}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{request.selectedServices.slice(0, 2).join(", ")}{request.selectedServices.length > 2 && ` +${request.selectedServices.length - 2}`}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{new Date(request.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[request.status as keyof typeof statusColors] || statusColors.pending}`}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span></td>
                      <td className="px-6 py-4"><Link href={`/admin/requests`} className="text-accent hover:text-accent/80 text-sm font-semibold">View</Link></td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/requests/new" className="bg-accent text-accent-foreground p-6 rounded-lg hover:bg-accent/90 transition-colors">
          <h3 className="font-serif text-lg font-bold mb-2">Create New Quote</h3>
          <p className="text-sm opacity-90">Generate a quotation for a service request</p>
        </Link>

        <Link href="/admin/analytics" className="bg-secondary text-secondary-foreground p-6 rounded-lg hover:bg-secondary/80 transition-colors">
          <h3 className="font-serif text-lg font-bold mb-2">View Analytics</h3>
          <p className="text-sm opacity-90">Track business metrics and performance</p>
        </Link>
      </div>
    </div>
  )
}

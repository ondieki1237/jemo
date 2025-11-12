"use client"

import { useState, useEffect } from "react"
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper"
import { TrendingUp, TrendingDown, DollarSign, FileText, Users, Calendar } from "lucide-react"

interface AnalyticsData {
  totalRequests: number
  totalQuotations: number
  totalInvoices: number
  totalRevenue: number
  pendingRevenue: number
  conversionRate: number
  averageQuoteValue: number
  requestsByMonth: { month: string; count: number }[]
  revenueByMonth: { month: string; amount: number }[]
  topServices: { service: string; count: number }[]
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalRequests: 0,
    totalQuotations: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    conversionRate: 0,
    averageQuoteValue: 0,
    requestsByMonth: [],
    revenueByMonth: [],
    topServices: [],
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("all")

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch all data
      const [requestsRes, quotationsRes, invoicesRes] = await Promise.all([
        fetch("/api/requests"),
        fetch("/api/quotations"),
        fetch("/api/invoices"),
      ])

      const requests = (await requestsRes.json()).requests || []
      const quotations = (await quotationsRes.json()).quotations || []
      const invoices = (await invoicesRes.json()).invoices || []

      // Calculate metrics
      const paidInvoices = invoices.filter((inv: any) => inv.paymentStatus === "paid")
      const pendingInvoices = invoices.filter((inv: any) => inv.paymentStatus === "pending")
      
      const totalRevenue = paidInvoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)
      const pendingRevenue = pendingInvoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0)
      
      const conversionRate = requests.length > 0 ? (quotations.length / requests.length) * 100 : 0
      const averageQuoteValue = quotations.length > 0
        ? quotations.reduce((sum: number, q: any) => sum + (q.total || 0), 0) / quotations.length
        : 0

      // Top services
      const servicesCounts: { [key: string]: number } = {}
      requests.forEach((req: any) => {
        req.selectedServices?.forEach((service: string) => {
          servicesCounts[service] = (servicesCounts[service] || 0) + 1
        })
      })
      
      const topServices = Object.entries(servicesCounts)
        .map(([service, count]) => ({ service, count: count as number }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Requests by month (last 6 months)
      const requestsByMonth = getLastSixMonths().map((month) => ({
        month,
        count: requests.filter((r: any) => {
          const date = new Date(r.createdAt)
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` === month
        }).length,
      }))

      // Revenue by month
      const revenueByMonth = getLastSixMonths().map((month) => ({
        month,
        amount: paidInvoices
          .filter((inv: any) => {
            const date = new Date(inv.createdAt)
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` === month
          })
          .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0),
      }))

      setData({
        totalRequests: requests.length,
        totalQuotations: quotations.length,
        totalInvoices: invoices.length,
        totalRevenue,
        pendingRevenue,
        conversionRate,
        averageQuoteValue,
        requestsByMonth,
        revenueByMonth,
        topServices,
      })
      
      setLoading(false)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setLoading(false)
    }
  }

  const getLastSixMonths = () => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`)
    }
    return months
  }

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-")
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <AdminLayoutWrapper title="Analytics" description="Business insights and performance metrics">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent"></div>
            <p className="mt-4 text-foreground/60">Loading analytics...</p>
          </div>
        </div>
      </AdminLayoutWrapper>
    )
  }

  return (
    <AdminLayoutWrapper title="Analytics" description="Business insights and performance metrics">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Time Range Filter */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {["all", "month", "quarter", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border hover:bg-secondary/5"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-foreground/60">Total Revenue</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">KES {(data.totalRevenue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-foreground/50 mt-2">+{data.pendingRevenue.toLocaleString()} pending</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-foreground/60">Conversion Rate</p>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-accent">{data.conversionRate.toFixed(1)}%</p>
            <p className="text-xs text-foreground/50 mt-2">Requests → Quotes</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-foreground/60">Avg Quote Value</p>
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">KES {(data.averageQuoteValue / 1000).toFixed(0)}K</p>
            <p className="text-xs text-foreground/50 mt-2">Per quotation</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-foreground/60">Total Requests</p>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{data.totalRequests}</p>
            <p className="text-xs text-foreground/50 mt-2">{data.totalQuotations} quoted</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requests Trend */}
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="font-serif text-xl font-bold mb-4">Service Requests Trend</h3>
            <div className="space-y-3">
              {data.requestsByMonth.map((item) => (
                <div key={item.month}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground/70">{formatMonth(item.month)}</span>
                    <span className="font-semibold">{item.count} requests</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div
                      className="bg-accent rounded-full h-2 transition-all duration-500"
                      style={{
                        width: `${Math.max((item.count / Math.max(...data.requestsByMonth.map((r) => r.count), 1)) * 100, 5)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="font-serif text-xl font-bold mb-4">Revenue Trend</h3>
            <div className="space-y-3">
              {data.revenueByMonth.map((item) => (
                <div key={item.month}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-foreground/70">{formatMonth(item.month)}</span>
                    <span className="font-semibold">KES {item.amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-secondary/20 rounded-full h-2">
                    <div
                      className="bg-green-600 rounded-full h-2 transition-all duration-500"
                      style={{
                        width: `${Math.max((item.amount / Math.max(...data.revenueByMonth.map((r) => r.amount), 1)) * 100, 5)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="font-serif text-xl font-bold mb-4">Top Requested Services</h3>
          <div className="space-y-3">
            {data.topServices.length > 0 ? (
              data.topServices.map((item, index) => (
                <div key={item.service} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{item.service}</span>
                      <span className="text-sm text-foreground/70">{item.count} requests</span>
                    </div>
                    <div className="w-full bg-secondary/20 rounded-full h-2">
                      <div
                        className="bg-accent rounded-full h-2"
                        style={{
                          width: `${(item.count / data.topServices[0].count) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-foreground/60 py-8">No service data yet</p>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-6 rounded-lg">
            <Calendar className="w-8 h-8 text-accent mb-2" />
            <p className="text-sm text-foreground/70 mb-1">Total Quotes Sent</p>
            <p className="text-2xl font-bold">{data.totalQuotations}</p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-6 rounded-lg">
            <FileText className="w-8 h-8 text-primary mb-2" />
            <p className="text-sm text-foreground/70 mb-1">Total Invoices</p>
            <p className="text-2xl font-bold">{data.totalInvoices}</p>
          </div>

          <div className="bg-gradient-to-br from-green-600/10 to-green-600/5 border border-green-600/20 p-6 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm text-foreground/70 mb-1">Pending Revenue</p>
            <p className="text-2xl font-bold">KES {(data.pendingRevenue / 1000).toFixed(0)}K</p>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  )
}

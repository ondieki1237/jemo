"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Download } from "lucide-react"
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper"

interface Invoice {
  _id: string
  quotationId: string
  amount: number
  dueDate?: string
  paymentStatus: string
  paymentMethod?: string
  createdAt: string
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices")
      const data = await res.json()
      setInvoices(data.invoices || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching invoices:", error)
      setLoading(false)
    }
  }

  const filtered = invoices.filter((inv) => {
    const matchesStatus = filterStatus === "all" || inv.paymentStatus === filterStatus
    const matchesSearch =
      inv._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.quotationId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  }

  const totalPending = invoices.filter((i) => i.paymentStatus === "pending").reduce((sum, i) => sum + i.amount, 0)
  const totalPaid = invoices.filter((i) => i.paymentStatus === "paid").reduce((sum, i) => sum + i.amount, 0)

  return (
    <AdminLayoutWrapper title="Invoices & Payments" description="Manage invoices and payment tracking">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Pending</p>
            <p className="text-3xl font-bold text-yellow-600">KES {totalPending.toLocaleString()}</p>
            <p className="text-xs text-foreground/50 mt-2">
              {invoices.filter((i) => i.paymentStatus === "pending").length} invoices
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Paid</p>
            <p className="text-3xl font-bold text-green-600">KES {totalPaid.toLocaleString()}</p>
            <p className="text-xs text-foreground/50 mt-2">
              {invoices.filter((i) => i.paymentStatus === "paid").length} invoices
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-accent">
              KES {(totalPending + totalPaid).toLocaleString()}
            </p>
            <p className="text-xs text-foreground/50 mt-2">All time</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by invoice or quotation ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-foreground/40" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-4 py-2 bg-background border border-border rounded text-foreground"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded hover:bg-secondary/5 transition-colors">
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Invoice ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Quotation ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                      Loading invoices...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filtered.map((invoice) => (
                    <tr key={invoice._id} className="border-b border-border hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-accent">{invoice._id.slice(-8)}</td>
                      <td className="px-6 py-4 text-sm font-mono">{invoice.quotationId.slice(-8)}</td>
                      <td className="px-6 py-4 font-bold">KES {invoice.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            statusColors[invoice.paymentStatus as keyof typeof statusColors] || statusColors.pending
                          }`}
                        >
                          {invoice.paymentStatus.charAt(0).toUpperCase() + invoice.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {invoice.paymentMethod ? (
                          <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">
                            {invoice.paymentMethod}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => alert(`Invoice details:\n${JSON.stringify(invoice, null, 2)}`)}
                          className="text-accent hover:text-accent/80 text-sm font-semibold"
                        >
                          View
                        </button>
                        {invoice.paymentStatus === "pending" && (
                          <>
                            <span className="text-foreground/30">•</span>
                            <button className="text-accent hover:text-accent/80 text-sm font-semibold">
                              Send Reminder
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  )
}

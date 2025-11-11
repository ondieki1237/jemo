"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Filter, Download } from "lucide-react"

interface Invoice {
  id: string
  quoteId: string
  clientName: string
  amount: number
  dueDate: string
  status: "pending" | "paid" | "overdue"
  createdAt: string
  paymentMethod?: "stripe" | "mpesa" | "none"
}

const mockInvoices: Invoice[] = [
  {
    id: "INV-001-2025",
    quoteId: "Q-001-2025",
    clientName: "Jane Smith",
    amount: 58000,
    dueDate: "2025-02-10",
    status: "pending",
    createdAt: "2025-01-10",
  },
  {
    id: "INV-002-2025",
    quoteId: "Q-002-2025",
    clientName: "Tech Africa Corp",
    amount: 87000,
    dueDate: "2025-02-12",
    status: "paid",
    createdAt: "2025-01-12",
    paymentMethod: "stripe",
  },
  {
    id: "INV-003-2025",
    quoteId: "Q-003-2025",
    clientName: "Wedding Celebrations",
    amount: 45000,
    dueDate: "2025-01-15",
    status: "overdue",
    createdAt: "2024-12-15",
  },
]

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = invoices.filter((inv) => {
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus
    const matchesSearch =
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
  }

  const totalPending = invoices.filter((i) => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Invoices & Payments</h1>
            <p className="text-foreground/60 mt-1">Manage invoices and payment tracking</p>
          </div>
          <Link
            href="/admin/invoices/new"
            className="px-6 py-3 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
          >
            New Invoice
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Pending</p>
            <p className="text-3xl font-bold text-yellow-600">KES {totalPending.toLocaleString()}</p>
            <p className="text-xs text-foreground/50 mt-2">
              {invoices.filter((i) => i.status === "pending").length} invoices
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Paid</p>
            <p className="text-3xl font-bold text-green-600">KES {totalPaid.toLocaleString()}</p>
            <p className="text-xs text-foreground/50 mt-2">
              {invoices.filter((i) => i.status === "paid").length} invoices
            </p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Overdue</p>
            <p className="text-3xl font-bold text-red-600">
              KES{" "}
              {invoices
                .filter((i) => i.status === "overdue")
                .reduce((sum, i) => sum + i.amount, 0)
                .toLocaleString()}
            </p>
            <p className="text-xs text-foreground/50 mt-2">
              {invoices.filter((i) => i.status === "overdue").length} invoices
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by name or invoice ID..."
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
                <option value="overdue">Overdue</option>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-accent">{invoice.id}</td>
                    <td className="px-6 py-4">{invoice.clientName}</td>
                    <td className="px-6 py-4 font-bold">KES {invoice.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[invoice.status]}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <Link
                        href={`/admin/invoices/${invoice.id}`}
                        className="text-accent hover:text-accent/80 text-sm font-semibold"
                      >
                        View
                      </Link>
                      {invoice.status === "pending" && (
                        <>
                          <span className="text-foreground/30">•</span>
                          <button className="text-accent hover:text-accent/80 text-sm font-semibold">
                            Send Reminder
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-foreground/60">No invoices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

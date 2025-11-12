"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Download } from "lucide-react"

interface Request {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  eventDate?: string
  selectedServices: string[]
  attendees?: number
  status: string
  createdAt: string
  budget?: string
}

export default function AdminRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests")
      const data = await res.json()
      setRequests(data.requests || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching requests:", error)
      setLoading(false)
    }
  }

  const filtered = requests.filter((req) => {
    const matchesStatus = filterStatus === "all" || req.status === filterStatus
    const fullName = `${req.firstName} ${req.lastName}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      req._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    quoted: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    invoiced: "bg-purple-100 text-purple-800",
    paid: "bg-emerald-100 text-emerald-800",
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Requests & Quotes</h1>
            <p className="text-foreground/60 mt-1">Manage service requests and quotations</p>
          </div>
          <Link
            href="/admin/requests/new"
            className="px-6 py-3 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
          >
            New Request
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by name or ID..."
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
                <option value="quoted">Quoted</option>
                <option value="approved">Approved</option>
                <option value="invoiced">Invoiced</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded hover:bg-secondary/5 transition-colors">
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Request ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Services</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Event Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Budget
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                      Loading requests...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                      No requests found
                    </td>
                  </tr>
                ) : (
                  filtered.map((request) => (
                    <tr key={request._id} className="border-b border-border hover:bg-secondary/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-accent">{request._id.slice(-8)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">
                            {request.firstName} {request.lastName}
                          </p>
                          <p className="text-sm text-foreground/60">{request.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {request.selectedServices.map((service: string, idx: number) => (
                            <span key={idx} className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">
                              {service}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {request.eventDate ? new Date(request.eventDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-accent">
                        {request.budget || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            statusColors[request.status as keyof typeof statusColors] || statusColors.pending
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => alert(`Request ID: ${request._id}\n\nFull details view coming soon!`)}
                          className="text-accent hover:text-accent/80 text-sm font-semibold"
                        >
                          View
                        </button>
                        {request.status === "pending" && (
                          <>
                            <span className="text-foreground/30">•</span>
                            <Link
                              href={`/admin/quotes/editor?requestId=${request._id}`}
                              className="text-accent hover:text-accent/80 text-sm font-semibold"
                            >
                              Create Quote
                            </Link>
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
    </div>
  )
}

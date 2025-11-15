"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Download } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'

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
        {/* Header + Actions as Card */}
        <Card className="flex items-center justify-between">
          <CardHeader>
            <div>
              <CardTitle className="font-serif text-2xl">Requests & Quotes</CardTitle>
              <CardDescription>Manage service requests and quotations</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/requests/new">
                <Button variant="default">New Request</Button>
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent>
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

              <div className="flex items-center justify-end">
                <Button variant="outline" asChild>
                  <button className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <tr className="bg-secondary/5 border-b border-border">
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Request ID</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Client</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Services</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Event Date</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Budget</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Status</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</TableHead>
                </tr>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                      Loading requests...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                      No requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((request) => (
                    <TableRow key={request._id} className="border-b border-border">
                      <TableCell className="px-6 py-4 font-semibold text-accent">{request._id.slice(-8)}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div>
                          <p className="font-medium">
                            {request.firstName} {request.lastName}
                          </p>
                          <p className="text-sm text-foreground/60">{request.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {request.selectedServices.map((service: string, idx: number) => (
                            <span key={idx} className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">
                              {service}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">{request.eventDate ? new Date(request.eventDate).toLocaleDateString() : "—"}</TableCell>
                      <TableCell className="px-6 py-4 font-semibold text-accent">{request.budget || "—"}</TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            statusColors[request.status as keyof typeof statusColors] || statusColors.pending
                          }`}
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => alert(`Request ID: ${request._id}\n\nFull details view coming soon!`)}>
                          View
                        </Button>
                        {request.status === "pending" && (
                          <>
                            <span className="text-foreground/30">•</span>
                            <Link href={`/admin/quotes/editor?requestId=${request._id}`}>
                              <Button variant="link" size="sm">Create Quote</Button>
                            </Link>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

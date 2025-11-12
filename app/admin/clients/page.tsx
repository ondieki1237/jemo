"use client"

import { useState, useEffect } from "react"
import { AdminLayoutWrapper } from "@/components/admin-layout-wrapper"
import { Search, Mail, Phone, Calendar, FileText } from "lucide-react"

interface Client {
  email: string
  firstName: string
  lastName: string
  phone: string
  company?: string
  totalRequests: number
  totalSpent: number
  lastRequestDate: string
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      // Fetch all requests
      const requestsRes = await fetch("/api/requests")
      const requestsData = await requestsRes.json()
      const requests = requestsData.requests || []

      // Fetch all invoices to calculate spending
      const invoicesRes = await fetch("/api/invoices")
      const invoicesData = await invoicesRes.json()
      const invoices = invoicesData.invoices || []

      // Group requests by email to get unique clients
      const clientsMap = new Map<string, Client>()

      requests.forEach((req: any) => {
        if (!req.email) return

        if (!clientsMap.has(req.email)) {
          clientsMap.set(req.email, {
            email: req.email,
            firstName: req.firstName || "",
            lastName: req.lastName || "",
            phone: req.phone || "",
            company: req.company,
            totalRequests: 0,
            totalSpent: 0,
            lastRequestDate: req.createdAt,
          })
        }

        const client = clientsMap.get(req.email)!
        client.totalRequests++
        
        // Update last request date if this is more recent
        if (new Date(req.createdAt) > new Date(client.lastRequestDate)) {
          client.lastRequestDate = req.createdAt
        }
      })

      // Calculate spending from paid invoices
      // Note: Would need to link invoices to requests via quotation to get client email
      // For now, we'll just show request count

      setClients(Array.from(clientsMap.values()).sort((a, b) => b.totalRequests - a.totalRequests))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching clients:", error)
      setLoading(false)
    }
  }

  const filtered = clients.filter((client) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.toLowerCase().includes(searchLower) ||
      client.company?.toLowerCase().includes(searchLower)
    )
  })

  return (
    <AdminLayoutWrapper title="Clients" description="Manage client relationships and history">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Total Clients</p>
            <p className="text-3xl font-bold text-accent">{clients.length}</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Active Clients</p>
            <p className="text-3xl font-bold text-green-600">
              {clients.filter((c) => {
                const daysSince = Math.floor(
                  (Date.now() - new Date(c.lastRequestDate).getTime()) / (1000 * 60 * 60 * 24)
                )
                return daysSince < 90
              }).length}
            </p>
            <p className="text-xs text-foreground/50 mt-1">Last 90 days</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Repeat Clients</p>
            <p className="text-3xl font-bold text-primary">
              {clients.filter((c) => c.totalRequests > 1).length}
            </p>
            <p className="text-xs text-foreground/50 mt-1">Multiple requests</p>
          </div>

          <div className="bg-card border border-border p-6 rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">Avg Requests</p>
            <p className="text-3xl font-bold text-purple-600">
              {clients.length > 0
                ? (clients.reduce((sum, c) => sum + c.totalRequests, 0) / clients.length).toFixed(1)
                : 0}
            </p>
            <p className="text-xs text-foreground/50 mt-1">Per client</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search clients by name, email, phone, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/5 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Requests
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">
                    Last Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">
                      Loading clients...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-foreground/60">
                      {searchTerm ? "No clients found matching your search" : "No clients yet"}
                    </td>
                  </tr>
                ) : (
                  filtered.map((client) => {
                    const daysSince = Math.floor(
                      (Date.now() - new Date(client.lastRequestDate).getTime()) / (1000 * 60 * 60 * 24)
                    )
                    const isActive = daysSince < 90

                    return (
                      <tr key={client.email} className="border-b border-border hover:bg-secondary/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">
                              {client.firstName.charAt(0)}
                              {client.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {client.firstName} {client.lastName}
                              </p>
                              {client.totalRequests > 1 && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                  Repeat Client
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-foreground/40" />
                              <a href={`mailto:${client.email}`} className="hover:text-accent">
                                {client.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-foreground/70">
                              <Phone className="w-4 h-4 text-foreground/40" />
                              <a href={`tel:${client.phone}`} className="hover:text-accent">
                                {client.phone}
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{client.company || "—"}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-accent" />
                            <span className="font-semibold">{client.totalRequests}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-foreground/40" />
                            <div>
                              <p className="text-sm">{new Date(client.lastRequestDate).toLocaleDateString()}</p>
                              <p className={`text-xs ${isActive ? "text-green-600" : "text-foreground/50"}`}>
                                {daysSince === 0 ? "Today" : `${daysSince} days ago`}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 space-x-2">
                          <button
                            onClick={() =>
                              alert(`Client: ${client.firstName} ${client.lastName}\nEmail: ${client.email}`)
                            }
                            className="text-accent hover:text-accent/80 text-sm font-semibold"
                          >
                            View History
                          </button>
                          <span className="text-foreground/30">•</span>
                          <a
                            href={`mailto:${client.email}`}
                            className="text-accent hover:text-accent/80 text-sm font-semibold"
                          >
                            Email
                          </a>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  )
}

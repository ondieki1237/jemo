"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Download, Eye, Plus, FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'

interface Quotation {
  _id: string
  requestId?: string
  clientName: string
  clientEmail: string
  eventDate?: string
  venue?: string
  lineItems: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
  subtotal: number
  tax: number
  discount: number
  total: number
  status: string
  notes?: string
  createdAt: string
}

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuotations()
  }, [])

  const fetchQuotations = async () => {
    try {
      const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
      const res = await fetch(`${BACKEND_URL}/api/quotations`)
      const data = await res.json()
      setQuotations(data.quotations || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching quotations:", error)
      setLoading(false)
    }
  }

  const handleDownloadPDF = (quotationId: string) => {
    const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
    window.open(`${BACKEND_URL}/api/quotations/${quotationId}/pdf`, '_blank')
  }

  const filtered = quotations.filter((quote) => {
    const matchesSearch =
      quote.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote._id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    sent: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-orange-100 text-orange-800",
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header + Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">Quotations</CardTitle>
              <CardDescription>Manage and download client quotations</CardDescription>
            </div>
            <Link href="/admin/quotes/editor">
              <Button variant="default" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Quotation
              </Button>
            </Link>
          </CardHeader>
        </Card>

        {/* Search */}
        <Card>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search by client name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quotations Table */}
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <tr className="bg-secondary/5 border-b border-border">
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Quote ID</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Client</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Event Date</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Venue</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Total</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Status</TableHead>
                  <TableHead className="px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase">Actions</TableHead>
                </tr>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                      Loading quotations...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-6 py-12 text-center text-foreground/60">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-foreground/20" />
                        <p>No quotations found</p>
                        <Link href="/admin/quotes/editor">
                          <Button variant="link" className="mt-2">Create your first quotation</Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((quote) => (
                    <TableRow key={quote._id} className="border-b border-border">
                      <TableCell className="px-6 py-4 font-semibold text-accent">{quote._id.slice(-8)}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div>
                          <p className="font-medium">{quote.clientName || "—"}</p>
                          <p className="text-sm text-foreground/60">{quote.clientEmail || "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {quote.eventDate ? new Date(quote.eventDate).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">{quote.venue || "—"}</TableCell>
                      <TableCell className="px-6 py-4 font-semibold text-accent">
                        KES {quote.total?.toLocaleString() || "0"}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            statusColors[quote.status as keyof typeof statusColors] || statusColors.draft
                          }`}
                        >
                          {quote.status?.charAt(0).toUpperCase() + quote.status?.slice(1) || "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownloadPDF(quote._id)}
                          className="flex items-center gap-1"
                        >
                          <Download className="w-4 h-4" />
                          PDF
                        </Button>
                        <span className="text-foreground/30">•</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => alert(`Quote ID: ${quote._id}\n\nDetailed view coming soon!`)}
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
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

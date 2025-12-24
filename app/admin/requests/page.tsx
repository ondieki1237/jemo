"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Download, X, FileText, Calendar, MapPin, Users, DollarSign, Phone, Mail, Building } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Request {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
  eventDate?: string
  eventTime?: string
  venue?: string
  city?: string
  selectedServices: string[]
  attendees?: number
  eventDescription?: string
  specialRequirements?: string
  status: string
  createdAt: string
  budget?: string
}

interface Quotation {
  _id: string
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

export default function AdminRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [requestQuotations, setRequestQuotations] = useState<Quotation[]>([])
  const [loadingQuotations, setLoadingQuotations] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
      const res = await fetch(`${BACKEND_URL}/api/requests`)
      const data = await res.json()
      setRequests(data.requests || [])
      setLoading(false)
    } catch (error) {
      console.error("Error fetching requests:", error)
      setLoading(false)
    }
  }

  const fetchQuotationsForRequest = async (requestId: string) => {
    setLoadingQuotations(true)
    try {
      const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
      const res = await fetch(`${BACKEND_URL}/api/quotations`)
      const data = await res.json()
      const allQuotations = data.quotations || []
      
      // Filter quotations for this specific request
      const filtered = allQuotations.filter((q: Quotation) => q.requestId === requestId)
      setRequestQuotations(filtered)
    } catch (error) {
      console.error("Error fetching quotations:", error)
      setRequestQuotations([])
    } finally {
      setLoadingQuotations(false)
    }
  }

  const handleViewRequest = async (request: Request) => {
    setSelectedRequest(request)
    await fetchQuotationsForRequest(request._id)
  }

  const handleCloseDialog = () => {
    setSelectedRequest(null)
    setRequestQuotations([])
  }

  const handleDownloadQuotationPDF = (quotationId: string) => {
    const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
    window.open(`${BACKEND_URL}/api/quotations/${quotationId}/pdf`, '_blank')
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif text-2xl">Service Requests</CardTitle>
              <CardDescription>Manage and track service requests</CardDescription>
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
                        <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request)}>
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

        {/* Request Details Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedRequest && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl flex items-center justify-between">
                    Request Details
                    <span className="text-sm font-normal text-foreground/60">
                      ID: {selectedRequest._id.slice(-8)}
                    </span>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Client Information */}
                  <div className="bg-secondary/5 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent" />
                      Client Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">Name</p>
                        <p className="font-semibold">{selectedRequest.firstName} {selectedRequest.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 mb-1 flex items-center gap-1">
                          <Mail className="w-4 h-4" /> Email
                        </p>
                        <p className="font-semibold">{selectedRequest.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 mb-1 flex items-center gap-1">
                          <Phone className="w-4 h-4" /> Phone
                        </p>
                        <p className="font-semibold">{selectedRequest.phone}</p>
                      </div>
                      {selectedRequest.company && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1 flex items-center gap-1">
                            <Building className="w-4 h-4" /> Company
                          </p>
                          <p className="font-semibold">{selectedRequest.company}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="bg-secondary/5 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-accent" />
                      Event Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRequest.eventDate && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Event Date</p>
                          <p className="font-semibold">{new Date(selectedRequest.eventDate).toLocaleDateString('en-GB')}</p>
                        </div>
                      )}
                      {selectedRequest.eventTime && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Event Time</p>
                          <p className="font-semibold">{selectedRequest.eventTime}</p>
                        </div>
                      )}
                      {selectedRequest.venue && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1 flex items-center gap-1">
                            <MapPin className="w-4 h-4" /> Venue
                          </p>
                          <p className="font-semibold">{selectedRequest.venue}</p>
                        </div>
                      )}
                      {selectedRequest.city && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">City</p>
                          <p className="font-semibold">{selectedRequest.city}</p>
                        </div>
                      )}
                      {selectedRequest.attendees && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1">Expected Attendees</p>
                          <p className="font-semibold">{selectedRequest.attendees}</p>
                        </div>
                      )}
                      {selectedRequest.budget && (
                        <div>
                          <p className="text-sm text-foreground/60 mb-1 flex items-center gap-1">
                            <DollarSign className="w-4 h-4" /> Budget
                          </p>
                          <p className="font-semibold">{selectedRequest.budget}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Selected Services */}
                  <div className="bg-secondary/5 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Requested Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRequest.selectedServices.map((service: string, idx: number) => (
                        <span key={idx} className="bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-medium">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Event Description */}
                  {selectedRequest.eventDescription && (
                    <div className="bg-secondary/5 p-6 rounded-lg">
                      <h3 className="font-bold text-lg mb-4">Event Description</h3>
                      <p className="text-foreground/80">{selectedRequest.eventDescription}</p>
                    </div>
                  )}

                  {/* Special Requirements */}
                  {selectedRequest.specialRequirements && (
                    <div className="bg-secondary/5 p-6 rounded-lg">
                      <h3 className="font-bold text-lg mb-4">Special Requirements</h3>
                      <p className="text-foreground/80">{selectedRequest.specialRequirements}</p>
                    </div>
                  )}

                  {/* Request Metadata */}
                  <div className="bg-secondary/5 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-4">Request Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">Status</p>
                        <span
                          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                            statusColors[selectedRequest.status as keyof typeof statusColors] || statusColors.pending
                          }`}
                        >
                          {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 mb-1">Submitted On</p>
                        <p className="font-semibold">{new Date(selectedRequest.createdAt).toLocaleString('en-GB')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Generated Quotations Section */}
                  <div className="bg-accent/5 p-6 rounded-lg border-2 border-accent/20">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      Generated Quotations
                    </h3>

                    {loadingQuotations ? (
                      <p className="text-center text-foreground/60 py-8">Loading quotations...</p>
                    ) : requestQuotations.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-foreground/60 mb-4">No quotations generated yet</p>
                        <Link href={`/admin/quotes/editor?requestId=${selectedRequest._id}`}>
                          <Button variant="default">
                            Create Quotation
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requestQuotations.map((quotation) => (
                          <div key={quotation._id} className="bg-background p-4 rounded-lg border border-border">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="font-semibold text-accent">
                                  Quote #{quotation._id.slice(-8).toUpperCase()}
                                </p>
                                <p className="text-sm text-foreground/60">
                                  Created: {new Date(quotation.createdAt).toLocaleDateString('en-GB')}
                                </p>
                              </div>
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  quotation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  quotation.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                                  quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                              </span>
                            </div>

                            {/* Line Items Summary */}
                            <div className="mb-3 space-y-1">
                              {quotation.lineItems.map((item, idx) => (
                                <div key={idx} className="text-sm flex justify-between">
                                  <span className="text-foreground/70">
                                    {item.description} (x{item.quantity})
                                  </span>
                                  <span className="font-medium">
                                    KES {(item.quantity * item.unitPrice).toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-border pt-3 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-foreground/60">Subtotal:</span>
                                <span className="font-medium">KES {quotation.subtotal.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-foreground/60">Tax (16%):</span>
                                <span className="font-medium">KES {quotation.tax.toLocaleString()}</span>
                              </div>
                              {quotation.discount > 0 && (
                                <div className="flex justify-between text-sm">
                                  <span className="text-foreground/60">Discount:</span>
                                  <span className="font-medium text-green-600">- KES {quotation.discount.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                                <span>Total:</span>
                                <span className="text-accent">KES {quotation.total.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Notes */}
                            {quotation.notes && (
                              <div className="mt-3 text-sm bg-secondary/5 p-3 rounded">
                                <p className="font-semibold mb-1">Notes:</p>
                                <p className="text-foreground/70">{quotation.notes}</p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex gap-2">
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleDownloadQuotationPDF(quotation._id)}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download PDF
                              </Button>
                              <Button variant="outline" size="sm">
                                <Mail className="w-4 h-4 mr-1" />
                                Send to Client
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-border">
                    <Link href={`/admin/quotes/editor?requestId=${selectedRequest._id}`}>
                      <Button variant="default">
                        Create New Quotation
                      </Button>
                    </Link>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

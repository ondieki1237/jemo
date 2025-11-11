"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { FileText, Mail, Check, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Quote {
  id: string
  requestId: string
  clientName: string
  eventDate: string
  services: string[]
  subtotal: number
  tax: number
  total: number
  status: "pending" | "emailed" | "approved" | "rejected"
  createdAt: string
  expiresAt: string
}

const mockQuotes: Quote[] = [
  {
    id: "Q-001-2025",
    requestId: "R-001-2025",
    clientName: "Jane Smith",
    eventDate: "2025-03-15",
    services: ["Event Planning", "Sound Systems", "Stage Lighting"],
    subtotal: 50000,
    tax: 8000,
    total: 58000,
    status: "emailed",
    createdAt: "2025-01-10",
    expiresAt: "2025-02-10",
  },
  {
    id: "Q-002-2025",
    requestId: "R-002-2025",
    clientName: "Tech Africa Corp",
    eventDate: "2025-04-20",
    services: ["LED Screens", "Sound Engineering"],
    subtotal: 75000,
    tax: 12000,
    total: 87000,
    status: "approved",
    createdAt: "2025-01-12",
    expiresAt: "2025-02-12",
  },
]

export default function QuoteStatusPage() {
  const [quotes] = useState<Quote[]>(mockQuotes)
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="w-5 h-5 text-green-600" />
      case "emailed":
        return <Mail className="w-5 h-5 text-blue-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Review" },
      emailed: { bg: "bg-blue-100", text: "text-blue-800", label: "Quote Sent" },
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    }
    const config = statusMap[status as keyof typeof statusMap]
    return config
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-secondary-foreground mb-6">Your Quotes</h1>
          <p className="text-xl text-secondary-foreground/80 max-w-2xl">Track and manage your service quotations.</p>
        </div>
      </section>

      {/* Quotes Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {quotes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-serif font-bold mb-2">No Quotes Yet</h3>
              <p className="text-foreground/70 mb-6">You don't have any quotes. Request a service to get started.</p>
              <Link
                href="/request-service"
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-all"
              >
                Request Service
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quote List */}
              <div className="lg:col-span-2 space-y-4">
                {quotes.map((quote) => {
                  const statusConfig = getStatusBadge(quote.status)
                  return (
                    <div
                      key={quote.id}
                      onClick={() => setSelectedQuote(quote)}
                      className={`p-6 border rounded-lg cursor-pointer transition-all ${
                        selectedQuote?.id === quote.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-serif text-lg font-bold">{quote.id}</h3>
                          <p className="text-sm text-foreground/60">{quote.clientName}</p>
                        </div>
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {getStatusIcon(quote.status)}
                          <span className="text-xs font-semibold">{statusConfig.label}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-foreground/60">Event Date</p>
                          <p className="font-medium">{new Date(quote.eventDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-foreground/60">Total Amount</p>
                          <p className="font-bold text-accent">KES {quote.total.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Quote Details */}
              <div>
                {selectedQuote ? (
                  <div className="bg-card border border-border rounded-lg p-6 sticky top-32 space-y-6">
                    <div>
                      <h4 className="font-serif font-bold text-lg mb-2">Quote Details</h4>
                      <p className="text-sm text-foreground/60">{selectedQuote.id}</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-foreground/60">Services</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedQuote.services.map((service, idx) => (
                            <span key={idx} className="bg-accent/20 text-accent px-2 py-1 rounded text-xs font-medium">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Subtotal</span>
                        <span className="font-medium">KES {selectedQuote.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Tax</span>
                        <span className="font-medium">KES {selectedQuote.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-accent">KES {selectedQuote.total.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-900">
                      <p>Quote expires: {new Date(selectedQuote.expiresAt).toLocaleDateString()}</p>
                    </div>

                    {selectedQuote.status === "emailed" && (
                      <div className="space-y-3">
                        <button className="w-full px-4 py-2 bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
                          Approve Quote
                        </button>
                        <button className="w-full px-4 py-2 border-2 border-border text-foreground font-semibold hover:border-accent transition-colors">
                          Request Changes
                        </button>
                      </div>
                    )}

                    {selectedQuote.status === "approved" && (
                      <button className="w-full px-4 py-2 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors">
                        Proceed to Payment
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-lg p-6 text-center text-foreground/60">
                    <p className="text-sm">Select a quote to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

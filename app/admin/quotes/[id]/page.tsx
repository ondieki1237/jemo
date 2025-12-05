"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
    ArrowLeft,
    Download,
    Mail,
    Printer,
    Edit,
    Calendar,
    MapPin,
    User,
    FileText,
    CheckCircle,
    Clock,
    XCircle,
    Loader2
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface LineItem {
    description: string
    quantity: number
    unitPrice: number
}

interface Quotation {
    _id: string
    requestId?: string
    clientName: string
    clientEmail: string
    eventDate?: string
    venue?: string
    lineItems: LineItem[]
    subtotal: number
    tax: number
    discount: number
    total: number
    status: string
    notes?: string
    validUntil?: string
    createdAt: string
}

export default function QuotationDetailPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    const printRef = useRef<HTMLDivElement>(null)

    const [quotation, setQuotation] = useState<Quotation | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [downloading, setDownloading] = useState(false)

    useEffect(() => {
        if (id) {
            fetchQuotation()
        }
    }, [id])

    const fetchQuotation = async () => {
        try {
            const res = await fetch(`/api/quotations?id=${id}`)
            const data = await res.json()

            if (data.quotations && data.quotations.length > 0) {
                // Find the specific quotation
                const quote = data.quotations.find((q: Quotation) => q._id === id)
                if (quote) {
                    setQuotation(quote)
                } else {
                    setError(true)
                }
            } else if (data.quotation) {
                setQuotation(data.quotation)
            } else {
                setError(true)
            }
            setLoading(false)
        } catch (err) {
            console.error("Error fetching quotation:", err)
            setError(true)
            setLoading(false)
        }
    }

    const handleDownloadPDF = async () => {
        setDownloading(true)
        try {
            const response = await fetch(`/api/quotations/${id}/pdf`)
            if (response.ok) {
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `quotation-${id}.pdf`
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
                a.remove()
            } else {
                alert('Failed to download PDF')
            }
        } catch (err) {
            console.error('Error downloading PDF:', err)
            alert('Error downloading PDF')
        } finally {
            setDownloading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />
            default:
                return <Clock className="w-5 h-5 text-yellow-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200'
            case 'sent':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'expired':
                return 'bg-orange-100 text-orange-800 border-orange-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
                    <p className="text-foreground/60">Loading quotation...</p>
                </div>
            </div>
        )
    }

    if (error || !quotation) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <FileText className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Quotation Not Found</h2>
                    <p className="text-foreground/60 mb-6">The quotation you're looking for doesn't exist.</p>
                    <Link href="/admin/quotes">
                        <Button>Back to Quotations</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Link href="/admin/quotes">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Quotations
                    </Button>
                </Link>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handlePrint} className="gap-2">
                        <Printer className="w-4 h-4" />
                        <span className="hidden sm:inline">Print</span>
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="gap-2"
                    >
                        {downloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline">Download PDF</span>
                    </Button>
                </div>
            </div>

            {/* Quotation Document */}
            <Card className="print:shadow-none print:border-none" ref={printRef}>
                <CardContent className="p-6 sm:p-8">
                    {/* Company Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg">
                                <span className="font-serif text-2xl font-bold text-white">B</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-serif font-bold text-primary">Boom Audio Visuals</h1>
                                <p className="text-sm text-foreground/60">Professional Event Production</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-bold text-accent">QUOTATION</h2>
                            <p className="text-sm text-foreground/60">#{quotation._id.slice(-8).toUpperCase()}</p>
                        </div>
                    </div>

                    {/* Status & Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-accent" />
                            <div>
                                <p className="text-xs text-foreground/60">Created</p>
                                <p className="font-medium">
                                    {new Date(quotation.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                        {quotation.validUntil && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-accent" />
                                <div>
                                    <p className="text-xs text-foreground/60">Valid Until</p>
                                    <p className="font-medium">
                                        {new Date(quotation.validUntil).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            {getStatusIcon(quotation.status)}
                            <div>
                                <p className="text-xs text-foreground/60">Status</p>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusColor(quotation.status)}`}>
                                    {quotation.status?.charAt(0).toUpperCase() + quotation.status?.slice(1) || 'Draft'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Client & Event Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 p-4 bg-secondary/5 rounded-lg">
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <User className="w-4 h-4 text-accent" />
                                Client Details
                            </h3>
                            <p className="font-medium">{quotation.clientName || '—'}</p>
                            <p className="text-sm text-foreground/60">{quotation.clientEmail || '—'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-accent" />
                                Event Details
                            </h3>
                            <p className="font-medium">
                                {quotation.eventDate
                                    ? new Date(quotation.eventDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : '—'
                                }
                            </p>
                            <p className="text-sm text-foreground/60">{quotation.venue || '—'}</p>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="mb-6">
                        <h3 className="font-semibold mb-4">Services & Items</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b-2 border-border">
                                        <th className="text-left py-3 px-2">#</th>
                                        <th className="text-left py-3 px-2">Description</th>
                                        <th className="text-right py-3 px-2">Qty</th>
                                        <th className="text-right py-3 px-2">Unit Price</th>
                                        <th className="text-right py-3 px-2">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotation.lineItems.map((item, index) => (
                                        <tr key={index} className="border-b border-border">
                                            <td className="py-3 px-2 text-foreground/60">{index + 1}</td>
                                            <td className="py-3 px-2 font-medium">{item.description}</td>
                                            <td className="py-3 px-2 text-right">{item.quantity}</td>
                                            <td className="py-3 px-2 text-right">KES {item.unitPrice.toLocaleString()}</td>
                                            <td className="py-3 px-2 text-right font-medium">
                                                KES {(item.quantity * item.unitPrice).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end mb-6">
                        <div className="w-full sm:w-72 space-y-2">
                            <div className="flex justify-between py-2 border-b border-border">
                                <span className="text-foreground/60">Subtotal</span>
                                <span className="font-medium">KES {quotation.subtotal?.toLocaleString() || '0'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                                <span className="text-foreground/60">Tax (16%)</span>
                                <span className="font-medium">KES {quotation.tax?.toLocaleString() || '0'}</span>
                            </div>
                            {quotation.discount > 0 && (
                                <div className="flex justify-between py-2 border-b border-border text-green-600">
                                    <span>Discount</span>
                                    <span className="font-medium">- KES {quotation.discount?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-3 text-lg font-bold bg-accent/10 px-3 rounded-lg">
                                <span>Total</span>
                                <span className="text-accent">KES {quotation.total?.toLocaleString() || '0'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {quotation.notes && (
                        <div className="bg-secondary/5 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold mb-2">Notes</h3>
                            <p className="text-sm text-foreground/70 whitespace-pre-wrap">{quotation.notes}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t border-border pt-6 text-center text-sm text-foreground/60">
                        <p className="font-medium text-foreground mb-1">Boom Audio Visuals</p>
                        <p>📞 +254 742 412650 | ✉️ boomaudiovisuals254@gmail.com</p>
                        <p>📍 Kisumu, Kenya | 🌐 boomaudiovisuals.co.ke</p>
                    </div>
                </CardContent>
            </Card>

            {/* Print Styles */}
            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
        </div>
    )
}

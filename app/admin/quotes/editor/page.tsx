"use client"

import { useState } from "react"
import { Plus, Trash2, Mail, Download, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export default function QuoteEditor() {
  const router = useRouter()
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Event Planning Services", quantity: 1, unitPrice: 5000 },
  ])

  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [venue, setVenue] = useState("")
  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null)

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * 0.16
  const total = subtotal + tax - discount

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSaveQuote = async () => {
    if (!clientName || !clientEmail) {
      alert("Please enter client name and email")
      return
    }

    if (lineItems.length === 0 || lineItems.every(item => !item.description)) {
      alert("Please add at least one service item")
      return
    }

    setSaving(true)

    try {
      const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
      
      const quotationData = {
        clientName,
        clientEmail,
        eventDate,
        venue,
        lineItems: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        discount,
        notes,
        status: 'draft',
        requestId: null // Optional: link to a service request if available
      }

      const response = await fetch(`${BACKEND_URL}/api/quotations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quotationData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSavedQuoteId(data.quotationId)
        alert(`Quotation saved successfully! Quote ID: ${data.quotationId.slice(-8)}`)
        // Optionally redirect to quotations list
        // router.push('/admin/quotes')
      } else {
        alert(`Error saving quotation: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving quotation:', error)
      alert('Failed to save quotation. Please check your connection.')
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPDF = () => {
    if (!savedQuoteId) {
      alert("Please save the quotation first before downloading PDF")
      return
    }
    const BACKEND_URL = 'https://jemo.codewithseth.co.ke'
    window.open(`${BACKEND_URL}/api/quotations/${savedQuoteId}/pdf`, '_blank')
  }

  const handleSendToClient = async () => {
    if (!savedQuoteId) {
      alert("Please save the quotation first before sending to client")
      return
    }
    // TODO: Implement email sending functionality
    alert("Email sending functionality coming soon!")
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold mb-2">Create Quotation</h1>
          <p className="text-foreground/60">Build a professional quote for your client</p>
        </div>

        {/* Client Info Section */}
        <div className="mb-8 p-6 bg-secondary/5 rounded-lg space-y-4">
          <h2 className="font-serif text-lg font-bold">Client Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Client Name *"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
              required
            />
            <input
              type="email"
              placeholder="Client Email *"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
              required
            />
            <input
              type="date"
              placeholder="Event Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
            />
            <input
              type="text"
              placeholder="Venue"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="mb-8">
          <h2 className="font-serif text-lg font-bold mb-4">Services</h2>
          <div className="space-y-3 mb-4">
            {lineItems.map((item) => (
              <div key={item.id} className="flex gap-3 items-end">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  placeholder="Service description"
                  className="flex-1 px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value))}
                  placeholder="Qty"
                  className="w-20 px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(item.id, "unitPrice", Number.parseFloat(e.target.value))}
                  placeholder="Price"
                  className="w-24 px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
                />
                <div className="w-32 px-4 py-2 bg-secondary/5 rounded text-right font-semibold">
                  KES {(item.quantity * item.unitPrice).toLocaleString()}
                </div>
                <button
                  onClick={() => removeLineItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addLineItem}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-border rounded hover:border-accent transition-colors text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        {/* Totals */}
        <div className="mb-8 p-6 bg-secondary/5 rounded-lg">
          <div className="space-y-3 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (16%):</span>
              <span className="font-semibold">KES {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number.parseFloat(e.target.value))}
                className="w-24 px-2 py-1 bg-background border border-border rounded text-right"
              />
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-accent">KES {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Notes & Terms</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add payment terms, conditions, or special notes..."
            rows={4}
            className="w-full px-4 py-3 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={handleSaveQuote}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold rounded hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Quote'}
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={!savedQuoteId}
            className="flex items-center gap-2 px-6 py-3 border-2 border-border font-semibold rounded hover:bg-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button 
            onClick={handleSendToClient}
            disabled={!savedQuoteId}
            className="flex items-center gap-2 px-6 py-3 border-2 border-border font-semibold rounded hover:bg-secondary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            Send to Client
          </button>
          {savedQuoteId && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-800 rounded text-sm font-medium">
              ✓ Saved - ID: {savedQuoteId.slice(-8)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

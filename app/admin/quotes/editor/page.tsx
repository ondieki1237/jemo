"use client"

import { useState } from "react"
import { Plus, Trash2, Mail, Download, Save } from "lucide-react"

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export default function QuoteEditor() {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Event Planning Services", quantity: 1, unitPrice: 5000 },
  ])

  const [discount, setDiscount] = useState(0)
  const [notes, setNotes] = useState("")

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
              placeholder="Client Name"
              className="px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
            />
            <input
              type="email"
              placeholder="Client Email"
              className="px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
            />
            <input
              type="text"
              placeholder="Event Date"
              className="px-4 py-2 bg-background border border-border rounded text-foreground placeholder:text-foreground/50"
            />
            <input
              type="text"
              placeholder="Venue"
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
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors">
            <Save className="w-5 h-5" />
            Save Quote
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-border font-semibold hover:bg-secondary/5 transition-colors">
            <Download className="w-5 h-5" />
            Preview PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3 border-2 border-border font-semibold hover:bg-secondary/5 transition-colors">
            <Mail className="w-5 h-5" />
            Send to Client
          </button>
        </div>
      </div>
    </div>
  )
}

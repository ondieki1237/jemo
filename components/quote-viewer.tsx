"use client"

import { Download, Mail } from "lucide-react"

interface QuoteViewerProps {
  quoteId: string
  clientName: string
  eventDate: string
  services: Array<{ name: string; price: number; quantity: number }>
  subtotal: number
  tax: number
  total: number
}

export function QuoteViewer({ quoteId, clientName, eventDate, services, subtotal, tax, total }: QuoteViewerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-12 pb-8 border-b border-gray-300">
        <div>
          <h1 className="font-serif text-4xl font-bold text-black">QUOTATION</h1>
          <p className="text-gray-600 mt-2">Quote #{quoteId}</p>
        </div>
        <div className="text-right">
          <div className="w-16 h-16 bg-black rounded-sm flex items-center justify-center mb-2">
            <span className="font-serif text-2xl font-bold text-yellow-500">B</span>
          </div>
          <p className="font-bold text-black">Boom Audio Visuals</p>
        </div>
      </div>

      {/* Client & Event Info */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase mb-3">Bill To</h3>
          <p className="font-semibold text-black">{clientName}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-600 uppercase mb-3">Event Details</h3>
          <p className="text-black">Date: {new Date(eventDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Services Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-3 px-4 font-bold text-black">Service</th>
            <th className="text-right py-3 px-4 font-bold text-black">Qty</th>
            <th className="text-right py-3 px-4 font-bold text-black">Price</th>
            <th className="text-right py-3 px-4 font-bold text-black">Total</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td className="py-4 px-4 text-black">{service.name}</td>
              <td className="text-right py-4 px-4 text-black">{service.quantity}</td>
              <td className="text-right py-4 px-4 text-black">KES {service.price.toLocaleString()}</td>
              <td className="text-right py-4 px-4 text-black">
                KES {(service.price * service.quantity).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64">
          <div className="flex justify-between py-2 text-black border-b border-gray-300">
            <span>Subtotal:</span>
            <span>KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 text-black border-b border-gray-300">
            <span>Tax (16%):</span>
            <span>KES {tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-3 text-lg font-bold text-black">
            <span>Total:</span>
            <span className="text-yellow-500">KES {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-8 border-t border-gray-300">
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white font-semibold hover:bg-gray-800">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-black text-black font-semibold hover:bg-black/5">
          <Mail className="w-4 h-4" />
          Email Quote
        </button>
      </div>
    </div>
  )
}

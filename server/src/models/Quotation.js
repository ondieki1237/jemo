import mongoose from 'mongoose'

const LineItemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  unitPrice: Number,
})

const QuotationSchema = new mongoose.Schema({
  requestId: { type: String, index: true }, // Add index for better query performance
  clientName: String,
  clientEmail: String,
  eventDate: String,
  venue: String,
  lineItems: [LineItemSchema],
  discount: { type: Number, default: 0 },
  notes: String,
  subtotal: Number,
  tax: Number,
  total: Number,
  status: { type: String, default: 'draft' }, // draft, sent, approved, rejected, expired
  createdAt: { type: Date, default: () => new Date() },
})

export default mongoose.models.Quotation || mongoose.model('Quotation', QuotationSchema)

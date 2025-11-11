import mongoose from 'mongoose'

const LineItemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  unitPrice: Number,
})

const QuotationSchema = new mongoose.Schema({
  requestId: String,
  clientEmail: String,
  lineItems: [LineItemSchema],
  discount: { type: Number, default: 0 },
  notes: String,
  subtotal: Number,
  tax: Number,
  total: Number,
  createdAt: { type: Date, default: () => new Date() },
})

export default mongoose.models.Quotation || mongoose.model('Quotation', QuotationSchema)

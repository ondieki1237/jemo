import mongoose from 'mongoose'

const InvoiceSchema = new mongoose.Schema({
  quotationId: String,
  amount: Number,
  dueDate: String,
  status: { type: String, default: 'unpaid' },
  createdAt: { type: Date, default: () => new Date() },
})

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema)

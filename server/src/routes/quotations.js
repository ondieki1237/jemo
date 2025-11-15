import express from 'express'
import Quotation from '../models/Quotation.js'
import ServiceRequest from '../models/ServiceRequest.js'
import { sendQuotationEmail } from '../utils/emailService.js'
import PDFDocument from 'pdfkit'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const body = req.body

    if (!body.requestId || !body.lineItems || !Array.isArray(body.lineItems) || body.lineItems.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const subtotal = body.lineItems.reduce((sum, it) => sum + (it.quantity || 0) * (it.unitPrice || 0), 0)
    const tax = +(subtotal * 0.16).toFixed(2)
    const discount = body.discount || 0
    const total = subtotal + tax - discount

    const doc = await Quotation.create({ ...body, subtotal, tax, total })

    // Get client details from service request
    try {
      const request = await ServiceRequest.findById(body.requestId)
      if (request && request.email) {
        const clientName = `${request.firstName} ${request.lastName}`
        // Send quotation email to client (non-blocking)
        sendQuotationEmail(doc, request.email, clientName).catch(err =>
          console.error('Failed to send quotation email:', err)
        )
      }
    } catch (emailErr) {
      console.error('Error fetching request for email:', emailErr)
    }

    return res.status(201).json({ 
      success: true, 
      quotationId: doc._id, 
      subtotal, 
      tax, 
      total,
      message: 'Quotation created and sent to client email'
    })
  } catch (err) {
    console.error('Error creating quotation:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const docs = await Quotation.find().sort({ createdAt: -1 }).limit(200)
    return res.json({ quotations: docs })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Stream a generated PDF for a quotation
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params
    const quote = await Quotation.findById(id)
    if (!quote) return res.status(404).json({ error: 'Quotation not found' })

    // Create a PDF document and stream it to the client
    const doc = new PDFDocument({ size: 'A4', margin: 50 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="quotation-${id}.pdf"`)

    doc.pipe(res)

    // Header
    doc.fontSize(20).text('Quotation', { align: 'center' })
    doc.moveDown()

    // Meta
    doc.fontSize(12)
    doc.text(`Quotation ID: ${quote._id}`)
    doc.text(`Date: ${new Date(quote.createdAt).toLocaleString()}`)
    if (quote.clientEmail) doc.text(`Client: ${quote.clientEmail}`)
    doc.moveDown()

    // Line items table-like output
    doc.fontSize(12).text('Items:', { underline: true })
    doc.moveDown(0.5)

    const items = quote.lineItems || []
    items.forEach((it, i) => {
      const desc = it.description || 'Item'
      const qty = it.quantity || 0
      const unit = it.unitPrice != null ? Number(it.unitPrice).toFixed(2) : '0.00'
      const lineTotal = (qty * (it.unitPrice || 0)).toFixed(2)
      doc.text(`${i + 1}. ${desc}`)
      doc.text(`   Qty: ${qty}  Unit: KES ${unit}  Line total: KES ${lineTotal}`)
      doc.moveDown(0.2)
    })

    doc.moveDown()
    doc.text(`Subtotal: KES ${quote.subtotal != null ? Number(quote.subtotal).toFixed(2) : '0.00'}`)
    doc.text(`Tax: KES ${quote.tax != null ? Number(quote.tax).toFixed(2) : '0.00'}`)
    doc.text(`Discount: KES ${quote.discount != null ? Number(quote.discount).toFixed(2) : '0.00'}`)
    doc.text(`Total: KES ${quote.total != null ? Number(quote.total).toFixed(2) : '0.00'}`)

    if (quote.notes) {
      doc.moveDown()
      doc.text('Notes:', { underline: true })
      doc.text(quote.notes)
    }

    doc.end()
  } catch (err) {
    console.error('Error generating PDF:', err)
    return res.status(500).json({ error: 'Failed to generate PDF' })
  }
})

export default router

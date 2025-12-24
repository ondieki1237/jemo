import express from 'express'
import Invoice from '../models/Invoice.js'
import Quotation from '../models/Quotation.js'
import ServiceRequest from '../models/ServiceRequest.js'
import { sendInvoiceEmail } from '../utils/emailService.js'
import PDFDocument from 'pdfkit'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.quotationId || !body.amount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const doc = await Invoice.create({ ...body })
    
    // Get client details from quotation and service request
    try {
      const quotation = await Quotation.findById(body.quotationId)
      if (quotation && quotation.requestId) {
        const request = await ServiceRequest.findById(quotation.requestId)
        if (request && request.email) {
          const clientName = `${request.firstName} ${request.lastName}`
          // Send invoice email to client (non-blocking)
          sendInvoiceEmail(doc, request.email, clientName).catch(err =>
            console.error('Failed to send invoice email:', err)
          )
        }
      }
    } catch (emailErr) {
      console.error('Error fetching data for invoice email:', emailErr)
    }
    
    return res.status(201).json({ 
      success: true, 
      invoiceId: doc._id,
      message: 'Invoice created and sent to client email'
    })
  } catch (err) {
    console.error('Error creating invoice:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/', async (req, res) => {
  try {
    const docs = await Invoice.find().sort({ createdAt: -1 }).limit(200)
    return res.json({ invoices: docs })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// Generate and download invoice PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params
    const invoice = await Invoice.findById(id)
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' })

    // Fetch quotation and client details
    let clientDetails = {
      name: 'Valued Client',
      email: '',
      phone: '',
      company: '',
      eventDate: '',
      venue: ''
    }
    let lineItems = []

    if (invoice.quotationId) {
      try {
        const quotation = await Quotation.findById(invoice.quotationId)
        if (quotation) {
          lineItems = quotation.lineItems || []
          if (quotation.requestId) {
            const request = await ServiceRequest.findById(quotation.requestId)
            if (request) {
              clientDetails = {
                name: `${request.firstName} ${request.lastName}`,
                email: request.email,
                phone: request.phone,
                company: request.company || '',
                eventDate: request.eventDate || '',
                venue: request.venue || ''
              }
            }
          }
        }
      } catch (err) {
        console.log('Could not fetch quotation/request details:', err)
      }
    }

    // Create PDF document
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      bufferPages: true
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="Boom-Invoice-${id.slice(-8)}.pdf"`)

    doc.pipe(res)

    // Colors
    const primaryBlue = '#2563eb'
    const accentBlue = '#3b82f6'
    const darkGray = '#1a1f2e'
    const lightGray = '#94a3b8'
    const yellow = '#f3d36b'
    const green = '#10b981'

    // === HEADER SECTION ===
    // Company logo/name
    doc.fontSize(28)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('BOOM', 50, 50, { continued: true })
       .fillColor(accentBlue)
       .text(' AUDIO VISUALS')
    
    // Tagline
    doc.fontSize(10)
       .fillColor(lightGray)
       .font('Helvetica')
       .text('Professional Audio-Visual Production', 50, 82)

    // Company details on right
    const rightX = 400
    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica')
       .text('📞 +254 742 412650', rightX, 50)
       .text('📧 boomaudiovisuals254@gmail.com', rightX, 65)
       .text('📍 Kisumu, Kenya', rightX, 80)
       .text('🌐 www.boomaudiovisuals.co.ke', rightX, 95)

    // Horizontal line
    doc.moveTo(50, 120)
       .lineTo(545, 120)
       .strokeColor(accentBlue)
       .lineWidth(2)
       .stroke()

    // === INVOICE TITLE ===
    doc.fontSize(24)
       .fillColor(green)
       .font('Helvetica-Bold')
       .text('INVOICE', 50, 140)

    // Invoice meta
    doc.fontSize(10)
       .fillColor(darkGray)
       .font('Helvetica')
       .text(`Invoice No: INV-${id.slice(-8).toUpperCase()}`, 50, 175)
       .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-GB')}`, 50, 190)
    
    if (invoice.dueDate) {
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-GB')}`, 50, 205)
    }

    // Payment status badge
    const statusColor = invoice.paymentStatus === 'paid' ? green : (invoice.paymentStatus === 'overdue' ? '#ef4444' : '#eab308')
    doc.text(`Status: ${(invoice.paymentStatus || 'pending').toUpperCase()}`, 50, invoice.dueDate ? 220 : 205)
       .fillColor(statusColor)

    // === CLIENT INFORMATION ===
    doc.fontSize(12)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('BILL TO:', 320, 175)

    doc.fontSize(10)
       .fillColor(darkGray)
       .font('Helvetica-Bold')
       .text(clientDetails.name, 320, 195)
       .font('Helvetica')

    if (clientDetails.company) {
      doc.text(clientDetails.company, 320, 210)
    }
    if (clientDetails.email) {
      doc.text(clientDetails.email, 320, clientDetails.company ? 225 : 210)
    }
    if (clientDetails.phone) {
      doc.text(clientDetails.phone, 320, clientDetails.company ? 240 : 225)
    }

    // Event details if available
    if (clientDetails.eventDate || clientDetails.venue) {
      let eventY = clientDetails.company ? 260 : 245
      doc.fontSize(10)
         .fillColor(primaryBlue)
         .font('Helvetica-Bold')
         .text('EVENT DETAILS:', 320, eventY)
      
      eventY += 15
      doc.fillColor(darkGray).font('Helvetica')
      if (clientDetails.eventDate) {
        doc.text(`Date: ${new Date(clientDetails.eventDate).toLocaleDateString('en-GB')}`, 320, eventY)
        eventY += 15
      }
      if (clientDetails.venue) {
        doc.text(`Venue: ${clientDetails.venue}`, 320, eventY, { width: 220 })
      }
    }

    // === LINE ITEMS TABLE (if available) ===
    let tableTop = 320
    
    if (lineItems.length > 0) {
      doc.fontSize(11)
         .fillColor('#ffffff')
         .font('Helvetica-Bold')

      // Table header background
      doc.rect(50, tableTop, 495, 25)
         .fillAndStroke(accentBlue, accentBlue)

      // Table headers
      doc.fillColor('#ffffff')
         .text('Item Description', 60, tableTop + 8, { width: 250 })
         .text('Qty', 320, tableTop + 8, { width: 40, align: 'center' })
         .text('Unit Price', 370, tableTop + 8, { width: 80, align: 'right' })
         .text('Amount', 460, tableTop + 8, { width: 75, align: 'right' })

      // Table rows
      let yPos = tableTop + 35
      
      doc.font('Helvetica')
         .fontSize(10)

      lineItems.forEach((item, index) => {
        const qty = item.quantity || 0
        const unitPrice = item.unitPrice || 0
        const lineTotal = qty * unitPrice

        // Alternating row colors
        if (index % 2 === 0) {
          doc.rect(50, yPos - 5, 495, 25).fillColor('#f8fafc').fill()
        }

        doc.fillColor(darkGray)
           .text(item.description || 'Item', 60, yPos, { width: 250 })
           .text(qty.toString(), 320, yPos, { width: 40, align: 'center' })
           .text(`KES ${unitPrice.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 370, yPos, { width: 80, align: 'right' })
           .text(`KES ${lineTotal.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })

        yPos += 30
      })

      tableTop = yPos + 20
    }

    // === TOTALS SECTION ===
    const totalsX = 370

    // Line above total
    doc.moveTo(totalsX, tableTop)
       .lineTo(545, tableTop)
       .strokeColor(accentBlue)
       .lineWidth(1)
       .stroke()

    tableTop += 15
    // Total Amount
    doc.fontSize(12)
       .fillColor(green)
       .font('Helvetica-Bold')
       .text('AMOUNT DUE:', totalsX, tableTop, { width: 80, align: 'right' })
       .text(`KES ${(invoice.amount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, tableTop, { width: 75, align: 'right' })

    // === PAYMENT INFORMATION ===
    let paymentY = tableTop + 60
    doc.fontSize(11)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('Payment Information:', 50, paymentY)
    
    paymentY += 20
    doc.fontSize(10)
       .fillColor(darkGray)
       .font('Helvetica-Bold')
       .text('M-Pesa Paybill:', 50, paymentY)
       .font('Helvetica')
       .text('Paybill: 123456', 50, paymentY + 15)
       .text('Account: BOOM-' + id.slice(-8).toUpperCase(), 50, paymentY + 30)

    doc.font('Helvetica-Bold')
       .text('Bank Transfer:', 50, paymentY + 55)
       .font('Helvetica')
       .text('Bank: Equity Bank', 50, paymentY + 70)
       .text('Account: 0123456789', 50, paymentY + 85)
       .text('Account Name: Boom Audio Visuals', 50, paymentY + 100)

    // === FOOTER ===
    const footerY = 720
    doc.fontSize(10)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('Terms & Conditions:', 50, footerY)
    
    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica')
       .text('• Payment is due within 7 days of invoice date', 50, footerY + 15)
       .text('• Late payments may incur additional charges', 50, footerY + 30)
       .text('• Please reference invoice number when making payment', 50, footerY + 45)

    // Bottom border
    doc.moveTo(50, 795)
       .lineTo(545, 795)
       .strokeColor(accentBlue)
       .lineWidth(1)
       .stroke()

    doc.fontSize(8)
       .fillColor(lightGray)
       .text('Thank you for your business! - Boom Audio Visuals', 50, 805, { align: 'center', width: 495 })

    doc.end()
  } catch (err) {
    console.error('Error generating invoice PDF:', err)
    return res.status(500).json({ error: 'Failed to generate PDF' })
  }
})

export default router

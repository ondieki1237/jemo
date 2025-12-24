import express from 'express'
import Quotation from '../models/Quotation.js'
import ServiceRequest from '../models/ServiceRequest.js'
import { sendQuotationEmail } from '../utils/emailService.js'
import PDFDocument from 'pdfkit'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const body = req.body

    // Validate required fields - requestId is now optional
    if (!body.lineItems || !Array.isArray(body.lineItems) || body.lineItems.length === 0) {
      return res.status(400).json({ error: 'Line items are required' })
    }

    // Validate client info if requestId is not provided
    if (!body.requestId && (!body.clientName || !body.clientEmail)) {
      return res.status(400).json({ error: 'Client name and email are required when requestId is not provided' })
    }

    const subtotal = body.lineItems.reduce((sum, it) => sum + (it.quantity || 0) * (it.unitPrice || 0), 0)
    const tax = +(subtotal * 0.16).toFixed(2)
    const discount = body.discount || 0
    const total = subtotal + tax - discount

    const doc = await Quotation.create({ ...body, subtotal, tax, total })

    // Get client details from service request if requestId is provided
    if (body.requestId) {
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
    } else if (body.clientEmail) {
      // Send email using provided client details
      try {
        sendQuotationEmail(doc, body.clientEmail, body.clientName).catch(err =>
          console.error('Failed to send quotation email:', err)
        )
      } catch (emailErr) {
        console.error('Error sending quotation email:', emailErr)
      }
    }

    return res.status(201).json({ 
      success: true, 
      quotationId: doc._id, 
      subtotal, 
      tax, 
      total,
      message: 'Quotation created successfully'
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

    // Fetch client details from service request
    let clientDetails = {
      name: quote.clientName || 'Valued Client',
      email: quote.clientEmail || '',
      phone: '',
      company: '',
      eventDate: '',
      venue: ''
    }

    if (quote.requestId) {
      try {
        const request = await ServiceRequest.findById(quote.requestId)
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
      } catch (err) {
        console.log('Could not fetch request details:', err)
      }
    }

    // Create a PDF document with better margins
    const doc = new PDFDocument({ 
      size: 'A4', 
      margin: 50,
      bufferPages: true
    })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="Boom-Quotation-${id.slice(-8)}.pdf"`)

    doc.pipe(res)

    // Colors
    const primaryBlue = '#2563eb'
    const accentBlue = '#3b82f6'
    const darkGray = '#1a1f2e'
    const lightGray = '#94a3b8'
    const yellow = '#f3d36b'

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

    // === QUOTATION TITLE ===
    doc.fontSize(24)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('QUOTATION', 50, 140)

    // Quotation meta
    doc.fontSize(10)
       .fillColor(darkGray)
       .font('Helvetica')
       .text(`Quotation No: QT-${id.slice(-8).toUpperCase()}`, 50, 175)
       .text(`Date: ${new Date(quote.createdAt).toLocaleDateString('en-GB')}`, 50, 190)
       .text(`Status: ${(quote.status || 'draft').toUpperCase()}`, 50, 205)

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

    // === LINE ITEMS TABLE ===
    const tableTop = 320
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
    const items = quote.lineItems || []
    
    doc.font('Helvetica')
       .fontSize(10)

    items.forEach((item, index) => {
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

    // === TOTALS SECTION ===
    yPos += 10
    const totalsX = 370

    // Subtotal
    doc.fontSize(10)
       .fillColor(darkGray)
       .font('Helvetica')
       .text('Subtotal:', totalsX, yPos, { width: 80, align: 'right' })
       .text(`KES ${(quote.subtotal || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })

    yPos += 20
    // Tax
    doc.text('Tax (16%):', totalsX, yPos, { width: 80, align: 'right' })
       .text(`KES ${(quote.tax || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })

    yPos += 20
    // Discount
    if (quote.discount > 0) {
      doc.text('Discount:', totalsX, yPos, { width: 80, align: 'right' })
         .text(`- KES ${(quote.discount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })
      yPos += 20
    }

    // Line above total
    doc.moveTo(totalsX, yPos)
       .lineTo(545, yPos)
       .strokeColor(accentBlue)
       .lineWidth(1)
       .stroke()

    yPos += 15
    // Total
    doc.fontSize(12)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('TOTAL:', totalsX, yPos, { width: 80, align: 'right' })
       .text(`KES ${(quote.total || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })

    // === NOTES SECTION ===
    if (quote.notes) {
      yPos += 40
      doc.fontSize(11)
         .fillColor(primaryBlue)
         .font('Helvetica-Bold')
         .text('Notes:', 50, yPos)
      
      yPos += 20
      doc.fontSize(10)
         .fillColor(darkGray)
         .font('Helvetica')
         .text(quote.notes, 50, yPos, { width: 495, align: 'left' })
    }

    // === FOOTER ===
    const footerY = 750
    doc.fontSize(10)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('Payment Terms:', 50, footerY)
    
    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica')
       .text('• 50% deposit required to confirm booking', 50, footerY + 15)
       .text('• Balance due 7 days before event date', 50, footerY + 30)
       .text('• Payment via M-Pesa, Bank Transfer, or Cash', 50, footerY + 45)

    // Bottom border
    doc.moveTo(50, 815)
       .lineTo(545, 815)
       .strokeColor(accentBlue)
       .lineWidth(1)
       .stroke()

    doc.fontSize(8)
       .fillColor(lightGray)
       .text('Thank you for choosing Boom Audio Visuals - Making Your Events Unforgettable', 50, 825, { align: 'center', width: 495 })

    doc.end()
  } catch (err) {
    console.error('Error generating PDF:', err)
    return res.status(500).json({ error: 'Failed to generate PDF' })
  }
})

export default router

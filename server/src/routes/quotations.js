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
    // Company logo
    try {
      doc.image('public/boom-logo-optimized.png', 50, 40, { width: 100 })
    } catch (err) {
      // Fallback if logo not found
      doc.fontSize(20)
         .fillColor(primaryBlue)
         .font('Helvetica-Bold')
         .text('BOOM AUDIO VISUALS', 50, 50)
    }

    // Company details on right with icons
    const rightX = 360
    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica')
       .text('Phone:', rightX, 45)
       .font('Helvetica-Bold')
       .text('+254 742 412650', rightX + 40, 45)
       
    doc.font('Helvetica')
       .text('Email:', rightX, 60)
       .font('Helvetica-Bold')
       .text('boomaudiovisuals254@gmail.com', rightX + 40, 60)
       
    doc.font('Helvetica')
       .text('Location:', rightX, 75)
       .font('Helvetica-Bold')
       .text('Kisumu, Kenya', rightX + 40, 75)
       
    doc.font('Helvetica')
       .text('Website:', rightX, 90)
       .font('Helvetica-Bold')
       .text('www.boomaudiovisuals.co.ke', rightX + 40, 90)

    // Horizontal line
    doc.moveTo(50, 110)
       .lineTo(545, 110)
       .strokeColor(accentBlue)
       .lineWidth(2)
       .stroke()

    // === QUOTATION TITLE ===
    doc.fontSize(20)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('QUOTATION', 50, 125)

    // Quotation meta
    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica')
       .text(`Quotation No: QT-${id.slice(-8).toUpperCase()}`, 50, 155)
       .text(`Date: ${new Date(quote.createdAt).toLocaleDateString('en-GB')}`, 50, 168)
       .text(`Status: ${(quote.status || 'draft').toUpperCase()}`, 50, 181)

    // === CLIENT INFORMATION ===
    doc.fontSize(11)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('BILL TO:', 320, 155)

    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica-Bold')
       .text(clientDetails.name, 320, 172)
       .font('Helvetica')

    let clientY = 184
    if (clientDetails.company) {
      doc.text(clientDetails.company, 320, clientY)
      clientY += 12
    }
    if (clientDetails.email) {
      doc.text(clientDetails.email, 320, clientY)
      clientY += 12
    }
    if (clientDetails.phone) {
      doc.text(clientDetails.phone, 320, clientY)
      clientY += 12
    }

    // Event details if available
    if (clientDetails.eventDate || clientDetails.venue) {
      clientY += 8
      doc.fontSize(10)
         .fillColor(primaryBlue)
         .font('Helvetica-Bold')
         .text('EVENT DETAILS:', 320, clientY)
      
      clientY += 14
      doc.fontSize(9).fillColor(darkGray).font('Helvetica')
      if (clientDetails.eventDate) {
        doc.text(`Date: ${new Date(clientDetails.eventDate).toLocaleDateString('en-GB')}`, 320, clientY)
        clientY += 12
      }
      if (clientDetails.venue) {
        doc.text(`Venue: ${clientDetails.venue}`, 320, clientY, { width: 220 })
      }
    }

    // === LINE ITEMS TABLE ===
    const tableTop = 260
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
    let yPos = tableTop + 30
    const items = quote.lineItems || []
    
    doc.font('Helvetica')
       .fontSize(9)

    items.forEach((item, index) => {
      const qty = item.quantity || 0
      const unitPrice = item.unitPrice || 0
      const lineTotal = qty * unitPrice

      // Alternating row colors
      if (index % 2 === 0) {
        doc.rect(50, yPos - 4, 495, 22).fillColor('#f8fafc').fill()
      }

      doc.fillColor(darkGray)
         .text(item.description || 'Item', 60, yPos, { width: 250 })
         .text(qty.toString(), 320, yPos, { width: 40, align: 'center' })
         .text(`KES ${unitPrice.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 370, yPos, { width: 80, align: 'right' })
         .text(`KES ${lineTotal.toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })

      yPos += 24
    })

    // === TOTALS SECTION ===
    yPos += 8
    const totalsX = 370

    // Subtotal
    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica')
       .text('Subtotal:', totalsX, yPos, { width: 80, align: 'right' })
       .text(`KES ${(quote.subtotal || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })

    yPos += 16
    // Tax
    doc.text('Tax (16%):', totalsX, yPos, { width: 80, align: 'right' })
       .text(`KES ${(quote.tax || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })

    yPos += 16
    // Discount
    if (quote.discount > 0) {
      doc.text('Discount:', totalsX, yPos, { width: 80, align: 'right' })
         .text(`- KES ${(quote.discount || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })
      yPos += 16
    }

    // Line above total
    doc.moveTo(totalsX, yPos)
       .lineTo(545, yPos)
       .strokeColor(accentBlue)
       .lineWidth(1)
       .stroke()

    yPos += 12
    // Total
    doc.fontSize(11)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('TOTAL:', totalsX, yPos, { width: 80, align: 'right' })
       .text(`KES ${(quote.total || 0).toLocaleString('en-KE', { minimumFractionDigits: 2 })}`, 460, yPos, { width: 75, align: 'right' })

    // === NOTES SECTION ===
    if (quote.notes) {
      yPos += 20
      doc.fontSize(10)
         .fillColor(primaryBlue)
         .font('Helvetica-Bold')
         .text('Notes:', 50, yPos)
      
      yPos += 14
      doc.fontSize(8)
         .fillColor(darkGray)
         .font('Helvetica')
         .text(quote.notes, 50, yPos, { width: 495, align: 'left', lineGap: 2 })
      yPos += 30
    }

    // === FOOTER ===
    // Check if we need a new page
    if (yPos > 680) {
      doc.addPage()
      yPos = 50
    } else {
      yPos = Math.max(yPos + 20, 680)
    }
    
    doc.fontSize(9)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('Payment Terms:', 50, yPos)
    
    doc.fontSize(8)
       .fillColor(darkGray)
       .font('Helvetica')
       .text('• 50% deposit required to confirm booking', 50, yPos + 12)
       .text('• Balance due 7 days before event date', 50, yPos + 24)
       .text('• Payment via M-Pesa, Bank Transfer, or Cash', 50, yPos + 36)

    // Bottom border
    doc.moveTo(50, yPos + 55)
       .lineTo(545, yPos + 55)
       .strokeColor(accentBlue)
       .lineWidth(1)
       .stroke()

    doc.fontSize(7)
       .fillColor(lightGray)
       .text('Thank you for choosing Boom Audio Visuals - Making Your Events Unforgettable', 50, yPos + 62, { align: 'center', width: 495 })

    doc.end()
  } catch (err) {
    console.error('Error generating PDF:', err)
    return res.status(500).json({ error: 'Failed to generate PDF' })
  }
})

export default router

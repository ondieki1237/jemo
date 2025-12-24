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

    // === INVOICE TITLE ===
    doc.fontSize(20)
       .fillColor(green)
       .font('Helvetica-Bold')
       .text('INVOICE', 50, 125)

    // Invoice meta
    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica')
       .text(`Invoice No: INV-${id.slice(-8).toUpperCase()}`, 50, 155)
       .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-GB')}`, 50, 168)
    
    if (invoice.dueDate) {
      doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-GB')}`, 50, 181)
    }

    // Payment status badge
    const statusColor = invoice.paymentStatus === 'paid' ? green : (invoice.paymentStatus === 'overdue' ? '#ef4444' : '#eab308')
    doc.text(`Status: ${(invoice.paymentStatus || 'pending').toUpperCase()}`, 50, invoice.dueDate ? 194 : 181)
       .fillColor(statusColor)

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

    // === LINE ITEMS TABLE (if available) ===
    let tableTop = 260
    
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
      let yPos = tableTop + 30
      
      doc.font('Helvetica')
         .fontSize(9)

      lineItems.forEach((item, index) => {
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

      tableTop = yPos + 15
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
    let paymentY = tableTop + 40
    doc.fontSize(10)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('Payment Information:', 50, paymentY)
    
    paymentY += 16
    doc.fontSize(9)
       .fillColor(darkGray)
       .font('Helvetica-Bold')
       .text('M-Pesa Paybill:', 50, paymentY)
       .font('Helvetica')
       .text('Paybill: 123456', 50, paymentY + 12)
       .text('Account: BOOM-' + id.slice(-8).toUpperCase(), 50, paymentY + 24)

    doc.font('Helvetica-Bold')
       .text('Bank Transfer:', 50, paymentY + 42)
       .font('Helvetica')
       .text('Bank: Equity Bank', 50, paymentY + 54)
       .text('Account: 0123456789', 50, paymentY + 66)
       .text('Account Name: Boom Audio Visuals', 50, paymentY + 78)

    // === FOOTER ===
    // Check if we need a new page
    let footerY = paymentY + 110
    if (footerY > 680) {
      doc.addPage()
      footerY = 50
    } else {
      footerY = Math.max(footerY, 680)
    }
    
    doc.fontSize(9)
       .fillColor(primaryBlue)
       .font('Helvetica-Bold')
       .text('Terms & Conditions:', 50, footerY)
    
    doc.fontSize(8)
       .fillColor(darkGray)
       .font('Helvetica')
       .text('• Payment is due within 7 days of invoice date', 50, footerY + 12)
       .text('• Late payments may incur additional charges', 50, footerY + 24)
       .text('• Please reference invoice number when making payment', 50, footerY + 36)

    // Bottom border
    doc.moveTo(50, footerY + 55)
       .lineTo(545, footerY + 55)
       .strokeColor(accentBlue)
       .lineWidth(1)
       .stroke()

    doc.fontSize(7)
       .fillColor(lightGray)
       .text('Thank you for your business! - Boom Audio Visuals', 50, footerY + 62, { align: 'center', width: 495 })

    doc.end()
  } catch (err) {
    console.error('Error generating invoice PDF:', err)
    return res.status(500).json({ error: 'Failed to generate PDF' })
  }
})

export default router

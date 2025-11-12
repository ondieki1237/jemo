import express from 'express'
import Invoice from '../models/Invoice.js'
import Quotation from '../models/Quotation.js'
import ServiceRequest from '../models/ServiceRequest.js'
import { sendInvoiceEmail } from '../utils/emailService.js'

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

export default router

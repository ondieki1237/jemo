import express from 'express'
import Invoice from '../models/Invoice.js'
import Quotation from '../models/Quotation.js'
import ServiceRequest from '../models/ServiceRequest.js'
import { sendPaymentConfirmation } from '../utils/emailService.js'

const router = express.Router()

// Simple webhook placeholder for Stripe / M-Pesa
router.post('/stripe-webhook', async (req, res) => {
  try {
    // NOTE: verify signature in production!
    console.log('Received stripe webhook:', req.body?.type)
    
    const event = req.body
    
    // Handle successful payment
    if (event.type === 'payment_intent.succeeded' || event.type === 'charge.succeeded') {
      const paymentIntent = event.data?.object
      
      if (paymentIntent) {
        // Extract metadata (should include invoiceId)
        const invoiceId = paymentIntent.metadata?.invoiceId
        
        if (invoiceId) {
          // Update invoice status
          const invoice = await Invoice.findByIdAndUpdate(
            invoiceId,
            { paymentStatus: 'paid', paidAt: new Date() },
            { new: true }
          )
          
          if (invoice) {
            // Get client details
            const quotation = await Quotation.findById(invoice.quotationId)
            if (quotation) {
              const request = await ServiceRequest.findById(quotation.requestId)
              if (request && request.email) {
                const clientName = `${request.firstName} ${request.lastName}`
                // Send payment confirmation
                sendPaymentConfirmation({
                  amount: invoice.amount,
                  transactionId: paymentIntent.id,
                  paymentMethod: 'Card (Stripe)'
                }, request.email, clientName).catch(err =>
                  console.error('Failed to send payment confirmation:', err)
                )
              }
            }
          }
        }
      }
    }
    
    return res.json({ received: true })
  } catch (err) {
    console.error('Stripe webhook error:', err)
    return res.status(500).json({ error: 'Webhook handler failed' })
  }
})

router.post('/mpesa-webhook', async (req, res) => {
  try {
    console.log('Received mpesa webhook:', req.body)
    
    const { Body } = req.body
    const callbackData = Body?.stkCallback
    
    if (callbackData && callbackData.ResultCode === 0) {
      // Payment successful
      const metadata = callbackData.CallbackMetadata?.Item || []
      const transactionId = metadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value
      const amount = metadata.find(item => item.Name === 'Amount')?.Value
      
      // You would need to store reference in your payment metadata
      // For now, just log success
      console.log('M-Pesa payment successful:', { transactionId, amount })
      
      // TODO: Update invoice and send confirmation email
      // Similar to Stripe webhook above
    }
    
    return res.json({ success: true })
  } catch (err) {
    console.error('M-Pesa webhook error:', err)
    return res.status(500).json({ error: 'Webhook handler failed' })
  }
})

export default router

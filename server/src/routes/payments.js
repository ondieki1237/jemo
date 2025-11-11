import express from 'express'

const router = express.Router()

// Simple webhook placeholder for Stripe / M-Pesa
router.post('/stripe-webhook', async (req, res) => {
  // NOTE: verify signature in production!
  console.log('Received stripe webhook:', req.body?.type)
  return res.json({ received: true })
})

router.post('/mpesa-webhook', async (req, res) => {
  console.log('Received mpesa webhook')
  return res.json({ success: true })
})

export default router

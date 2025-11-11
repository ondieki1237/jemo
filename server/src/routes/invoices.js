import express from 'express'
import Invoice from '../models/Invoice.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.quotationId || !body.amount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const doc = await Invoice.create({ ...body })
    return res.status(201).json({ success: true, invoiceId: doc._id })
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

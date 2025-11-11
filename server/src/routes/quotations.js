import express from 'express'
import Quotation from '../models/Quotation.js'

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

    return res.status(201).json({ success: true, quotationId: doc._id, subtotal, tax, total })
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

export default router

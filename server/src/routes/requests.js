import express from 'express'
import ServiceRequest from '../models/ServiceRequest.js'

const router = express.Router()

// POST /api/requests  - create a new service request
router.post('/', async (req, res) => {
  try {
    const body = req.body

    if (!body.firstName || !body.lastName || !body.email || !body.phone) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const doc = await ServiceRequest.create(body)
    return res.status(201).json({ success: true, requestId: doc._id, doc })
  } catch (err) {
    console.error('Error creating request:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/requests - list requests (simple, no auth)
router.get('/', async (req, res) => {
  try {
    const docs = await ServiceRequest.find().sort({ createdAt: -1 }).limit(200)
    return res.json({ requests: docs })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

import express from 'express'
import Service from '../models/Service.js'

const router = express.Router()

// GET /api/services - list all active services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ createdAt: -1 })
    return res.json({ services })
  } catch (err) {
    console.error('Error fetching services:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/services - create a new service
router.post('/', async (req, res) => {
  try {
    const service = await Service.create(req.body)
    return res.status(201).json({ success: true, service })
  } catch (err) {
    console.error('Error creating service:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/services/:id - update a service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updatedAt: new Date() },
      { new: true }
    )
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }
    return res.json({ success: true, service })
  } catch (err) {
    console.error('Error updating service:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/services/:id - soft delete (set active: false)
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { id: req.params.id },
      { active: false, updatedAt: new Date() },
      { new: true }
    )
    if (!service) {
      return res.status(404).json({ error: 'Service not found' })
    }
    return res.json({ success: true, message: 'Service deleted' })
  } catch (err) {
    console.error('Error deleting service:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

import express from 'express'
import mongoose from 'mongoose'

const router = express.Router()

// Simple in-memory fallback list for demonstration and seeding
const defaultServices = [
  { id: 'event-planning', name: 'Event Planning', description: 'Full-service event coordination', basePrice: 5000 },
  { id: 'sound-systems', name: 'Sound Systems', description: 'Professional audio engineering', basePrice: 2000 },
  { id: 'lighting', name: 'Stage Lighting', description: 'Stunning visual experiences', basePrice: 2200 },
]

// GET /api/services
router.get('/', async (req, res) => {
  try {
    // In a fuller implementation we'd read from a Services collection
    return res.json({ services: defaultServices })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

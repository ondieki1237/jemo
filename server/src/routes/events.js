import express from 'express'
import Event from '../models/Event.js'

const router = express.Router()

// Get all events (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { published, status, featured, category, limit } = req.query
    
    let query = {}
    if (published !== undefined) {
      query.published = published === 'true'
    }
    if (status) {
      query.status = status
    }
    if (featured !== undefined) {
      query.featured = featured === 'true'
    }
    if (category) {
      query.category = category
    }
    
    const events = await Event.find(query)
      .sort({ eventDate: 1 })
      .limit(limit ? parseInt(limit) : 0)
    
    res.json({ success: true, events })
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch events' })
  }
})

// Get single event by slug
router.get('/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug })
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }
    
    res.json({ success: true, event })
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch event' })
  }
})

// Create new event
router.post('/', async (req, res) => {
  try {
    const eventData = req.body
    
    // Generate slug if not provided
    if (!eventData.slug && eventData.title) {
      eventData.slug = eventData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    const event = new Event(eventData)
    await event.save()
    
    res.status(201).json({ 
      success: true, 
      message: 'Event created successfully',
      event 
    })
  } catch (error) {
    console.error('Error creating event:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'An event with this slug already exists' 
      })
    }
    
    res.status(500).json({ success: false, message: 'Failed to create event' })
  }
})

// Update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Event updated successfully',
      event 
    })
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({ success: false, message: 'Failed to update event' })
  }
})

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting event:', error)
    res.status(500).json({ success: false, message: 'Failed to delete event' })
  }
})

export default router

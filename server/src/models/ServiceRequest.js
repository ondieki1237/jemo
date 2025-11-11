import mongoose from 'mongoose'

const ServiceRequestSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String },
  eventDate: { type: String },
  eventTime: { type: String },
  venue: { type: String },
  city: { type: String },
  country: { type: String },
  attendees: { type: Number },
  selectedServices: { type: [String], default: [] },
  eventDescription: { type: String },
  specialRequirements: { type: String },
  budget: { type: String },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: () => new Date() },
})

export default mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', ServiceRequestSchema)

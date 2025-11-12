import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
  icon: { type: String },
  image: { type: String },
  category: { type: String, default: 'general' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
})

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema)

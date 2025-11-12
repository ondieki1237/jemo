import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    location: {
      venue: {
        type: String,
        default: '',
      },
      address: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
    },
    featuredImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['wedding', 'corporate', 'concert', 'conference', 'party', 'other'],
      default: 'other',
    },
    services: [{
      type: String,
      trim: true,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    capacity: {
      type: Number,
      default: 0,
    },
    ticketPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
  },
  {
    timestamps: true,
  }
)

// Auto-generate slug from title if not provided
eventSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  // Auto-update status based on dates
  const now = new Date()
  if (this.eventDate) {
    if (this.eventDate > now) {
      this.status = 'upcoming'
    } else if (this.endDate && this.endDate < now) {
      this.status = 'completed'
    } else if (this.eventDate <= now && (!this.endDate || this.endDate >= now)) {
      this.status = 'ongoing'
    }
  }
  
  next()
})

export default mongoose.model('Event', eventSchema)

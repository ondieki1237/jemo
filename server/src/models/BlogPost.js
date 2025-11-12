import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },
    featuredImage: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: 'Boom Audio Visuals',
    },
    category: {
      type: String,
      enum: ['events', 'equipment', 'tips', 'news', 'general'],
      default: 'general',
    },
    tags: [{
      type: String,
      trim: true,
    }],
    published: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Auto-generate slug from title if not provided
blogPostSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  
  // Set publishedAt when first published
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  
  next()
})

export default mongoose.model('BlogPost', blogPostSchema)

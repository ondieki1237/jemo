import express from 'express'
import BlogPost from '../models/BlogPost.js'

const router = express.Router()

// Get all blog posts (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { published, category, limit } = req.query
    
    let query = {}
    if (published !== undefined) {
      query.published = published === 'true'
    }
    if (category) {
      query.category = category
    }
    
    const posts = await BlogPost.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(limit ? parseInt(limit) : 0)
    
    res.json({ success: true, posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch blog posts' })
  }
})

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' })
    }
    
    // Increment views
    post.views += 1
    await post.save()
    
    res.json({ success: true, post })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch blog post' })
  }
})

// Create new blog post
router.post('/', async (req, res) => {
  try {
    const postData = req.body
    
    // Generate slug if not provided
    if (!postData.slug && postData.title) {
      postData.slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    const post = new BlogPost(postData)
    await post.save()
    
    res.status(201).json({ 
      success: true, 
      message: 'Blog post created successfully',
      post 
    })
  } catch (error) {
    console.error('Error creating blog post:', error)
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'A blog post with this slug already exists' 
      })
    }
    
    res.status(500).json({ success: false, message: 'Failed to create blog post' })
  }
})

// Update blog post
router.put('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Blog post updated successfully',
      post 
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    res.status(500).json({ success: false, message: 'Failed to update blog post' })
  }
})

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id)
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Blog post not found' })
    }
    
    res.json({ 
      success: true, 
      message: 'Blog post deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    res.status(500).json({ success: false, message: 'Failed to delete blog post' })
  }
})

export default router

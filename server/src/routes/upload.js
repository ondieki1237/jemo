import express from 'express'
import multer from 'multer'
import cloudinary from '../config/cloudinary.js'

const router = express.Router()

// Configure multer to store files in memory
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  },
})

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' })
    }

    // Upload to Cloudinary using buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'boom-audiovisuals',
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(req.file.buffer)
    })

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({ success: false, message: 'Failed to upload image' })
  }
})

// Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided' })
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'boom-audiovisuals',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(file.buffer)
      })
    })

    const results = await Promise.all(uploadPromises)

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      images: results.map((result) => ({
        imageUrl: result.secure_url,
        publicId: result.public_id,
      })),
    })
  } catch (error) {
    console.error('Error uploading images:', error)
    res.status(500).json({ success: false, message: 'Failed to upload images' })
  }
})

// Delete image by public_id
router.delete('/image/:publicId', async (req, res) => {
  try {
    const publicId = req.params.publicId.replace(/-/g, '/') // Convert back from URL-safe format
    
    const result = await cloudinary.uploader.destroy(publicId)

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully',
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found',
      })
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(500).json({ success: false, message: 'Failed to delete image' })
  }
})

export default router

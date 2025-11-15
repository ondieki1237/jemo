import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'

import servicesRouter from './routes/services.js'
import requestsRouter from './routes/requests.js'
import quotationsRouter from './routes/quotations.js'
import invoicesRouter from './routes/invoices.js'
import paymentsRouter from './routes/payments.js'
import blogRouter from './routes/blog.js'
import eventsRouter from './routes/events.js'
import uploadRouter from './routes/upload.js'

dotenv.config()

const app = express()
app.use(morgan('dev'))
app.use(express.json())
// Allow CORS from any origin. For production you may want to restrict this to
// specific origins via FRONTEND_ORIGIN environment variable.
app.use(cors())
app.options('*', cors())

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jemo_db'

mongoose
  .connect(MONGODB_URI, { autoIndex: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

// API routes
app.use('/api/services', servicesRouter)
app.use('/api/requests', requestsRouter)
app.use('/api/quotations', quotationsRouter)
app.use('/api/invoices', invoicesRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/blog', blogRouter)
app.use('/api/events', eventsRouter)
app.use('/api/upload', uploadRouter)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`))

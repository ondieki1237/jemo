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

dotenv.config()

const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000' }))

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

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`))

# Boom Audio Visuals API Documentation

## Overview
Complete REST API for Boom Audio Visuals. All endpoints require authentication (except public endpoints).

## Base URL
```
https://api.boomaudiovisuals.co.ke/api
```

## Authentication
Include Bearer token in Authorization header:
\`\`\`
Authorization: Bearer {token}
\`\`\`

## Endpoints

### Service Requests
- `POST /api/requests` - Create new service request
- `GET /api/requests` - List user's requests (auth required)
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Cancel request

### Quotations
- `POST /api/quotations` - Create quotation
- `GET /api/quotations` - List quotations
- `GET /api/quotations/:id` - Get quotation details
- `GET /api/quotations/:id/pdf` - Download quotation as PDF
- `PUT /api/quotations/:id` - Update quotation
- `POST /api/quotations/:id/email` - Email quotation to client
- `POST /api/quotations/:id/approve` - Client approves quote
- `POST /api/quotations/:id/reject` - Client rejects quote

### Invoices
- `POST /api/invoices` - Create invoice from quotation
- `GET /api/invoices` - List invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices/:id/email` - Email invoice to client
- `POST /api/invoices/:id/mark-paid` - Mark invoice as paid

### Payments
- `POST /api/payments/stripe-webhook` - Stripe webhook (public)
- `POST /api/payments/mpesa-webhook` - M-Pesa webhook (public)
- `GET /api/payments/:invoiceId/status` - Check payment status

### Services
- `GET /api/services` - List all services (public)
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

### Events
- `GET /api/events` - List upcoming events (public)
- `POST /api/events` - Create event (admin)
- `GET /api/events/:id` - Get event details (public)

### Tickets
- `POST /api/events/:id/tickets/purchase` - Purchase tickets
- `GET /api/events/:id/tickets` - Get ticket info (public)

### Analytics
- `GET /api/analytics` - Get dashboard metrics (admin)
- `GET /api/analytics/requests` - Request metrics (admin)
- `GET /api/analytics/revenue` - Revenue metrics (admin)

### Blog
- `GET /api/blog` - List published posts (public)
- `GET /api/blog/:slug` - Get post (public)
- `POST /api/blog` - Create post (admin)
- `PUT /api/blog/:id` - Update post (admin)

## Error Responses
\`\`\`json
{
  "error": "Error message",
  "status": 400
}
\`\`\`

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Webhooks
- `stripe/webhook` - Payment confirmations
- `mpesa/webhook` - M-Pesa payment updates

## Environment Variables Required
```
# Using MongoDB for the backend
MONGODB_URI=mongodb://localhost:27017/jemo_db
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
MPESA_API_KEY=...
MPESA_CONSUMER_KEY=...
JWT_SECRET=...
```

# Boom Audio Visuals - Professional Audio-Visual Production (Kisumu, Kenya)

A comprehensive full-stack platform for managing event service requests, quotations, invoicing, and payments with automated email notifications.

## 🎯 Features

### Public Website
- Modern homepage with hero carousel and floating stats
- Comprehensive services showcase
- Multi-step service request form
- Quote status tracking
- Payment processing (Stripe & M-Pesa)
- Gallery and blog
- Contact forms

### Admin Dashboard
- Service request management
- Quotation editor with line-item calculations
- Invoice generation
- Payment tracking
- Analytics dashboard

### Automated Email Notifications
- ✅ Service request confirmation to clients
- ✅ Admin notifications for new requests
- ✅ Quotation delivery via email
- ✅ Invoice notifications
- ✅ Payment confirmations

## 🏗️ Tech Stack

- **Frontend**: Next.js 16 with React 19, Turbopack
- **Styling**: Tailwind CSS v4 with custom design tokens (oklch colors)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Email**: Nodemailer with Gmail SMTP
- **Payments**: Stripe & M-Pesa webhooks
- **Animations**: Framer Motion, GSAP

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email notifications

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ondieki1237/jemo.git
cd jemo
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
npm install
cd ..
```

4. **Configure environment variables**

Backend (create `server/.env`):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/boomaudiovisuals
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Boom Audio Visual <your-email@gmail.com>

# Optional: Webhook secrets
STRIPE_WEBHOOK_SECRET=
MPESA_WEBHOOK_SECRET=
```

Frontend (create `.env.local` in root):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=https://jemo.codewithseth.co.ke
```

5. **Start the development servers**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

Visit **http://localhost:3000** for the frontend
Backend API runs on **https://jemo.codewithseth.co.ke**

## 📧 Email Setup

The system uses Gmail SMTP for sending emails. To set up:

1. Go to your Google Account → Security
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
4. Add to `server/.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ```

## 📁 Project Structure

```
jemo/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── services/          # Services page
│   ├── request-service/   # Service request form
│   ├── quote-status/      # Quote tracking
│   ├── payment/           # Payment page
│   ├── admin/             # Admin dashboard
│   │   ├── requests/      # Request management
│   │   ├── quotes/        # Quote editor
│   │   └── invoices/      # Invoice management
│   └── api/               # API routes (proxy to backend)
│       ├── requests/
│       ├── quotations/
│       ├── invoices/
│       └── payments/
├── components/
│   ├── home-hero.tsx      # Hero section component
│   ├── navigation.tsx     # Header navigation
│   ├── footer.tsx         # Footer component
│   └── ui/                # Shadcn UI components
├── server/                # Backend API
│   ├── src/
│   │   ├── index.js       # Express server
│   │   ├── models/        # Mongoose models
│   │   │   ├── ServiceRequest.js
│   │   │   ├── Quotation.js
│   │   │   └── Invoice.js
│   │   ├── routes/        # API routes
│   │   │   ├── requests.js
│   │   │   ├── quotations.js
│   │   │   ├── invoices.js
│   │   │   └── payments.js
│   │   └── utils/
│   │       └── emailService.js  # Email utilities
│   ├── .env               # Environment variables (DO NOT COMMIT)
│   └── package.json
├── styles/
│   └── globals.css        # Global styles
└── README.md
```

## 🔌 API Endpoints

### Service Requests
- `POST /api/requests` - Create new service request (sends emails)
- `GET /api/requests` - List all requests

### Quotations
- `POST /api/quotations` - Create quotation (sends email to client)
- `GET /api/quotations` - List all quotations
- `GET /api/quotations/:id/pdf` - Download quotation as PDF

### Invoices
- `POST /api/invoices` - Create invoice (sends email to client)
- `GET /api/invoices` - List all invoices

### Payments
- `POST /api/payments/stripe-webhook` - Handle Stripe payments
- `POST /api/payments/mpesa-webhook` - Handle M-Pesa payments

## 📊 Database Schema

### ServiceRequest
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  eventDate: String,
  venue: String,
  selectedServices: [String],
  eventDescription: String,
  budget: String,
  status: String (default: 'pending'),
  createdAt: Date
}
```

### Quotation
```javascript
{
  requestId: ObjectId,
  lineItems: [{
    description: String,
    quantity: Number,
    unitPrice: Number
  }],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  validUntil: String,
  notes: String,
  createdAt: Date
}
```

### Invoice
```javascript
{
  quotationId: ObjectId,
  amount: Number,
  dueDate: String,
  paymentStatus: String,
  paymentMethod: String,
  paidAt: Date,
  createdAt: Date
}
```

## 🧪 Testing

Test service request submission:
```bash
curl -X POST https://jemo.codewithseth.co.ke/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "test@example.com",
    "phone": "+254712345678",
    "eventDate": "2025-12-25",
    "venue": "Kisumu Sports Club",
    "selectedServices": ["Sound Systems", "Lighting"],
    "eventDescription": "Wedding reception",
    "budget": "KES 150,000"
  }'
```

**Expected result:**
- Response with `requestId`
- Confirmation email to `test@example.com`
- Admin notification to configured email

## 🎨 Branding

- **Company**: Boom Audio Visuals
- **Location**: Kisumu, Kenya (serves all 47 counties)
- **Phone**: +254 742 412650
- **Email**: boomaudiovisuals254@gmail.com
- **Website**: https://boomaudiovisuals.co.ke
- **Colors**: Blue (#0b5fff), Yellow (#ffd43b)

## 🚢 Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Railway/Render/DigitalOcean)
1. Set environment variables
2. Deploy from `server/` directory
3. Update `BACKEND_URL` in frontend `.env`

## 📝 License

MIT License - see LICENSE file for details

## 💬 Support

For support or bookings:
- 📞 Phone: +254 742 412650
- 📧 Email: boomaudiovisuals254@gmail.com
- 🌐 Website: https://boomaudiovisuals.co.ke

---

Made with ❤️ in Kisumu, Kenya

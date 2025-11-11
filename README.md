# Zenith Events - Premium Event Production Platform

A comprehensive full-stack platform for managing African events, from request intake to payment processing.

## Features
A comprehensive full-stack platform for managing African events, from request intake to payment processing.
# Boom Audio Visuals - Professional Audio-Visual Production (Kisumu, Kenya)

Boom Audio Visuals provides professional audio-visual production and event services from Kisumu to all corners of Kenya. We deliver sound, lighting, staging and full production for corporate, cultural and private events.
### Public Website
- Homepage with hero imagery and CTAs
- Services showcase
- Multi-step request form
- Service selection and customization
- Service request management
- Quotation editor with line items
- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 with custom design tokens
### Prerequisites
- Node.js 18+
- PostgreSQL
- Stripe Account
1. Clone repository
\`\`\`bash
git clone https://github.com/boomaudiovisuals/platform.git
cd platform
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables
\`\`\`bash
cp .env.example .env.local
# Edit .env.local with your credentials
\`\`\`

4. Set up database
\`\`\`bash
npm run db:migrate
\`\`\`

Create a `.env.local` in the `server/` folder and set `MONGODB_URI`.

5. Run development servers
```
# start backend (server/)
cd server && npm install && npm run dev

# in another terminal start frontend
npm run dev
```

5. Run development server
\`\`\`bash
npm run dev
\`\`\`


# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# M-Pesa
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...
MPESA_PASSKEY=...

# Email
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=boomaudiovisuals254@gmail.com

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# JWT
JWT_SECRET=your_jwt_secret_key_here
```
Visit http://localhost:3000

### Environment Variables
\`\`\`
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/zenith_events

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# M-Pesa
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=...
MPESA_PASSKEY=...

# Email
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=boomaudiovisuals254@gmail.com

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# JWT
JWT_SECRET=your_jwt_secret_key_here
\`\`\`
│   ├── gallery/             # Gallery page
│   ├── blog/                # Blog pages
│   ├── events/              # Events page
│   └── layout.tsx           # Root layout
├── components/
│   ├── navigation.tsx       # Header/nav
│   ├── footer.tsx          # Footer
│   ├── quote-viewer.tsx    # PDF quote template
│   └── ui/                 # Shadcn components
├── scripts/
│   └── 01-database-schema.sql  # Database setup
├── docs/
│   └── API-DOCUMENTATION.md    # API docs
└── public/
    └── images/             # Image assets
\`\`\`

## Database Schema

### Core Tables
- `users` - Admin, finance, content users
- `services` - Event services catalog
- `service_requests` - Client requests
- `quotations` - Generated quotes
- `invoices` - Billing documents
- `payment_transactions` - Payment records
- `events` - Upcoming events
- `tickets` - Event ticketing
- `media` - Gallery media
- `blog_posts` - Blog content

## API Examples

### Create Service Request
\`\`\`bash
POST /api/requests
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+254700000000",
  "eventDate": "2025-03-15",
  "venue": "Safari Park Hotel",
  "attendees": 500,
  "selectedServices": ["event-planning", "sound-systems"],
  "eventDescription": "Corporate gala for 500 guests"
}
\`\`\`

### Create Quotation
\`\`\`bash
POST /api/quotations
{
  "requestId": "R-001",
  "clientEmail": "john@example.com",
  "lineItems": [
    {
      "description": "Event Planning Services",
      "quantity": 1,
      "unitPrice": 5000
    },
    {
      "description": "Sound System Rental",
      "quantity": 1,
      "unitPrice": 2000
    }
  ],
  "notes": "Payment due 30 days from invoice"
For support or bookings: 

- Phone: +254 742 412650
- Email: boomaudiovisuals254@gmail.com
- Website: https://boomaudiovisuals.co.ke

We operate across Kenya — from Nairobi to coastal and Western counties; see the website for a full list of counties we serve.
}
vercel
\`\`\`

### Backend (Node.js/Express - Separate Deployment)
Deploy to AWS, DigitalOcean, or Render with PostgreSQL database.

## Testing
\`\`\`bash
npm run test
npm run test:integration
\`\`\`

## Contributing
1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request

## License
MIT License - see LICENSE file for details

## Support
For support, email boomaudiovisuals254@gmail.com or visit boomaudiovisuals.co.ke/help

## Roadmap
- [ ] WhatsApp integration for notifications
- [ ] Mobile app (React Native)
- [ ] Video capabilities for gallery
- [ ] Advanced analytics & reporting
- [ ] Multi-currency support
- [ ] Vendor management portal
- [ ] Client self-service portal enhancements
# jemo

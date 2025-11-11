# Zenith Events - Premium Event Production Platform

A comprehensive full-stack platform for managing African events, from request intake to payment processing.

## Features

### Public Website
- Homepage with hero imagery and CTAs
- Services showcase
- Gallery with event portfolio
- Blog with SEO support
- Events & ticketing
- Contact form

### Service Management
- Multi-step request form
- Service selection and customization
- Quote generation and tracking
- Invoice management
- Payment processing (Stripe & M-Pesa)

### Admin Dashboard
- Service request management
- Quotation editor with line items
- Invoice and payment tracking
- Event management
- Gallery uploads (Cloudinary)
- Analytics dashboard
- User management

### Technical Stack
- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Payments**: Stripe & M-Pesa integration
- **File Storage**: Cloudinary
- **Email**: SendGrid / Mailgun
- **PDF Generation**: Puppeteer

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Stripe Account
- M-Pesa Developer Account (for mobile payments)
- Cloudinary Account

### Installation

1. Clone repository
\`\`\`bash
git clone https://github.com/zenithevents/platform.git
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

5. Run development server
\`\`\`bash
npm run dev
\`\`\`

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
SENDGRID_FROM_EMAIL=hello@zenithevents.com

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# JWT
JWT_SECRET=your_jwt_secret_key_here
\`\`\`

## File Structure
\`\`\`
├── app/
│   ├── api/                  # API routes
│   ├── admin/               # Admin dashboard
│   ├── request-service/     # Service request form
│   ├── quote-status/        # Quote tracking
│   ├── payment/             # Payment page
│   ├── services/            # Services listing
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
}
\`\`\`

## Deployment

### Vercel (Recommended for Frontend)
\`\`\`bash
npm install -g vercel
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
For support, email support@zenithevents.com or visit zenithevents.com/help

## Roadmap
- [ ] WhatsApp integration for notifications
- [ ] Mobile app (React Native)
- [ ] Video capabilities for gallery
- [ ] Advanced analytics & reporting
- [ ] Multi-currency support
- [ ] Vendor management portal
- [ ] Client self-service portal enhancements
# jemo

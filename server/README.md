# Backend Setup - Boom Audio Visuals

## ✅ Configuration Complete

The backend has been set up with:
- **MongoDB Atlas** connection
- **Email notifications** using Gmail SMTP
- **Automated emails** for all customer interactions

## 🔧 Environment Variables

Your `.env` file has been created with:
```
MONGODB_URI=mongodb+srv://seth:XgvRMF9eogc7vPI3@cluster0.p8yydpu.mongodb.net/boomaudiovisuals
EMAIL_USER=bellarinseth@gmail.com
EMAIL_PASS=kept qqvc demi yfxc
EMAIL_FROM=Boom Audio Visual <bellarinseth@gmail.com>
```

## 📧 Email Notifications

### Automatic Emails Sent:

1. **Service Request Submission** (when customer fills the form):
   - ✅ Confirmation email to customer with request details
   - ✅ Notification email to admin (your inbox)

2. **Quotation Created**:
   - ✅ Quotation email to customer with pricing breakdown
   - Includes VAT calculation, line items, and total

3. **Invoice Generated**:
   - ✅ Invoice email to customer with payment details
   - Payment instructions for M-Pesa, bank transfer, and card

4. **Payment Received** (via Stripe or M-Pesa webhook):
   - ✅ Payment confirmation email to customer
   - Includes transaction ID and receipt

## 🚀 How to Start the Backend

```bash
cd server
npm install  # Install dependencies (already done)
npm run dev  # Start development server
```

The server will start on: **http://localhost:4000**

## 📝 API Endpoints

### Service Requests
- `POST /api/requests` - Create new service request (sends emails)
- `GET /api/requests` - List all requests

### Quotations
- `POST /api/quotations` - Create quotation (sends email to client)
- `GET /api/quotations` - List all quotations

### Invoices
- `POST /api/invoices` - Create invoice (sends email to client)
- `GET /api/invoices` - List all invoices

### Payments
- `POST /api/payments/stripe-webhook` - Handle Stripe payments
- `POST /api/payments/mpesa-webhook` - Handle M-Pesa payments

## 🧪 Testing Email Flow

### Test Service Request:
```bash
curl -X POST http://localhost:4000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "test@example.com",
    "phone": "+254712345678",
    "eventDate": "2025-12-25",
    "eventTime": "14:00",
    "venue": "Kisumu Sports Club",
    "city": "Kisumu",
    "selectedServices": ["Sound Systems", "Lighting"],
    "eventDescription": "Wedding reception for 200 guests",
    "budget": "KES 150,000"
  }'
```

**Result:**
- Customer receives confirmation email
- Admin receives notification at `bellarinseth@gmail.com`

## ⚙️ Gmail App Password Setup

Your Gmail is already configured with an app password. If you need to regenerate:

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to "App passwords"
4. Generate new password for "Mail"
5. Update `.env` with new password

## 📊 Email Templates

All emails include:
- **Boom Audio Visuals** branding (blue & yellow colors)
- Professional HTML formatting
- Company contact details (phone, email, location)
- Call-to-action buttons
- Responsive design for mobile

## 🔒 Security Notes

1. **Never commit `.env`** - It's already in `.gitignore`
2. In production, use environment variables (not `.env` file)
3. Add webhook signature verification for Stripe/M-Pesa
4. Consider rate limiting for email sending

## 🐛 Troubleshooting

### Emails not sending?
1. Check Gmail credentials in `.env`
2. Verify "Less secure app access" or use App Password
3. Check spam folder
4. View console logs for error messages

### MongoDB connection issues?
1. Verify internet connection
2. Check MongoDB Atlas IP whitelist (should allow all: 0.0.0.0/0)
3. Verify username/password in connection string

## 📚 Next Steps

1. **Start the backend**: `npm run dev`
2. **Test the frontend**: Fill out the service request form
3. **Check emails**: Both customer and admin should receive emails
4. **Monitor logs**: Watch console for email delivery status

## 🎉 Success Indicators

When working correctly, you'll see:
```
✅ Confirmation email sent: <message-id>
✅ Admin notification sent: <message-id>
Connected to MongoDB
Backend listening on http://localhost:4000
```

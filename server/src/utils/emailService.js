import nodemailer from 'nodemailer'

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

/**
 * Send email confirmation to client when they submit a service request
 */
export async function sendServiceRequestConfirmation(requestData) {
  try {
    const transporter = createTransporter()
    
    const { firstName, lastName, email, phone, eventDate, eventTime, venue, selectedServices } = requestData

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Boom Audio Visual <noreply@boomaudiovisuals.co.ke>',
      to: email,
      subject: '🎉 Service Request Received - Boom Audio Visuals',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0b5fff 0%, #ffd43b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #0b5fff; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #ffd43b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Thank You for Your Request!</h1>
              <p>We've received your service request</p>
            </div>
            <div class="content">
              <p>Dear ${firstName} ${lastName},</p>
              
              <p>Thank you for choosing <strong>Boom Audio Visuals</strong>! We've received your service request and our team will review it shortly.</p>
              
              <div class="details">
                <h3>Your Request Details:</h3>
                <div class="detail-row">
                  <span class="detail-label">Name:</span> ${firstName} ${lastName}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span> ${email}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span> ${phone}
                </div>
                ${eventDate ? `<div class="detail-row"><span class="detail-label">Event Date:</span> ${eventDate}</div>` : ''}
                ${eventTime ? `<div class="detail-row"><span class="detail-label">Event Time:</span> ${eventTime}</div>` : ''}
                ${venue ? `<div class="detail-row"><span class="detail-label">Venue:</span> ${venue}</div>` : ''}
                ${selectedServices && selectedServices.length > 0 ? `
                  <div class="detail-row">
                    <span class="detail-label">Selected Services:</span><br/>
                    ${selectedServices.map(s => `• ${s}`).join('<br/>')}
                  </div>
                ` : ''}
              </div>
              
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your request within 24 hours</li>
                <li>We'll prepare a customized quotation based on your requirements</li>
                <li>You'll receive a detailed proposal via email</li>
                <li>We'll schedule a call to discuss any questions</li>
              </ul>
              
              <center>
                <a href="https://boomaudiovisuals.co.ke/quote-status" class="button">Track Your Request</a>
              </center>
              
              <p>If you have any immediate questions, feel free to contact us:</p>
              <p>
                📞 <strong>+254 742 412650</strong><br/>
                📧 <strong>boomaudiovisuals254@gmail.com</strong><br/>
                📍 <strong>Kisumu, Kenya</strong>
              </p>
            </div>
            <div class="footer">
              <p>Boom Audio Visuals - Making Your Events Unforgettable</p>
              <p>www.boomaudiovisuals.co.ke</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Confirmation email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending confirmation email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send internal notification to admin when new service request is received
 */
export async function sendAdminNotification(requestData) {
  try {
    const transporter = createTransporter()
    
    const { firstName, lastName, email, phone, eventDate, venue, selectedServices, eventDescription, budget } = requestData

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Boom Audio Visual <noreply@boomaudiovisuals.co.ke>',
      to: process.env.EMAIL_USER, // Send to admin email
      subject: `🔔 New Service Request from ${firstName} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background: #0b5fff; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f5f5f5; padding: 30px; }
            .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #ffd43b; }
            .label { font-weight: bold; color: #0b5fff; display: inline-block; min-width: 150px; }
            .urgent { background: #fff3cd; border-left-color: #ffd43b; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 New Service Request Alert</h2>
              <p>A new client has submitted a service request</p>
            </div>
            <div class="content">
              <div class="section">
                <h3>Client Information</h3>
                <p><span class="label">Name:</span> ${firstName} ${lastName}</p>
                <p><span class="label">Email:</span> <a href="mailto:${email}">${email}</a></p>
                <p><span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a></p>
              </div>
              
              <div class="section">
                <h3>Event Details</h3>
                <p><span class="label">Event Date:</span> ${eventDate || 'Not specified'}</p>
                <p><span class="label">Venue:</span> ${venue || 'Not specified'}</p>
                <p><span class="label">Budget:</span> ${budget || 'Not specified'}</p>
              </div>
              
              ${selectedServices && selectedServices.length > 0 ? `
                <div class="section">
                  <h3>Selected Services</h3>
                  <ul>
                    ${selectedServices.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${eventDescription ? `
                <div class="section">
                  <h3>Event Description</h3>
                  <p>${eventDescription}</p>
                </div>
              ` : ''}
              
              <div class="urgent">
                <strong>⚡ Action Required:</strong> Please review this request and send a quotation within 24 hours.
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Admin notification sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending admin notification:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send quotation to client
 */
export async function sendQuotationEmail(quotationData, clientEmail, clientName) {
  try {
    const transporter = createTransporter()
    
    const { lineItems, subtotal, tax, discount, total, validUntil, notes } = quotationData

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Boom Audio Visual <noreply@boomaudiovisuals.co.ke>',
      to: clientEmail,
      subject: '📋 Your Quotation from Boom Audio Visuals',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 700px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0b5fff 0%, #ffd43b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { background: #0b5fff; color: white; padding: 12px; text-align: left; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .total-row { font-weight: bold; font-size: 18px; background: #f0f8ff; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #ffd43b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Your Custom Quotation</h1>
              <p>Boom Audio Visuals</p>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              
              <p>Thank you for your interest in our services. Please find below your customized quotation:</p>
              
              <table>
                <thead>
                  <tr>
                    <th>Service Description</th>
                    <th>Qty</th>
                    <th>Unit Price (KES)</th>
                    <th>Total (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItems.map(item => `
                    <tr>
                      <td>${item.description || 'Service'}</td>
                      <td>${item.quantity || 1}</td>
                      <td>${(item.unitPrice || 0).toLocaleString()}</td>
                      <td>${((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString()}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                    <td><strong>KES ${subtotal.toLocaleString()}</strong></td>
                  </tr>
                  <tr>
                    <td colspan="3" style="text-align: right;">VAT (16%):</td>
                    <td>KES ${tax.toLocaleString()}</td>
                  </tr>
                  ${discount > 0 ? `
                    <tr>
                      <td colspan="3" style="text-align: right; color: green;">Discount:</td>
                      <td style="color: green;">- KES ${discount.toLocaleString()}</td>
                    </tr>
                  ` : ''}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;">TOTAL:</td>
                    <td>KES ${total.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              
              ${validUntil ? `<p><strong>Valid Until:</strong> ${validUntil}</p>` : ''}
              ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
              
              <center>
                <a href="https://boomaudiovisuals.co.ke/contact" class="button">Accept Quotation</a>
              </center>
              
              <p>If you have any questions or would like to discuss this quotation, please don't hesitate to contact us:</p>
              <p>
                📞 <strong>+254 742 412650</strong><br/>
                📧 <strong>boomaudiovisuals254@gmail.com</strong>
              </p>
            </div>
            <div class="footer">
              <p>Boom Audio Visuals - Premium Event Production Services</p>
              <p>www.boomaudiovisuals.co.ke</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Quotation email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending quotation email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send invoice to client
 */
export async function sendInvoiceEmail(invoiceData, clientEmail, clientName) {
  try {
    const transporter = createTransporter()
    
    const { amount, dueDate, paymentStatus, paymentMethod } = invoiceData

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Boom Audio Visual <noreply@boomaudiovisuals.co.ke>',
      to: clientEmail,
      subject: '💰 Invoice from Boom Audio Visuals',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0b5fff; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .invoice-box { background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffd43b; }
            .amount { font-size: 32px; font-weight: bold; color: #0b5fff; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #ffd43b; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 Invoice</h1>
              <p>Boom Audio Visuals</p>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              
              <p>Please find your invoice details below:</p>
              
              <div class="invoice-box">
                <p><strong>Invoice Amount:</strong></p>
                <div class="amount">KES ${amount.toLocaleString()}</div>
                <p><strong>Due Date:</strong> ${dueDate || 'Upon receipt'}</p>
                <p><strong>Status:</strong> ${paymentStatus || 'Pending'}</p>
                ${paymentMethod ? `<p><strong>Payment Method:</strong> ${paymentMethod}</p>` : ''}
              </div>
              
              <h3>Payment Options:</h3>
              <ul>
                <li><strong>M-Pesa:</strong> Send to +254 742 412650</li>
                <li><strong>Bank Transfer:</strong> Contact us for bank details</li>
                <li><strong>Card Payment:</strong> Click the button below</li>
              </ul>
              
              <center>
                <a href="https://boomaudiovisuals.co.ke/payment" class="button">Pay Now</a>
              </center>
              
              <p>Once payment is received, we'll send you a confirmation receipt.</p>
              
              <p>For any questions, please contact us:</p>
              <p>
                📞 <strong>+254 742 412650</strong><br/>
                📧 <strong>boomaudiovisuals254@gmail.com</strong>
              </p>
            </div>
            <div class="footer">
              <p>Boom Audio Visuals</p>
              <p>www.boomaudiovisuals.co.ke</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Invoice email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending invoice email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send payment confirmation
 */
export async function sendPaymentConfirmation(paymentData, clientEmail, clientName) {
  try {
    const transporter = createTransporter()
    
    const { amount, transactionId, paymentMethod } = paymentData

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Boom Audio Visual <noreply@boomaudiovisuals.co.ke>',
      to: clientEmail,
      subject: '✅ Payment Received - Boom Audio Visuals',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #ffd43b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #ddd; border-top: none; }
            .success-box { background: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Payment Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${clientName},</p>
              
              <p>Thank you! Your payment has been successfully received.</p>
              
              <div class="success-box">
                <h3>Payment Details:</h3>
                <p><strong>Amount Paid:</strong> KES ${amount.toLocaleString()}</p>
                <p><strong>Transaction ID:</strong> ${transactionId}</p>
                <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
              
              <p>Your receipt has been attached to this email. We're excited to work with you!</p>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Our team will confirm final details with you</li>
                <li>We'll schedule equipment setup and testing</li>
                <li>You'll receive event day contact information</li>
              </ul>
              
              <p>Thank you for choosing Boom Audio Visuals!</p>
              
              <p>
                📞 <strong>+254 742 412650</strong><br/>
                📧 <strong>boomaudiovisuals254@gmail.com</strong>
              </p>
            </div>
            <div class="footer">
              <p>Boom Audio Visuals - Making Your Events Unforgettable</p>
              <p>www.boomaudiovisuals.co.ke</p>
            </div>
          </div>
        </body>
        </html>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Payment confirmation sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending payment confirmation:', error)
    return { success: false, error: error.message }
  }
}

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/bachupally', (req, res) => {
  res.sendFile(path.join(__dirname, 'bachupally', 'index.html'));
});

app.get('/bachupally/', (req, res) => {
  res.sendFile(path.join(__dirname, 'bachupally', 'index.html'));
});

app.get('/manikonda', (req, res) => {
  res.sendFile(path.join(__dirname, 'manikonda', 'index.html'));
});

app.get('/manikonda/', (req, res) => {
  res.sendFile(path.join(__dirname, 'manikonda', 'index.html'));
});

app.get('/thank-you', (req, res) => {
  res.sendFile(path.join(__dirname, 'thank-you.html'));
});

// Helper functions
function getRecipientEmail(preferredBranch) {
  // All emails go to the same address
  return process.env.EMAIL_ADMIN || 'gohyacademytools@gmail.com';
}

function formatPhoneNumber(phone) {
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length === 10) {
    return `+91 ${phoneDigits}`;
  } else if (phoneDigits.length > 10 && !phone.startsWith('+')) {
    return `+${phoneDigits}`;
  }
  return phone;
}

function generateEmailHTML(data) {
  const branchName = data.preferredBranch && data.preferredBranch !== 'Either branch' 
    ? data.preferredBranch 
    : `${data.sourceBranch} Branch`;
  
  const formattedPhone = formatPhoneNumber(data.phone);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Enquiry - Rockridge Global Preschool</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .email-container {
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .email-header p {
      margin: 8px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .email-body {
      padding: 30px 20px;
    }
    .info-section {
      margin-bottom: 25px;
    }
    .info-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .info-value {
      font-size: 16px;
      color: #1f2937;
      font-weight: 500;
      margin-bottom: 15px;
    }
    .info-value a {
      color: #3b82f6;
      text-decoration: none;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
      margin: 25px 0;
    }
    .message-box {
      background-color: #f9fafb;
      border-left: 4px solid #3b82f6;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .message-box p {
      margin: 0;
      color: #374151;
      font-size: 14px;
      line-height: 1.6;
    }
    .branch-info {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .branch-info h3 {
      margin: 0 0 10px 0;
      color: #92400e;
      font-size: 16px;
    }
    .branch-info p {
      margin: 5px 0;
      color: #78350f;
      font-size: 14px;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .email-footer p {
      margin: 5px 0;
      font-size: 12px;
      color: #6b7280;
    }
    .badge {
      display: inline-block;
      background-color: #dbeafe;
      color: #1e40af;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>🎓 New Enquiry Received</h1>
      <p>Rockridge Global Preschool</p>
    </div>
    
    <div class="email-body">
      <div class="info-section">
        <div class="info-label">Parent's Name</div>
        <div class="info-value">${data.parentName}</div>
      </div>
      
      <div class="info-section">
        <div class="info-label">Mobile Number</div>
        <div class="info-value">
          <a href="tel:${data.phone}">${formattedPhone}</a>
          <br>
          <a href="https://wa.me/${data.phone.replace(/\D/g, '')}" style="font-size: 14px;">
            💬 WhatsApp
          </a>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="info-section">
        <div class="info-label">Preferred Branch</div>
        <div class="info-value">
          ${branchName}
          <span class="badge">${data.sourceBranch} Page</span>
        </div>
      </div>
      
      ${data.childAge ? `
      <div class="info-section">
        <div class="info-label">Child's Age</div>
        <div class="info-value">${data.childAge}</div>
      </div>
      ` : ''}
      
      ${data.preferredTime && data.preferredTime !== 'Any time' ? `
      <div class="info-section">
        <div class="info-label">Preferred Contact Time</div>
        <div class="info-value">${data.preferredTime}</div>
      </div>
      ` : ''}
      
      ${data.message ? `
      <div class="divider"></div>
      <div class="info-section">
        <div class="info-label">Message</div>
        <div class="message-box">
          <p>${data.message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      ` : ''}
      
      <div class="divider"></div>
      
      <div class="branch-info">
        <h3>📍 ${branchName}</h3>
        <p><strong>Form Type:</strong> ${data.formType}</p>
        <p><strong>Submitted:</strong> ${data.timestamp}</p>
        <p><strong>Page URL:</strong> <a href="${data.pageUrl}" style="color: #92400e;">${data.pageUrl}</a></p>
      </div>
    </div>
    
    <div class="email-footer">
      <p><strong>Rockridge Global Preschool</strong></p>
      <p>This is an automated email from your website contact form.</p>
      <p>Please respond to the parent at ${formattedPhone}</p>
    </div>
  </div>
</body>
</html>
  `;
}

function generateEmailText(data) {
  const branchName = data.preferredBranch && data.preferredBranch !== 'Either branch' 
    ? data.preferredBranch 
    : `${data.sourceBranch} Branch`;
  
  const formattedPhone = formatPhoneNumber(data.phone);
  
  let text = `NEW ENQUIRY - ROCKRIDGE GLOBAL PRESCHOOL\n\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  text += `Parent's Name: ${data.parentName}\n\n`;
  text += `Mobile Number: ${formattedPhone}\n\n`;
  text += `Preferred Branch: ${branchName}\n\n`;
  
  if (data.childAge) {
    text += `Child's Age: ${data.childAge}\n\n`;
  }
  
  if (data.preferredTime && data.preferredTime !== 'Any time') {
    text += `Preferred Contact Time: ${data.preferredTime}\n\n`;
  }
  
  if (data.message) {
    text += `Message:\n${data.message}\n\n`;
  }
  
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  text += `Form Type: ${data.formType}\n`;
  text += `Source: ${data.sourceBranch} Page\n`;
  text += `Submitted: ${data.timestamp}\n`;
  text += `Page URL: ${data.pageUrl}\n`;
  
  return text;
}

// Email API endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const data = req.body;

    // Validate required fields
    if (!data.parentName || !data.phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: parentName and phone are required.'
      });
    }

    // Validate phone number
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Must be at least 10 digits.'
      });
    }

    // Get recipient email
    const recipientEmail = getRecipientEmail(data.preferredBranch);
    
    if (!recipientEmail) {
      console.error('No recipient email configured');
      return res.status(500).json({
        success: false,
        error: 'Email configuration error. Please contact support.'
      });
    }

    // Validate email configuration
    if (!process.env.SMTP_USER) {
      console.error('SMTP_USER environment variable is not set');
      return res.status(500).json({
        success: false,
        error: 'Email configuration error: SMTP_USER is not set.'
      });
    }
    
    if (!process.env.SMTP_PASS) {
      console.error('SMTP_PASS environment variable is not set');
      return res.status(500).json({
        success: false,
        error: 'Email configuration error: SMTP_PASS is not set.'
      });
    }

    console.log('Attempting to send email...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || 'smtp.gmail.com (default)');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '587 (default)');
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);

    // Configure SMTP transporter with proper settings
    const transporterConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: (process.env.SMTP_USER || '').trim(),
        pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''), // Remove all whitespace
      },
      // Timeout settings
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    };

    const transporter = nodemailer.createTransport(transporterConfig);

    // Prepare email
    const branchName = data.preferredBranch && data.preferredBranch !== 'Either branch' 
      ? data.preferredBranch 
      : `${data.sourceBranch} Branch`;

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Rockridge Global Preschool'}" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      replyTo: process.env.EMAIL_FROM || process.env.SMTP_USER,
      subject: `🎓 New Enquiry: ${data.parentName} - ${branchName}`,
      text: generateEmailText(data),
      html: generateEmailHTML(data),
    };

    // Send email with timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timeout')), 30000);
    });

    try {
      const info = await Promise.race([sendPromise, timeoutPromise]);
      console.log('✅ Email sent successfully:', info.messageId);
      console.log('📬 Email sent to:', recipientEmail);

      // Return success
      return res.status(200).json({
        success: true,
        message: 'Email sent successfully! We will contact you soon.',
        messageId: info.messageId,
      });
    } catch (emailError) {
      // Detailed error logging
      console.error('❌ Email sending failed:', emailError.message);
      console.error('Error details:', {
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode
      });
      console.error('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'NOT SET');
      console.error('SMTP_PASS:', process.env.SMTP_PASS ? `Set (length: ${process.env.SMTP_PASS.length})` : 'NOT SET');
      console.error('SMTP_HOST:', process.env.SMTP_HOST || 'NOT SET');
      console.error('SMTP_PORT:', process.env.SMTP_PORT || 'NOT SET');
      console.error('SMTP_SECURE:', process.env.SMTP_SECURE || 'NOT SET');

      if (emailError.code === 'EAUTH') {
        return res.status(500).json({
          success: false,
          error: 'SMTP authentication failed. Please check your Gmail App Password configuration.'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again or contact us directly.'
      });
    }

  } catch (error) {
    console.error('Error processing form:', error);

    return res.status(500).json({
      success: false,
      error: 'Failed to process your request. Please try again later.'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Email configured: ${process.env.SMTP_USER || 'Not configured'}`);
  console.log(`\nAvailable routes:`);
  console.log(`  - http://localhost:${PORT}/`);
  console.log(`  - http://localhost:${PORT}/bachupally/`);
  console.log(`  - http://localhost:${PORT}/manikonda/`);
  console.log(`  - http://localhost:${PORT}/thank-you`);
  console.log(`  - POST http://localhost:${PORT}/api/send-email`);
});

module.exports = app;

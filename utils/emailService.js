import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email notification when feedback is received
export const sendEmailNotification = async ({ name, email, message, feedbackId }) => {
  try {
    // Check if required environment variables are set
    if (!process.env.ADMIN_EMAIL) {
      throw new Error('ADMIN_EMAIL environment variable is not set');
    }
    if (!process.env.EMAIL_USER) {
      throw new Error('EMAIL_USER environment variable is not set');
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Feedback System" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Feedback Received from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            .info-row {
              margin: 15px 0;
              padding: 10px;
              background: white;
              border-left: 4px solid #667eea;
              border-radius: 4px;
            }
            .label {
              font-weight: bold;
              color: #667eea;
              display: block;
              margin-bottom: 5px;
            }
            .message-box {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border: 1px solid #e0e0e0;
            }
            .footer {
              background: #333;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 10px 10px;
              font-size: 12px;
            }
            .feedback-id {
              color: #888;
              font-size: 12px;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">📬 New Feedback Received</h1>
          </div>
          <div class="content">
            <p>You have received a new feedback submission:</p>
            
            <div class="info-row">
              <span class="label">👤 Name:</span>
              ${name}
            </div>
            
            <div class="info-row">
              <span class="label">📧 Email:</span>
              <a href="mailto:${email}">${email}</a>
            </div>
            
            <div class="message-box">
              <span class="label">💬 Message:</span>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p class="feedback-id">Feedback ID: ${feedbackId}</p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              <strong>Note:</strong> Please respond to this feedback at your earliest convenience.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0;">This is an automated notification from your Feedback System</p>
            <p style="margin: 5px 0 0 0;">Received at ${new Date().toLocaleString()}</p>
          </div>
        </body>
        </html>
      `,
      text: `
New Feedback Received

Name: ${name}
Email: ${email}

Message:
${message}

Feedback ID: ${feedbackId}
Received at: ${new Date().toLocaleString()}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Environment check:');
    console.error('- EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
    console.error('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'NOT SET');
    console.error('- ADMIN_EMAIL:', process.env.ADMIN_EMAIL ? 'Set' : 'NOT SET');
    console.error('- EMAIL_HOST:', process.env.EMAIL_HOST || 'NOT SET');
    console.error('- EMAIL_PORT:', process.env.EMAIL_PORT || 'NOT SET');
    throw error;
  }
};

// Optional: Send confirmation email to user
export const sendConfirmationEmail = async ({ name, email }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We received your feedback!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #e0e0e0;
            }
            .footer {
              background: #333;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 10px 10px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0;">✅ Thank You for Your Feedback!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for reaching out to us! We have received your message and our team will review it shortly.</p>
            <p>We typically respond within 24-48 hours. If your inquiry is urgent, please feel free to contact us directly.</p>
            <p>Best regards,<br><strong>The Support Team</strong></p>
          </div>
          <div class="footer">
            <p style="margin: 0;">This is an automated confirmation email</p>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};


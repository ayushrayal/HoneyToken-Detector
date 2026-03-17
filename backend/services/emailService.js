const nodemailer = require('nodemailer');
const Alert = require('../models/Alert');

const createTransporter = () => {
  // Use SMTP settings if provided, otherwise fallback to Gmail service
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendAlertEmail = async (alertData, retryCount = 0) => {
  const { alertId, fileName, filePath, action, userName, ipAddress, deviceInfo, userAgent, os, timestamp, fileType, severity } = alertData;

  const transporter = createTransporter();

  const formattedTime = new Date(timestamp).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const severityColor = severity === 'critical' ? '#ef4444' : severity === 'high' ? '#f97316' : '#3b82f6';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; padding: 0; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, ${severityColor}, #000000); padding: 30px; text-align: center; border-bottom: 2px solid ${severityColor}; }
        .header h1 { color: #fff; margin: 0; font-size: 26px; text-transform: uppercase; letter-spacing: 2px; }
        .header p { color: #ffffff; opacity: 0.8; margin: 10px 0 0; font-weight: 500; }
        .body { background: #0d0d12; padding: 32px; }
        .alert-badge { display: inline-block; background: ${severityColor}; color: white; padding: 6px 16px; border-radius: 4px; font-weight: 800; font-size: 13px; text-transform: uppercase; margin-bottom: 24px; box-shadow: 0 0 15px ${severityColor}44; }
        .detail-row { display: flex; padding: 12px 0; border-bottom: 1px solid #1f2937; }
        .detail-label { color: #9ca3af; width: 140px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
        .detail-value { color: #f3f4f6; flex: 1; font-size: 14px; font-weight: 600; }
        .file-highlight { background: #11111a; border: 1px solid #1f2937; border-left: 4px solid ${severityColor}; padding: 16px; border-radius: 4px; margin: 20px 0; }
        .file-name { color: #fff; font-size: 18px; font-weight: 900; margin-bottom: 4px; }
        .file-path { color: #6b7280; font-size: 12px; font-family: monospace; word-break: break-all; }
        .footer { text-align: center; padding: 20px; background: #08080a; color: #4b5563; font-size: 11px; }
        .btn { display: inline-block; background: ${severityColor}; color: white; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 24px; transition: all 0.3s; }
        .warning-icon { font-size: 52px; margin-bottom: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="warning-icon">🛡️</div>
          <h1>HONEYTOKEN SENTINEL</h1>
          <p>SOC Intelligence Dashboard — v3.0</p>
        </div>
        <div class="body">
          <div class="alert-badge">${severity?.toUpperCase() || 'CRITICAL'} BREACH DETECTED</div>
          
          <div class="file-highlight">
            <div style="color: #9ca3af; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Intercepted Asset Access</div>
            <div class="file-name">🚨 ${fileName}</div>
            <div class="file-path">${filePath}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Action</div>
            <div class="detail-value" style="color: ${severityColor};">${action?.toUpperCase()}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">IP Address</div>
            <div class="detail-value">${ipAddress}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Device Info</div>
            <div class="detail-value">${deviceInfo}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">System OS</div>
            <div class="detail-value">${os}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Incident Time</div>
            <div class="detail-value">${formattedTime}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Alert Severity</div>
            <div class="detail-value" style="color: ${severityColor}; text-transform: uppercase;">${severity}</div>
          </div>

          <div style="margin-top: 30px; padding: 20px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1); border-radius: 8px;">
            <p style="color: #ef4444; margin: 0 0 8px; font-weight: 800; font-size: 14px;">⚠️ IMMEDIATE SECURITY ACTION REQUIRED</p>
            <p style="color: #9ca3af; margin: 0; font-size: 13px; line-height: 1.6;">
              An unauthorized interaction with a monitored honeytoken asset has been verified. 
              Automated countermeasures have been initialized. Please logs into the SOC Dashboard for forensic snapshots.
            </p>
          </div>

          <div style="text-align: center; margin-top: 10px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/alerts" class="btn">INITIALIZE FORENSIC VIEW →</a>
          </div>
        </div>
        <div class="footer">
          <p>AUTHORIZED SECURITY PERSONNEL ONLY | HoneyToken Sentinel v3.0</p>
          <p>This is a high-priority automated transmission. Do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"HoneyToken Sentinel v3.0 🛡️" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
    to: alertData.recipient || process.env.ALERT_EMAIL || 'nxtzen.co@gmail.com',
    subject: `🚨 [SOC-ALERT] ${severity?.toUpperCase()} BREACH: ${fileName} was ${action}`,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Alert email sent:', info.messageId);
    
    // Update Alert status in DB
    if (alertId) {
      await Alert.findByIdAndUpdate(alertId, { 
        emailStatus: 'sent', 
        emailSent: true,
        retryCount: retryCount 
      });
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Email sending failed (Attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < 2) {
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return sendAlertEmail(alertData, retryCount + 1);
    }
    
    // Mark as failed after all retries
    if (alertId) {
      await Alert.findByIdAndUpdate(alertId, { 
        emailStatus: 'failed',
        retryCount: retryCount 
      });
    }
    
    return { success: false, error: error.message };
  }
};

const sendResetPasswordEmail = async (email, token) => {
  const transporter = createTransporter();
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"HoneyToken Sentinel 🛡️" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 HoneyToken Sentinel - Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #050507; color: #f3f4f6; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0d0d12; border: 1px solid #1a1a20; border-radius: 12px; padding: 40px;">
          <h2 style="color: #3b82f6; text-align: center;">Password Reset Request</h2>
          <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following button to complete the process:</p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p style="color: #6b7280; font-size: 12px; margin-top: 40px; border-top: 1px solid #1a1a20; pt: 20px;">
            This link will expire in 1 hour.
          </p>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendAlertEmail, sendResetPasswordEmail };

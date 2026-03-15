const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Use SMTP settings if provided, otherwise fallback to Gmail service
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
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
  const { fileName, action, userName, ipAddress, deviceInfo, userAgent, os, timestamp, fileType, severity } = alertData;

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
        body { font-family: Arial, sans-serif; background: #0a0a0a; color: #e0e0e0; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, ${severityColor}, #000000); padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 24px; }
        .header p { color: #fecaca; margin: 5px 0 0; }
        .body { background: #111827; padding: 24px; border-radius: 0 0 8px 8px; }
        .alert-badge { display: inline-block; background: ${severityColor}; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 16px; }
        .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #1f2937; }
        .detail-label { color: #9ca3af; min-width: 150px; font-size: 14px; }
        .detail-value { color: #f3f4f6; font-size: 14px; font-weight: 600; }
        .file-highlight { background: #1f2937; border-left: 4px solid ${severityColor}; padding: 12px 16px; border-radius: 4px; margin: 16px 0; }
        .file-name { color: ${severityColor}; font-size: 18px; font-weight: bold; }
        .footer { text-align: center; padding: 16px; color: #6b7280; font-size: 12px; }
        .btn { display: inline-block; background: ${severityColor}; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 16px; }
        .warning-icon { font-size: 48px; margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="warning-icon">🚨</div>
          <h1>SECURITY ALERT — Nxtzen File Guardian</h1>
          <p>A honeypot trap file has been triggered</p>
        </div>
        <div class="body">
          <div class="alert-badge">${severity?.toUpperCase() || 'HIGH'} SEVERITY TRIGGER</div>
          
          <div class="file-highlight">
            <div style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">File Accessed</div>
            <div class="file-name">📄 ${fileName}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">Action Performed</div>
            <div class="detail-value">${action?.toUpperCase()}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">User / Username</div>
            <div class="detail-value">${userName}</div>
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
            <div class="detail-label">Operating System</div>
            <div class="detail-value">${os}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">User Agent</div>
            <div class="detail-value" style="font-size: 11px;">${userAgent}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Date & Time (IST)</div>
            <div class="detail-value">${formattedTime}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">File Type</div>
            <div class="detail-value" style="color: ${severityColor};">${fileType === 'honeypot' ? '🪤 HONEYPOT (Trap File)' : 'Normal'}</div>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #1f2937; border-radius: 8px;">
            <p style="color: #f59e0b; margin: 0 0 8px; font-weight: bold;">⚠️ Immediate Action Required</p>
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
              An unauthorized attempt to access a monitored honeypot file has been detected. 
              Review the activity logs immediately in your Nxtzen File Guardian dashboard.
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/alerts" class="btn">View Full Alert Details →</a>
          </div>
        </div>
        <div class="footer">
          <p>This is an automated security alert from <strong>Nxtzen File Guardian</strong></p>
          <p>Do not reply to this email. Log in to your dashboard to manage alerts.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Nxtzen File Guardian 🛡️" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
    to: process.env.ALERT_EMAIL || 'nxtzen.cog@gmail.com',
    subject: `🚨 [${severity?.toUpperCase() || 'HIGH'}] SECURITY ALERT: Honeypot Triggered — ${fileName} was ${action}`,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Alert email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Email sending failed (Attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < 2) {
      console.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return sendAlertEmail(alertData, retryCount + 1);
    }
    
    return { success: false, error: error.message };
  }
};

module.exports = { sendAlertEmail };

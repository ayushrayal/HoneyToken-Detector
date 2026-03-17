const express = require('express');
const router = express.Router();
const { sendAlertEmail } = require('../services/emailService');

// @route   POST api/settings/test-email
// @desc    Send a test email to verify SMTP configuration
// @access  Private (Admin only)
router.post('/test-email', async (req, res) => {
  try {
    const testData = {
      fileName: 'TEST_CONNECTION.vault',
      filePath: '/system/security/test',
      action: 'verification',
      userName: req.user?.name || 'Administrator',
      ipAddress: req.ip || '127.0.0.1',
      deviceInfo: 'Sentinel Test Protocol',
      os: 'SOC System',
      timestamp: new Date(),
      fileType: 'honeypot',
      severity: 'medium'
    };

    const result = await sendAlertEmail(testData);

    if (result.success) {
      return res.json({ success: true, message: 'Test email sent successfully.' });
    } else {
      console.error('Test email failure:', result.error);
      return res.status(500).json({ success: false, message: 'Failed to send email. Check SMTP configuration.', error: result.error });
    }
  } catch (err) {
    console.error('Settings route error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during email dispatch.' });
  }
});

module.exports = router;

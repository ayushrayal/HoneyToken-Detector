const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');
const MonitoredFile = require('../models/MonitoredFile');
const Alert = require('../models/Alert');
const { sendAlertEmail } = require('../services/emailService');
const { takeDashboardSnapshot } = require('../services/snapshotService');

// Get all activity logs
router.get('/', auth, async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Record new activity (normally done by fileWatcher, but we expose an API for simulation/testing)
router.post('/', async (req, res) => {
  try {
    const { fileId, action, userName, ipAddress, deviceInfo, duration } = req.body;
    
    // Find the file
    const file = await MonitoredFile.findById(fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Create log
    const log = await ActivityLog.create({
      fileId: file._id,
      fileName: file.name,
      filePath: file.path,
      fileType: file.type,
      action,
      userName: userName || 'Unknown',
      ipAddress: ipAddress || req.ip || 'Unknown',
      deviceInfo: deviceInfo || req.headers['user-agent'] || 'Unknown',
      duration: duration || 0,
      isSuspicious: file.type === 'honeypot'
    });

    // If Honeypot, create alert and send email
    if (file.type === 'honeypot' && (file.alertOnAccess || file.alertOnEdit || file.alertOnDownload || file.alertOnDelete)) {
      
      // Let's generate a snapshot URL first
      let snapshotUrl = null;
      try {
        snapshotUrl = await takeDashboardSnapshot();
      } catch (snapErr) {
        console.error('Failed to take snapshot:', snapErr.message);
      }

      const alert = await Alert.create({
        activityId: log._id,
        fileId: file._id,
        fileName: file.name,
        action,
        userName: log.userName,
        ipAddress: log.ipAddress,
        deviceInfo: log.deviceInfo,
        severity: 'critical',
        snapshotUrl,
        message: `Honeypot trap file '${file.name}' was ${action}.`
      });

      // Send email
      const emailResult = await sendAlertEmail({
        fileName: file.name,
        action,
        userName: log.userName,
        ipAddress: log.ipAddress,
        deviceInfo: log.deviceInfo,
        timestamp: log.timestamp,
        fileType: file.type
      });

      if (emailResult.success) {
        alert.emailSent = true;
        await alert.save();
      }

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.emit('new_alert', alert);
      }
    }

    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

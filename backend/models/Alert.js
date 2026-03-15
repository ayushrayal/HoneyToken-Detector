const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'ActivityLog' },
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MonitoredFile' },
  fileName: { type: String, required: true },
  action: { type: String, required: true },
  userName: { type: String, default: 'Unknown' },
  ipAddress: { type: String, default: 'Local Machine' },
  deviceInfo: { type: String, default: 'Unknown' },
  operatingSystem: { type: String, default: 'Unknown' },
  userAgent: { type: String, default: 'FileSystemWatcher' },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'high' },
  isRead: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  snapshotUrl: { type: String, default: null }, // Forensic snapshot of dashboard
  screenshotPath: { type: String, default: null }, // Desktop screenshot
  timestamp: { type: Date, default: Date.now },
  message: { type: String, default: '' }
});

module.exports = mongoose.model('Alert', alertSchema);

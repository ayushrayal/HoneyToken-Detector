const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MonitoredFile' },
  fileName: { type: String, required: true },
  filePath: { type: String },
  fileType: { type: String, enum: ['normal', 'honeypot'], default: 'normal' },
  action: {
    type: String,
    enum: ['open', 'read', 'edit', 'delete', 'download', 'copy', 'access'],
    required: true
  },
  userName: { type: String, default: 'Unknown' },
  ipAddress: { type: String, default: 'Unknown' },
  deviceInfo: { type: String, default: 'Unknown' },
  duration: { type: Number, default: 0 }, // seconds
  timestamp: { type: Date, default: Date.now },
  isSuspicious: { type: Boolean, default: false },
  metadata: { type: Object, default: {} }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);

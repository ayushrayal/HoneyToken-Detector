const mongoose = require('mongoose');

const monitoredFileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  folder: { type: String, required: true },
  type: { type: String, enum: ['normal', 'honeypot'], default: 'normal' },
  description: { type: String, default: '' },
  alertOnAccess: { type: Boolean, default: true },
  alertOnEdit: { type: Boolean, default: true },
  alertOnDelete: { type: Boolean, default: true },
  alertOnDownload: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MonitoredFile', monitoredFileSchema);

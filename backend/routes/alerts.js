const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Alert = require('../models/Alert');

// Get all alerts
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get unread alerts count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Alert.countDocuments({ isRead: false });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark alert as read
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) io.emit('alertMarkedRead', { alertId: req.params.id });

    res.json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark all as read
router.post('/mark-all-read', auth, async (req, res) => {
  try {
    await Alert.updateMany({ isRead: false }, { isRead: true });
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) io.emit('allAlertsMarkedRead');

    res.json({ message: 'All alerts marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete individual alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) io.emit('alertDeleted', { alertId: req.params.id });

    res.json({ message: 'Alert deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Bulk delete alerts
router.post('/bulk-delete', auth, async (req, res) => {
  try {
    const { alertIds } = req.body;
    if (!Array.isArray(alertIds)) {
      return res.status(400).json({ message: 'Invalid alert IDs' });
    }
    
    await Alert.deleteMany({ _id: { $in: alertIds } });
    
    // Emit real-time update
    const io = req.app.get('io');
    if (io) io.emit('alertsBulkDeleted', { alertIds });

    res.json({ message: 'Alerts deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

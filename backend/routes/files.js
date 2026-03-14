const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MonitoredFile = require('../models/MonitoredFile');

// Get all monitored files
router.get('/', auth, async (req, res) => {
  try {
    const files = await MonitoredFile.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single file
router.get('/:id', auth, async (req, res) => {
  try {
    const file = await MonitoredFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create file
router.post('/', auth, async (req, res) => {
  try {
    const file = await MonitoredFile.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update file
router.put('/:id', auth, async (req, res) => {
  try {
    const file = await MonitoredFile.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    await MonitoredFile.findByIdAndDelete(req.params.id);
    res.json({ message: 'File removed from monitoring' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

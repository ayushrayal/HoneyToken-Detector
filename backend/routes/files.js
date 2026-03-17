const express = require('express');
const router = express.Router();
const fs = require('fs');
const auth = require('../middleware/auth');
const MonitoredFile = require('../models/MonitoredFile');
const { addWatchPath, removeWatchPath } = require('../services/fileWatcher');

// Get all monitored files
router.get('/', auth, async (req, res) => {
  try {
    const files = await MonitoredFile.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single file
router.get('/:id', auth, async (req, res) => {
  try {
    const file = await MonitoredFile.findOne({ _id: req.params.id, userId: req.user.id });
    if (!file) return res.status(404).json({ message: 'File not found' });
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create file
router.post('/', auth, async (req, res) => {
  try {
    const { path } = req.body;
    
    // Validate that the file path exists
    if (!fs.existsSync(path)) {
      return res.status(400).json({ message: "File path does not exist" });
    }

    const file = await MonitoredFile.create({ ...req.body, userId: req.user.id });
    
    // Add to real-time watcher
    addWatchPath(file.path);
    
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update file
router.put('/:id', auth, async (req, res) => {
  try {
    const oldFile = await MonitoredFile.findOne({ _id: req.params.id, userId: req.user.id });
    if (!oldFile) return res.status(404).json({ message: 'File not found or access denied' });

    const file = await MonitoredFile.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user.id, updatedAt: Date.now() },
      { new: true }
    );
    if (!file) return res.status(404).json({ message: 'File not found' });
    
    // If path changed, update watcher
    if (oldFile && oldFile.path !== file.path) {
      removeWatchPath(oldFile.path);
      addWatchPath(file.path);
    }
    
    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await MonitoredFile.findOne({ _id: req.params.id, userId: req.user.id });
    if (file) {
      // Remove from real-time watcher
      removeWatchPath(file.path);
      await MonitoredFile.findByIdAndDelete(req.params.id);
    } else {
      return res.status(404).json({ message: 'File not found or access denied' });
    }
    res.json({ message: 'File removed from monitoring' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

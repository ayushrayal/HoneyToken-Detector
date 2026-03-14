const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MonitoredFile = require('../models/MonitoredFile');
const ActivityLog = require('../models/ActivityLog');
const Alert = require('../models/Alert');

router.get('/stats', auth, async (req, res) => {
  try {
    const totalFiles = await MonitoredFile.countDocuments();
    const trapFiles = await MonitoredFile.countDocuments({ type: 'honeypot' });
    const totalAlerts = await Alert.countDocuments();
    const unreadAlerts = await Alert.countDocuments({ isRead: false });
    const suspiciousActivities = await ActivityLog.countDocuments({ isSuspicious: true });
    
    // Get recent activity
    const recentActivity = await ActivityLog.find().sort({ timestamp: -1 }).limit(5);

    // Prepare data for Heatmap (Count of actions by hour or day)
    // For simplicity, we'll return top 5 most accessed files
    const topFiles = await ActivityLog.aggregate([
      { $group: { _id: '$fileName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Data for activity timeline (last 7 days counts)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activityTimeline = await ActivityLog.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      { 
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      totalFiles,
      trapFiles,
      totalAlerts,
      unreadAlerts,
      suspiciousActivities,
      recentActivity,
      topFiles,
      activityTimeline
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

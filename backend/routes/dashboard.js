const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const MonitoredFile = require('../models/MonitoredFile');
const ActivityLog = require('../models/ActivityLog');
const Alert = require('../models/Alert');

router.get('/stats', auth, async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized: User not identified' });
  }

  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const totalFiles = await MonitoredFile.countDocuments({ userId });
    const trapFiles = await MonitoredFile.countDocuments({ userId, type: 'honeypot' });
    const totalAlerts = await Alert.countDocuments({ userId });
    const unreadAlerts = await Alert.countDocuments({ userId, isRead: false });
    const suspiciousActivities = await ActivityLog.countDocuments({ userId, isSuspicious: true });
    
    // Get recent activity
    const recentActivity = await ActivityLog.find({ userId }).sort({ timestamp: -1 }).limit(10);

    // Alerts per hour (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const alertsPerHour = await Alert.aggregate([
      { 
        $match: { 
          userId, 
          timestamp: { $gte: twentyFourHoursAgo } 
        } 
      },
      {
        $group: {
          _id: { $hour: "$timestamp" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Top attacked files (Honeypots only)
    const topAttackedFiles = await ActivityLog.aggregate([
      { 
        $match: { 
          userId, 
          isSuspicious: true 
        } 
      },
      { $group: { _id: '$fileName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Data for activity timeline (last 7 days counts)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activityTimeline = await ActivityLog.aggregate([
      { 
        $match: { 
          userId, 
          timestamp: { $gte: sevenDaysAgo } 
        } 
      },
      { 
        $group: {
          _id: { $dateToString: { format: '%m-%d', date: '$timestamp' } },
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
      topAttackedFiles,
      alertsPerHour,
      activityTimeline
    });

  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ message: 'Internal server error while fetching dashboard stats' });
  }
});

module.exports = router;

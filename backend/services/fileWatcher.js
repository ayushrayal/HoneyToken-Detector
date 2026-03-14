const chokidar = require("chokidar");
const MonitoredFile = require("../models/MonitoredFile");
const ActivityLog = require("../models/ActivityLog");
const Alert = require("../models/Alert");

/**
 * Starts watching a directory for file changes and logs activity/alerts.
 * @param {Object} io Socket.io instance for real-time notifications.
 */
const startWatching = (io) => {
  const watchPath = "D:/Nextzen";

  const watcher = chokidar.watch(watchPath, {
    persistent: true,
    ignoreInitial: true,
    depth: 99
  });

  console.log(`Watcher started on ${watchPath}`);

  watcher.on("all", async (event, path) => {
    // Focus on file changes, additions, and deletions
    if (!['add', 'change', 'unlink'].includes(event)) return;

    const normalizedPath = path.replace(/\\/g, "/");
    
    try {
      // Ensure DB is connected
      if (require('mongoose').connection.readyState !== 1) return;

      // Find if this file is monitored
      const monitoredFile = await MonitoredFile.findOne({ 
        path: { $regex: new RegExp(`^${normalizedPath}$`, 'i') } 
      });

      if (!monitoredFile) return;

      console.log(`Monitored file matched [${event}]: ${monitoredFile.name}`);

      // Map event to action
      let action = 'access';
      if (event === 'change') action = 'edit';
      if (event === 'unlink') action = 'delete';
      if (event === 'add') action = 'access';

      // Create Activity Log
      const activity = await ActivityLog.create({
        fileId: monitoredFile._id,
        fileName: monitoredFile.name,
        filePath: monitoredFile.path,
        fileType: monitoredFile.type,
        action: action,
        userName: 'System Watcher',
        ipAddress: '127.0.0.1',
        deviceInfo: 'Local Server',
        timestamp: new Date(),
        isSuspicious: monitoredFile.type === 'honeypot'
      });

      // Emit Activity via Socket
      io.emit('new-activity', activity);

      // Check if an alert should be created
      let shouldAlert = false;
      if (action === 'edit' && monitoredFile.alertOnEdit) shouldAlert = true;
      if (action === 'delete' && monitoredFile.alertOnDelete) shouldAlert = true;
      if (action === 'access' && monitoredFile.alertOnAccess) shouldAlert = true;
      
      // Honeypots always alert
      if (monitoredFile.type === 'honeypot') shouldAlert = true;

      if (shouldAlert) {
        const alert = await Alert.create({
          activityId: activity._id,
          fileId: monitoredFile._id,
          fileName: monitoredFile.name,
          action: action,
          severity: monitoredFile.type === 'honeypot' ? 'critical' : 'high',
          message: `Alert: ${monitoredFile.name} was ${action}ed.`
        });

        // Emit Alert via Socket
        io.emit('new-alert', alert);
        console.log(`Alert emitted for monitored file: ${monitoredFile.name}`);
      }

    } catch (err) {
      console.error(`Error in file watcher for ${normalizedPath}:`, err);
    }
  });

  watcher.on("error", (error) => {
    console.error(`Watcher error: ${error}`);
  });

  return watcher;
};

module.exports = { startWatching };
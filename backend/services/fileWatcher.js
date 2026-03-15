const chokidar = require("chokidar");
const os = require("os");
const MonitoredFile = require("../models/MonitoredFile");
const ActivityLog = require("../models/ActivityLog");
const Alert = require("../models/Alert");
const { sendAlertEmail } = require("./emailService");
const { takeDashboardSnapshot } = require("./snapshotService");
const { captureDesktop } = require("./screenshotService");

let watcher = null;
let currentIo = null;

/**
 * Starts watching a directory for file changes and logs activity/alerts.
 * @param {Object} io Socket.io instance for real-time notifications.
 */
const startWatching = async (io) => {
  currentIo = io;

  // Initialize watcher
  watcher = chokidar.watch([], {
    persistent: true,
    ignoreInitial: true,
    depth: 99,
    alwaysStat: true // Required for detection accuracy 
  });

  console.log(`Watcher initialized`);

  // Load all existing monitored files from DB
  try {
    const files = await MonitoredFile.find({ isActive: true });
    files.forEach(file => {
      // Normalize and add to watcher
      const normalizedPath = file.path.replace(/\\/g, "/");
      watcher.add(normalizedPath);
    });
    console.log(`Watching ${files.length} existing files from database`);
  } catch (err) {
    console.error("Failed to load initial files for watcher:", err);
  }

  watcher.on("all", async (event, path) => {
    // Focus on file changes, additions, and deletions
    // Support add (open), change (edit), and raw (read)
    if (!['add', 'change', 'unlink', 'raw'].includes(event)) return;

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
      if (event === 'add') action = 'open';
      if (event === 'raw') action = 'read';

      // Capture System Forensics
      const systemHostname = os.hostname();
      const systemPlatform = os.platform();
      const systemType = os.type();
      const forensics = {
        ipAddress: "Local Machine",
        deviceInfo: `${systemHostname} - ${systemPlatform}`,
        operatingSystem: systemType,
        userAgent: "FileSystemWatcher"
      };

      // Create Activity Log
      const activity = await ActivityLog.create({
        fileId: monitoredFile._id,
        fileName: monitoredFile.name,
        filePath: monitoredFile.path,
        fileType: monitoredFile.type,
        action: action,
        userName: 'System Watcher',
        ipAddress: forensics.ipAddress,
        deviceInfo: forensics.deviceInfo,
        os: forensics.operatingSystem, // Map for ActivityLog schema
        userAgent: forensics.userAgent,
        timestamp: new Date(),
        isSuspicious: monitoredFile.type === 'honeypot'
      });

      // Emit Activity via Socket
      if (currentIo) {
        currentIo.emit('newActivity', activity);
        currentIo.emit('activityUpdate', activity); // Requirement 6
      }

      // Check if an alert should be created
      let shouldAlert = false;
      if (action === 'edit' && monitoredFile.alertOnEdit) shouldAlert = true;
      if (action === 'delete' && monitoredFile.alertOnDelete) shouldAlert = true;
      if (action === 'access' || action === 'open' || action === 'read') {
         if (monitoredFile.alertOnAccess) shouldAlert = true;
      }
      
      // Honeypots always alert
      if (monitoredFile.type === 'honeypot') shouldAlert = true;

      if (shouldAlert) {
        // Take Forensic Snapshots
        let snapshotUrl = null;
        let screenshotPath = null;

        try {
          // Both types of screenshots for maximum evidence
          [snapshotUrl, screenshotPath] = await Promise.all([
            takeDashboardSnapshot().catch(e => { console.error(e); return null; }),
            captureDesktop().catch(e => { console.error(e); return null; })
          ]);
        } catch (captureErr) {
          console.error("Forensic capture failed:", captureErr.message);
        }

        const alert = await Alert.create({
          activityId: activity._id,
          fileId: monitoredFile._id,
          fileName: monitoredFile.name,
          action: action,
          ...forensics,
          severity: monitoredFile.type === 'honeypot' ? 'critical' : 'high',
          message: `Alert: ${monitoredFile.name} was ${action}ed.`,
          snapshotUrl,
          screenshotPath // Desktop screenshot
        });

        // Send Email Alert
        try {
          await sendAlertEmail({
            fileName: monitoredFile.name,
            action: action,
            userName: 'System Watcher',
            ...forensics,
            os: forensics.operatingSystem, // Support email template
            timestamp: new Date(),
            fileType: monitoredFile.type
          }).then(res => {
            if (res.success) {
               alert.emailSent = true;
               alert.save();
            }
          });
        } catch (emailErr) {
          console.error("Failed to send watcher alert email:", emailErr.message);
        }

        // Emit Alert via Socket
        if (currentIo) currentIo.emit('newAlert', alert);
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

/**
 * Dynamically adds a path to the watcher.
 * @param {string} filePath 
 */
const addWatchPath = (filePath) => {
  if (watcher) {
    const normalizedPath = filePath.replace(/\\/g, "/");
    watcher.add(normalizedPath);
    console.log(`Successfully added to watcher: ${normalizedPath}`);
  }
};

/**
 * Dynamically removes a path from the watcher.
 * @param {string} filePath 
 */
const removeWatchPath = (filePath) => {
  if (watcher) {
    const normalizedPath = filePath.replace(/\\/g, "/");
    watcher.unwatch(normalizedPath);
    console.log(`Successfully removed from watcher: ${normalizedPath}`);
  }
};

module.exports = { startWatching, addWatchPath, removeWatchPath };
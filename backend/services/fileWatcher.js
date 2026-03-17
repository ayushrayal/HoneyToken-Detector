const chokidar = require("chokidar");
const os = require("os");
const MonitoredFile = require("../models/MonitoredFile");
const ActivityLog = require("../models/ActivityLog");
const Alert = require("../models/Alert");
const { sendAlertEmail } = require("./emailService");
const { takeDashboardSnapshot } = require("./snapshotService");
const { captureDesktop } = require("./screenshotService");
const { captureIntruder } = require("./webcamService");

let watcher = null;
let currentIo = null;

/**
 * AI Rule Engine: Checks if the file has been triggered recently.
 * @param {string} fileId 
 * @returns {Promise<boolean>} True if more than 3 triggers in 2 mins.
 */
const checkSuspiciousBehavior = async (fileId) => {
  try {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const count = await Alert.countDocuments({
      fileId,
      userId: (await MonitoredFile.findById(fileId)).userId, // Get userId from file
      timestamp: { $gte: twoMinutesAgo }
    });
    return count >= 3;
  } catch (err) {
    console.error("AI Rule Engine error:", err);
    return false;
  }
};

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

    console.log(`File event detected: [${event}] on ${path}`);

    const normalizedPath = path.replace(/\\/g, "/");
    
    try {
      // Ensure DB is connected
      if (require('mongoose').connection.readyState !== 1) return;

      // Find if this file is monitored
      const monitoredFile = await MonitoredFile.findOne({ 
        path: { $regex: new RegExp(`^${normalizedPath}$`, 'i') } 
      });

      if (!monitoredFile) return;

      console.log(`File accessed or modified: ${monitoredFile.path}`);
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
        userId: monitoredFile.userId,
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
        // AI Rules - Behavioral Detection
        const isSuspiciousBehavior = await checkSuspiciousBehavior(monitoredFile._id);
        const finalSeverity = isSuspiciousBehavior || monitoredFile.type === 'honeypot' ? 'critical' : 'high';

        // Take Forensic Snapshots
        let snapshotUrl = null;
        let screenshotPath = null;
        let intruderImage = null;

        try {
          // Both types of screenshots and webcam capture
          [snapshotUrl, screenshotPath, intruderImage] = await Promise.all([
            takeDashboardSnapshot().catch(e => null),
            captureDesktop().catch(e => null),
            captureIntruder().catch(e => null)
          ]);
        } catch (captureErr) {
          console.error("Forensic capture failed:", captureErr.message);
        }

        const alert = await Alert.create({
          activityId: activity._id,
          fileId: monitoredFile._id,
          userId: monitoredFile.userId,
          fileName: monitoredFile.name,
          action: action,
          ...forensics,
          severity: finalSeverity,
          message: isSuspiciousBehavior 
            ? `AI WARNING: Recurring activity on ${monitoredFile.name}.`
            : `Alert: ${monitoredFile.name} was ${action}ed.`,
          snapshotUrl,
          screenshotPath,
          intruderImage
        });

        // Send Email Alert to all registered users
        try {
          const User = require('../models/User');
          const users = await User.find({ role: 'admin' });
          
          for (const user of users) {
             await sendAlertEmail({
                alertId: alert._id,
                fileName: monitoredFile.name,
                filePath: monitoredFile.path,
                action: action,
                userName: 'System Watcher',
                ...forensics,
                recipient: user.email, // Send to this specific user
                os: forensics.operatingSystem,
                timestamp: new Date(),
                fileType: monitoredFile.type,
                severity: finalSeverity
              });
          }
        } catch (emailErr) {
          console.error("Failed to send watcher alert emails:", emailErr.message);
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
    console.log(`Monitoring started for: ${normalizedPath}`);
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
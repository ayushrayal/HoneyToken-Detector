const screenshot = require('screenshot-desktop');
const path = require('path');
const fs = require('fs');

/**
 * Captures a screenshot of the current desktop and saves it to the screenshots directory.
 * @returns {Promise<string>} The filename of the saved screenshot.
 */
const captureDesktop = async () => {
    try {
        const screenshotDir = path.join(__dirname, '../screenshots');
        
        // Ensure directory exists
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const filename = `incident-${Date.now()}.png`;
        const filePath = path.join(screenshotDir, filename);

        await screenshot({ filename: filePath });
        console.log(`Desktop screenshot captured: ${filename}`);
        
        return filename;
    } catch (err) {
        console.error('Failed to capture desktop screenshot:', err.message);
        return null;
    }
};

module.exports = { captureDesktop };

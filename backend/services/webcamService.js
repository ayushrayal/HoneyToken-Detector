const NodeWebcam = require('node-webcam');
const path = require('path');
const fs = require('fs');

// Capture device config
const opts = {
    width: 1280,
    height: 720,
    quality: 100,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location",
    verbose: false
};

/**
 * Captures a webcam image of the user and saves it to the intruders directory.
 * @returns {Promise<string>} The filename of the saved intruder photo.
 */
const captureIntruder = async () => {
    try {
        const intruderDir = path.join(__dirname, '../intruders');
        
        // Ensure directory exists
        if (!fs.existsSync(intruderDir)) {
            fs.mkdirSync(intruderDir, { recursive: true });
        }

        const filename = `intruder-${Date.now()}.jpg`;
        const filePath = path.join(intruderDir, filename);

        // Capture
        const webcam = NodeWebcam.create(opts);
        
        return new Promise((resolve, reject) => {
            webcam.capture(path.join(intruderDir, `intruder-${Date.now()}`), (err, data) => {
                if (err) {
                    console.error('Webcam capture failed:', err);
                    return resolve(null);
                }
                const capturedFile = path.basename(data);
                console.log(`Intruder photo captured: ${capturedFile}`);
                resolve(capturedFile);
            });
        });
    } catch (err) {
        console.error('Failed to capture intruder image:', err.message);
        return null;
    }
};

module.exports = { captureIntruder };

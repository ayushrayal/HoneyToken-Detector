const puppeteer = require('puppeteer');

const takeDashboardSnapshot = async () => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    // Go to the dashboard with a special query param to hide navbar/sidebar for snapshot
    await page.goto(`${frontendUrl}/dashboard?snapshot=true`, { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });

    const screenshotBuffer = await page.screenshot({ type: 'png' });
    
    await browser.close();

    // Since we don't have AWS S3 set up, we will just return a Base64 URL 
    // or simulate an upload. Returning base64 so it can be embedded in email or UI.
    const base64Image = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;
    return base64Image;

  } catch (error) {
    console.error('Snapshot Service Error:', error);
    return null;
  }
};

module.exports = { takeDashboardSnapshot };

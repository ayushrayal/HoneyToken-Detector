const mongoose = require('mongoose');
require('dotenv').config();
const MonitoredFile = require('./models/MonitoredFile');

async function fixExtension() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const file = await MonitoredFile.findOne({ name: "Nxtgen Password" });
    if (file) {
        file.path = "D:/Nextzen/nxtgenpassword.xlsx.txt";
        console.log(`Updated path to: ${file.path}`);
        await file.save();
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

fixExtension();

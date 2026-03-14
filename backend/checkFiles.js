const mongoose = require('mongoose');
require('dotenv').config();
const MonitoredFile = require('./models/MonitoredFile');

async function checkFiles() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const files = await MonitoredFile.find();
    console.log('Monitored Files:');
    console.log(JSON.stringify(files, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkFiles();

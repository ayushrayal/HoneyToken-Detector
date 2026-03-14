const mongoose = require('mongoose');
require('dotenv').config();
const MonitoredFile = require('./models/MonitoredFile');

async function updatePaths() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const files = await MonitoredFile.find();
    for (const file of files) {
        let changed = false;
        if (file.path.includes("D:/Nxtzen")) {
            file.path = file.path.replace("D:/Nxtzen", "D:/Nextzen");
            file.folder = file.folder.replace("D:/Nxtzen", "D:/Nextzen");
            console.log(`Updating ${file.name} path to ${file.path}`);
            changed = true;
        }
        if (file.name === "Nxtzen Secret") {
            file.path = "D:/Nextzen/nxtgenpassword.xlsx.txt";
            file.name = "Nxtgen Password";
            console.log("Updated secret file path and name to match disk.");
            changed = true;
        }
        if (changed) {
            await file.save();
        }
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

updatePaths();

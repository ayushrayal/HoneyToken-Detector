const mongoose = require('mongoose');
require('dotenv').config();
const MonitoredFile = require('./models/MonitoredFile');

async function normalizePaths() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const files = await MonitoredFile.find();
    for (const file of files) {
        let changed = false;
        const newPath = file.path.replace(/\\/g, "/");
        const newFolder = file.folder.replace(/\\/g, "/");
        
        if (newPath !== file.path || newFolder !== file.folder) {
            console.log(`Normalizing ${file.name}: ${file.path} -> ${newPath}`);
            file.path = newPath;
            file.folder = newFolder;
            changed = true;
        }

        // Also fix the Nxtzen -> Nextzen if any still left
        if (file.path.includes("Nxtzen")) {
            file.path = file.path.replace("Nxtzen", "Nextzen");
            file.folder = file.folder.replace("Nxtzen", "Nextzen");
            console.log(`Fixing typo in ${file.name}: -> ${file.path}`);
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

normalizePaths();

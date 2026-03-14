const mongoose = require('mongoose');
require('dotenv').config();
const MonitoredFile = require('./models/MonitoredFile');

async function trimPaths() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const files = await MonitoredFile.find();
    for (const file of files) {
        let changed = false;
        const trimmedPath = file.path.trim();
        const trimmedFolder = file.folder.trim();
        
        if (trimmedPath !== file.path || trimmedFolder !== file.folder) {
            console.log(`Trimming ${file.name}: '${file.path}' -> '${trimmedPath}'`);
            file.path = trimmedPath;
            file.folder = trimmedFolder;
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

trimPaths();

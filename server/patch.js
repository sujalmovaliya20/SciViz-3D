import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const patchDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sciviz3d');
    console.log('Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const experimentsCol = db.collection('experiments');
    
    const exps = await experimentsCol.find({}).toArray();
    let updated = 0;
    
    for (const exp of exps) {
      let changed = false;
      const newSteps = (exp.steps || []).map(step => {
        let newTitle = step.title;
        let newDesc = step.description;
        
        if (newTitle && newTitle.includes('仿真')) {
          newTitle = newTitle.replace(/仿真/g, ' Simulation');
          changed = true;
        }
        if (newDesc && newDesc.includes('仿真')) {
          newDesc = newDesc.replace(/仿真/g, ' Simulation');
          changed = true;
        }
        
        return { ...step, title: newTitle, description: newDesc };
      });
      
      if (changed) {
        await experimentsCol.updateOne({ _id: exp._id }, { $set: { steps: newSteps } });
        console.log(`Updated experiment: ${exp.sceneKey || exp.title} -> Fixed 仿真 -> Simulation`);
        updated++;
      }
    }
    
    console.log(`Patching complete. Updated ${updated} experiments.`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

patchDb();

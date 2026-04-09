import express from 'express';
import { 
  getExperiments, 
  getExperiment, 
  getSubjects,
  getExperimentBySceneKey,
  createExperiment, 
  updateExperiment,
  deleteExperiment
} from '../controllers/experimentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/subjects', getSubjects);

// sceneKey lookup — must come before /:id to avoid conflict
router.get('/scene/:sceneKey', getExperimentBySceneKey);

router.route('/')
  .get(getExperiments)
  .post(protect, authorize('admin'), createExperiment);

router.route('/:id')
  .get(getExperiment)
  .put(protect, authorize('admin'), updateExperiment)
  .delete(protect, authorize('admin'), deleteExperiment);

export default router;

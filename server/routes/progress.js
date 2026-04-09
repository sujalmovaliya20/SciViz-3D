import express from 'express';
import { 
  getExperimentProgress, 
  updateProgress, 
  getProgressForUser,
  getProgressStats 
} from '../controllers/progressController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getProgressStats);
router.get('/user/:userId', getProgressForUser);
router.get('/:experimentId', getExperimentProgress);
router.post('/update', updateProgress); // Note: renamed from /:experimentId to match request

export default router;

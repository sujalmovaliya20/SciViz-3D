import express from 'express';
import { getQuiz, submitQuiz } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/:experimentId', getQuiz);
router.post('/submit', submitQuiz);

export default router;

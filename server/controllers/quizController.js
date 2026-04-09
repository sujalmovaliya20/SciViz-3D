import Experiment from '../models/Experiment.js';
import Progress from '../models/Progress.js';

// @desc    Get quiz for experiment (shuffled)
// @route   GET /api/quiz/:experimentId
export const getQuiz = async (req, res, next) => {
  try {
    const experiment = await Experiment.findById(req.params.experimentId).select('quiz');

    if (!experiment || !experiment.quiz) {
      return res.status(404).json({ success: false, error: 'Quiz not found' });
    }

    // Shuffle options for each question
    const shuffledQuiz = experiment.quiz.map(q => {
      const options = [...q.options];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      return {
        question: q.question,
        options: options,
        _id: q._id
      };
    });

    res.status(200).json({ success: true, data: shuffledQuiz });
  } catch (err) {
    next(err);
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
export const submitQuiz = async (req, res, next) => {
  try {
    const { experimentId, answers } = req.body;

    const experiment = await Experiment.findById(experimentId).select('quiz');
    if (!experiment) {
      return res.status(404).json({ success: false, error: 'Experiment not found' });
    }

    let score = 0;
    const results = experiment.quiz.map((q, index) => {
      const userAnswer = answers.find(a => a.questionId === q._id.toString())?.answer;
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      
      return {
        questionId: q._id,
        isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      };
    });

    const quizScore = Math.round((score / experiment.quiz.length) * 100);

    // Update progress
    let progress = await Progress.findOne({
      userId: req.user.id,
      experimentId: experimentId
    });

    if (progress) {
      progress.quizScore = quizScore;
      progress.quizAttempts += 1;
      await progress.save();
    } else {
      await Progress.create({
        userId: req.user.id,
        experimentId: experimentId,
        quizScore,
        quizAttempts: 1
      });
    }

    res.status(200).json({
      success: true,
      data: {
        score: quizScore,
        correctCount: score,
        totalQuestions: experiment.quiz.length,
        results
      }
    });
  } catch (err) {
    next(err);
  }
};

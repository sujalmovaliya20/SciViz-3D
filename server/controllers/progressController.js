import Progress from '../models/Progress.js';
import Experiment from '../models/Experiment.js';

// @desc    Get all progress for a specific user (admin/teacher)
// @route   GET /api/progress/user/:userId
export const getProgressForUser = async (req, res, next) => {
  try {
    const progress = await Progress.find({ userId: req.params.userId }).populate('experimentId');
    res.status(200).json({ success: true, count: progress.length, data: progress });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user progress for one experiment
// @route   GET /api/progress/:experimentId
export const getExperimentProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      userId: req.user.id,
      experimentId: req.params.experimentId
    });

    if (!progress) {
      return res.status(404).json({ success: false, error: 'No progress found for this experiment' });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user progress (Upsert)
// @route   POST /api/progress/update
export const updateProgress = async (req, res, next) => {
  try {
    const { experimentId, currentStep, totalSteps, quizScore, quizAttempts, timeSpent, notes } = req.body;
    const userId = req.user.id;

    let progress = await Progress.findOne({ userId, experimentId });

    if (progress) {
      progress = await Progress.findByIdAndUpdate(
        progress._id,
        {
          currentStep,
          totalSteps,
          quizScore,
          quizAttempts,
          timeSpent,
          notes,
          completionPercent: totalSteps ? Math.round((currentStep / totalSteps) * 100) : 0,
          completedAt: currentStep === totalSteps ? Date.now() : progress.completedAt,
          lastAccessed: Date.now()
        },
        { new: true, runValidators: true }
      );
    } else {
      progress = await Progress.create({
        userId,
        experimentId,
        currentStep,
        totalSteps,
        quizScore,
        quizAttempts,
        timeSpent,
        notes,
        completionPercent: totalSteps ? Math.round((currentStep / totalSteps) * 100) : 0,
        completedAt: currentStep === totalSteps ? Date.now() : null
      });
    }

    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

// Helper: calculate study streak
function calculateStreak(progressRecords) {
  if (!progressRecords.length) return 0;

  // Collect unique study days from lastAccessed in descending order
  const daysSet = new Set();
  progressRecords.forEach(p => {
    if (p.lastAccessed) {
      daysSet.add(new Date(p.lastAccessed).toISOString().slice(0, 10));
    }
    if (p.completedAt) {
      daysSet.add(new Date(p.completedAt).toISOString().slice(0, 10));
    }
  });

  const sortedDays = [...daysSet].sort().reverse(); // most recent first
  if (!sortedDays.length) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Streak must include today or yesterday
  if (sortedDays[0] !== today && sortedDays[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = new Date(sortedDays[i - 1]);
    const curr = new Date(sortedDays[i]);
    const diff = (prev - curr) / 86400000;
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Helper: calculate achievements
function calculateAchievements(allProgress, subjectMap) {
  const completedCount = allProgress.filter(p => p.completionPercent === 100).length;
  const physicsCompleted = allProgress.filter(p => p.completionPercent === 100 && subjectMap[p.experimentId?.toString()] === 'physics').length;
  const chemistryCompleted = allProgress.filter(p => p.completionPercent === 100 && subjectMap[p.experimentId?.toString()] === 'chemistry').length;
  const biologyCompleted = allProgress.filter(p => p.completionPercent === 100 && subjectMap[p.experimentId?.toString()] === 'biology').length;
  const hasPerfectQuiz = allProgress.some(p => p.quizScore >= 3);
  const streak = calculateStreak(allProgress);
  const totalMinutes = allProgress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const avgScore = allProgress.length ? allProgress.reduce((s, p) => s + (p.quizScore || 0), 0) / allProgress.length : 0;
  const avgScorePercent = Math.round((avgScore / 3) * 100);

  const defs = [
    { id: 'first_lab', emoji: '🔬', name: 'First Lab', description: 'Complete your first experiment', earned: completedCount >= 1 },
    { id: 'physics_fan', emoji: '⚡', name: 'Physics Fan', description: 'Complete 5 physics experiments', earned: physicsCompleted >= 5 },
    { id: 'chemistry_club', emoji: '🧪', name: 'Chemistry Club', description: 'Complete 5 chemistry experiments', earned: chemistryCompleted >= 5 },
    { id: 'biology_buff', emoji: '🌿', name: 'Biology Buff', description: 'Complete 5 biology experiments', earned: biologyCompleted >= 5 },
    { id: 'perfect_score', emoji: '🎯', name: 'Perfect Score', description: 'Get 3/3 on any quiz', earned: hasPerfectQuiz },
    { id: 'on_fire', emoji: '🔥', name: 'On Fire', description: '3-day study streak', earned: streak >= 3 },
    { id: 'science_master', emoji: '🏆', name: 'Science Master', description: 'Complete 30 experiments', earned: completedCount >= 30 },
    { id: 'class10_champ', emoji: '💡', name: 'Class 10 Champion', description: 'Complete all Class 10 experiments', earned: false }, // would need class data
    { id: 'class12_legend', emoji: '🚀', name: 'Class 12 Legend', description: 'Complete all Class 12 experiments', earned: false },
    { id: 'all_rounder', emoji: '⭐', name: 'All Rounder', description: 'Complete at least 1 from each subject', earned: physicsCompleted >= 1 && chemistryCompleted >= 1 && biologyCompleted >= 1 },
    { id: 'scholar', emoji: '🎓', name: 'Scholar', description: 'Average quiz score above 80%', earned: avgScorePercent > 80 && completedCount > 0 },
    { id: 'dedicated', emoji: '📚', name: 'Dedicated', description: 'Study for 10 total hours', earned: totalMinutes >= 600 },
  ];

  return defs;
}

// Helper: build study calendar (last 30 days)
function buildStudyCalendar(allProgress) {
  const calendar = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    const dayRecords = allProgress.filter(p => {
      const accessed = p.lastAccessed ? new Date(p.lastAccessed).toISOString().slice(0, 10) : null;
      const completed = p.completedAt ? new Date(p.completedAt).toISOString().slice(0, 10) : null;
      return accessed === dateStr || completed === dateStr;
    });

    const mins = dayRecords.reduce((s, p) => s + (p.timeSpent || 0), 0);
    const completedCount = dayRecords.filter(p => {
      const completed = p.completedAt ? new Date(p.completedAt).toISOString().slice(0, 10) : null;
      return completed === dateStr;
    }).length;

    calendar.push({
      date: dateStr,
      experiments: dayRecords.length,
      completed: completedCount,
      minutes: mins,
      level: completedCount > 0 ? 2 : dayRecords.length > 0 ? 1 : 0
    });
  }
  return calendar;
}

// @desc    Get comprehensive dashboard stats
// @route   GET /api/progress/stats
export const getProgressStats = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.json({
        completedCount: 0,
        totalExperiments: 60,
        averageQuizScore: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        subjectProgress: {
          physics: { completed: 0, total: 28 },
          chemistry: { completed: 0, total: 17 },
          biology: { completed: 0, total: 15 }
        },
        recentActivity: [],
        achievements: []
      })
    }

    const progress = await Progress.find({ userId })
      .populate('experimentId')
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean()

    const completed = progress.filter(
      p => p.completionPercent >= 100
    )

    const subjectProgress = {
      physics: { completed: 0, total: 28 },
      chemistry: { completed: 0, total: 17 },
      biology: { completed: 0, total: 15 }
    }

    completed.forEach(p => {
      const subject = p.experimentId?.subject?.toLowerCase()
      if (subject && subjectProgress[subject]) {
        subjectProgress[subject].completed++
      }
    })

    const avgScore = progress.length > 0
      ? progress.reduce((s, p) => s + (p.quizScore || 0), 0) 
        / progress.length
      : 0

    res.json({
      completedCount: completed.length,
      totalExperiments: 60,
      averageQuizScore: Math.round(avgScore),
      totalTimeSpent: progress.reduce(
        (s, p) => s + (p.timeSpent || 0), 0
      ),
      currentStreak: 0,
      subjectProgress,
      recentActivity: progress.slice(0, 7).map(p => ({
        experimentId: p.experimentId?._id,
        title: p.experimentId?.title || 'Unknown',
        subject: p.experimentId?.subject || 'physics',
        completionPercent: p.completionPercent || 0,
        updatedAt: p.updatedAt
      })),
      achievements: []
    })
  } catch (err) {
    console.error('Stats error:', err)
    res.status(500).json({ message: err.message })
  }
}

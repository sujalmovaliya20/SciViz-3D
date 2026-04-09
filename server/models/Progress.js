import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  experimentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Experiment',
    required: true
  },
  currentStep: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Number,
    default: 0
  },
  completionPercent: {
    type: Number,
    default: 0
  },
  quizScore: {
    type: Number,
    default: 0
  },
  quizAttempts: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  completedAt: Date,
  notes: String,
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Progress', ProgressSchema);

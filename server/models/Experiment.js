import mongoose from 'mongoose';

const ExperimentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    unique: true,
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    enum: ['physics', 'chemistry', 'biology']
  },
  class: {
    type: Number,
    required: [true, 'Please add a class (10 or 12)'],
    enum: [10, 12]
  },
  chapter: {
    type: String,
    required: [true, 'Please add a chapter name']
  },
  chapterNumber: {
    type: Number,
    required: [true, 'Please add a chapter number']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  steps: [{
    stepNumber: Number,
    title: String,
    description: String
  }],
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  sceneKey: {
    type: String,
    required: [true, 'Please add a Three.js scene key']
  },
  thumbnail: String,
  duration: Number,
  objectives: [String],
  materials: [String],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Experiment', ExperimentSchema);

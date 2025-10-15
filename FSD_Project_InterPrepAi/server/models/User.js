const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: ''
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  lastPracticeDate: {
    type: Date,
    default: Date.now
  },
  attemptedQuestions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    status: {
      type: String,
      enum: ['correct', 'incorrect', 'partial'],
      default: 'incorrect'
    },
    attemptedAt: {
      type: Date,
      default: Date.now
    },
    timeSpent: Number,
    code: String
  }],
  completedMockInterviews: [{
    interviewId: String,
    score: Number,
    totalQuestions: Number,
    completedAt: Date,
    feedback: String
  }],
  resumeAnalysis: [{
    originalName: String,
    feedback: String,
    uploadedAt: Date,
    score: Number
  }],
  preferences: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    categories: [{
      type: String,
      enum: ['algorithms', 'data-structures', 'system-design', 'frontend', 'backend', 'database']
    }],
    dailyGoal: {
      type: Number,
      default: 3,
      min: 1,
      max: 10
    }
  },
  achievements: [{
    name: String,
    description: String,
    unlockedAt: Date,
    icon: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ streak: -1 });
userSchema.index({ points: -1 });

// Virtual for calculating total questions attempted
userSchema.virtual('totalAttempted').get(function() {
  return this.attemptedQuestions.length;
});

// Virtual for calculating success rate
userSchema.virtual('successRate').get(function() {
  if (this.attemptedQuestions.length === 0) return 0;
  const correct = this.attemptedQuestions.filter(q => q.status === 'correct').length;
  return Math.round((correct / this.attemptedQuestions.length) * 100);
});

// Virtual for calculating level based on points
userSchema.virtual('calculatedLevel').get(function() {
  return Math.floor(this.points / 100) + 1;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastPractice = new Date(this.lastPracticeDate);
  const diffTime = Math.abs(today - lastPractice);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    this.streak += 1;
  } else if (diffDays > 1) {
    this.streak = 1;
  }
  
  this.lastPracticeDate = today;
  return this.save();
};

// Method to add points
userSchema.methods.addPoints = function(points) {
  this.points += points;
  this.level = this.calculatedLevel;
  return this.save();
};

// Method to add achievement
userSchema.methods.addAchievement = function(achievement) {
  if (!this.achievements.find(a => a.name === achievement.name)) {
    this.achievements.push(achievement);
    return this.save();
  }
  return this;
};

// Ensure virtuals are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);


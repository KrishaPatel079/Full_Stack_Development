const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  questionText: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 'Dynamic Programming', 'Greedy', 'Backtracking', 'Math', 'System Design', 'Behavioral', 'Other']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  answer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  testCases: [{
    input: String,
    output: String,
    description: String
  }],
  constraints: {
    type: String,
    default: ''
  },
  hints: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  timeLimit: {
    type: Number,
    default: 30 // minutes
  },
  memoryLimit: {
    type: Number,
    default: 128 // MB
  },
  points: {
    type: Number,
    default: 10
  },
  isDailyQuestion: {
    type: Boolean,
    default: false
  },
  dailyDate: {
    type: Date
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  correctAttempts: {
    type: Number,
    default: 0
  },
  averageTime: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ isDailyQuestion: 1, dailyDate: 1 });
questionSchema.index({ tags: 1 });

// Method to update question statistics
questionSchema.methods.updateStats = function(wasCorrect, timeTaken) {
  this.totalAttempts += 1;
  if (wasCorrect) {
    this.correctAttempts += 1;
  }
  
  // Update average time
  this.averageTime = ((this.averageTime * (this.totalAttempts - 1)) + timeTaken) / this.totalAttempts;
  
  // Update success rate
  this.successRate = (this.correctAttempts / this.totalAttempts) * 100;
  
  return this.save();
};

// Method to set as daily question
questionSchema.methods.setAsDailyQuestion = function(date) {
  this.isDailyQuestion = true;
  this.dailyDate = date;
  return this.save();
};

// Method to remove daily question status
questionSchema.methods.removeDailyQuestionStatus = function() {
  this.isDailyQuestion = false;
  this.dailyDate = undefined;
  return this.save();
};

// Static method to get daily question
questionSchema.statics.getDailyQuestion = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.findOne({
    isDailyQuestion: true,
    dailyDate: {
      $gte: today,
      $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    }
  });
};

// Static method to get questions with filters
questionSchema.statics.getQuestions = function(filters = {}, page = 1, limit = 10) {
  const query = {};
  
  if (filters.category) query.category = filters.category;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  if (filters.tags && filters.tags.length > 0) query.tags = { $in: filters.tags };
  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { questionText: { $regex: filters.search, $options: 'i' } },
      { tags: { $in: [new RegExp(filters.search, 'i')] } }
    ];
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

module.exports = mongoose.model('Question', questionSchema);

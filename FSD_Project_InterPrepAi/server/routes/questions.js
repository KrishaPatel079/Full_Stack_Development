const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/questions/health
// @desc    Health check for questions route
// @access  Public
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Questions route is working!',
    timestamp: new Date().toISOString()
  });
});

// @route   GET /api/questions/test
// @desc    Test endpoint to check Question model functionality
// @access  Public
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 Testing Question model functionality...');
    
    const totalQuestions = await Question.countDocuments();
    console.log('📊 Total questions:', totalQuestions);
    
    if (totalQuestions > 0) {
      const firstQuestion = await Question.findOne();
      console.log('🔍 First question found:', firstQuestion.title);
      
      const categories = await Question.distinct('category');
      console.log('📂 Categories found:', categories);
      
      res.json({
        status: 'OK',
        totalQuestions,
        firstQuestionTitle: firstQuestion.title,
        categories,
        message: 'Question model is working correctly!'
      });
    } else {
      res.json({
        status: 'WARNING',
        totalQuestions: 0,
        message: 'No questions found in database'
      });
    }
  } catch (error) {
    console.error('❌ Test endpoint error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   GET /api/questions
// @desc    Get all questions with filters
// @access  Public (with optional auth for personalized results)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      tags, 
      search, 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    if (category) filters.category = category;
    if (difficulty) filters.difficulty = difficulty;
    if (tags) filters.tags = { $in: tags.split(',') };
    if (search) filters.$or = [
      { title: { $regex: search, $options: 'i' } },
      { questionText: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const questions = await Question.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-answer -testCases -explanation');

    const total = await Question.countDocuments(filters);

    if (req.user) {
      try {
        const userAttempts = await User.findById(req.user._id)
          .select('attemptedQuestions')
          .populate('attemptedQuestions.questionId', 'status');

        const questionsWithStatus = questions.map(question => {
          const attempt = userAttempts.attemptedQuestions.find(
            a => a.questionId._id.toString() === question._id.toString()
          );
          return {
            ...question.toObject(),
            userStatus: attempt ? attempt.status : 'not-attempted'
          };
        });

        return res.json({
          questions: questionsWithStatus,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalQuestions: total,
            hasNext: skip + questions.length < total,
            hasPrev: parseInt(page) > 1
          }
        });
      } catch (userError) {
        console.error('Error fetching user attempts:', userError);
      }
    }

    res.json({
      questions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalQuestions: total,
        hasNext: skip + questions.length < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      error: 'Server error while fetching questions',
      message: error.message
    });
  }
});

// @route   GET /api/questions/daily
// @desc    Get daily question
// @access  Public
router.get('/daily', async (req, res) => {
  try {
    console.log('🚀 Daily endpoint called');
    
    const question = await Question.findOne();
    
    if (!question) {
      return res.status(404).json({
        error: 'No questions available',
        message: 'No questions found in database'
      });
    }
    
    const safeQuestion = {
      _id: question._id,
      title: question.title,
      questionText: question.questionText,
      category: question.category,
      difficulty: question.difficulty,
      constraints: question.constraints,
      hints: question.hints,
      tags: question.tags,
      timeLimit: question.timeLimit,
      memoryLimit: question.memoryLimit,
      points: question.points
    };

    res.json({ question: safeQuestion });

  } catch (error) {
    console.error('❌ Get daily question error:', error);
    res.status(500).json({
      error: 'Server error while fetching daily question',
      message: error.message
    });
  }
});

// @route   GET /api/questions/categories
// @desc    Get all available categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Question.distinct('category');
    res.json(categories); // <-- Return array, not { categories: [...] }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// @route   GET /api/questions/difficulties
// @desc    Get all available difficulties
// @access  Public
router.get('/difficulties', async (req, res) => {
  try {
    const difficulties = await Question.distinct('difficulty');
    res.json(difficulties); // <-- Return array, not { difficulties: [...] }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/questions/tags
// @desc    Get all available tags
// @access  Public
router.get('/tags', async (req, res) => {
  try {
    const tags = await Question.distinct('tags');
    res.json({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/questions/stats
// @desc    Get basic question statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const totalQuestions = await Question.countDocuments();
    const dailyQuestion = await Question.findOne({ isDailyQuestion: true });
    
    res.json({
      totalQuestions,
      hasDailyQuestion: !!dailyQuestion,
      dailyQuestionId: dailyQuestion?._id || null
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/questions/:id
// @desc    Get question by ID
// @access  Public (with optional auth for personalized results)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (req.user) {
      const user = await User.findById(req.user._id)
        .select('attemptedQuestions')
        .populate('attemptedQuestions.questionId', 'status timeSpent code');

      const attempt = user.attemptedQuestions.find(
        a => a.questionId._id.toString() === question._id.toString()
      );

      const questionWithStatus = {
        ...question.toObject(),
        userStatus: attempt ? attempt.status : 'not-attempted',
        userAttempt: attempt ? {
          timeSpent: attempt.timeSpent,
          code: attempt.code
        } : null
      };

      return res.json({ question: questionWithStatus });
    }

    res.json({ question });

  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Server error while fetching question' });
  }
});

// @route   POST /api/questions/:id/attempt
// @desc    Record a question attempt
// @access  Private
router.post('/:id/attempt', auth, async (req, res) => {
  try {
    const { status, timeSpent, code } = req.body;
    const questionId = req.params.id;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    await question.updateStats(status === 'correct', timeSpent || 0);

    const user = await User.findById(req.user._id);
    const existingAttempt = user.attemptedQuestions.find(
      a => a.questionId.toString() === questionId
    );

    if (existingAttempt) {
      existingAttempt.status = status;
      existingAttempt.timeSpent = timeSpent || 0;
      existingAttempt.attemptedAt = new Date();
      if (code) existingAttempt.code = code;
    } else {
      user.attemptedQuestions.push({
        questionId,
        status,
        timeSpent: timeSpent || 0,
        code: code || ''
      });
    }

    if (status === 'correct') {
      await user.addPoints(question.points);
    }

    await user.save();

    res.json({
      message: 'Attempt recorded successfully! 📝',
      points: status === 'correct' ? question.points : 0,
      totalPoints: user.points
    });

  } catch (error) {
    console.error('Record attempt error:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/questions/:id/hint
// @desc    Get hint for a question
// @access  Private
router.get('/:id/hint', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    if (!question.hints || question.hints.length === 0) {
      return res.json({ hint: 'No hints available for this question.' });
    }

    const randomHint = question.hints[Math.floor(Math.random() * question.hints.length)];
    res.json({ hint: randomHint });

  } catch (error) {
    console.error('Get hint error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

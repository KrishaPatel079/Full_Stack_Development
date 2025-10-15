const express = require('express');
const Question = require('../models/Question');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/mock/start
// @desc    Start a new mock interview session
// @access  Private
router.post('/start', auth, async (req, res) => {
  try {
    const { 
      category, 
      categories,
      difficulty, 
      questionCount = 5, 
      timePerQuestion = 60 
    } = req.body;

    // Build filters
    const filters = { isActive: true };
    if (categories && Array.isArray(categories) && categories.length > 0) {
      filters.category = { $in: categories };
    } else if (category) {
      filters.category = category;
    }
    if (difficulty) filters.difficulty = difficulty;

    // Get random questions
    const questions = await Question.aggregate([
      { $match: filters },
      { $sample: { size: Math.min(questionCount, 20) } }, // Max 20 questions
      { $project: { 
        _id: 1, 
        title: 1, 
        questionText: 1, 
        category: 1, 
        difficulty: 1,
        timeLimit: 1,
        points: 1
      }}
    ]);

    if (questions.length === 0) {
      return res.status(404).json({
        error: 'No questions found with the specified criteria'
      });
    }

    // Create interview session
    const interviewId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const interviewSession = {
      interviewId,
      questions: questions.map(q => ({
        questionId: q._id,
        title: q.title,
        questionText: q.questionText,
        category: q.category,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit || timePerQuestion,
        points: q.points,
        userAnswer: '',
        timeSpent: 0,
        status: 'pending'
      })),
      totalQuestions: questions.length,
      currentQuestion: 0,
      timePerQuestion,
      startTime: new Date(),
      status: 'active',
      score: 0,
      totalPoints: questions.reduce((sum, q) => sum + q.points, 0)
    };

    // Store session in user document (you could also use Redis for better performance)
    const user = await User.findById(req.user._id);
    if (!user.completedMockInterviews) {
      user.completedMockInterviews = [];
    }
    
    user.completedMockInterviews.push(interviewSession);
    await user.save();

    res.json({
      message: 'Mock interview started! 🚀',
      interview: {
        interviewId,
        totalQuestions: questions.length,
        timePerQuestion,
        startTime: interviewSession.startTime,
        currentQuestion: 0,
        questions: interviewSession.questions
      }
    });

  } catch (error) {
    console.error('Start mock interview error:', error);
    res.status(500).json({
      error: 'Server error while starting mock interview'
    });
  }
});

// @route   POST /api/mock/:interviewId/answer
// @desc    Submit answer for current question
// @access  Private
router.post('/:interviewId/answer', auth, async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { questionIndex, answer, timeSpent } = req.body;

    if (questionIndex === undefined || !answer) {
      return res.status(400).json({
        error: 'Question index and answer are required'
      });
    }

    // Find user's interview session
    const user = await User.findById(req.user._id);
    const interview = user.completedMockInterviews.find(i => i.interviewId === interviewId);

    if (!interview) {
      return res.status(404).json({
        error: 'Interview session not found'
      });
    }

    if (interview.status !== 'active') {
      return res.status(400).json({
        error: 'Interview session is not active'
      });
    }

    if (questionIndex >= interview.questions.length) {
      return res.status(400).json({
        error: 'Invalid question index'
      });
    }

    // Update question answer
    interview.questions[questionIndex].userAnswer = answer;
    interview.questions[questionIndex].timeSpent = timeSpent || 0;
    interview.questions[questionIndex].status = 'answered';

    // Move to next question or end interview
    if (questionIndex < interview.questions.length - 1) {
      interview.currentQuestion = questionIndex + 1;
    } else {
      // Interview completed
      interview.status = 'completed';
      interview.endTime = new Date();
      interview.duration = interview.endTime - interview.startTime;
      
      // Calculate score (you can implement more sophisticated scoring)
      interview.score = interview.questions.filter(q => q.status === 'answered').length;
      
      // Update user stats
      await user.updateStreak();
    }

    await user.save();

    res.json({
      message: questionIndex < interview.questions.length - 1 
        ? 'Answer submitted! Moving to next question.' 
        : 'Interview completed! 🎉',
      interview: {
        interviewId,
        currentQuestion: interview.currentQuestion,
        totalQuestions: interview.totalQuestions,
        status: interview.status,
        score: interview.score,
        isCompleted: interview.status === 'completed'
      }
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      error: 'Server error while submitting answer'
    });
  }
});

// @route   GET /api/mock/:interviewId/status
// @desc    Get current interview status
// @access  Private
router.get('/:interviewId/status', auth, async (req, res) => {
  try {
    const { interviewId } = req.params;

    const user = await User.findById(req.user._id);
    const interview = user.completedMockInterviews.find(i => i.interviewId === interviewId);

    if (!interview) {
      return res.status(404).json({
        error: 'Interview session not found'
      });
    }

    res.json({
      interview: {
        interviewId,
        status: interview.status,
        currentQuestion: interview.currentQuestion,
        totalQuestions: interview.totalQuestions,
        timePerQuestion: interview.timePerQuestion,
        startTime: interview.startTime,
        endTime: interview.endTime,
        duration: interview.duration,
        score: interview.score,
        totalPoints: interview.totalPoints,
        questions: interview.questions.map(q => ({
          questionId: q.questionId,
          title: q.title,
          category: q.category,
          difficulty: q.difficulty,
          timeLimit: q.timeLimit,
          points: q.points,
          status: q.status,
          timeSpent: q.timeSpent
        }))
      }
    });

  } catch (error) {
    console.error('Get interview status error:', error);
    res.status(500).json({
      error: 'Server error while fetching interview status'
    });
  }
});

// @route   GET /api/mock/:interviewId/question/:questionIndex
// @desc    Get specific question from interview
// @access  Private
router.get('/:interviewId/question/:questionIndex', auth, async (req, res) => {
  try {
    const { interviewId, questionIndex } = req.params;

    const user = await User.findById(req.user._id);
    const interview = user.completedMockInterviews.find(i => i.interviewId === interviewId);

    if (!interview) {
      return res.status(404).json({
        error: 'Interview session not found'
      });
    }

    if (questionIndex >= interview.questions.length) {
      return res.status(400).json({
        error: 'Invalid question index'
      });
    }

    const question = interview.questions[questionIndex];

    // Get full question details
    const fullQuestion = await Question.findById(question.questionId)
      .select('-answer -testCases -explanation');

    if (!fullQuestion) {
      return res.status(404).json({
        error: 'Question not found'
      });
    }

    res.json({
      question: {
        ...fullQuestion.toObject(),
        interviewQuestionId: questionIndex,
        timeLimit: question.timeLimit,
        points: question.points,
        userAnswer: question.userAnswer,
        timeSpent: question.timeSpent,
        status: question.status
      },
      interview: {
        interviewId,
        currentQuestion: interview.currentQuestion,
        totalQuestions: interview.totalQuestions,
        timePerQuestion: interview.timePerQuestion
      }
    });

  } catch (error) {
    console.error('Get interview question error:', error);
    res.status(500).json({
      error: 'Server error while fetching interview question'
    });
  }
});

// @route   POST /api/mock/:interviewId/end
// @desc    End interview early
// @access  Private
router.post('/:interviewId/end', auth, async (req, res) => {
  try {
    const { interviewId } = req.params;

    const user = await User.findById(req.user._id);
    const interview = user.completedMockInterviews.find(i => i.interviewId === interviewId);

    if (!interview) {
      return res.status(404).json({
        error: 'Interview session not found'
      });
    }

    if (interview.status !== 'active') {
      return res.status(400).json({
        error: 'Interview session is not active'
      });
    }

    // End interview
    interview.status = 'completed';
    interview.endTime = new Date();
    interview.duration = interview.endTime - interview.startTime;
    interview.score = interview.questions.filter(q => q.status === 'answered').length;

    await user.save();

    res.json({
      message: 'Interview ended early',
      interview: {
        interviewId,
        status: interview.status,
        score: interview.score,
        totalQuestions: interview.totalQuestions,
        duration: interview.duration
      }
    });

  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({
      error: 'Server error while ending interview'
    });
  }
});

// @route   GET /api/mock/history
// @desc    Get user's mock interview history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user._id);
    const interviews = user.completedMockInterviews || [];

    // Sort by completion date (most recent first)
    const sortedInterviews = interviews
      .filter(i => i.status === 'completed')
      .sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedInterviews = sortedInterviews.slice(startIndex, endIndex);

    res.json({
      interviews: paginatedInterviews.map(i => ({
        interviewId: i.interviewId,
        startTime: i.startTime,
        endTime: i.endTime,
        duration: i.duration,
        score: i.score,
        totalQuestions: i.totalQuestions,
        totalPoints: i.totalPoints,
        averageScore: Math.round((i.score / i.totalQuestions) * 100)
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedInterviews.length / parseInt(limit)),
        totalInterviews: sortedInterviews.length,
        hasNext: endIndex < sortedInterviews.length,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({
      error: 'Server error while fetching interview history'
    });
  }
});

// @route   GET /api/mock/stats
// @desc    Get user's mock interview statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const interviews = user.completedMockInterviews || [];

    const completedInterviews = interviews.filter(i => i.status === 'completed');
    
    if (completedInterviews.length === 0) {
      return res.json({
        stats: {
          totalInterviews: 0,
          averageScore: 0,
          bestScore: 0,
          totalQuestions: 0,
          averageTimePerQuestion: 0,
          totalTime: 0
        }
      });
    }

    const totalQuestions = completedInterviews.reduce((sum, i) => sum + i.totalQuestions, 0);
    const totalScore = completedInterviews.reduce((sum, i) => sum + i.score, 0);
    const totalTime = completedInterviews.reduce((sum, i) => sum + (i.duration || 0), 0);
    const bestScore = Math.max(...completedInterviews.map(i => i.score));

    const stats = {
      totalInterviews: completedInterviews.length,
      averageScore: Math.round((totalScore / totalQuestions) * 100),
      bestScore: Math.round((bestScore / Math.max(...completedInterviews.map(i => i.totalQuestions))) * 100),
      totalQuestions,
      averageTimePerQuestion: Math.round(totalTime / totalQuestions / 1000), // in seconds
      totalTime: Math.round(totalTime / 1000 / 60) // in minutes
    };

    res.json({ stats });

  } catch (error) {
    console.error('Get interview stats error:', error);
    res.status(500).json({
      error: 'Server error while fetching interview statistics'
    });
  }
});

module.exports = router;


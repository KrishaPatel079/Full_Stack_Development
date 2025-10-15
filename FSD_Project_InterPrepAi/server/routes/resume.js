const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const OpenAI = require('openai');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// @route   POST /api/resume/analyze
// @desc    Upload and analyze resume
// @access  Private
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Please upload a resume file'
      });
    }

    // Parse PDF content
    let pdfText;
    try {
      const pdfData = await pdfParse(req.file.buffer);
      pdfText = pdfData.text;
    } catch (parseError) {
      return res.status(400).json({
        error: 'Failed to parse PDF. Please ensure it\'s a valid PDF file.'
      });
    }

    if (!pdfText || pdfText.trim().length < 50) {
      return res.status(400).json({
        error: 'PDF appears to be empty or contains insufficient text for analysis.'
      });
    }

    // Analyze resume with OpenAI
    const systemPrompt = `You are an expert resume reviewer and career coach. Analyze the provided resume and provide:
    1. Overall assessment (1-2 sentences)
    2. Key strengths (3-5 points)
    3. Areas for improvement (3-5 points)
    4. Missing keywords/skills that could improve ATS scoring
    5. Specific suggestions for enhancement
    6. Overall rating from 1-10
    7. Industry-specific recommendations
    
    Be constructive, specific, and actionable. Focus on helping the candidate improve their resume.`;

    const userPrompt = `Please analyze this resume:

${pdfText}

Provide the analysis in the following JSON format:
{
  "overallAssessment": "Brief assessment",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "rating": 7,
  "industryRecommendations": ["rec1", "rec2"],
  "atsScore": "Estimated ATS score (Good/Fair/Needs Improvement)"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 800
    });

    const analysis = completion.choices[0].message.content;
    
    // Try to parse JSON response
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysis);
    } catch (parseError) {
      // If JSON parsing fails, return the raw analysis
      parsedAnalysis = {
        overallAssessment: analysis,
        strengths: [],
        improvements: [],
        missingKeywords: [],
        suggestions: [],
        rating: 5,
        industryRecommendations: [],
        atsScore: "Fair"
      };
    }

    // Calculate score based on rating
    const score = Math.round((parsedAnalysis.rating / 10) * 100);

    // Save analysis to user's profile
    const user = await User.findById(req.user._id);
    if (!user.resumeAnalysis) {
      user.resumeAnalysis = [];
    }

    const resumeAnalysis = {
      originalName: req.file.originalname,
      feedback: parsedAnalysis,
      uploadedAt: new Date(),
      score: score
    };

    user.resumeAnalysis.push(resumeAnalysis);
    await user.save();

    res.json({
      message: 'Resume analyzed successfully! 📄✨',
      analysis: parsedAnalysis,
      score: score,
      originalName: req.file.originalname,
      textLength: pdfText.length
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'OpenAI API quota exceeded. Please try again later.'
      });
    }
    
    res.status(500).json({
      error: 'Server error during resume analysis'
    });
  }
});

// @route   GET /api/resume/history
// @desc    Get user's resume analysis history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const user = await User.findById(req.user._id);
    const analyses = user.resumeAnalysis || [];

    // Sort by upload date (most recent first)
    const sortedAnalyses = analyses.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedAnalyses = sortedAnalyses.slice(startIndex, endIndex);

    res.json({
      analyses: paginatedAnalyses.map(a => ({
        id: a._id,
        originalName: a.originalName,
        uploadedAt: a.uploadedAt,
        score: a.score,
        overallAssessment: a.feedback.overallAssessment,
        rating: a.feedback.rating,
        atsScore: a.feedback.atsScore
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(sortedAnalyses.length / parseInt(limit)),
        totalAnalyses: sortedAnalyses.length,
        hasNext: endIndex < sortedAnalyses.length,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get resume history error:', error);
    res.status(500).json({
      error: 'Server error while fetching resume history'
    });
  }
});

// @route   GET /api/resume/:analysisId
// @desc    Get specific resume analysis details
// @access  Private
router.get('/:analysisId', auth, async (req, res) => {
  try {
    const { analysisId } = req.params;

    const user = await User.findById(req.user._id);
    const analysis = user.resumeAnalysis.find(a => a._id.toString() === analysisId);

    if (!analysis) {
      return res.status(404).json({
        error: 'Resume analysis not found'
      });
    }

    res.json({
      analysis: {
        id: analysis._id,
        originalName: analysis.originalName,
        uploadedAt: analysis.uploadedAt,
        score: analysis.score,
        feedback: analysis.feedback
      }
    });

  } catch (error) {
    console.error('Get resume analysis error:', error);
    res.status(500).json({
      error: 'Server error while fetching resume analysis'
    });
  }
});

// @route   DELETE /api/resume/:analysisId
// @desc    Delete a resume analysis
// @access  Private
router.delete('/:analysisId', auth, async (req, res) => {
  try {
    const { analysisId } = req.params;

    const user = await User.findById(req.user._id);
    const analysisIndex = user.resumeAnalysis.findIndex(a => a._id.toString() === analysisId);

    if (analysisIndex === -1) {
      return res.status(404).json({
        error: 'Resume analysis not found'
      });
    }

    // Remove the analysis
    user.resumeAnalysis.splice(analysisIndex, 1);
    await user.save();

    res.json({
      message: 'Resume analysis deleted successfully'
    });

  } catch (error) {
    console.error('Delete resume analysis error:', error);
    res.status(500).json({
      error: 'Server error while deleting resume analysis'
    });
  }
});

// @route   GET /api/resume/stats
// @desc    Get user's resume analysis statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const analyses = user.resumeAnalysis || [];

    if (analyses.length === 0) {
      return res.json({
        stats: {
          totalAnalyses: 0,
          averageScore: 0,
          bestScore: 0,
          improvementTrend: 'No data'
        }
      });
    }

    const totalAnalyses = analyses.length;
    const averageScore = Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / totalAnalyses);
    const bestScore = Math.max(...analyses.map(a => a.score));

    // Calculate improvement trend
    let improvementTrend = 'Stable';
    if (analyses.length >= 2) {
      const recentAnalyses = analyses.slice(-3); // Last 3 analyses
      const recentScores = recentAnalyses.map(a => a.score);
      
      if (recentScores[recentScores.length - 1] > recentScores[0]) {
        improvementTrend = 'Improving';
      } else if (recentScores[recentScores.length - 1] < recentScores[0]) {
        improvementTrend = 'Declining';
      }
    }

    const stats = {
      totalAnalyses,
      averageScore,
      bestScore,
      improvementTrend
    };

    res.json({ stats });

  } catch (error) {
    console.error('Get resume stats error:', error);
    res.status(500).json({
      error: 'Server error while fetching resume statistics'
    });
  }
});

// @route   POST /api/resume/compare
// @desc    Compare two resume analyses
// @access  Private
router.post('/compare', auth, async (req, res) => {
  try {
    const { analysisId1, analysisId2 } = req.body;

    if (!analysisId1 || !analysisId2) {
      return res.status(400).json({
        error: 'Two analysis IDs are required for comparison'
      });
    }

    const user = await User.findById(req.user._id);
    const analysis1 = user.resumeAnalysis.find(a => a._id.toString() === analysisId1);
    const analysis2 = user.resumeAnalysis.find(a => a._id.toString() === analysisId2);

    if (!analysis1 || !analysis2) {
      return res.status(404).json({
        error: 'One or both resume analyses not found'
      });
    }

    // Generate comparison using AI
    const systemPrompt = `You are an expert resume reviewer. Compare two resume analyses and provide:
    1. Overall comparison summary
    2. Key differences in strengths
    3. Key differences in areas for improvement
    4. Which version is better and why
    5. Specific recommendations for the better version
    6. Progress assessment (improvement/decline)`;

    const userPrompt = `Please compare these two resume analyses:

Analysis 1 (${analysis1.uploadedAt.toDateString()}):
${JSON.stringify(analysis1.feedback, null, 2)}

Analysis 2 (${analysis2.uploadedAt.toDateString()}):
${JSON.stringify(analysis2.feedback, null, 2)}

Provide the comparison in the following JSON format:
{
  "summary": "Overall comparison summary",
  "strengthDifferences": ["difference1", "difference2"],
  "improvementDifferences": ["difference1", "difference2"],
  "betterVersion": "1 or 2",
  "reasoning": "Why this version is better",
  "recommendations": ["rec1", "rec2"],
  "progress": "Improvement/Decline/Stable"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 600
    });

    const comparison = completion.choices[0].message.content;
    
    let parsedComparison;
    try {
      parsedComparison = JSON.parse(comparison);
    } catch (parseError) {
      parsedComparison = {
        summary: comparison,
        strengthDifferences: [],
        improvementDifferences: [],
        betterVersion: "1",
        reasoning: "Unable to parse comparison",
        recommendations: [],
        progress: "Stable"
      };
    }

    res.json({
      message: 'Resume comparison completed! 📊',
      comparison: parsedComparison,
      analysis1: {
        id: analysis1._id,
        uploadedAt: analysis1.uploadedAt,
        score: analysis1.score,
        rating: analysis1.feedback.rating
      },
      analysis2: {
        id: analysis2._id,
        uploadedAt: analysis2.uploadedAt,
        score: analysis2.score,
        rating: analysis2.feedback.rating
      }
    });

  } catch (error) {
    console.error('Resume comparison error:', error);
    res.status(500).json({
      error: 'Server error during resume comparison'
    });
  }
});

module.exports = router;


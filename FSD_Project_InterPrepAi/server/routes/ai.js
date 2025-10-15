const express = require('express');
const OpenAI = require('openai');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @route   POST /api/ai/interview
// @desc    Get AI feedback for interview question/answer
// @access  Private
router.post('/interview', auth, async (req, res) => {
  try {
    const { question, userAnswer, context = 'general' } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({
        error: 'Question and user answer are required'
      });
    }

    // Create the prompt for OpenAI
    const systemPrompt = `You are an expert technical interviewer providing constructive feedback. 
    Analyze the user's answer to the interview question and provide:
    1. A brief assessment of their answer (1-2 sentences)
    2. Specific feedback on what they did well
    3. Areas for improvement
    4. A sample answer or key points they should have mentioned
    5. A confidence score from 1-10
    
    Be encouraging but honest. Focus on helping them learn and improve.`;

    const userPrompt = `Question: ${question}
    
User's Answer: ${userAnswer}

Context: ${context}

Please provide feedback in the following JSON format:
{
  "assessment": "Brief assessment",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "sampleAnswer": "Key points they should mention",
  "confidenceScore": 7,
  "tips": ["tip1", "tip2"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const feedback = completion.choices[0].message.content;
    
    // Try to parse JSON response
    let parsedFeedback;
    try {
      parsedFeedback = JSON.parse(feedback);
    } catch (parseError) {
      // If JSON parsing fails, return the raw feedback
      parsedFeedback = {
        assessment: feedback,
        strengths: [],
        improvements: [],
        sampleAnswer: "",
        confidenceScore: 5,
        tips: []
      };
    }

    res.json({
      feedback: parsedFeedback,
      rawFeedback: feedback
    });

  } catch (error) {
    console.error('AI interview error:', error);
    
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        error: 'OpenAI API quota exceeded. Please try again later.'
      });
    }
    
    res.status(500).json({
      error: 'Server error while processing AI feedback'
    });
  }
});

// @route   POST /api/ai/code-review
// @desc    Get AI feedback for code
// @access  Private
router.post('/code-review', auth, async (req, res) => {
  try {
    const { code, question, language = 'javascript' } = req.body;

    if (!code || !question) {
      return res.status(400).json({
        error: 'Code and question are required'
      });
    }

    const systemPrompt = `You are an expert code reviewer. Analyze the provided code and provide:
    1. Code quality assessment
    2. Potential bugs or issues
    3. Performance considerations
    4. Best practices suggestions
    5. A rating from 1-10
    
    Be constructive and educational.`;

    const userPrompt = `Question: ${question}

Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Please provide feedback in the following JSON format:
{
  "quality": "Code quality assessment",
  "issues": ["issue1", "issue2"],
  "performance": "Performance notes",
  "bestPractices": ["practice1", "practice2"],
  "rating": 7,
  "suggestions": ["suggestion1", "suggestion2"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
      max_tokens: 600
    });

    const feedback = completion.choices[0].message.content;
    
    let parsedFeedback;
    try {
      parsedFeedback = JSON.parse(feedback);
    } catch (parseError) {
      parsedFeedback = {
        quality: feedback,
        issues: [],
        performance: "",
        bestPractices: [],
        rating: 5,
        suggestions: []
      };
    }

    res.json({
      feedback: parsedFeedback,
      rawFeedback: feedback
    });

  } catch (error) {
    console.error('AI code review error:', error);
    res.status(500).json({
      error: 'Server error while processing code review'
    });
  }
});

// @route   POST /api/ai/explain-concept
// @desc    Get AI explanation of a technical concept
// @access  Private
router.post('/explain-concept', auth, async (req, res) => {
  try {
    const { concept, level = 'intermediate' } = req.body;

    if (!concept) {
      return res.status(400).json({
        error: 'Concept is required'
      });
    }

    const systemPrompt = `You are an expert technical educator. Explain the concept in a clear, 
    structured way appropriate for the specified level. Include:
    1. Simple definition
    2. Key points
    3. Real-world examples
    4. Common misconceptions
    5. Related concepts
    
    Be engaging and use analogies when helpful.`;

    const userPrompt = `Please explain: ${concept}
    
Level: ${level}

Provide the explanation in the following JSON format:
{
  "definition": "Simple definition",
  "keyPoints": ["point1", "point2", "point3"],
  "examples": ["example1", "example2"],
  "misconceptions": ["misconception1", "misconception2"],
  "relatedConcepts": ["concept1", "concept2"]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.6,
      max_tokens: 700
    });

    const explanation = completion.choices[0].message.content;
    
    let parsedExplanation;
    try {
      parsedExplanation = JSON.parse(explanation);
    } catch (parseError) {
      parsedExplanation = {
        definition: explanation,
        keyPoints: [],
        examples: [],
        misconceptions: [],
        relatedConcepts: []
      };
    }

    res.json({
      explanation: parsedExplanation,
      rawExplanation: explanation
    });

  } catch (error) {
    console.error('AI explain concept error:', error);
    res.status(500).json({
      error: 'Server error while processing concept explanation'
    });
  }
});

// @route   POST /api/ai/practice-question
// @desc    Generate a practice question based on topic
// @access  Private
router.post('/practice-question', auth, async (req, res) => {
  try {
    const { topic, difficulty = 'medium', type = 'coding' } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: 'Topic is required'
      });
    }

    const systemPrompt = `You are an expert technical interviewer. Generate a practice question 
    that is appropriate for the specified difficulty and type. Include:
    1. Clear question statement
    2. Constraints/requirements
    3. Sample test cases
    4. Expected approach
    5. Difficulty justification`;

    const userPrompt = `Generate a practice question for:
Topic: ${topic}
Difficulty: ${difficulty}
Type: ${type}

Provide the question in the following JSON format:
{
  "question": "Question text",
  "constraints": ["constraint1", "constraint2"],
  "testCases": [
    {"input": "input1", "output": "output1", "description": "description1"},
    {"input": "input2", "output": "output2", "description": "description2"}
  ],
  "approach": "Expected approach or algorithm",
  "difficulty": "Why this is ${difficulty} difficulty"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 800
    });

    const question = completion.choices[0].message.content;
    
    let parsedQuestion;
    try {
      parsedQuestion = JSON.parse(question);
    } catch (parseError) {
      parsedQuestion = {
        question: question,
        constraints: [],
        testCases: [],
        approach: "",
        difficulty: ""
      };
    }

    res.json({
      practiceQuestion: parsedQuestion,
      rawQuestion: question
    });

  } catch (error) {
    console.error('AI practice question error:', error);
    res.status(500).json({
      error: 'Server error while generating practice question'
    });
  }
});

module.exports = router;


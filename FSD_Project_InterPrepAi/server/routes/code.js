const express = require('express');
const { VM } = require('vm2');
const Question = require('../models/Question');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/code/execute
// @desc    Execute user code and test against test cases
// @access  Private
router.post('/execute', auth, async (req, res) => {
  try {
    const { questionId, code, language = 'javascript' } = req.body;

    if (!questionId || !code) {
      return res.status(400).json({
        error: 'Question ID and code are required'
      });
    }

    // Get question and test cases
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        error: 'Question not found'
      });
    }

    if (!question.testCases || question.testCases.length === 0) {
      return res.status(400).json({
        error: 'No test cases available for this question'
      });
    }

    const results = [];
    let allTestsPassed = true;
    let totalExecutionTime = 0;

    // Execute code against each test case
    for (let i = 0; i < question.testCases.length; i++) {
      const testCase = question.testCases[i];
      const startTime = Date.now();

      try {
        let output;
        
        if (language === 'javascript') {
          // Create a safe VM for JavaScript execution
          const vm = new VM({
            timeout: question.timeLimit * 1000 || 5000, // Convert to milliseconds
            memory: question.memoryLimit || 128
          });

          // Prepare the code with input
          const codeWithInput = `
            ${code}
            
            // Test the function with the given input
            const input = ${testCase.input};
            const result = solution ? solution(input) : main ? main(input) : undefined;
            result;
          `;

          output = vm.run(codeWithInput);
        } else {
          // For other languages, you might want to use Judge0 API or similar
          // For now, we'll return an error
          return res.status(400).json({
            error: `Language ${language} is not supported yet. Only JavaScript is supported.`
          });
        }

        const executionTime = Date.now() - startTime;
        totalExecutionTime += executionTime;

        // Compare output with expected output
        const isCorrect = String(output) === String(testCase.expectedOutput || testCase.output);
        
        if (!isCorrect) {
          allTestsPassed = false;
        }

        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput || testCase.output,
          actualOutput: output,
          passed: isCorrect,
          executionTime,
          description: testCase.description
        });

      } catch (error) {
        const executionTime = Date.now() - startTime;
        totalExecutionTime += executionTime;
        
        results.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput || testCase.output,
          actualOutput: null,
          passed: false,
          executionTime,
          error: error.message,
          description: testCase.description
        });
        
        allTestsPassed = false;
      }
    }

    // Calculate score
    const passedTests = results.filter(r => r.passed).length;
    const totalTests = results.length;
    const score = Math.round((passedTests / totalTests) * 100);

    // Determine status
    let status = 'incorrect';
    if (score === 100) {
      status = 'correct';
    } else if (score > 0) {
      status = 'partial';
    }

    // Record the attempt
    try {
      await question.updateStatistics(status === 'correct', totalExecutionTime);
    } catch (error) {
      console.error('Error updating question statistics:', error);
    }

    res.json({
      results,
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        score,
        status,
        totalExecutionTime,
        averageExecutionTime: Math.round(totalExecutionTime / totalTests)
      },
      message: allTestsPassed 
        ? '🎉 All tests passed! Great job!' 
        : `Tests completed. ${passedTests}/${totalTests} tests passed.`
    });

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      error: 'Server error during code execution'
    });
  }
});

// @route   POST /api/code/validate
// @desc    Validate code syntax without execution
// @access  Private
router.post('/validate', auth, async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Code is required'
      });
    }

    let isValid = true;
    let errors = [];

    if (language === 'javascript') {
      try {
        // Basic syntax validation
        new Function(code);
        
        // Check for common issues
        if (code.includes('eval(') || code.includes('Function(')) {
          errors.push('Use of eval() or Function() constructor is not allowed for security reasons');
          isValid = false;
        }

        if (code.includes('process.') || code.includes('require(')) {
          errors.push('Node.js specific APIs are not allowed');
          isValid = false;
        }

        if (code.includes('global.') || code.includes('window.')) {
          errors.push('Global object access is not allowed');
          isValid = false;
        }

      } catch (syntaxError) {
        isValid = false;
        errors.push(`Syntax error: ${syntaxError.message}`);
      }
    } else {
      return res.status(400).json({
        error: `Language ${language} is not supported for validation yet.`
      });
    }

    res.json({
      isValid,
      errors,
      message: isValid 
        ? 'Code syntax is valid! ✅' 
        : 'Code has syntax errors. Please fix them before running. ❌'
    });

  } catch (error) {
    console.error('Code validation error:', error);
    res.status(500).json({
      error: 'Server error during code validation'
    });
  }
});

// @route   POST /api/code/format
// @desc    Format and beautify code
// @access  Private
router.post('/format', auth, async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Code is required'
      });
    }

    let formattedCode = code;

    if (language === 'javascript') {
      try {
        // Basic formatting (you can use prettier or similar for better formatting)
        formattedCode = code
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/\s*{\s*/g, ' {\n  ') // Format opening braces
          .replace(/\s*}\s*/g, '\n}\n') // Format closing braces
          .replace(/\s*;\s*/g, ';\n  ') // Format semicolons
          .replace(/\n\s*\n/g, '\n') // Remove empty lines
          .trim();
      } catch (error) {
        formattedCode = code; // Return original if formatting fails
      }
    }

    res.json({
      originalCode: code,
      formattedCode,
      message: 'Code formatted successfully! ✨'
    });

  } catch (error) {
    console.error('Code formatting error:', error);
    res.status(500).json({
      error: 'Server error during code formatting'
    });
  }
});

// @route   GET /api/code/languages
// @desc    Get supported programming languages
// @access  Public
router.get('/languages', (req, res) => {
  const supportedLanguages = [
    {
      id: 'javascript',
      name: 'JavaScript',
      extension: '.js',
      supported: true,
      features: ['Syntax validation', 'Code execution', 'Basic formatting']
    },
    {
      id: 'python',
      name: 'Python',
      extension: '.py',
      supported: false,
      features: ['Coming soon...']
    },
    {
      id: 'java',
      name: 'Java',
      extension: '.java',
      supported: false,
      features: ['Coming soon...']
    },
    {
      id: 'cpp',
      name: 'C++',
      extension: '.cpp',
      supported: false,
      features: ['Coming soon...']
    }
  ];

  res.json({
    languages: supportedLanguages,
    message: 'Currently only JavaScript is fully supported'
  });
});

module.exports = router;


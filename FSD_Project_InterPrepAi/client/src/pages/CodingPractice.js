import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Play, RotateCcw, CheckCircle, XCircle, Clock, Target, Star } from 'lucide-react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const CodingPractice = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [results, setResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchQuestion();
    setStartTime(Date.now());

  }, [id]);

  useEffect(() => {
    if (!startTime) return;
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`/api/questions/${id}`);
      setQuestion(response.data);
      setCode(response.data.answer || '// Write your solution here\n');
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // Reset code when language changes
    setCode('// Write your solution here\n');
  };

  const executeCode = async () => {
    if (!code.trim()) return;

    setExecuting(true);
    setResults(null);

    try {
      console.log('Executing code:', { code, language, questionId: id });
      const response = await axios.post('/api/code/execute', {
        code,
        language,
        questionId: id
      });

      setResults(response.data);
    } catch (error) {
      console.error('Error executing code:', error);
      setResults({
        success: false,
        error: error.response?.data?.message || 'Failed to execute code'
      });
    } finally {
      setExecuting(false);
    }
  };

  const resetCode = () => {
    setCode(question?.answer || '// Write your solution here\n');
    setResults(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'algorithms': return '🔢';
      case 'data-structures': return '🏗️';
      case 'system-design': return '🏛️';
      case 'frontend': return '🎨';
      case 'backend': return '⚙️';
      case 'database': return '🗄️';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-pink-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-pink-50 to-pastel-cream-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h1>
            <Link to="/questions" className="text-pastel-pink-500 hover:text-pastel-pink-600">
              Back to Question Bank
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to={`/questions`}
            className="inline-flex items-center space-x-2 text-pastel-pink-600 hover:text-pastel-pink-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Question Bank</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Question Panel */}
          <div className="space-y-6">
            {/* Question Header */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-start space-x-3 mb-4">
                <span className="text-3xl">{getCategoryIcon(question.category)}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {question.title}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">{question.points} points</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {question.questionText}
                </p>
              </div>

              {/* Constraints */}
              {question.constraints && question.constraints.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Constraints:</h4>
                  <ul className="space-y-1">
                    {question.constraints.map((constraint, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                        <span className="text-pastel-pink-500 mt-1">•</span>
                        <span>{constraint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Test Cases */}
            {question.testCases && question.testCases.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Cases</h3>
                <div className="space-y-3">
                  {question.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Test Case {index + 1}</span>
                        {results && results.testResults && results.testResults[index] && (
                          <div className="flex items-center space-x-1">
                            {results.testResults[index].passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="font-medium text-gray-600 mb-1">Input:</div>
                          <div className="bg-white rounded p-2 font-mono text-gray-800 text-xs">
                            {testCase.input}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-600 mb-1">Expected:</div>
                          <div className="bg-white rounded p-2 font-mono text-gray-800 text-xs">
                            {testCase.expectedOutput}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Code Editor Panel */}
          <div className="space-y-6">
            {/* Editor Controls */}
            <div className="bg-white rounded-2xl shadow-soft p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={resetCode}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={executeCode}
                    disabled={executing || !code.trim()}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white rounded-lg hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {executing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span>{executing ? 'Running...' : 'Run Code'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <Editor
                height="500px"
                language={language}
                value={code}
                onChange={handleCodeChange}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  lineHeight: 24,
                }}
              />
            </div>

            {/* Results */}
            {results && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution Results</h3>

                {results.success ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">All test cases passed!</span>
                    </div>

                    {results.executionTime && (
                      <div className="text-sm text-gray-600">
                        Execution time: {results.executionTime}ms
                      </div>
                    )}

                    {results.output && (
                      <div>
                        <div className="font-medium text-gray-700 mb-2">Output:</div>
                        <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-800">
                          {results.output}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      <span className="font-medium">Some test cases failed</span>
                    </div>

                    {results.error && (
                      <div>
                        <div className="font-medium text-gray-700 mb-2">Error:</div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 font-mono text-sm text-red-800">
                          {results.error}
                        </div>
                      </div>
                    )}

                    {results.testResults && (
                      <div>
                        <div className="font-medium text-gray-700 mb-2">Test Results:</div>
                        <div className="space-y-2">
                          {results.testResults.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">Test Case {index + 1}</span>
                              <div className="flex items-center space-x-2">
                                {result.passed ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                                <span className={`text-sm ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                                  {result.passed ? 'Passed' : 'Failed'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;


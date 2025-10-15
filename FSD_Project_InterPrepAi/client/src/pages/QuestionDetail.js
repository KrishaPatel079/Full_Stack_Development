import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Target, Star, CheckCircle, XCircle, Lightbulb, Code, Play } from 'lucide-react';
import axios from 'axios';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await axios.get(`/api/questions/${id}`);
      console.log('Question response:', response.data);
      // The backend returns { question: {...} }, so we need to extract it
      setQuestion(response.data.question || response.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowHint = () => {
    if (question?.hints && question.hints.length > 0) {
      setShowHint(true);
      setCurrentHintIndex(0);
    }
  };

  const nextHint = () => {
    if (question?.hints && currentHintIndex < question.hints.length - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
  };

  const previousHint = () => {
    if (currentHintIndex > 0) {
      setCurrentHintIndex(currentHintIndex - 1);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
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
        {/* Back Button */}
        <Link
          to="/questions"
          className="inline-flex items-center space-x-2 text-pastel-pink-600 hover:text-pastel-pink-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Question Bank</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getCategoryIcon(question.category || 'default')}</span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {question.title || 'Untitled Question'}
                    </h1>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty || 'unknown')}`}>
                        {question.difficulty || 'N/A'}
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{question.points || 0} points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-pastel-pink-50 rounded-xl">
                  <Clock className="h-6 w-6 text-pastel-pink-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Time Limit</div>
                  <div className="text-lg font-semibold text-gray-900">{question.timeLimit || 30}m</div>
                </div>
                <div className="text-center p-4 bg-pastel-blue-50 rounded-xl">
                  <Target className="h-6 w-6 text-pastel-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Success Rate</div>
                  <div className="text-lg font-semibold text-gray-900">{question.statistics?.successRate || 0}%</div>
                </div>
                <div className="text-center p-4 bg-pastel-cream-50 rounded-xl">
                  <Code className="h-6 w-6 text-pastel-cream-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Attempts</div>
                  <div className="text-lg font-semibold text-gray-900">{question.statistics?.totalAttempts || 0}</div>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Problem Description</h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {question.questionText || 'No question text available.'}
                  </p>
                </div>
              </div>

              {/* Constraints */}
              {question.constraints && Object.keys(question.constraints).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Constraints</h3>
                  <ul className="space-y-2">
                    {Object.entries(question.constraints).map(([key, value], index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-pastel-pink-500 mt-1">•</span>
                        <span className="text-gray-700">
                          <strong>{key}:</strong> {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Test Cases */}
              {question.testCases && question.testCases.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Cases</h3>
                  <div className="space-y-4">
                    {question.testCases.map((testCase, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium text-gray-600">Test Case {index + 1}</span>
                          {testCase.description && (
                            <span className="text-xs text-gray-500">({testCase.description || 'No description'})</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-700 mb-1">Input:</div>
                            <div className="bg-white rounded p-2 font-mono text-gray-800">
                              {testCase.input || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700 mb-1">Expected Output:</div>
                            <div className="bg-white rounded p-2 font-mono text-gray-800">
                              {testCase.expectedOutput || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hints */}
              {question.hints && question.hints.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Hints</h3>
                    <button
                      onClick={handleShowHint}
                      className="flex items-center space-x-2 px-4 py-2 bg-pastel-yellow-100 text-pastel-yellow-700 rounded-xl hover:bg-pastel-yellow-200 transition-colors"
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span>Show Hint</span>
                    </button>
                  </div>

                  {showHint && (
                    <div className="bg-pastel-yellow-50 border border-pastel-yellow-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-pastel-yellow-800">
                          Hint {currentHintIndex + 1} of {question.hints?.length || 0}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={previousHint}
                            disabled={currentHintIndex === 0}
                            className="px-3 py-1 bg-pastel-yellow-200 text-pastel-yellow-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pastel-yellow-300 transition-colors"
                          >
                            Previous
                          </button>
                          <button
                            onClick={nextHint}
                            disabled={currentHintIndex === (question.hints?.length || 0) - 1}
                            className="px-3 py-1 bg-pastel-yellow-200 text-pastel-yellow-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pastel-yellow-300 transition-colors"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {question.hints && question.hints[currentHintIndex] ? question.hints[currentHintIndex] : 'No hint available.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Practice Button */}
              <div className="text-center">
                <Link
                  to={`/coding-practice/${question._id || 'unknown'}`}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white py-4 px-8 rounded-xl hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300 text-lg font-semibold"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Coding Practice</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Question Info */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {question.category ? question.category.replace('-', ' ') : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty || 'unknown')}`}>
                    {question.difficulty || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Points:</span>
                  <span className="font-medium text-gray-900">{question.points || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="font-medium text-gray-900">{question.timeLimit || 30}m</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-pastel-blue-100 text-pastel-blue-700 text-sm rounded-full">
                      {tag || 'Untagged'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Attempts:</span>
                  <span className="font-medium text-gray-900">{question.statistics?.totalAttempts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Correct Attempts:</span>
                  <span className="font-medium text-gray-900">{question.statistics?.correctAttempts || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium text-gray-900">{question.statistics?.successRate || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Time:</span>
                  <span className="font-medium text-gray-900">{question.statistics?.averageTime || 0}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;


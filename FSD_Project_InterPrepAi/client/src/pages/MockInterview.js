import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Square, Clock, CheckCircle, XCircle, MessageCircle, ArrowRight, ArrowLeft, Trophy, Target } from 'lucide-react';
import axios from 'axios';

const MockInterview = () => {
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  useEffect(() => {
    if (isStarted && !isPaused && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endInterview();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, isPaused, timeLeft]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/mock/start', {
        questionCount: 5,
        difficulty: 'medium',
        categories: ['algorithms', 'data-structures']
      });

      setInterview(response.data);
      setTimeLeft(response.data.timeLimit * 60); // Convert to seconds
      setIsStarted(true);
      setCurrentQuestionIndex(0);
      setAnswers(new Array(response.data.questions.length).fill(''));
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setLoading(false);
    }
  };

  const pauseInterview = () => {
    setIsPaused(true);
  };

  const resumeInterview = () => {
    setIsPaused(false);
  };

  const endInterview = async () => {
    if (!interview) return;

    try {
      const response = await axios.post(`/api/mock/${interview.interviewId}/end`, {
        answers: answers.map((answer, index) => ({
          questionIndex: index,
          answer: answer,
          questionId: interview.questions[index]._id
        }))
      });

      setShowResults(true);
      setAiFeedback(response.data.aiFeedback || '');
    } catch (error) {
      console.error('Error ending interview:', error);
    }
  };

  const handleAnswerChange = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!interview) return 0;
    return ((currentQuestionIndex + 1) / interview.questions.length) * 100;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-pink-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview && !isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Screen */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Mock Interview
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practice with our AI-powered mock interview system. Answer questions, get real-time feedback, and improve your interview skills.
            </p>
          </div>

          {/* Interview Setup */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-pastel-pink-50 rounded-xl">
                <Clock className="h-12 w-12 text-pastel-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Timed Session</h3>
                <p className="text-gray-600">Practice under realistic time constraints</p>
              </div>
              <div className="text-center p-6 bg-pastel-blue-50 rounded-xl">
                <Target className="h-12 w-12 text-pastel-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5 Questions</h3>
                <p className="text-gray-600">Curated questions across different topics</p>
              </div>
              <div className="text-center p-6 bg-pastel-cream-50 rounded-xl">
                <MessageCircle className="h-12 w-12 text-pastel-cream-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Feedback</h3>
                <p className="text-gray-600">Get instant feedback on your answers</p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={startInterview}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white py-4 px-8 rounded-xl hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300 text-lg font-semibold"
              >
                <Play className="h-5 w-5" />
                <span>Start Interview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Interview Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Great job completing the mock interview. Here's your performance summary.
            </p>
          </div>

          {/* Results Summary */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-pastel-pink-50 rounded-xl">
                <Trophy className="h-12 w-12 text-pastel-pink-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Score</h3>
                <div className="text-3xl font-bold text-pastel-pink-600">
                  {Math.round((answers.filter(a => a.trim() !== '').length / interview.questions.length) * 100)}%
                </div>
              </div>
              <div className="text-center p-6 bg-pastel-blue-50 rounded-xl">
                <Clock className="h-12 w-12 text-pastel-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Used</h3>
                <div className="text-3xl font-bold text-pastel-blue-600">
                  {formatTime(interview.timeLimit * 60 - timeLeft)}
                </div>
              </div>
              <div className="text-center p-6 bg-pastel-cream-50 rounded-xl">
                <Target className="h-12 w-12 text-pastel-cream-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions</h3>
                <div className="text-3xl font-bold text-pastel-cream-600">
                  {interview.questions.length}
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            {aiFeedback && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Feedback</h3>
                <div className="bg-pastel-blue-50 border border-pastel-blue-200 rounded-xl p-6">
                  <p className="text-gray-800 leading-relaxed">{aiFeedback}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowResults(false);
                  setInterview(null);
                  setIsStarted(false);
                  setAnswers([]);
                  setCurrentQuestionIndex(0);
                  setTimeLeft(0);
                }}
                className="px-6 py-3 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white rounded-xl hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300"
              >
                Take Another Interview
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) return null;

  const currentQuestion = interview.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Interview Header */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </p>
            </div>

            {/* Timer and Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
                <Clock className="h-6 w-6 text-pastel-pink-500" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {isPaused ? (
                  <button
                    onClick={resumeInterview}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={pauseInterview}
                    className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={endInterview}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Square className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentQuestion.title}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="prose prose-gray max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {currentQuestion.questionText}
                </p>
              </div>

              {/* Answer Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Answer:
                </label>
                <textarea
                  value={answers[currentQuestionIndex] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Navigation */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {interview.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-pastel-pink-500 text-white'
                        : answers[index] && answers[index].trim() !== ''
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === interview.questions.length - 1}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Interview Info */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Questions:</span>
                  <span className="font-medium text-gray-900">{interview.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time Limit:</span>
                  <span className="font-medium text-gray-900">{interview.timeLimit}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Answered:</span>
                  <span className="font-medium text-gray-900">
                    {answers.filter(a => a && a.trim() !== '').length}/{interview.questions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* End Interview */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <button
                onClick={endInterview}
                className="w-full px-6 py-3 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white rounded-xl hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300 font-semibold"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;


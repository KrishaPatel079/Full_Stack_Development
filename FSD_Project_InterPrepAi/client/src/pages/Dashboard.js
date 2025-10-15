import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Code, 
  MessageCircle, 
  FileText,
  Flame,
  Star,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  MinusCircle,
  User
} from 'lucide-react';
import axios from 'axios';
import Profile from './Profile';

const Dashboard = () => {
  const { user } = useAuth();
  const [dailyQuestion, setDailyQuestion] = useState(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    points: 0,
    level: 1
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dailyRes, statsRes, activityRes] = await Promise.all([
        axios.get('/api/questions/daily'),
        axios.get('/api/mock/stats'),
        axios.get('/api/questions?limit=5')
      ]);

      setDailyQuestion(dailyRes.data.question);
      
      // Calculate stats from user data
      const userStats = {
        totalQuestions: user.attemptedQuestions?.length || 0,
        correctAnswers: user.attemptedQuestions?.filter(q => q.status === 'correct').length || 0,
        streak: user.streak || 0,
        points: user.points || 0,
        level: user.level || 1
      };
      setStats(userStats);

      // Get recent activity from attempted questions
      if (user.attemptedQuestions && user.attemptedQuestions.length > 0) {
        const recent = user.attemptedQuestions
          .slice(-5)
          .reverse()
          .map(attempt => ({
            id: attempt.questionId,
            type: 'question',
            status: attempt.status,
            date: new Date(attempt.attemptedAt),
            title: `Question Attempt - ${attempt.status}`
          }));
        setRecentActivity(recent);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'incorrect':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'partial':
        return <MinusCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <MinusCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct':
        return 'bg-green-100 text-green-800';
      case 'incorrect':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const quickActions = [
     {
      title: 'Profile & Settings',
      description: 'Write and test code',
      icon: User,
      color: 'from-pastel-blue-400 to-pastel-blue-600',
      path: '/profile'
    },
    {
      title: 'Practice Questions',
      description: 'Browse our question bank',
      icon: BookOpen,
      color: 'from-pastel-pink-400 to-pastel-pink-600',
      path: '/questions'
    },
    {
      title: 'Mock Interview',
      description: 'Simulate real interviews',
      icon: Calendar,
      color: 'from-pastel-cream-400 to-pastel-cream-600',
      path: '/mock-interview'
    },
    {
      title: 'AI Interviewer',
      description: 'Get AI feedback',
      icon: MessageCircle,
      color: 'from-pastel-pink-300 to-pastel-blue-400',
      path: '/ai-interviewer'
    },
    {
      title: 'Resume Analyzer',
      description: 'Analyze your resume',
      icon: FileText,
      color: 'from-pastel-blue-300 to-pastel-cream-400',
      path: '/resume-analyzer'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pastel-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Ready to continue your interview preparation journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pastel-pink-400 to-pastel-pink-600 rounded-xl flex items-center justify-center mr-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Questions Attempted</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pastel-blue-400 to-pastel-blue-600 rounded-xl flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Correct Answers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.correctAnswers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pastel-cream-400 to-pastel-cream-600 rounded-xl flex items-center justify-center mr-4">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{stats.streak} days</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 rounded-xl flex items-center justify-center mr-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{stats.points}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Daily Question */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-pastel-pink-500" />
                  Daily Challenge
                </h2>
                <span className="px-3 py-1 bg-gradient-to-r from-pastel-pink-100 to-pastel-blue-100 text-pastel-pink-700 rounded-full text-sm font-medium">
                  {dailyQuestion?.difficulty || 'Medium'}
                </span>
              </div>

              {dailyQuestion ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {dailyQuestion.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {dailyQuestion.questionText}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {dailyQuestion.timeLimit || 60}s
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {dailyQuestion.points || 10} pts
                      </span>
                    </div>
                    <Link
                      to={`/questions/${dailyQuestion._id}`}
                      className="btn-primary"
                    >
                      Start Challenge
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No daily question available</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress Overview */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-pastel-blue-500" />
                Progress Overview
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-gray-900">
                      {stats.totalQuestions > 0 
                        ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                        : 0}%
                      </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${stats.totalQuestions > 0 
                          ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100)
                          : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Level Progress</span>
                    <span className="font-medium text-gray-900">Level {stats.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pastel-cream-400 to-pastel-pink-400 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(stats.points % 100)}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {100 - (stats.points % 100)} points to next level
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3 text-sm">
                          {getStatusIcon(activity.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 truncate">{activity.title}</p>
                            <p className="text-gray-500 text-xs">
                              {activity.date.toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.path}
                  className="card group hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {action.description}
                  </p>
                  <div className="mt-4 flex items-center text-pastel-pink-600 font-medium text-sm group-hover:text-pastel-pink-700 transition-colors duration-200">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


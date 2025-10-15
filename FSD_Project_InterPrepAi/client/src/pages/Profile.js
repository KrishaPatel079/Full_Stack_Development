import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Trophy, Target, Calendar, Star, Edit3, Save, X, Eye, EyeOff, Award, TrendingUp, Flame } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferences: {
      difficulty: 'medium',
      categories: [],
      dailyGoal: 5
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    points: 0,
    level: 1
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        preferences: {
          difficulty: user.preferences?.difficulty || 'medium',
          categories: user.preferences?.categories || [],
          dailyGoal: user.preferences?.dailyGoal || 5
        }
      });
      setStats({
        totalQuestions: user.attemptedQuestions?.length || 0,
        correctAnswers: user.attemptedQuestions?.filter(q => q.status === 'correct').length || 0,
        streak: user.streak || 0,
        points: user.points || 0,
        level: user.level || 1
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        categories: prev.preferences.categories.includes(category)
          ? prev.preferences.categories.filter(c => c !== category)
          : [...prev.preferences.categories, category]
      }
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    if (level >= 10) return 'text-purple-600 bg-purple-100';
    if (level >= 7) return 'text-blue-600 bg-blue-100';
    if (level >= 4) return 'text-green-600 bg-green-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStreakIcon = (streak) => {
    if (streak >= 10) return <Flame className="h-6 w-6 text-red-500" />;
    if (streak >= 5) return <TrendingUp className="h-6 w-6 text-orange-500" />;
    return <Star className="h-6 w-6 text-yellow-500" />;
  };

  const categories = [
    'algorithms', 'data-structures', 'system-design', 'frontend', 'backend', 'database', 'general'
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'hard', label: 'Hard', color: 'text-red-600 bg-red-100' }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-pink-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Profile & Settings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your profile, preferences, and track your progress.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-pastel-pink-100 text-pastel-pink-700 rounded-xl hover:bg-pastel-pink-200 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-lg text-gray-900">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <p className="text-lg text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                  
                  {/* Difficulty */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Difficulty Level
                    </label>
                    {isEditing ? (
                      <select
                        name="preferences.difficulty"
                        value={formData.preferences.difficulty}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
                      >
                        {difficulties.map(difficulty => (
                          <option key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(user.preferences?.difficulty || 'medium')}`}>
                        {user.preferences?.difficulty || 'medium'}
                      </span>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Categories
                    </label>
                    {isEditing ? (
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(category => (
                          <label key={category} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={formData.preferences.categories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                              className="rounded border-gray-300 text-pastel-pink-600 focus:ring-pastel-pink-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {category.replace('-', ' ')}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.preferences?.categories?.map(category => (
                          <span key={category} className="px-3 py-1 bg-pastel-blue-100 text-pastel-blue-700 rounded-full text-sm">
                            {category.replace('-', ' ')}
                          </span>
                        )) || <span className="text-gray-500">No preferences set</span>}
                      </div>
                    )}
                  </div>

                  {/* Daily Goal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Practice Goal
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="preferences.dailyGoal"
                        value={formData.preferences.dailyGoal}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-lg text-gray-900">{user.preferences?.dailyGoal || 5} questions per day</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Change Password</h2>
                {!isChangingPassword ? (
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-pastel-blue-100 text-pastel-blue-700 rounded-xl hover:bg-pastel-blue-200 transition-colors"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Change</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                      <span>Update</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {isChangingPassword && (
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Summary */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-pastel-pink-500" />
                    <span className="text-gray-600">Questions:</span>
                  </div>
                  <span className="font-medium text-gray-900">{stats.totalQuestions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-pastel-blue-500" />
                    <span className="text-gray-600">Correct:</span>
                  </div>
                  <span className="font-medium text-gray-900">{stats.correctAnswers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStreakIcon(stats.streak)}
                    <span className="text-gray-600">Streak:</span>
                  </div>
                  <span className="font-medium text-gray-900">{stats.streak} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-600">Points:</span>
                  </div>
                  <span className="font-medium text-gray-900">{stats.points}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600">Level:</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(stats.level)}`}>
                    {stats.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            {user.achievements && user.achievements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
                <div className="space-y-3">
                  {user.achievements.slice(0, 5).map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <div>
                        <div className="font-medium text-gray-900">{achievement.name}</div>
                        <div className="text-sm text-gray-500">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Member Since</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, Clock, Target, Star, ArrowRight } from 'lucide-react';
import axios from 'axios';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: ''
  });
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);

  useEffect(() => {
    fetchQuestions();
    fetchFilters();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`/api/questions?${params}`);
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

 const fetchFilters = async () => {
  try {
    const [categoriesRes, difficultiesRes] = await Promise.all([
      axios.get('/api/questions/categories'),
      axios.get('/api/questions/difficulties')
    ]);
    setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    setDifficulties(Array.isArray(difficultiesRes.data) ? difficultiesRes.data : []);
  } catch (error) {
    console.error('Error fetching filters:', error);
    setCategories([]);
    setDifficulties([]);
  }
};
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Question Bank
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice with our curated collection of coding questions. Filter by category, difficulty, or search for specific topics.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={filters.difficulty}
              onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent"
            >
              <option value="">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({ category: '', difficulty: '', search: '' })}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <div key={question._id} className="bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(question.category)}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{question.points}</span>
                  </div>
                </div>

                {/* Question Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {question.title}
                </h3>

                {/* Question Text */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {question.questionText}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags?.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-pastel-blue-100 text-pastel-blue-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Question Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{question.timeLimit}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-4 w-4" />
                    <span>{question.statistics?.successRate || 0}% success</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/questions/${question._id}`}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white py-3 px-4 rounded-xl hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300"
                >
                  <span>Practice Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {questions.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;


import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Brain, 
  Code, 
  MessageCircle, 
  FileText, 
  Target, 
  Zap, 
  Users,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Get personalized feedback and explanations from our advanced AI interviewer',
      color: 'from-pastel-pink-400 to-pastel-pink-600'
    },
    {
      icon: Code,
      title: 'Coding Practice',
      description: 'Practice with real coding problems using our Monaco Editor integration',
      color: 'from-pastel-blue-400 to-pastel-blue-600'
    },
    {
      icon: MessageCircle,
      title: 'Mock Interviews',
      description: 'Simulate real interview scenarios with timed questions and AI feedback',
      color: 'from-pastel-cream-400 to-pastel-cream-600'
    },
    {
      icon: FileText,
      title: 'Resume Analysis',
      description: 'Upload your resume and get AI-powered feedback and improvement suggestions',
      color: 'from-pastel-pink-300 to-pastel-blue-400'
    },
    {
      icon: Target,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and achievements',
      color: 'from-pastel-blue-300 to-pastel-cream-400'
    },
    {
      icon: Zap,
      title: 'Daily Challenges',
      description: 'Stay consistent with daily practice questions and maintain your streak',
      color: 'from-pastel-cream-300 to-pastel-pink-400'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Practice Questions' },
    { number: '50+', label: 'Categories' },
    { number: '24/7', label: 'AI Support' },
    { number: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/20 shadow-soft mb-8">
              <Trophy className="w-4 h-4 text-pastel-pink-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                #1 AI-Powered Interview Prep Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Master Your
              <span className="block gradient-text">Interview Skills</span>
              with AI
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Practice coding problems, get AI feedback, and ace your technical interviews with our comprehensive platform
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                    Start Learning Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                    Already have an account?
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pastel-pink-200 to-pastel-pink-300 rounded-full opacity-20 animate-bounce-gentle"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-pastel-blue-200 to-pastel-blue-300 rounded-full opacity-20 animate-pulse-gentle"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-pastel-cream-200 to-pastel-cream-300 rounded-full opacity-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines AI technology with proven learning methods to help you excel in technical interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card group hover:scale-105 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-pastel-pink-50 to-pastel-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and begin your interview preparation journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign Up & Choose Path</h3>
              <p className="text-gray-600">
                Create your account and select your learning path based on your goals and experience level
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pastel-blue-500 to-pastel-cream-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Practice & Learn</h3>
              <p className="text-gray-600">
                Work through coding problems, take mock interviews, and get instant AI feedback
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pastel-cream-500 to-pastel-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your improvement with detailed analytics and celebrate your achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-pastel-pink-100 mb-8">
            Join thousands of developers who have already improved their interview skills with InterviewPrepAI
          </p>
          
          {user ? (
            <Link to="/dashboard" className="inline-flex items-center bg-white text-pastel-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-200">
              Continue Learning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          ) : (
            <Link to="/signup" className="inline-flex items-center bg-white text-pastel-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-200">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;


import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Bot, User, Sparkles, Target, Clock, Star } from 'lucide-react';
import axios from 'axios';

const AIInterviewer = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationMode, setConversationMode] = useState('general');
  const [sessionStats, setSessionStats] = useState({
    questionsAsked: 0,
    timeSpent: 0,
    feedbackReceived: 0
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: "Hello! I'm your AI Interview Coach. I'm here to help you practice for interviews, answer questions, and provide feedback. What would you like to work on today?",
        timestamp: new Date()
      }
    ]);

    // Start session timer
    const timer = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let response;
      
      switch (conversationMode) {
        case 'interview':
          response = await axios.post('/api/ai/interview', {
            userAnswer: inputMessage,
            context: messages.slice(-3).map(m => m.content).join(' ')
          });
          break;
        case 'code-review':
          response = await axios.post('/api/ai/code-review', {
            code: inputMessage,
            context: 'Code review request'
          });
          break;
        case 'concept':
          response = await axios.post('/api/ai/explain-concept', {
            concept: inputMessage
          });
          break;
        default:
          response = await axios.post('/api/ai/interview', {
            userAnswer: inputMessage,
            context: 'General conversation'
          });
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.feedback || response.data.explanation || response.data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update stats
      setSessionStats(prev => ({
        ...prev,
        questionsAsked: prev.questionsAsked + 1,
        feedbackReceived: prev.feedbackReceived + 1
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "I'm sorry, I encountered an error. Please try again or rephrase your question.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const changeMode = (mode) => {
    setConversationMode(mode);
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        content: getModeWelcomeMessage(mode),
        timestamp: new Date()
      }
    ]);
  };

  const getModeWelcomeMessage = (mode) => {
    switch (mode) {
      case 'interview':
        return "Great! I'm now in Interview Practice mode. I'll ask you questions and provide feedback on your answers. Let's start with a question: 'Tell me about a challenging project you worked on.'";
      case 'code-review':
        return "Perfect! I'm now in Code Review mode. Share your code with me and I'll provide feedback on structure, efficiency, and best practices.";
      case 'concept':
        return "Excellent! I'm now in Concept Explanation mode. Ask me about any programming concept, algorithm, or technical topic and I'll explain it in detail.";
      default:
        return "I'm in General mode. I can help with interview practice, code review, concept explanations, or general questions. What would you like to work on?";
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'interview': return <Target className="h-4 w-4" />;
      case 'code-review': return <Star className="h-4 w-4" />;
      case 'concept': return <Sparkles className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'interview': return 'bg-pastel-pink-500 hover:bg-pastel-pink-600';
      case 'code-review': return 'bg-pastel-blue-500 hover:bg-pastel-blue-600';
      case 'concept': return 'bg-pastel-cream-500 hover:bg-pastel-cream-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearConversation = () => {
    setMessages([
      {
        id: Date.now(),
        type: 'ai',
        content: getModeWelcomeMessage(conversationMode),
        timestamp: new Date()
      }
    ]);
    setSessionStats({
      questionsAsked: 0,
      timeSpent: 0,
      feedbackReceived: 0
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Interview Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice interviews, get code reviews, and learn concepts with our AI-powered coach.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Mode Selection */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Mode</h3>
              <div className="space-y-3">
                {[
                  { key: 'general', label: 'General', description: 'General assistance' },
                  { key: 'interview', label: 'Interview Practice', description: 'Practice interview questions' },
                  { key: 'code-review', label: 'Code Review', description: 'Get code feedback' },
                  { key: 'concept', label: 'Concept Explanation', description: 'Learn new concepts' }
                ].map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => changeMode(mode.key)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      conversationMode === mode.key
                        ? 'bg-pastel-pink-100 border-2 border-pastel-pink-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${conversationMode === mode.key ? 'bg-pastel-pink-200' : 'bg-gray-200'}`}>
                        {getModeIcon(mode.key)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{mode.label}</div>
                        <div className="text-sm text-gray-500">{mode.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-pastel-pink-500" />
                    <span className="text-gray-600">Questions:</span>
                  </div>
                  <span className="font-medium text-gray-900">{sessionStats.questionsAsked}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-pastel-blue-500" />
                    <span className="text-gray-600">Time:</span>
                  </div>
                  <span className="font-medium text-gray-900">{formatTime(sessionStats.timeSpent)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-pastel-cream-500" />
                    <span className="text-gray-600">Feedback:</span>
                  </div>
                  <span className="font-medium text-gray-900">{sessionStats.feedbackReceived}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={clearConversation}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Clear Conversation
                </button>
                <button
                  onClick={() => changeMode(conversationMode)}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Restart Session
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 p-6 text-white">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">AI Interview Coach</h2>
                    <p className="text-pastel-pink-100">
                      {conversationMode === 'interview' && 'Interview Practice Mode'}
                      {conversationMode === 'code-review' && 'Code Review Mode'}
                      {conversationMode === 'concept' && 'Concept Explanation Mode'}
                      {conversationMode === 'general' && 'General Assistant Mode'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'ai' && (
                            <Bot className="h-4 w-4 text-pastel-pink-500 mt-1 flex-shrink-0" />
                          )}
                          {message.type === 'user' && (
                            <User className="h-4 w-4 text-white mt-1 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${
                              message.type === 'user' ? 'text-pastel-pink-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-3 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-pastel-pink-500" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pastel-pink-500 focus:border-transparent resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white rounded-xl hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewer;


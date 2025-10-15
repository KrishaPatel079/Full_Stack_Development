import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Trash2, Star, Clock, MessageCircle, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const ResumeAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      const response = await axios.get('/api/resume/history');
      setAnalysisHistory(response.data.analyses || []);
    } catch (error) {
      console.error('Error fetching analysis history:', error);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const uploadResume = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const response = await axios.post('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAnalysis(response.data);
      setSelectedFile(null);
      fetchAnalysisHistory(); // Refresh history
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Error analyzing resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const deleteAnalysis = async (analysisId) => {
    try {
      await axios.delete(`/api/resume/${analysisId}`);
      fetchAnalysisHistory();
      if (analysis && analysis._id === analysisId) {
        setAnalysis(null);
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <TrendingUp className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-pink-50 via-pastel-blue-50 to-pastel-cream-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and get AI-powered feedback, suggestions, and insights to improve your job applications.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upload Resume</h2>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-pastel-pink-400 bg-pastel-pink-50'
                    : 'border-gray-300 hover:border-pastel-pink-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your resume here, or click to browse
                </p>
                <p className="text-gray-500 mb-4">
                  Supports PDF files up to 5MB
                </p>
                
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white rounded-xl hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>Choose File</span>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={uploadResume}
                disabled={!selectedFile || uploading}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-pastel-pink-500 to-pastel-blue-500 text-white rounded-xl hover:from-pastel-pink-600 hover:to-pastel-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {uploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Analyze Resume'
                )}
              </button>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-700">Overall resume score and rating</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-gray-700">Detailed feedback and suggestions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Improvement recommendations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">ATS optimization tips</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {analysis ? (
              <div className="bg-white rounded-2xl shadow-soft p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">Analysis Results</h2>
                  <button
                    onClick={() => setAnalysis(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>

                {/* Score */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-3">
                    {getScoreIcon(analysis.score)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
                      Score: {analysis.score}/100
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Insights</h4>
                    <div className="bg-pastel-blue-50 border border-pastel-blue-200 rounded-xl p-4">
                      <p className="text-gray-800 leading-relaxed">{analysis.feedback}</p>
                    </div>
                  </div>

                  {analysis.strengths && analysis.strengths.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Strengths</h4>
                      <ul className="space-y-2">
                        {analysis.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.improvements && analysis.improvements.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {analysis.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <TrendingUp className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.suggestions && analysis.suggestions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Star className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-soft p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Yet</h3>
                <p className="text-gray-500">
                  Upload your resume to get started with AI-powered analysis and feedback.
                </p>
              </div>
            )}

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
                <div className="space-y-3">
                  {analysisHistory.slice(0, 5).map((item) => (
                    <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{item.originalName}</p>
                          <p className="text-sm text-gray-500">{formatDate(item.uploadedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(item.score)}`}>
                          {item.score}/100
                        </span>
                        <button
                          onClick={() => deleteAnalysis(item._id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;


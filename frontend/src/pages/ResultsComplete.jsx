import React, { useState, useEffect } from 'react';
import { apiUrl } from '../utils/api';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    if (location.state?.assessmentData) {
      const data = location.state.assessmentData;
      // Ensure percentage is a number and normalize field names
      const normalizedData = {
        ...data,
        percentage: parseFloat(data.percentage) || 0,
        grade: data.overall_grade || data.grade || 'D',
        tier: data.performance_tier || data.tier || 'Developing',
        category_scores: data.category_scores || {}
      };
      // Ensure category percentages are numbers
      Object.keys(normalizedData.category_scores).forEach(key => {
        if (normalizedData.category_scores[key].percentage) {
          normalizedData.category_scores[key].percentage = parseFloat(normalizedData.category_scores[key].percentage) || 0;
        }
      });
      setResults(normalizedData);
    } else {
      navigate('/');
    }
  }, [location, navigate]);
  
  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  const getGradeColor = (grade) => {
    const colors = {
      'A': 'text-green-600 bg-green-100',
      'B': 'text-blue-600 bg-blue-100',
      'C': 'text-yellow-600 bg-yellow-100',
      'D': 'text-orange-600 bg-orange-100',
      'F': 'text-red-600 bg-red-100'
    };
    return colors[grade] || 'text-gray-600 bg-gray-100';
  };
  
  const getTierBadge = (tier) => {
    const badges = {
      'World Class': 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
      'Industry Leader': 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white',
      'Competitive': 'bg-gradient-to-r from-green-600 to-teal-600 text-white',
      'Developing': 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white',
      'Emerging': 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
    };
    return badges[tier] || 'bg-gray-600 text-white';
  };
  
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 85) return { label: 'Exceptional', color: 'text-green-600' };
    if (percentage >= 75) return { label: 'Strong', color: 'text-blue-600' };
    if (percentage >= 65) return { label: 'Good', color: 'text-yellow-600' };
    if (percentage >= 50) return { label: 'Fair', color: 'text-orange-600' };
    return { label: 'Needs Improvement', color: 'text-red-600' };
  };
  
  const scheduleConsultation = () => {
    // Open Calendly or scheduling link
    window.open('https://calendly.com/navvicorp', '_blank');
  };
  
  const downloadReport = () => {
    // Trigger PDF download
    alert('PDF download feature coming soon!');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Assessment Complete! 🎉
            </h1>
            <p className="text-gray-600">
              Here's your comprehensive business intelligence report
            </p>
          </div>
          
          {/* Overall Score */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {results.percentage}%
              </div>
              <div className="text-gray-600 font-medium">Overall Score</div>
              <div className="text-sm text-gray-500 mt-1">
                {results.total_score} / {results.max_score} points
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className={`text-5xl font-bold mb-2 ${getGradeColor(results.grade)}`}>
                {results.grade}
              </div>
              <div className="text-gray-600 font-medium">Performance Grade</div>
              <div className={`text-sm mt-1 ${getPerformanceLevel(results.percentage).color} font-medium`}>
                {getPerformanceLevel(results.percentage).label}
              </div>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
              <div className={`inline-block px-4 py-2 rounded-full text-lg font-bold mb-2 ${getTierBadge(results.tier)}`}>
                {results.tier}
              </div>
              <div className="text-gray-600 font-medium mt-2">Performance Tier</div>
              <div className="text-sm text-gray-500 mt-1">
                Industry Classification
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={downloadReport}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF Report
            </button>
            
            <button
              onClick={scheduleConsultation}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Consultation
            </button>
          </div>
        </div>
        
        {/* Category Scores */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance by Category</h2>
          
          <div className="space-y-4">
            {Object.entries(results.category_scores || {}).map(([category, scores]) => {
              const performance = getPerformanceLevel(scores.percentage);
              return (
                <div key={category} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">{category}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-medium ${performance.color}`}>
                        {performance.label}
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        {scores.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          scores.percentage >= 75 ? 'bg-green-500' :
                          scores.percentage >= 60 ? 'bg-blue-500' :
                          scores.percentage >= 50 ? 'bg-yellow-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${scores.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-24 text-right">
                      {scores.score} / {scores.max_score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Insights */}
        {results.insights && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Insights</h2>
            
            <div className="mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
                <p className="text-gray-800">{results.insights.overall}</p>
              </div>
            </div>
            
            {results.insights.strengths && results.insights.strengths.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-600">✓</span> Strengths
                </h3>
                <ul className="space-y-2">
                  {results.insights.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {results.insights.improvement_areas && results.insights.improvement_areas.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-orange-600">⚠</span> Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {results.insights.improvement_areas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Recommendations */}
        {results.recommendations && results.recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Strategic Recommendations</h2>
            
            <div className="space-y-4">
              {results.recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{rec.category}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                      rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-700">{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Industry Benchmarks */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Industry Benchmarks</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Tirupur Industry Average</h3>
              <div className="text-3xl font-bold text-gray-600 mb-2">68%</div>
              <p className="text-sm text-gray-600">
                You scored <span className={`font-bold ${results.percentage >= 68 ? 'text-green-600' : 'text-orange-600'}`}>
                  {results.percentage >= 68 ? `${(results.percentage - 68).toFixed(1)}% above` : `${(68 - results.percentage).toFixed(1)}% below`}
                </span> the industry average
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Top Performers</h3>
              <div className="text-3xl font-bold text-gray-600 mb-2">85%+</div>
              <p className="text-sm text-gray-600">
                {results.percentage >= 85 
                  ? 'Congratulations! You are among the top performers'
                  : `${(85 - results.percentage).toFixed(1)}% gap to reach top performer status`
                }
              </p>
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="mb-6 text-blue-100">
            Schedule a consultation with our experts to discuss your personalized growth strategy
          </p>
          <button
            onClick={scheduleConsultation}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-all inline-flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Your Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsComplete;


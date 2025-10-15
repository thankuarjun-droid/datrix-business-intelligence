import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AssessmentComplete = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [assessmentData, setAssessmentData] = useState(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (!token) {
      alert('Invalid assessment link');
      navigate('/');
      return;
    }
    
    fetchAssessmentQuestions();
  }, [token]);
  
  const fetchAssessmentQuestions = async () => {
    try {
      const response = await fetch(`/api/assessment/questions?token=${token}`);
      const data = await response.json();
      
      if (response.ok) {
        setAssessmentData(data);
        setLoading(false);
      } else {
        alert(data.error || 'Failed to load assessment');
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to load assessment');
      navigate('/');
    }
  };
  
  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };
  
  const currentCategory = assessmentData?.categories[currentCategoryIndex];
  const totalCategories = assessmentData?.categories.length || 0;
  const progress = ((currentCategoryIndex + 1) / totalCategories) * 100;
  
  const isCurrentCategoryComplete = () => {
    if (!currentCategory) return false;
    return currentCategory.questions.every(q => responses[q.id] !== undefined);
  };
  
  const handleNext = () => {
    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = async () => {
    if (!isCurrentCategoryComplete()) {
      alert('Please answer all questions in this section before submitting');
      return;
    }
    
    // Check if all questions are answered
    const totalQuestions = assessmentData.categories.reduce((sum, cat) => sum + cat.questions.length, 0);
    const answeredQuestions = Object.keys(responses).length;
    
    if (answeredQuestions < totalQuestions) {
      alert(`Please answer all questions. ${answeredQuestions}/${totalQuestions} answered.`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          responses: responses
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Navigate to results page with assessment data
        navigate(`/results?id=${data.assessment_id}`, {
          state: { assessmentData: data }
        });
      } else {
        alert(data.error || 'Failed to submit assessment');
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit assessment');
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Datrix™ Business Intelligence Scanner</h1>
              <p className="text-gray-600">Comprehensive Assessment for {assessmentData?.user.business}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{assessmentData?.user.name}</p>
              <p className="text-xs text-gray-500">{assessmentData?.user.email}</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Section {currentCategoryIndex + 1} of {totalCategories}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {assessmentData?.categories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => setCurrentCategoryIndex(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  index === currentCategoryIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Current Category Questions */}
        {currentCategory && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentCategory.name}</h2>
              <p className="text-gray-600">{currentCategory.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                {currentCategory.questions.length} questions • Weight: {currentCategory.weight}%
              </div>
            </div>
            
            <div className="space-y-6">
              {currentCategory.questions.map((question, qIndex) => (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      {qIndex + 1}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {question.question_text}
                      </h3>
                      {question.help_text && (
                        <p className="text-sm text-gray-500 mb-3">{question.help_text}</p>
                      )}
                      
                      {/* Rating Scale */}
                      <div className="flex flex-wrap gap-2">
                        {[0, 1, 2, 3, 4].map(value => (
                          <label
                            key={value}
                            className={`flex-1 min-w-[80px] cursor-pointer`}
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={value}
                              checked={responses[question.id] === value}
                              onChange={(e) => handleResponseChange(question.id, e.target.value)}
                              className="sr-only"
                            />
                            <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                              responses[question.id] === value
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 hover:border-blue-300 text-gray-700'
                            }`}>
                              <div className="font-semibold">{value}</div>
                              <div className="text-xs mt-1">
                                {value === 0 && 'Not at all'}
                                {value === 1 && 'Basic'}
                                {value === 2 && 'Moderate'}
                                {value === 3 && 'Good'}
                                {value === 4 && 'Excellent'}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={handlePrevious}
            disabled={currentCategoryIndex === 0}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Previous Section
          </button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {Object.keys(responses).length} of {assessmentData?.categories.reduce((sum, cat) => sum + cat.questions.length, 0)} questions answered
            </p>
            {!isCurrentCategoryComplete() && (
              <p className="text-xs text-orange-600 mt-1">
                Complete this section to continue
              </p>
            )}
          </div>
          
          {currentCategoryIndex < totalCategories - 1 ? (
            <button
              onClick={handleNext}
              disabled={!isCurrentCategoryComplete()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next Section →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !isCurrentCategoryComplete()}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentComplete;


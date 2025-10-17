import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../config/supabase';
import { markTokenCompleted } from '../services/invitationService';
import navviLogo from '../assets/navvi-logo.svg';

const AssessmentToken = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get token and invitation from session or location state
  const token = sessionStorage.getItem('assessment_token') || location.state?.token;
  const invitation = JSON.parse(sessionStorage.getItem('assessment_invitation') || '{}') || location.state?.invitation;

  useEffect(() => {
    if (!token) {
      alert('Invalid assessment access. Please use the assessment link provided.');
      navigate('/');
      return;
    }

    loadAssessmentQuestions();
    createOrGetUser();
  }, [token]);

  const createOrGetUser = async () => {
    try {
      // Check if user already exists with this email
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', invitation.client_email)
        .single();

      if (existingUser) {
        setUserId(existingUser.id);
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([
            {
              name: invitation.client_name,
              email: invitation.client_email,
              mobile: invitation.client_mobile || '',
              company_name: invitation.company_name,
              is_verified: true, // Auto-verified via invitation
              verification_token: token
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
        } else {
          setUserId(newUser.id);
        }
      }
    } catch (error) {
      console.error('Error in createOrGetUser:', error);
    }
  };

  const loadAssessmentQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .order('category', { ascending: true })
        .order('question_order', { ascending: true });

      if (error) {
        console.error('Error loading questions:', error);
        alert('Failed to load assessment questions');
        return;
      }

      setQuestions(data);

      // Group questions by category
      const categoryMap = {};
      data.forEach(question => {
        if (!categoryMap[question.category]) {
          categoryMap[question.category] = {
            name: question.category,
            description: getCategoryDescription(question.category),
            questions: []
          };
        }
        categoryMap[question.category].questions.push(question);
      });

      setCategories(Object.values(categoryMap));
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load assessment questions');
    }
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'Strategic Planning': 'Evaluate your strategic vision, planning processes, and long-term business objectives',
      'Operations Excellence': 'Assess operational efficiency, quality control, and production management',
      'Financial Management': 'Review financial planning, cost control, and profitability metrics',
      'Sales & Marketing': 'Analyze sales strategies, market positioning, and customer relationships',
      'Human Resources': 'Examine workforce management, talent development, and organizational culture',
      'Technology & Innovation': 'Evaluate technology adoption, digital transformation, and innovation capabilities'
    };
    return descriptions[category] || 'Assessment questions for this business pillar';
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const currentCategory = categories[currentCategoryIndex];
  const totalCategories = categories.length;
  const progress = ((currentCategoryIndex + 1) / totalCategories) * 100;

  const isCurrentCategoryComplete = () => {
    if (!currentCategory) return false;
    return currentCategory.questions.every(q => responses[q.id] !== undefined);
  };

  const getTotalAnswered = () => {
    return Object.keys(responses).length;
  };

  const getTotalQuestions = () => {
    return questions.length;
  };

  const handleNext = () => {
    if (!isCurrentCategoryComplete()) {
      alert('Please answer all questions in this section before proceeding');
      return;
    }

    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!isCurrentCategoryComplete()) {
      alert('Please answer all questions in this section before submitting');
      return;
    }

    const totalQuestions = getTotalQuestions();
    const answeredQuestions = getTotalAnswered();

    if (answeredQuestions < totalQuestions) {
      alert(`Please answer all questions. ${answeredQuestions}/${totalQuestions} answered.`);
      return;
    }

    if (!confirm('Are you sure you want to submit your assessment? You cannot modify your answers after submission.')) {
      return;
    }

    setSubmitting(true);

    try {
      // Save all responses to database
      const responseRecords = Object.entries(responses).map(([questionId, score]) => ({
        user_id: userId,
        question_id: questionId,
        score: score
      }));

      const { error: responseError } = await supabase
        .from('assessment_responses')
        .insert(responseRecords);

      if (responseError) {
        console.error('Error saving responses:', responseError);
        alert('Failed to save assessment responses');
        setSubmitting(false);
        return;
      }

      // Mark token as completed
      await markTokenCompleted(token, userId);

      // Navigate to results
      navigate('/results', { 
        state: { 
          userId,
          fromAssessment: true 
        } 
      });

    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Assessment</h3>
              <p className="text-sm text-gray-600 text-center">
                Preparing your assessment questions...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No assessment questions found. Please contact support.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img src={navviLogo} alt="Navvi Logo" className="h-8" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Datrix™ Assessment</h1>
                <p className="text-sm text-gray-600">{invitation.company_name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progress</div>
              <div className="text-lg font-bold text-blue-600">
                {currentCategoryIndex + 1} / {totalCategories}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-blue-900">
                  {currentCategory.name}
                </CardTitle>
                <CardDescription className="text-blue-700 mt-2">
                  {currentCategory.description}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {currentCategoryIndex + 1}
                </div>
                <div className="text-sm text-blue-700">of {totalCategories}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {currentCategory.questions.map((question, index) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 mb-2">
                      {question.question_text}
                    </CardTitle>
                    {question.description && (
                      <CardDescription className="text-gray-600">
                        {question.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={responses[question.id]?.toString()}
                  onValueChange={(value) => handleResponseChange(question.id, value)}
                  className="space-y-3"
                >
                  {[
                    { value: '5', label: 'Strongly Agree / Excellent', color: 'text-green-700' },
                    { value: '4', label: 'Agree / Good', color: 'text-blue-700' },
                    { value: '3', label: 'Neutral / Average', color: 'text-yellow-700' },
                    { value: '2', label: 'Disagree / Poor', color: 'text-orange-700' },
                    { value: '1', label: 'Strongly Disagree / Very Poor', color: 'text-red-700' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                      <Label 
                        htmlFor={`${question.id}-${option.value}`} 
                        className={`flex-1 cursor-pointer font-medium ${option.color}`}
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Info */}
        <Card className="mb-6 bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">
                  Questions Answered: <strong>{getTotalAnswered()}</strong> / {getTotalQuestions()}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Section {currentCategoryIndex + 1} of {totalCategories}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCategoryIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Section
          </Button>

          {currentCategoryIndex < totalCategories - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isCurrentCategoryComplete()}
              className="flex items-center gap-2"
            >
              Next Section
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentCategoryComplete() || submitting}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submit Assessment
                </>
              )}
            </Button>
          )}
        </div>

        {!isCurrentCategoryComplete() && (
          <Alert className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please answer all questions in this section to proceed
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AssessmentToken;


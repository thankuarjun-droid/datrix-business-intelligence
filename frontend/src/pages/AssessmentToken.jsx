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
  const [error, setError] = useState(null);

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
      if (!invitation || !invitation.client_email) {
        console.error('No invitation data found');
        return;
      }

      // Check if user already exists with this email
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', invitation.client_email)
        .maybeSingle();

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
          // Continue anyway - we can still save responses without user_id
        } else {
          setUserId(newUser.id);
        }
      }
    } catch (error) {
      console.error('Error in createOrGetUser:', error);
      // Continue anyway
    }
  };

  const loadAssessmentQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch questions with category information
      const { data, error } = await supabase
        .from('assessment_questions')
        .select(`
          *,
          assessment_categories (
            id,
            name,
            description
          )
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading questions:', error);
        setError('Failed to load assessment questions. Please try again.');
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setError('No assessment questions found. Please contact support.');
        setLoading(false);
        return;
      }

      setQuestions(data);

      // Group questions by category
      const categoryMap = {};
      data.forEach(question => {
        const categoryName = question.assessment_categories?.name || 'General';
        const categoryDesc = question.assessment_categories?.description || '';
        
        if (!categoryMap[categoryName]) {
          categoryMap[categoryName] = {
            name: categoryName,
            description: categoryDesc,
            questions: []
          };
        }
        categoryMap[categoryName].questions.push(question);
      });

      const categoriesArray = Object.values(categoryMap);
      setCategories(categoriesArray);
      setLoading(false);

      console.log(`Loaded ${data.length} questions across ${categoriesArray.length} categories`);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load assessment questions. Please try again.');
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const currentCategory = categories[currentCategoryIndex];
  const totalCategories = categories.length;
  const progress = totalCategories > 0 ? ((currentCategoryIndex + 1) / totalCategories) * 100 : 0;

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

  const handleNextCategory = () => {
    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmitAssessment = async () => {
    if (getTotalAnswered() < getTotalQuestions()) {
      alert(`Please answer all questions before submitting. You have answered ${getTotalAnswered()} out of ${getTotalQuestions()} questions.`);
      return;
    }

    setSubmitting(true);

    try {
      // If we don't have a userId, try to create one now
      let finalUserId = userId;
      if (!finalUserId && invitation && invitation.client_email) {
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert([
            {
              name: invitation.client_name,
              email: invitation.client_email,
              mobile: invitation.client_mobile || '',
              company_name: invitation.company_name,
              is_verified: true,
              verification_token: token
            }
          ])
          .select()
          .single();

        if (!userError && newUser) {
          finalUserId = newUser.id;
          setUserId(newUser.id);
        }
      }

      if (!finalUserId) {
        alert('Unable to create user record. Please try again or contact support.');
        setSubmitting(false);
        return;
      }

      // Create assessment record
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          user_id: finalUserId,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (assessmentError) {
        console.error('Error creating assessment:', assessmentError);
        alert('Failed to save assessment. Please try again.');
        setSubmitting(false);
        return;
      }

      // Save all responses
      const responseRecords = Object.entries(responses).map(([questionId, value]) => ({
        assessment_id: assessment.id,
        question_id: questionId,
        response_value: value
      }));

      const { error: responsesError } = await supabase
        .from('assessment_responses')
        .insert(responseRecords);

      if (responsesError) {
        console.error('Error saving responses:', responsesError);
        alert('Failed to save responses. Please try again.');
        setSubmitting(false);
        return;
      }

      // Mark token as completed
      if (token) {
        await markTokenCompleted(token, finalUserId);
      }

      // Navigate to results
      navigate('/results', {
        state: {
          assessmentId: assessment.id,
          userId: finalUserId,
          responses: responses,
          questions: questions
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Loading Assessment</h2>
              <p className="text-gray-600 text-center">Preparing your assessment questions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Error Loading Assessment</h2>
              <p className="text-gray-600 text-center">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-12 w-12 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">No Questions Available</h2>
              <p className="text-gray-600 text-center">No assessment questions found. Please contact support.</p>
              <Button onClick={() => navigate('/')}>Go Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={navviLogo} alt="Navvi Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Datrix™ Assessment</h1>
                <p className="text-sm text-gray-600">{invitation?.company_name || 'Business Assessment'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {getTotalAnswered()} / {getTotalQuestions()}
              </p>
              <p className="text-xs text-gray-600">Questions Answered</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-600 mt-1">
              Section {currentCategoryIndex + 1} of {totalCategories}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{currentCategory.name}</CardTitle>
            <CardDescription>{currentCategory.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentCategory.questions.map((question, index) => (
              <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
                <Label className="text-base font-medium text-gray-900 mb-4 block">
                  {index + 1}. {question.question_text}
                </Label>
                {question.help_text && (
                  <p className="text-sm text-gray-600 mb-3">{question.help_text}</p>
                )}
                <RadioGroup
                  value={responses[question.id]?.toString()}
                  onValueChange={(value) => handleResponseChange(question.id, value)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="1" id={`${question.id}-1`} />
                      <Label htmlFor={`${question.id}-1`} className="cursor-pointer flex-1">
                        <span className="font-medium">1</span>
                        <span className="text-xs text-gray-600 block">Poor</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="2" id={`${question.id}-2`} />
                      <Label htmlFor={`${question.id}-2`} className="cursor-pointer flex-1">
                        <span className="font-medium">2</span>
                        <span className="text-xs text-gray-600 block">Fair</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="3" id={`${question.id}-3`} />
                      <Label htmlFor={`${question.id}-3`} className="cursor-pointer flex-1">
                        <span className="font-medium">3</span>
                        <span className="text-xs text-gray-600 block">Good</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="4" id={`${question.id}-4`} />
                      <Label htmlFor={`${question.id}-4`} className="cursor-pointer flex-1">
                        <span className="font-medium">4</span>
                        <span className="text-xs text-gray-600 block">Excellent</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousCategory}
            disabled={currentCategoryIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Section
          </Button>

          {!isCurrentCategoryComplete() && (
            <Alert className="flex-1 mx-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please answer all questions in this section before proceeding.
              </AlertDescription>
            </Alert>
          )}

          {currentCategoryIndex < totalCategories - 1 ? (
            <Button
              onClick={handleNextCategory}
              disabled={!isCurrentCategoryComplete()}
            >
              Next Section
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmitAssessment}
              disabled={!isCurrentCategoryComplete() || submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Assessment
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentToken;


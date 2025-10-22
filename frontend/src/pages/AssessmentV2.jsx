import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2, AlertCircle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from '../config/supabase';
import { markTokenCompleted } from '../services/invitationService';
import navviLogo from '../assets/navvi-logo.svg';

const AssessmentFinal = () => {
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
        console.error('No invitation data available');
        return;
      }

      // Check if invitation has user ID directly (from users table)
      if (invitation.id && invitation.client_email) {
        // Try to find user by email
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', invitation.client_email)
          .maybeSingle();

        if (existingUser) {
          console.log('Found existing user:', existingUser.id);
          setUserId(existingUser.id);
          return;
        }
      }

      // If no existing user found, create new one (for manual invitations)
      console.log('Creating new user for invitation');
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          full_name: invitation.client_name,
          email: invitation.client_email,
          mobile: invitation.client_mobile || '',
          business_name: invitation.company_name,
          is_verified: true,
          status: 'approved',
          assessment_token: token
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return;
      }

      if (newUser) {
        console.log('Created new user:', newUser.id);
        setUserId(newUser.id);
      }
    } catch (error) {
      console.error('Error in createOrGetUser:', error);
    }
  };

  const loadAssessmentQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

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
    } catch (error) {
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

  const getTotalAnswered = () => Object.keys(responses).length;
  const getTotalQuestions = () => questions.length;

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
      let finalUserId = userId;
      if (!finalUserId && invitation && invitation.client_email) {
        const { data: newUser, error: userError } = await supabase
          .from('users')
          .insert([{
            name: invitation.client_name,
            email: invitation.client_email,
            mobile: invitation.client_mobile || '',
            company_name: invitation.company_name,
            is_verified: true,
            verification_token: token
          }])
          .select()
          .single();

        if (userError) {
          alert('Unable to create user record. Error: ' + userError.message);
          setSubmitting(false);
          return;
        }

        finalUserId = newUser.id;
        setUserId(newUser.id);
      }

      if (!finalUserId) {
        alert('Unable to create user record. Please try again or contact support.');
        setSubmitting(false);
        return;
      }

      // Calculate scoring metrics
      const answersData = {};
      const categoryScoresData = {};
      let totalScore = 0;
      let maxScore = 0;

      // Process all responses and calculate scores by category
      questions.forEach(q => {
        const responseValue = responses[q.id] || 0;
        const questionMaxScore = q.max_score || 4;
        
        answersData[q.id] = {
          question_id: q.id,
          question_text: q.question_text,
          category: q.assessment_categories?.name || 'Unknown',
          response_value: responseValue,
          max_score: questionMaxScore
        };
        
        totalScore += responseValue;
        maxScore += questionMaxScore;
        
        // Aggregate by category
        const categoryName = q.assessment_categories?.name || 'Unknown';
        if (!categoryScoresData[categoryName]) {
          categoryScoresData[categoryName] = {
            score: 0,
            max_score: 0,
            questions_count: 0
          };
        }
        categoryScoresData[categoryName].score += responseValue;
        categoryScoresData[categoryName].max_score += questionMaxScore;
        categoryScoresData[categoryName].questions_count += 1;
      });

      // Calculate percentage and grade
      const percentage = maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(2) : 0;
      let overallGrade = 'D';
      if (percentage >= 85) overallGrade = 'A';
      else if (percentage >= 70) overallGrade = 'B';
      else if (percentage >= 55) overallGrade = 'C';

      // Calculate category percentages
      Object.keys(categoryScoresData).forEach(category => {
        const catData = categoryScoresData[category];
        catData.percentage = catData.max_score > 0 
          ? ((catData.score / catData.max_score) * 100).toFixed(2) 
          : 0;
      });

      // Generate recommendations based on scores
      const recommendations = [];
      Object.entries(categoryScoresData).forEach(([category, data]) => {
        const catPercentage = parseFloat(data.percentage);
        if (catPercentage < 60) {
          recommendations.push({
            category,
            priority: 'High',
            message: `${category} requires immediate attention with a score of ${catPercentage.toFixed(1)}%. Focus on strengthening core capabilities in this area.`
          });
        } else if (catPercentage < 75) {
          recommendations.push({
            category,
            priority: 'Medium',
            message: `${category} shows moderate performance at ${catPercentage.toFixed(1)}%. Consider targeted improvements to reach excellence.`
          });
        } else {
          recommendations.push({
            category,
            priority: 'Low',
            message: `${category} demonstrates strong performance at ${catPercentage.toFixed(1)}%. Maintain current practices and explore optimization opportunities.`
          });
        }
      });

      // Insert assessment with all required fields
      const { data: assessment, error: assessmentError } = await supabase
        .from('assessments')
        .insert({
          user_id: finalUserId,
          answers: answersData,
          total_score: totalScore,
          max_score: maxScore,
          percentage: parseFloat(percentage),
          overall_grade: overallGrade,
          category_scores: categoryScoresData,
          recommendations: recommendations,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (assessmentError) {
        alert('Failed to save assessment. Please try again.');
        setSubmitting(false);
        return;
      }

      const responseRecords = Object.entries(responses).map(([questionId, value]) => ({
        assessment_id: assessment.id,
        question_id: questionId,
        response_value: value
      }));

      const { error: responsesError } = await supabase
        .from('assessment_responses')
        .insert(responseRecords);

      if (responsesError) {
        alert('Failed to save responses. Please try again.');
        setSubmitting(false);
        return;
      }

      // Mark token as completed (non-blocking - don't wait for it)
      if (token) {
        markTokenCompleted(token, finalUserId).catch(err => {
          console.warn('Failed to mark token as completed:', err);
        });
      }

      // Navigate to business context form to collect additional data
      navigate('/business-context', {
        state: {
          assessmentData: {
            id: assessment.id,
            user_id: finalUserId,
            total_score: totalScore,
            max_score: maxScore,
            percentage: parseFloat(percentage),
            overall_grade: overallGrade,
            category_scores: categoryScoresData,
            recommendations: recommendations,
            completed_at: new Date().toISOString()
          },
          responses: responses
        }
      });
    } catch (error) {
      alert('Failed to submit assessment. Error: ' + error.message);
      setSubmitting(false);
    }
  };

  // Color scheme for score values
  const getOptionColor = (value, isSelected) => {
    const colors = {
      0: { base: 'bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-700', selected: 'bg-gray-500 text-white border-gray-600 shadow-lg' },
      1: { base: 'bg-red-50 hover:bg-red-100 border-red-300 text-red-700', selected: 'bg-red-500 text-white border-red-600 shadow-lg' },
      2: { base: 'bg-orange-50 hover:bg-orange-100 border-orange-300 text-orange-700', selected: 'bg-orange-500 text-white border-orange-600 shadow-lg' },
      3: { base: 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700', selected: 'bg-blue-500 text-white border-blue-600 shadow-lg' },
      4: { base: 'bg-green-50 hover:bg-green-100 border-green-300 text-green-700', selected: 'bg-green-500 text-white border-green-600 shadow-lg' },
    };
    return isSelected ? colors[value].selected : colors[value].base;
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
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={navviLogo} alt="Navvi Logo" className="h-10 w-10" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Datrix™ Assessment</h1>
                  <p className="text-sm text-gray-600">{invitation?.company_name || 'Business Assessment'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {getTotalAnswered()} / {getTotalQuestions()}
                </p>
                <p className="text-xs text-gray-600">Questions Answered</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-medium text-gray-700">
                  {currentCategory.name}
                </p>
                <p className="text-xs text-gray-600">
                  Section {currentCategoryIndex + 1} of {totalCategories}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-2xl text-blue-900">{currentCategory.name}</CardTitle>
              <CardDescription className="text-base text-gray-700">{currentCategory.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              {currentCategory.questions.map((question, index) => {
                const options = question.options || [];
                
                return (
                  <div key={question.id} className="border-b border-gray-200 pb-8 last:border-0">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <p className="text-lg font-medium text-gray-900 flex-1">
                            {question.question_text}
                          </p>
                          {question.explanation && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="flex-shrink-0 text-blue-600 hover:text-blue-700 transition-colors">
                                  <Info className="h-5 w-5" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                <p className="text-sm">{question.explanation}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {question.explanation && (
                      <div className="ml-11 mb-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold text-blue-900">Why this matters: </span>
                          {question.explanation}
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-3 ml-11">
                      {options.map((optionText, optionIndex) => {
                        const isSelected = responses[question.id] === optionIndex;
                        return (
                          <button
                            key={optionIndex}
                            onClick={() => handleResponseChange(question.id, optionIndex)}
                            className={`
                              px-4 py-3 rounded-lg border-2 font-medium text-sm text-left
                              transition-all duration-200 transform hover:scale-[1.02]
                              ${getOptionColor(optionIndex, isSelected)}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex-1">{optionText}</span>
                              {isSelected && (
                                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePreviousCategory}
              disabled={currentCategoryIndex === 0}
              className="px-6"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous Section
            </Button>

            {!isCurrentCategoryComplete() && (
              <Alert className="flex-1 border-orange-300 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Please answer all questions in this section before proceeding.
                </AlertDescription>
              </Alert>
            )}

            {currentCategoryIndex < totalCategories - 1 ? (
              <Button
                onClick={handleNextCategory}
                disabled={!isCurrentCategoryComplete()}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                Next Section
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitAssessment}
                disabled={!isCurrentCategoryComplete() || submitting}
                className="px-8 bg-green-600 hover:bg-green-700 text-lg py-6"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Submit Assessment
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AssessmentFinal;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import navviLogo from '../assets/navvi-logo.svg';
import { fetchAssessmentQuestions, submitAssessment } from '../config/supabase';

const AssessmentDynamic = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Load questions from Supabase on component mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const questionsData = await fetchAssessmentQuestions();
        
        // Group questions by category for better organization
        const categoriesMap = {};
        questionsData.forEach(q => {
          const categoryName = q.assessment_categories?.name || 'Uncategorized';
          if (!categoriesMap[categoryName]) {
            categoriesMap[categoryName] = [];
          }
          categoriesMap[categoryName].push(q);
        });
        
        setQuestions(questionsData);
        setCategories(Object.keys(categoriesMap));
        setLoading(false);
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Failed to load assessment questions. Please try again later.');
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: value
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Get user ID from localStorage or session
      const userId = localStorage.getItem('userId') || 'demo-user';
      
      // Format responses for submission
      const responses = Object.entries(answers).map(([questionId, value]) => ({
        question_id: questionId,
        response_value: parseInt(value)
      }));

      // Submit to Supabase
      const assessment = await submitAssessment(userId, responses);
      
      // Calculate scores
      const totalScore = Object.values(answers).reduce((sum, val) => sum + parseInt(val), 0);
      const maxScore = questions.length * 4; // Assuming max score is 4 per question
      const percentage = Math.round((totalScore / maxScore) * 100);

      // Navigate to results page with assessment data
      navigate('/results', {
        state: {
          assessmentId: assessment.id,
          answers,
          totalScore,
          percentage,
          questions
        }
      });
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Failed to submit assessment. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="text-lg font-medium">Loading Assessment Questions...</p>
              <p className="text-sm text-gray-500">Please wait while we prepare your assessment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert>
              <AlertDescription>
                No assessment questions available at this time. Please contact support.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full mt-4"
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isAnswered = answers[currentQ.id] !== undefined;
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={navviLogo} alt="Navvi Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Datrix™</h1>
                <p className="text-sm text-gray-600">Business Intelligence Scanner</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-xs text-gray-500">
                {currentQ.assessment_categories?.name || 'General'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-gray-600 mt-2 text-center">
          {Math.round(progress)}% Complete
        </p>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-600 mb-2">
                  {currentQ.assessment_categories?.name || 'General Assessment'}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {currentQ.question_text}
                </CardTitle>
                {currentQ.help_text && (
                  <p className="text-sm text-gray-500 mt-3 p-3 bg-blue-50 rounded-md">
                    <strong>Scoring Guide:</strong> {currentQ.help_text}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Scale-based question (0-4) */}
            {currentQ.question_type === 'scale' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm text-gray-600">Not at all</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {answers[currentQ.id] !== undefined ? answers[currentQ.id] : '-'}
                  </span>
                  <span className="text-sm text-gray-600">Excellent</span>
                </div>
                <Slider
                  value={[answers[currentQ.id] || 0]}
                  onValueChange={(value) => handleAnswer(value[0])}
                  max={currentQ.max_score || 4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 px-2">
                  {[...Array(currentQ.max_score + 1 || 5)].map((_, i) => (
                    <span key={i}>{i}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {!isLastQuestion ? (
                <Button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isAnswered || submitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Assessment'
                  )}
                </Button>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="text-center text-sm text-gray-500 pt-2">
              {Object.keys(answers).length} of {questions.length} questions answered
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssessmentDynamic;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import navviLogo from '../assets/navvi-logo.svg';

const Assessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const questions = [
    // Financial Management (5 questions)
    {
      id: 1,
      category: 'Financial Management',
      question: 'How well does your company manage cash flow and working capital?',
      options: [
        { value: 4, label: 'Excellent - We have robust cash flow management with detailed forecasting' },
        { value: 3, label: 'Good - We monitor cash flow regularly with some forecasting' },
        { value: 2, label: 'Fair - Basic cash flow tracking with occasional issues' },
        { value: 1, label: 'Poor - Frequent cash flow problems and limited tracking' }
      ]
    },
    {
      id: 2,
      category: 'Financial Management',
      question: 'How comprehensive is your financial reporting and analysis?',
      options: [
        { value: 4, label: 'Excellent - Detailed monthly reports with variance analysis and KPIs' },
        { value: 3, label: 'Good - Regular financial reports with basic analysis' },
        { value: 2, label: 'Fair - Basic financial statements prepared periodically' },
        { value: 1, label: 'Poor - Limited or infrequent financial reporting' }
      ]
    },
    {
      id: 3,
      category: 'Financial Management',
      question: 'How effective is your cost control and budgeting process?',
      options: [
        { value: 4, label: 'Excellent - Comprehensive budgeting with regular variance analysis' },
        { value: 3, label: 'Good - Annual budgets with quarterly reviews' },
        { value: 2, label: 'Fair - Basic budgeting with limited monitoring' },
        { value: 1, label: 'Poor - No formal budgeting process' }
      ]
    },
    {
      id: 4,
      category: 'Financial Management',
      question: 'How well do you manage accounts receivable and credit control?',
      options: [
        { value: 4, label: 'Excellent - Systematic credit control with minimal bad debts' },
        { value: 3, label: 'Good - Regular follow-up on overdue accounts' },
        { value: 2, label: 'Fair - Basic credit control with some delays' },
        { value: 1, label: 'Poor - Frequent payment delays and bad debts' }
      ]
    },
    {
      id: 5,
      category: 'Financial Management',
      question: 'How effectively do you manage inventory and working capital?',
      options: [
        { value: 4, label: 'Excellent - Optimized inventory levels with automated systems' },
        { value: 3, label: 'Good - Regular inventory management with some automation' },
        { value: 2, label: 'Fair - Basic inventory tracking with manual processes' },
        { value: 1, label: 'Poor - Poor inventory control leading to excess or shortages' }
      ]
    },

    // Operations Management (6 questions)
    {
      id: 6,
      category: 'Operations Management',
      question: 'How efficient are your production processes and workflows?',
      options: [
        { value: 4, label: 'Excellent - Lean processes with continuous improvement programs' },
        { value: 3, label: 'Good - Standardized processes with regular optimization' },
        { value: 2, label: 'Fair - Basic processes with some inefficiencies' },
        { value: 1, label: 'Poor - Inefficient processes with frequent bottlenecks' }
      ]
    },
    {
      id: 7,
      category: 'Operations Management',
      question: 'How effective is your quality control and assurance system?',
      options: [
        { value: 4, label: 'Excellent - Comprehensive QC with statistical process control' },
        { value: 3, label: 'Good - Regular quality checks with documented procedures' },
        { value: 2, label: 'Fair - Basic quality control with some defects' },
        { value: 1, label: 'Poor - Inconsistent quality with frequent customer complaints' }
      ]
    },
    {
      id: 8,
      category: 'Operations Management',
      question: 'How well do you manage your supply chain and vendor relationships?',
      options: [
        { value: 4, label: 'Excellent - Strategic partnerships with reliable suppliers' },
        { value: 3, label: 'Good - Good supplier relationships with backup options' },
        { value: 2, label: 'Fair - Basic supplier management with occasional issues' },
        { value: 1, label: 'Poor - Frequent supplier problems affecting production' }
      ]
    },
    {
      id: 9,
      category: 'Operations Management',
      question: 'How effectively do you utilize technology and automation?',
      options: [
        { value: 4, label: 'Excellent - Advanced automation and integrated systems' },
        { value: 3, label: 'Good - Some automation with digital systems' },
        { value: 2, label: 'Fair - Basic technology with manual processes' },
        { value: 1, label: 'Poor - Limited technology adoption' }
      ]
    },
    {
      id: 10,
      category: 'Operations Management',
      question: 'How well do you manage production capacity and scheduling?',
      options: [
        { value: 4, label: 'Excellent - Optimized capacity planning with flexible scheduling' },
        { value: 3, label: 'Good - Regular capacity planning with some flexibility' },
        { value: 2, label: 'Fair - Basic scheduling with occasional capacity issues' },
        { value: 1, label: 'Poor - Poor capacity utilization and scheduling conflicts' }
      ]
    },
    {
      id: 11,
      category: 'Operations Management',
      question: 'How effective is your maintenance and equipment management?',
      options: [
        { value: 4, label: 'Excellent - Preventive maintenance with minimal downtime' },
        { value: 3, label: 'Good - Regular maintenance schedules with good uptime' },
        { value: 2, label: 'Fair - Basic maintenance with some unplanned downtime' },
        { value: 1, label: 'Poor - Frequent equipment failures and breakdowns' }
      ]
    },

    // Human Resources (4 questions)
    {
      id: 12,
      category: 'Human Resources',
      question: 'How effective are your recruitment and retention strategies?',
      options: [
        { value: 4, label: 'Excellent - Low turnover with systematic recruitment process' },
        { value: 3, label: 'Good - Reasonable retention with structured hiring' },
        { value: 2, label: 'Fair - Moderate turnover with basic recruitment' },
        { value: 1, label: 'Poor - High turnover and recruitment challenges' }
      ]
    },
    {
      id: 13,
      category: 'Human Resources',
      question: 'How comprehensive are your training and development programs?',
      options: [
        { value: 4, label: 'Excellent - Comprehensive training with career development paths' },
        { value: 3, label: 'Good - Regular training programs with skill development' },
        { value: 2, label: 'Fair - Basic training with limited development opportunities' },
        { value: 1, label: 'Poor - Minimal training and development activities' }
      ]
    },
    {
      id: 14,
      category: 'Human Resources',
      question: 'How well do you manage employee performance and motivation?',
      options: [
        { value: 4, label: 'Excellent - Regular performance reviews with incentive programs' },
        { value: 3, label: 'Good - Annual reviews with some recognition programs' },
        { value: 2, label: 'Fair - Basic performance management with limited feedback' },
        { value: 1, label: 'Poor - No formal performance management system' }
      ]
    },
    {
      id: 15,
      category: 'Human Resources',
      question: 'How effective is your workplace safety and compliance program?',
      options: [
        { value: 4, label: 'Excellent - Comprehensive safety program with zero incidents' },
        { value: 3, label: 'Good - Good safety practices with minimal incidents' },
        { value: 2, label: 'Fair - Basic safety measures with occasional incidents' },
        { value: 1, label: 'Poor - Poor safety record with frequent incidents' }
      ]
    },

    // Marketing & Sales (5 questions)
    {
      id: 16,
      category: 'Marketing & Sales',
      question: 'How effective are your marketing and brand positioning strategies?',
      options: [
        { value: 4, label: 'Excellent - Strong brand with comprehensive marketing strategy' },
        { value: 3, label: 'Good - Good brand recognition with regular marketing activities' },
        { value: 2, label: 'Fair - Basic marketing with limited brand development' },
        { value: 1, label: 'Poor - Weak brand presence and minimal marketing' }
      ]
    },
    {
      id: 17,
      category: 'Marketing & Sales',
      question: 'How well do you understand and serve your target customers?',
      options: [
        { value: 4, label: 'Excellent - Deep customer insights with personalized service' },
        { value: 3, label: 'Good - Good customer understanding with targeted approach' },
        { value: 2, label: 'Fair - Basic customer knowledge with standard service' },
        { value: 1, label: 'Poor - Limited customer understanding and generic approach' }
      ]
    },
    {
      id: 18,
      category: 'Marketing & Sales',
      question: 'How effective is your sales process and customer acquisition?',
      options: [
        { value: 4, label: 'Excellent - Systematic sales process with high conversion rates' },
        { value: 3, label: 'Good - Structured sales approach with good results' },
        { value: 2, label: 'Fair - Basic sales process with moderate success' },
        { value: 1, label: 'Poor - Inconsistent sales approach with low conversion' }
      ]
    },
    {
      id: 19,
      category: 'Marketing & Sales',
      question: 'How well do you manage customer relationships and retention?',
      options: [
        { value: 4, label: 'Excellent - Strong customer loyalty with high retention rates' },
        { value: 3, label: 'Good - Good customer relationships with reasonable retention' },
        { value: 2, label: 'Fair - Basic customer service with moderate retention' },
        { value: 1, label: 'Poor - Poor customer relationships and high churn' }
      ]
    },
    {
      id: 20,
      category: 'Marketing & Sales',
      question: 'How effectively do you use digital marketing and e-commerce?',
      options: [
        { value: 4, label: 'Excellent - Comprehensive digital strategy with strong online presence' },
        { value: 3, label: 'Good - Active digital marketing with growing online sales' },
        { value: 2, label: 'Fair - Basic digital presence with limited online activity' },
        { value: 1, label: 'Poor - Minimal digital marketing and no e-commerce' }
      ]
    },

    // Strategic Management (5 questions)
    {
      id: 21,
      category: 'Strategic Management',
      question: 'How clear and well-communicated is your business strategy?',
      options: [
        { value: 4, label: 'Excellent - Clear strategy with regular communication and alignment' },
        { value: 3, label: 'Good - Defined strategy with good team understanding' },
        { value: 2, label: 'Fair - Basic strategy with limited communication' },
        { value: 1, label: 'Poor - Unclear strategy with poor communication' }
      ]
    },
    {
      id: 22,
      category: 'Strategic Management',
      question: 'How effectively do you monitor and adapt to market changes?',
      options: [
        { value: 4, label: 'Excellent - Proactive market monitoring with quick adaptation' },
        { value: 3, label: 'Good - Regular market analysis with timely responses' },
        { value: 2, label: 'Fair - Basic market awareness with slow adaptation' },
        { value: 1, label: 'Poor - Limited market monitoring and reactive approach' }
      ]
    },
    {
      id: 23,
      category: 'Strategic Management',
      question: 'How well do you manage innovation and product development?',
      options: [
        { value: 4, label: 'Excellent - Systematic innovation with regular new product launches' },
        { value: 3, label: 'Good - Some innovation activities with periodic new products' },
        { value: 2, label: 'Fair - Limited innovation with occasional new offerings' },
        { value: 1, label: 'Poor - No formal innovation process or new product development' }
      ]
    },
    {
      id: 24,
      category: 'Strategic Management',
      question: 'How effective is your competitive positioning and differentiation?',
      options: [
        { value: 4, label: 'Excellent - Strong competitive advantage with clear differentiation' },
        { value: 3, label: 'Good - Good market position with some differentiation' },
        { value: 2, label: 'Fair - Average market position with limited differentiation' },
        { value: 1, label: 'Poor - Weak competitive position with no clear differentiation' }
      ]
    },
    {
      id: 25,
      category: 'Strategic Management',
      question: 'How well do you plan for future growth and expansion?',
      options: [
        { value: 4, label: 'Excellent - Comprehensive growth strategy with clear roadmap' },
        { value: 3, label: 'Good - Growth plans with some strategic initiatives' },
        { value: 2, label: 'Fair - Basic growth planning with limited strategy' },
        { value: 1, label: 'Poor - No formal growth planning or expansion strategy' }
      ]
    },

    // Risk Management (2 questions)
    {
      id: 26,
      category: 'Risk Management',
      question: 'How comprehensive is your risk assessment and management system?',
      options: [
        { value: 4, label: 'Excellent - Comprehensive risk framework with regular assessments' },
        { value: 3, label: 'Good - Good risk identification with management procedures' },
        { value: 2, label: 'Fair - Basic risk awareness with limited management' },
        { value: 1, label: 'Poor - No formal risk management system' }
      ]
    },
    {
      id: 27,
      category: 'Risk Management',
      question: 'How well are you prepared for business continuity and crisis management?',
      options: [
        { value: 4, label: 'Excellent - Comprehensive continuity plans with regular testing' },
        { value: 3, label: 'Good - Business continuity plans with some preparation' },
        { value: 2, label: 'Fair - Basic continuity planning with limited preparation' },
        { value: 1, label: 'Poor - No business continuity or crisis management plans' }
      ]
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    // Calculate results locally for demo
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    // Store results in localStorage for demo
    localStorage.setItem('assessmentResults', JSON.stringify({
      answers,
      totalScore,
      maxScore,
      percentage,
      completedAt: new Date().toISOString()
    }));
    
    setTimeout(() => {
      navigate('/results');
    }, 2000);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  const isAnswered = answers[currentQ.id] !== undefined;
  const allAnswered = questions.every(q => answers[q.id] !== undefined);

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
              <p className="text-xs text-gray-600">{currentQ.category}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Assessment Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {currentQuestion + 1}
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">{currentQ.category}</CardTitle>
                  <p className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h3>
            
            <RadioGroup
              value={answers[currentQ.id]?.toString() || ''}
              onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
              className="space-y-4"
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value={option.value.toString()} id={`option-${index}`} className="mt-1" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700 leading-relaxed">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="px-6"
          >
            Previous
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {Object.keys(answers).length} of {questions.length} questions answered
            </p>
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || loading}
              className="bg-green-600 hover:bg-green-700 px-8"
            >
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="bg-blue-600 hover:bg-blue-700 px-6"
            >
              Next
            </Button>
          )}
        </div>

        {/* Summary */}
        {allAnswered && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Assessment Complete!
              </h3>
              <p className="text-green-700">
                You've answered all {questions.length} questions. Click "Submit Assessment" to see your results.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Assessment;


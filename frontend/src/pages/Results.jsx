import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Mail,
  Calendar,
  Target
} from 'lucide-react';
import navviLogo from '../assets/navvi-logo.svg';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load results from localStorage (in production, this would come from API)
    const savedResults = localStorage.getItem('assessmentResults');
    if (savedResults) {
      const data = JSON.parse(savedResults);
      setResults(calculateDetailedResults(data));
    } else {
      navigate('/');
    }
    setLoading(false);
  }, [navigate]);

  const calculateDetailedResults = (data) => {
    const categories = {
      'Financial Management': { questions: [1, 2, 3, 4, 5], color: '#3B82F6' },
      'Operations Management': { questions: [6, 7, 8, 9, 10, 11], color: '#10B981' },
      'Human Resources': { questions: [12, 13, 14, 15], color: '#F59E0B' },
      'Marketing & Sales': { questions: [16, 17, 18, 19, 20], color: '#EF4444' },
      'Strategic Management': { questions: [21, 22, 23, 24, 25], color: '#8B5CF6' },
      'Risk Management': { questions: [26, 27], color: '#F97316' }
    };

    const categoryResults = Object.entries(categories).map(([category, config]) => {
      const categoryAnswers = config.questions.map(q => data.answers[q] || 0);
      const categoryScore = categoryAnswers.reduce((sum, score) => sum + score, 0);
      const maxCategoryScore = config.questions.length * 4;
      const percentage = Math.round((categoryScore / maxCategoryScore) * 100);
      
      return {
        category,
        score: categoryScore,
        maxScore: maxCategoryScore,
        percentage,
        color: config.color,
        status: percentage >= 75 ? 'excellent' : percentage >= 60 ? 'good' : percentage >= 40 ? 'fair' : 'poor'
      };
    });

    return {
      ...data,
      categoryResults,
      overallGrade: data.percentage >= 75 ? 'A' : data.percentage >= 60 ? 'B' : data.percentage >= 40 ? 'C' : 'D',
      overallStatus: data.percentage >= 75 ? 'excellent' : data.percentage >= 60 ? 'good' : data.percentage >= 40 ? 'fair' : 'poor'
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'good': return <TrendingUp className="w-5 h-5 text-blue-600" />;
      case 'fair': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'poor': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getRecommendations = (categoryResults) => {
    const poorCategories = categoryResults.filter(cat => cat.status === 'poor');
    const fairCategories = categoryResults.filter(cat => cat.status === 'fair');
    
    const recommendations = [];
    
    if (poorCategories.length > 0) {
      recommendations.push({
        priority: 'High',
        title: 'Immediate Action Required',
        description: `Focus on improving ${poorCategories.map(cat => cat.category).join(', ')}. These areas need urgent attention.`,
        timeframe: '30 days'
      });
    }
    
    if (fairCategories.length > 0) {
      recommendations.push({
        priority: 'Medium',
        title: 'Areas for Improvement',
        description: `Work on enhancing ${fairCategories.map(cat => cat.category).join(', ')} to reach good performance levels.`,
        timeframe: '60-90 days'
      });
    }
    
    recommendations.push({
      priority: 'Low',
      title: 'Maintain Excellence',
      description: 'Continue monitoring and maintaining performance in your strong areas while implementing improvements.',
      timeframe: 'Ongoing'
    });
    
    return recommendations;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">No Results Found</h2>
            <p className="text-gray-600 mb-6">Please complete the assessment first.</p>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const recommendations = getRecommendations(results.categoryResults);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={navviLogo} alt="Navvi Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Datrix™</h1>
                <p className="text-sm text-gray-600">Business Intelligence Scanner</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email Report</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overall Score */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Business Health Score</h2>
              <p className="text-gray-600">Comprehensive 360° Assessment Results</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                      strokeDasharray={`${results.percentage}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">{results.percentage}%</div>
                      <div className="text-sm text-gray-600">Grade {results.overallGrade}</div>
                    </div>
                  </div>
                </div>
                <Badge className={`${getStatusColor(results.overallStatus)} px-4 py-2 text-sm font-medium`}>
                  {results.overallStatus.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Score</span>
                  <span className="font-semibold">{results.totalScore} / {results.maxScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Questions Answered</span>
                  <span className="font-semibold">27 / 27</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Assessment Date</span>
                  <span className="font-semibold">
                    {new Date(results.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Industry Focus</span>
                  <span className="font-semibold">Garment Manufacturing</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {getStatusIcon(results.overallStatus)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {results.overallStatus === 'excellent' && 'Outstanding Performance!'}
                  {results.overallStatus === 'good' && 'Good Performance'}
                  {results.overallStatus === 'fair' && 'Room for Improvement'}
                  {results.overallStatus === 'poor' && 'Needs Attention'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {results.overallStatus === 'excellent' && 'Your business shows excellent health across all areas.'}
                  {results.overallStatus === 'good' && 'Your business is performing well with some areas for enhancement.'}
                  {results.overallStatus === 'fair' && 'Your business has potential with several areas needing improvement.'}
                  {results.overallStatus === 'poor' && 'Your business requires immediate attention in multiple areas.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="w-5 h-5 text-blue-600" />
                <span>Category Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={results.categoryResults}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Score']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Bar dataKey="percentage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-600" />
                <span>Performance Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={results.categoryResults}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="percentage"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                  >
                    {results.categoryResults.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Category Results */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle>Detailed Category Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.categoryResults.map((category, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.category}</h3>
                      <Badge className={`${getStatusColor(category.status)} text-xs`}>
                        {category.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{category.percentage}%</div>
                      <div className="text-sm text-gray-600">{category.score}/{category.maxScore}</div>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span>90-Day Action Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                    <Badge 
                      className={`${
                        rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {rec.priority} Priority
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{rec.description}</p>
                  <p className="text-sm text-gray-500">Timeframe: {rec.timeframe}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/')}
              className="bg-blue-600 hover:bg-blue-700 px-8"
            >
              Take Assessment Again
            </Button>
            <Button 
              variant="outline"
              className="px-8"
            >
              Schedule Consultation
            </Button>
            <Button 
              variant="outline"
              className="px-8"
            >
              Download Detailed Report
            </Button>
          </div>
          
          <p className="text-sm text-gray-600">
            Need help interpreting your results?{' '}
            <a href="mailto:support@navvicorp.com" className="text-blue-600 hover:underline">
              Contact our experts
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Results;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  generateEnhancedReport, 
  getIndustryBenchmarks, 
  prepareRadarChartData 
} from '../services/enhancedAIReportService';
import { 
  TrendingUp, Download, Calendar, CheckCircle2, Target, 
  Zap, Award, BarChart3, AlertCircle, ArrowRight, Sparkles,
  Building2, DollarSign, Users, Clock
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip
} from 'recharts';

const ResultsEnhanced = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const assessmentData = location.state?.assessmentData;
  const businessContext = location.state?.businessContext;

  useEffect(() => {
    if (!assessmentData || !businessContext) {
      navigate('/');
      return;
    }

    // Generate AI report
    const generateReport = async () => {
      try {
        setLoading(true);
        const result = await generateEnhancedReport({
          assessmentData,
          businessContext,
          questions: [] // We'll fetch questions if needed
        });

        if (result.success) {
          setReport(result.report);
        } else {
          setError(result.error);
          // Still show fallback report
          if (result.report) {
            setReport(result.report);
          }
        }
      } catch (err) {
        console.error('Error generating report:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    generateReport();
  }, [assessmentData, businessContext, navigate]);

  const scheduleConsultation = () => {
    window.open('https://calendly.com/navvicorp', '_blank');
  };

  const downloadReport = () => {
    alert('PDF download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <Sparkles className="h-12 w-12 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your AI-Powered Report</h2>
          <p className="text-gray-600">Our AI is analyzing your responses and creating personalized insights...</p>
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Generation Failed</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to generate report. Please try again.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const radarData = prepareRadarChartData(report.assessment_summary.category_scores);
  const aiInsights = report.ai_insights;
  const percentage = report.assessment_summary.percentage;
  const grade = report.assessment_summary.grade;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Hero Section with Overall Score */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-12 w-12 mr-3" />
            <h1 className="text-4xl font-bold">Your Business Intelligence Report</h1>
          </div>
          <p className="text-center text-blue-100 text-lg mb-8">
            AI-Powered Insights Tailored to Your Business
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-5xl font-bold mb-2">{percentage.toFixed(1)}%</div>
              <div className="text-blue-100">Overall Score</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-5xl font-bold mb-2">{grade}</div>
              <div className="text-blue-100">Performance Grade</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{businessContext.sewing_machines}</div>
              <div className="text-blue-100 text-sm">Sewing Machines</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <DollarSign className="h-8 w-8 mx-auto mb-2" />
              <div className="text-lg font-bold">{businessContext.turnover_currency} {parseInt(businessContext.annual_turnover).toLocaleString()}</div>
              <div className="text-blue-100 text-sm">Annual Turnover</div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={downloadReport}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg"
            >
              <Download className="h-5 w-5" />
              Download PDF Report
            </button>
            <button
              onClick={scheduleConsultation}
              className="px-8 py-4 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2 shadow-lg"
            >
              <Calendar className="h-5 w-5" />
              Schedule Free Consultation
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-7 w-7 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">Executive Summary</h2>
          </div>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              {aiInsights.executive_summary?.overview}
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
              <p className="font-semibold text-purple-900 mb-2">Critical Insight:</p>
              <p className="text-purple-800">{aiInsights.executive_summary?.critical_insight}</p>
            </div>
          </div>
        </div>

        {/* Radar Chart - Performance Comparison */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-7 w-7 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Performance Radar Analysis</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Compare your performance across all categories against industry benchmarks and top performers
          </p>
          
          <ResponsiveContainer width="100%" height={500}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fill: '#374151', fontSize: 12 }}
                tickLine={false}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
              <Radar 
                name="Your Score" 
                dataKey="yourScore" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.6}
                strokeWidth={2}
              />
              <Radar 
                name="Industry Average" 
                dataKey="industryAverage" 
                stroke="#f59e0b" 
                fill="#f59e0b" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar 
                name="Top Performers" 
                dataKey="topPerformers" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Your Average</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">68%</div>
              <div className="text-sm text-gray-600">Industry Average</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">85%+</div>
              <div className="text-sm text-gray-600">Top Performers</div>
            </div>
          </div>
        </div>

        {/* Quick Wins Section */}
        {aiInsights.quick_wins && aiInsights.quick_wins.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 mb-8 border border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-7 w-7 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Quick Wins - Start Here!</h2>
            </div>
            <p className="text-gray-700 mb-6">
              These high-impact, low-effort actions can deliver immediate results:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {aiInsights.quick_wins.map((win, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{win.action}</h3>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                          Impact: {win.impact}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          Effort: {win.effort}
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                          {win.timeline}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Insights */}
        {aiInsights.category_insights && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-7 w-7 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-900">Detailed Category Analysis</h2>
            </div>
            <div className="space-y-6">
              {Object.entries(aiInsights.category_insights).map(([category, insights]) => {
                const categoryScore = report.assessment_summary.category_scores[category];
                const percentage = categoryScore ? parseFloat(categoryScore.percentage) : 0;
                
                return (
                  <div key={category} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{category}</h3>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{percentage.toFixed(1)}%</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          insights.priority_level === 'Critical' ? 'bg-red-100 text-red-800' :
                          insights.priority_level === 'High' ? 'bg-orange-100 text-orange-800' :
                          insights.priority_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {insights.priority_level} Priority
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{insights.current_state}</p>
                    
                    {insights.strengths && insights.strengths.length > 0 && (
                      <div className="mb-3">
                        <p className="font-semibold text-green-700 mb-2">✓ Strengths:</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {insights.strengths.map((strength, i) => (
                            <li key={i}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {insights.weaknesses && insights.weaknesses.length > 0 && (
                      <div className="mb-3">
                        <p className="font-semibold text-orange-700 mb-2">⚠ Areas for Improvement:</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {insights.weaknesses.map((weakness, i) => (
                            <li key={i}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {insights.recommendations && insights.recommendations.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-4 mt-4">
                        <p className="font-semibold text-blue-900 mb-2">📋 Recommendations:</p>
                        <ul className="space-y-2">
                          {insights.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-2 text-blue-800">
                              <ArrowRight className="h-5 w-5 flex-shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Consultation CTA - Sales Pitch */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl text-purple-100">
              This report is just the beginning. Let our experts help you implement these insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">What You Get with Consultation:</h3>
              <ul className="space-y-3">
                {[
                  'Customized implementation roadmap',
                  'Hands-on support from industry experts',
                  'Access to proven frameworks and tools',
                  'Regular progress reviews and adjustments',
                  'ROI tracking and performance metrics'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-300 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Typical Outcomes:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">20-30% Efficiency Gain</div>
                    <div className="text-sm text-purple-100">Within 6 months of implementation</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">15-25% Cost Reduction</div>
                    <div className="text-sm text-purple-100">Through process optimization</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Improved Team Performance</div>
                    <div className="text-sm text-purple-100">Higher productivity and morale</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">3-6 Month ROI</div>
                    <div className="text-sm text-purple-100">Investment pays for itself quickly</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={scheduleConsultation}
              className="px-12 py-5 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3"
            >
              <Calendar className="h-6 w-6" />
              Schedule Your Free 30-Minute Consultation
              <ArrowRight className="h-6 w-6" />
            </button>
            <p className="mt-4 text-purple-100">
              No obligation • Expert guidance • Tailored to your business
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsEnhanced;


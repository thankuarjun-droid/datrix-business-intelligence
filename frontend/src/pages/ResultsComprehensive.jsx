import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  generateComprehensiveReport, 
  getIndustryBenchmarks, 
  prepareRadarChartData 
} from '../services/comprehensiveAIReportService';
import { supabase } from '../config/supabase';
import { 
  TrendingUp, Download, Calendar, CheckCircle2, Target, 
  Zap, Award, BarChart3, AlertCircle, ArrowRight, Sparkles,
  Building2, DollarSign, Users, Clock, AlertTriangle, CheckCircle,
  XCircle, Info
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip
} from 'recharts';

const ResultsComprehensive = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  const assessmentData = location.state?.assessmentData;
  const businessContext = location.state?.businessContext;
  const responses = location.state?.responses;

  useEffect(() => {
    if (!assessmentData || !businessContext || !responses) {
      navigate('/');
      return;
    }

    loadQuestionsAndGenerateReport();
  }, [assessmentData, businessContext, responses, navigate]);

  const loadQuestionsAndGenerateReport = async () => {
    try {
      setLoading(true);

      // Load questions from Supabase
      const { data: questionsData, error: questionsError } = await supabase
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

      if (questionsError) throw questionsError;

      setQuestions(questionsData);

      // Generate comprehensive report
      const result = await generateComprehensiveReport({
        assessmentData,
        businessContext,
        responses,
        questions: questionsData
      });

      if (result.success) {
        setReport(result.report);
      } else {
        setError(result.error);
        if (result.report) {
          setReport(result.report);
        }
      }
    } catch (err) {
      console.error('Error loading questions and generating report:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Comprehensive Report</h2>
          <p className="text-gray-600">Our AI is analyzing your responses and creating detailed insights...</p>
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
  const percentage = parseFloat(report.assessment_summary.percentage) || 0;
  const grade = report.assessment_summary.grade || 'N/A';
  const heatMapData = report.heat_map || [];
  const categoryDeepDives = report.category_deep_dives || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-12 w-12 mr-3" />
            <h1 className="text-4xl font-bold">Your Comprehensive Business Intelligence Report</h1>
          </div>
          <p className="text-center text-blue-100 text-lg mb-8">
            AI-Powered Deep Analysis with Question-Level Insights
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
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg mb-4">
              <p className="font-semibold text-purple-900 mb-2">Critical Insight:</p>
              <p className="text-purple-800">{aiInsights.executive_summary?.critical_insight}</p>
            </div>
            {aiInsights.executive_summary?.key_findings && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-2">Key Findings:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  {aiInsights.executive_summary.key_findings.map((finding, i) => (
                    <li key={i}>{finding}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Heat Map Analysis */}
        {heatMapData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-7 w-7 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900">Heat Map Analysis</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Visual representation of your performance across all {heatMapData.length} questions. 
              Colors indicate performance level: Green (Excellent), Yellow (Needs Improvement), Red (Critical).
            </p>
            
            <div className="grid grid-cols-8 gap-2">
              {heatMapData.map((item, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: item.color }}
                  title={`Q${item.question_number}: ${item.category} - ${item.performance_level}`}
                >
                  {item.question_number}
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-500"></div>
                <span className="text-sm text-gray-700">Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-500"></div>
                <span className="text-sm text-gray-700">Needs Improvement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-red-500"></div>
                <span className="text-sm text-gray-700">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-400"></div>
                <span className="text-sm text-gray-700">Not Applicable</span>
              </div>
            </div>
          </div>
        )}

        {/* Radar Chart */}
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

        {/* Quick Wins */}
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

        {/* Category Deep Dives with Question-Level Analysis */}
        {categoryDeepDives.map((categoryData, catIndex) => (
          <div key={catIndex} className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Target className="h-7 w-7 text-indigo-600" />
                <h2 className="text-3xl font-bold text-gray-900">{categoryData.name}</h2>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {report.assessment_summary.category_scores[categoryData.name]?.percentage.toFixed(1)}%
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${
                  categoryData.summary.priority_level === 'Critical' ? 'bg-red-100 text-red-800' :
                  categoryData.summary.priority_level === 'High' ? 'bg-orange-100 text-orange-800' :
                  categoryData.summary.priority_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {categoryData.summary.priority_level} Priority
                </span>
              </div>
            </div>

            {/* Category Summary */}
            {categoryData.summary.current_state && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700">{categoryData.summary.current_state}</p>
              </div>
            )}

            {/* Question-Level Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Question-Level Analysis</h3>
              {categoryData.questions.map((qa, qIndex) => (
                <div key={qIndex} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Performance Indicator */}
                    <div className="flex-shrink-0">
                      {qa.performance_level === 'Excellent' && (
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-white" />
                        </div>
                      )}
                      {qa.performance_level === 'Good' && (
                        <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                          <CheckCircle2 className="h-8 w-8 text-white" />
                        </div>
                      )}
                      {qa.performance_level === 'Needs Improvement' && (
                        <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="h-8 w-8 text-white" />
                        </div>
                      )}
                      {qa.performance_level === 'Critical' && (
                        <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                          <XCircle className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Question Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 text-lg flex-1">
                          Q{qIndex + 1}: {qa.question_text}
                        </h4>
                        <span className="ml-4 text-sm font-medium text-gray-600">
                          {qa.score}/{qa.max_score}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-blue-900 mb-1">Your Response:</p>
                          <p className="text-blue-800">{qa.response_text}</p>
                        </div>
                        <div className={`rounded-lg p-3 ${
                          qa.performance_level === 'Excellent' ? 'bg-green-50' :
                          qa.performance_level === 'Good' ? 'bg-green-50' :
                          qa.performance_level === 'Needs Improvement' ? 'bg-yellow-50' :
                          'bg-red-50'
                        }`}>
                          <p className={`text-sm font-semibold mb-1 ${
                            qa.performance_level === 'Excellent' ? 'text-green-900' :
                            qa.performance_level === 'Good' ? 'text-green-900' :
                            qa.performance_level === 'Needs Improvement' ? 'text-yellow-900' :
                            'text-red-900'
                          }`}>
                            Performance Level:
                          </p>
                          <p className={
                            qa.performance_level === 'Excellent' ? 'text-green-800' :
                            qa.performance_level === 'Good' ? 'text-green-800' :
                            qa.performance_level === 'Needs Improvement' ? 'text-yellow-800' :
                            'text-red-800'
                          }>
                            {qa.performance_level}
                          </p>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Diagnosis & Impact:
                        </p>
                        <p className="text-gray-700 text-sm">{qa.diagnosis}</p>
                      </div>

                      {/* Recommendations */}
                      {qa.recommendations && qa.recommendations.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <p className="text-sm font-semibold text-blue-900 mb-2">Recommended Actions:</p>
                          <ul className="space-y-1">
                            {qa.recommendations.map((rec, recIndex) => (
                              <li key={recIndex} className="flex items-start gap-2 text-sm text-blue-800">
                                <ArrowRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Consultation CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Save ₹8+ Crores Annually: Eliminate Factory Inefficiencies in 90 Days</h2>
            <p className="text-xl text-orange-100 mb-4">
              Stop losing money to operational inefficiencies. Get your complete transformation package with our proven Ultimate Factory Transformation Mastery.
            </p>
            <div className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold text-lg">
              🛡️ 50% Money Back Guarantee if we don't deliver 15% savings in 90 days!
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Our Scientific 3-Phase Transformation:</h3>
              <ul className="space-y-3">
                {[
                  { phase: 'Crisis Response (0-3 months)', result: '50% Loss Reduction' },
                  { phase: 'System Enhancement (3-9 months)', result: '70% Loss Reduction' },
                  { phase: 'Excellence Institutionalization (9-15 months)', result: '85% Loss Reduction' }
                ].map((item, i) => (
                  <li key={i} className="bg-white/10 rounded-lg p-3">
                    <div className="font-semibold">{item.phase}</div>
                    <div className="text-sm text-orange-100">{item.result}</div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Proven Results:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-yellow-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">10+ Factories Transformed</div>
                    <div className="text-sm text-orange-100">98% Client Satisfaction</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DollarSign className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">₹500+ Cr Total Savings</div>
                    <div className="text-sm text-purple-100">Through process optimization</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">Cut Defects by 3%, Slash Rework by 15%</div>
                    <div className="text-sm text-orange-100">Optimize workforce efficiency</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-300 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold">500%+ ROI in 12 Months</div>
                    <div className="text-sm text-orange-100">Visible results within 30 days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={scheduleConsultation}
              className="px-12 py-5 bg-yellow-400 text-gray-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3"
            >
              <Calendar className="h-6 w-6" />
              📋 Claim Your Free Factory Audit
              <ArrowRight className="h-6 w-6" />
            </button>
            <p className="mt-4 text-orange-100 font-semibold">
              ✅ Free ✅ 45 Min ✅ No Risk • Expert-led problem analysis • Custom recommendations
            </p>
            <p className="mt-2 text-sm text-orange-200">
              Contact: +91-989-44-66-715 | arjunm@navvicorp.com | Avinashi Road, Tirupur
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsComprehensive;


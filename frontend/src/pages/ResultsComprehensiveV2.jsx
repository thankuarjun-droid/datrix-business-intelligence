import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  generateComprehensiveReport, 
  getIndustryBenchmarks, 
  prepareRadarChartData 
} from '../services/comprehensiveAIReportService';
import { supabase } from '../config/supabase';
import { generateComprehensivePDF } from '../services/pdfGenerationService';
import { 
  TrendingUp, Download, Calendar, CheckCircle2, Target, 
  Zap, Award, BarChart3, AlertCircle, ArrowRight, Sparkles,
  Building2, DollarSign, Users, Clock, AlertTriangle, CheckCircle,
  XCircle, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip
} from 'recharts';

const ResultsComprehensiveV2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [hoveredHeatMapItem, setHoveredHeatMapItem] = useState(null);

  const assessmentData = location.state?.assessmentData;
  const businessContext = location.state?.businessContext;
  const responses = location.state?.responses;
  const providedQuestions = location.state?.questions;

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

      let questionsData;
      
      if (providedQuestions && providedQuestions.length > 0) {
        questionsData = providedQuestions;
      } else {
        const { data: dbQuestions, error: questionsError } = await supabase
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
        questionsData = dbQuestions;
      }

      setQuestions(questionsData);

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

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const scheduleConsultation = () => {
    window.open('https://calendly.com/navvicorp', '_blank');
  };

  const claimFreeAudit = () => {
    window.open('https://consulting.navvicorp.com/', '_blank');
  };

  const downloadReport = async () => {
    if (!report) {
      alert('Report data not available');
      return;
    }

    try {
      const companyName = businessContext?.company_name || 'Your Company';
      const result = await generateComprehensivePDF(report, companyName);
      
      if (result.success) {
        console.log('PDF generated successfully');
      } else {
        alert('Failed to generate PDF: ' + result.error);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Generating your comprehensive report...</p>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Generation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const aiInsights = report?.ai_insights || {};
  const heatMapData = report?.heat_map || [];
  const categoryDeepDives = report?.category_deep_dives || [];
  const radarData = prepareRadarChartData(report?.assessment_summary?.category_scores || {});
  const benchmarks = getIndustryBenchmarks();
  const percentage = parseFloat(report?.assessment_summary?.percentage || 0);

  // Get user name from business context or assessment data
  const userName = businessContext?.user_name || 'Valued Client';
  const companyName = businessContext?.company_name || 'Your Company';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header with Personalization */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-10 w-10" />
            <div>
              <h1 className="text-4xl font-bold">Your Comprehensive Business Intelligence Report</h1>
              <p className="text-blue-100 text-lg mt-1">Prepared for {userName} • {companyName}</p>
            </div>
          </div>
          <p className="text-blue-100 text-lg mb-6">AI-Powered Deep Analysis with Question-Level Insights</p>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-blue-100 text-sm mb-1">Overall Score</p>
              <p className="text-4xl font-bold">{percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-blue-100 text-sm mb-1">Performance Grade</p>
              <p className="text-4xl font-bold">{report?.assessment_summary?.overall_grade || 'N/A'}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-blue-100" />
                <p className="text-blue-100 text-sm">Sewing Machines</p>
              </div>
              <p className="text-3xl font-bold">{businessContext?.sewing_machines || 0}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-4 w-4 text-blue-100" />
                <p className="text-blue-100 text-sm">Annual Turnover</p>
              </div>
              <p className="text-2xl font-bold">
                {businessContext?.turnover_currency} {parseInt(businessContext?.annual_turnover || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={downloadReport}
              className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold shadow-lg"
            >
              <Download className="h-5 w-5" />
              Download PDF Report
            </button>
            <button
              onClick={scheduleConsultation}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-lg"
            >
              <Calendar className="h-5 w-5" />
              Book Your Free Consultation
            </button>
            <button
              onClick={claimFreeAudit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-semibold shadow-lg"
            >
              <Award className="h-5 w-5" />
              Claim Your Free Audit
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-7 w-7 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-900">Executive Summary</h2>
          </div>
          <div>
            <p className="text-lg text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
              {aiInsights.executive_summary?.overview}
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg mb-4">
              <p className="font-semibold text-purple-900 mb-2">Critical Insight:</p>
              <p className="text-purple-800">{aiInsights.executive_summary?.critical_insight}</p>
            </div>
            {aiInsights.executive_summary?.key_findings && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="font-semibold text-blue-900 mb-2">Key Findings:</p>
                <ul className="list-disc list-inside space-y-2 text-blue-800">
                  {aiInsights.executive_summary.key_findings.map((finding, i) => (
                    <li key={i} className="leading-relaxed">{finding}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Compact Heat Map */}
        {heatMapData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="h-7 w-7 text-orange-600" />
              <h2 className="text-3xl font-bold text-gray-900">Performance Heat Map</h2>
            </div>
            <p className="text-gray-600 mb-6">
              All {heatMapData.length} questions at a glance. Hover over each square to see details.
            </p>
            
            <div className="grid grid-cols-12 gap-1.5">
              {heatMapData.map((item, index) => {
                const isHovered = hoveredHeatMapItem?.category === item.category;
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded flex items-center justify-center text-white text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer ${
                      isHovered ? 'scale-110 shadow-lg ring-2 ring-blue-400 z-10' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={`Q${item.question_number}: ${item.category} - ${item.performance_level}`}
                    onMouseEnter={() => setHoveredHeatMapItem(item)}
                    onMouseLeave={() => setHoveredHeatMapItem(null)}
                  >
                    {item.question_number}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span className="text-sm text-gray-700">Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500"></div>
                <span className="text-sm text-gray-700">Needs Improvement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-sm text-gray-700">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gray-400"></div>
                <span className="text-sm text-gray-700">N/A</span>
              </div>
            </div>
          </div>
        )}

        {/* Radar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-7 w-7 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Performance Radar Analysis</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Compare your performance across all categories against industry benchmarks and top performers
          </p>

          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ fill: '#4b5563', fontSize: 12 }}
                tickLine={false}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
              <Radar
                name="Your Score"
                dataKey="yourScore"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.5}
                strokeWidth={2}
              />
              <Radar
                name="Industry Average"
                dataKey="industryAverage"
                stroke="#fbbf24"
                fill="#fbbf24"
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
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{percentage.toFixed(1)}%</p>
              <p className="text-sm text-blue-800 mt-1">Your Average</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-yellow-600">{benchmarks.industryAverage}%</p>
              <p className="text-sm text-yellow-800 mt-1">Industry Average</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{benchmarks.topPerformers}+</p>
              <p className="text-sm text-green-800 mt-1">Top Performers</p>
            </div>
          </div>
        </div>

        {/* Quick Wins */}
        {aiInsights.quick_wins && aiInsights.quick_wins.length > 0 && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-8 mb-8 border border-green-200">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="h-7 w-7 text-green-600" />
              <h2 className="text-3xl font-bold text-gray-900">Quick Wins - Start Here!</h2>
            </div>
            <p className="text-gray-700 mb-6">
              These high-impact, low-effort actions can deliver immediate results:
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {aiInsights.quick_wins.map((win, index) => (
                <div key={index} className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{win.action}</h3>
                      {win.expected_impact && (
                        <p className="text-sm text-gray-600 mb-2">{win.expected_impact}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          win.impact === 'High' ? 'bg-green-100 text-green-800' :
                          win.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          Impact: {win.impact}
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          win.effort === 'Low' ? 'bg-green-100 text-green-800' :
                          win.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
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

        {/* Collapsible Category Deep Dives */}
        {categoryDeepDives.map((categoryData, catIndex) => {
          const isExpanded = expandedCategories[categoryData.name];
          const categoryPercentage = parseFloat(
            report.assessment_summary.category_scores[categoryData.name]?.percentage || 0
          );

          return (
            <div key={catIndex} className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
              {/* Category Header - Always Visible */}
              <div
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleCategory(categoryData.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Target className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900">{categoryData.name}</h2>
                      {categoryData.summary.current_state && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {categoryData.summary.current_state}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {categoryPercentage.toFixed(1)}%
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
                    {isExpanded ? (
                      <ChevronUp className="h-6 w-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-gray-200">
                  {/* Category Insights */}
                  {categoryData.summary.recommendations && categoryData.summary.recommendations.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 mt-6">
                      <p className="font-semibold text-blue-900 mb-2">Recommendations:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                        {categoryData.summary.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Question-Level Analysis */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Question-Level Analysis ({categoryData.questions.length} questions)
                    </h3>
                    {categoryData.questions.map((qa, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          {/* Performance Indicator */}
                          <div className="flex-shrink-0">
                            {qa.performance_level === 'Excellent' && (
                              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-white" />
                              </div>
                            )}
                            {qa.performance_level === 'Good' && (
                              <div className="w-10 h-10 bg-green-400 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-white" />
                              </div>
                            )}
                            {qa.performance_level === 'Needs Improvement' && (
                              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-white" />
                              </div>
                            )}
                            {qa.performance_level === 'Critical' && (
                              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                                <XCircle className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Question Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 flex-1 text-sm">
                                {qa.question_text}
                              </h4>
                              <span className="ml-4 text-xs font-medium text-gray-600">
                                {qa.score}/{qa.max_score}
                              </span>
                            </div>

                            <div className="bg-gray-50 rounded p-3 mb-2">
                              <p className="text-xs text-gray-600 mb-1">Your Response:</p>
                              <p className="font-medium text-gray-900 text-sm">{qa.response_text}</p>
                            </div>

                            {qa.diagnosis && (
                              <div className="bg-blue-50 rounded p-3 mb-2">
                                <p className="text-xs text-blue-600 mb-1">Diagnosis:</p>
                                <p className="text-sm text-blue-900">{qa.diagnosis}</p>
                              </div>
                            )}

                            {qa.recommendations && qa.recommendations.length > 0 && (
                              <div className="bg-green-50 rounded p-3">
                                <p className="text-xs text-green-600 mb-1">Recommendations:</p>
                                <ul className="list-disc list-inside space-y-0.5 text-sm text-green-900">
                                  {qa.recommendations.map((rec, i) => (
                                    <li key={i}>{rec}</li>
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
              )}
            </div>
          );
        })}

        {/* Consultation CTA */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-4xl font-bold mb-4">Save ₹8+ Crores Annually: Eliminate Factory Inefficiencies in 90 Days</h2>
          <p className="text-xl mb-6">
            Stop losing money to operational inefficiencies. Get your complete transformation package with our proven Ultimate Factory Transformation Mastery.
          </p>
          
          <div className="bg-yellow-400 text-gray-900 font-bold text-xl px-6 py-3 rounded-lg inline-block mb-8">
            🛡️ 50% Money Back Guarantee if we don't deliver 15% savings in 90 days!
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Our Scientific 3-Phase Transformation:</h3>
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-bold">Crisis Response (2-3 months)</p>
                  <p className="text-sm text-orange-100">30% Loss Reduction</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-bold">System Enhancement (3-5 months)</p>
                  <p className="text-sm text-orange-100">40% Efficiency Boost</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-bold">Excellence Institutionalization (8-10 months)</p>
                  <p className="text-sm text-orange-100">25% Cost Reduction</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Proven Results:</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <p>10+ Factories Transformed</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <p>₹500+ Cr Total Savings</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <p>Cut Defects by 7%, Slash Rework by 15%</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <p>5000%+ ROI in 12 Months</p>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                  <p>Visible results within 30 days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={claimFreeAudit}
              className="flex items-center gap-2 px-8 py-4 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300 transition-colors font-bold text-lg shadow-lg"
            >
              <Award className="h-6 w-6" />
              Claim Your Free Factory Audit →
            </button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Free</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>45 Min</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>No Risk - Expert-led problem analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Custom recommendations</span>
            </div>
          </div>

          <p className="mt-6 text-sm">
            📞 +91-989-44-66-715 | ✉️ arjunm@navvicorp.com | 🌐 Navvi Corp - Tirupur's Factory Transformation Experts
          </p>
        </div>

      </div>
    </div>
  );
};

export default ResultsComprehensiveV2;


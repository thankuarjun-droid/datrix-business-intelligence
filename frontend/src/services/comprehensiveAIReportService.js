import { supabase } from '../config/supabase';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Generate comprehensive AI-powered business intelligence report
 * with question-level analysis and detailed diagnostics
 */
export async function generateComprehensiveReport(data) {
  const { assessmentData, businessContext, responses, questions } = data;

  try {
    // Prepare question-level analysis
    const questionAnalysis = await analyzeQuestionResponses(responses, questions);
    
    // Generate AI insights
    const aiInsights = await generateAIInsights({
      assessmentData,
      businessContext,
      questionAnalysis
    });

    // Prepare heat map data
    const heatMapData = prepareHeatMapData(questionAnalysis);

    // Prepare category deep dives
    const categoryDeepDives = prepareCategoryDeepDives(questionAnalysis, aiInsights);

    return {
      success: true,
      report: {
        assessment_summary: assessmentData,
        business_context: businessContext,
        ai_insights: aiInsights,
        question_analysis: questionAnalysis,
        heat_map: heatMapData,
        category_deep_dives: categoryDeepDives,
        industry_benchmarks: getIndustryBenchmarks()
      }
    };
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    
    // Return fallback report
    return {
      success: false,
      error: error.message,
      report: generateFallbackReport(data)
    };
  }
}

/**
 * Analyze each question response and provide interpretation
 */
async function analyzeQuestionResponses(responses, questions) {
  const analysis = [];

  for (const question of questions) {
    const response = responses[question.id];
    
    if (response === undefined || response === null) continue;

    const questionAnalysis = {
      question_id: question.id,
      question_text: question.question_text,
      category: question.assessment_categories?.name || 'General',
      response_value: response,
      response_text: getResponseText(response, question),
      score: calculateQuestionScore(response, question),
      max_score: question.max_score || 4,
      performance_level: getPerformanceLevel(response, question),
      diagnosis: generateQuestionDiagnosis(response, question),
      recommendations: generateQuestionRecommendations(response, question),
      impact_level: assessImpactLevel(response, question)
    };

    analysis.push(questionAnalysis);
  }

  return analysis;
}

/**
 * Get human-readable response text
 */
function getResponseText(value, question) {
  const options = question.options || [];
  
  if (Array.isArray(options) && options.length > 0) {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value.toString();
  }
  
  // For numeric responses
  if (typeof value === 'number') {
    const labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
    return labels[value] || value.toString();
  }
  
  return value.toString();
}

/**
 * Calculate score for a question
 */
function calculateQuestionScore(response, question) {
  const maxScore = question.max_score || 4;
  
  // For numeric responses (0-4 scale)
  if (typeof response === 'number') {
    return response;
  }
  
  // For boolean responses
  if (typeof response === 'boolean') {
    return response ? maxScore : 0;
  }
  
  return 0;
}

/**
 * Determine performance level (Excellent/Good/Needs Improvement/Critical)
 */
function getPerformanceLevel(response, question) {
  const score = calculateQuestionScore(response, question);
  const maxScore = question.max_score || 4;
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) return 'Excellent';
  if (percentage >= 60) return 'Good';
  if (percentage >= 40) return 'Needs Improvement';
  return 'Critical';
}

/**
 * Generate diagnosis for a question response
 */
function generateQuestionDiagnosis(response, question) {
  const performanceLevel = getPerformanceLevel(response, question);
  const category = question.assessment_categories?.name || 'General';
  
  // Create contextual diagnosis based on question and response
  const diagnoses = {
    'Excellent': `Strong performance in this area. Your ${category.toLowerCase()} practices are well-established and effective.`,
    'Good': `Satisfactory performance with room for optimization. Your ${category.toLowerCase()} processes are functional but could be enhanced.`,
    'Needs Improvement': `This area requires attention. Improving your ${category.toLowerCase()} practices will significantly impact overall business performance.`,
    'Critical': `Urgent action required. This weakness in ${category.toLowerCase()} poses serious risks to your business operations and profitability.`
  };

  return diagnoses[performanceLevel] || 'Assessment needed.';
}

/**
 * Generate specific recommendations for a question
 */
function generateQuestionRecommendations(response, question) {
  const performanceLevel = getPerformanceLevel(response, question);
  const category = question.assessment_categories?.name || 'General';
  
  const recommendations = {
    'Excellent': [
      'Maintain current best practices',
      'Document processes for knowledge sharing',
      'Consider mentoring others in this area'
    ],
    'Good': [
      'Identify specific optimization opportunities',
      'Benchmark against industry leaders',
      'Implement incremental improvements'
    ],
    'Needs Improvement': [
      'Conduct detailed gap analysis',
      'Develop improvement action plan',
      'Allocate resources for enhancement',
      'Set measurable improvement targets'
    ],
    'Critical': [
      'Immediate intervention required',
      'Engage expert consultation',
      'Develop emergency action plan',
      'Monitor progress weekly'
    ]
  };

  return recommendations[performanceLevel] || [];
}

/**
 * Assess impact level of the question area
 */
function assessImpactLevel(response, question) {
  const performanceLevel = getPerformanceLevel(response, question);
  const category = question.assessment_categories?.name || '';

  // Critical categories
  const criticalCategories = [
    'Financial Management',
    'Operations & Production',
    'Quality Control'
  ];

  if (performanceLevel === 'Critical' && criticalCategories.some(c => category.includes(c))) {
    return 'High';
  }

  if (performanceLevel === 'Critical' || performanceLevel === 'Needs Improvement') {
    return 'Medium';
  }

  return 'Low';
}

/**
 * Prepare heat map data for visualization
 */
function prepareHeatMapData(questionAnalysis) {
  return questionAnalysis.map((qa, index) => ({
    question_number: index + 1,
    question_id: qa.question_id,
    category: qa.category,
    performance_level: qa.performance_level,
    score: qa.score,
    max_score: qa.max_score,
    color: getHeatMapColor(qa.performance_level)
  }));
}

/**
 * Get color for heat map based on performance
 */
function getHeatMapColor(performanceLevel) {
  const colors = {
    'Excellent': '#10b981', // Green
    'Good': '#84cc16', // Light green
    'Needs Improvement': '#fbbf24', // Yellow
    'Critical': '#ef4444', // Red
    'N/A': '#9ca3af' // Gray
  };

  return colors[performanceLevel] || colors['N/A'];
}

/**
 * Prepare category deep dives with question-level details
 */
function prepareCategoryDeepDives(questionAnalysis, aiInsights) {
  const categories = {};

  questionAnalysis.forEach(qa => {
    if (!categories[qa.category]) {
      categories[qa.category] = {
        name: qa.category,
        questions: [],
        summary: aiInsights.category_insights?.[qa.category] || {}
      };
    }

    categories[qa.category].questions.push(qa);
  });

  return Object.values(categories);
}

/**
 * Generate AI insights using OpenAI
 */
async function generateAIInsights(data) {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using fallback insights');
    return generateFallbackInsights(data);
  }

  try {
    const prompt = buildAIPrompt(data);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: `You are a senior partner at McKinsey & Company with 20+ years of experience in garment manufacturing and textile industry transformation. You have successfully led 50+ factory optimization projects across Tirupur, Bangladesh, and Vietnam, delivering average efficiency improvements of 35% and cost reductions of 25%. 

Your writing style is:
- Insightful and data-driven, identifying root causes and systemic issues
- Natural and conversational, avoiding jargon and templates  
- Specific and actionable, with concrete recommendations
- Strategic yet practical, balancing quick wins with long-term transformation
- Empathetic and supportive, acknowledging challenges while inspiring confidence

Provide analysis that demonstrates deep industry expertise and makes the client feel they've received a ₹5 lakh consultant engagement.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    const insights = JSON.parse(result.choices[0].message.content);

    return insights;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return generateFallbackInsights(data);
  }
}

/**
 * Build comprehensive AI prompt
 */
function buildAIPrompt(data) {
  const { assessmentData, businessContext, questionAnalysis } = data;

  const criticalQuestions = questionAnalysis.filter(qa => qa.performance_level === 'Critical');
  const needsImprovementQuestions = questionAnalysis.filter(qa => qa.performance_level === 'Needs Improvement');
  
  return `
You are analyzing a comprehensive business intelligence assessment for a garment manufacturing company. Provide deep, McKinsey-quality insights that will genuinely help them transform their business.

## COMPANY PROFILE

**Scale:** ${businessContext.sewing_machines} sewing machines
**Revenue:** ${businessContext.turnover_currency} ${parseInt(businessContext.annual_turnover).toLocaleString()} annually
**Industry:** Garment Manufacturing (Tirupur/India)

**Strategic Objectives:**
- 1-Year Goal: ${businessContext.one_year_goals}
- 3-Year Vision: ${businessContext.three_year_goals}

**Current Pain Points:**
${businessContext.current_challenges}

## ASSESSMENT PERFORMANCE

**Overall Maturity:** ${parseFloat(assessmentData.percentage || 0).toFixed(1)}% (Grade ${assessmentData.grade})
**Total Score:** ${assessmentData.total_score}/${assessmentData.max_score} points

**Category Performance:**
${Object.entries(assessmentData.category_scores).map(([category, data]) => {
  const pct = parseFloat(data.percentage || 0).toFixed(1);
  const status = pct < 30 ? '🔴 CRITICAL' : pct < 50 ? '🟡 NEEDS ATTENTION' : pct < 70 ? '🟢 DEVELOPING' : '✅ STRONG';
  return `- ${category}: ${pct}% ${status} (${data.score}/${data.max_score})`;
}).join('\n')}

**Critical Gaps (${criticalQuestions.length} areas scoring < 40%):**
${criticalQuestions.slice(0, 8).map(qa => 
  `- ${qa.question_text} → Response: "${qa.response_text}"`
).join('\n')}

**Areas Needing Improvement (${needsImprovementQuestions.length} areas scoring 40-60%):**
${needsImprovementQuestions.slice(0, 5).map(qa => 
  `- ${qa.question_text} → Response: "${qa.response_text}"`
).join('\n')}

## YOUR TASK

Provide a comprehensive consultant-quality analysis in JSON format. Write as if you're presenting findings to the CEO in a boardroom.

**Requirements:**

1. **Executive Summary** - Write 2-3 insightful paragraphs that:
   - Identify the core systemic issues (not just symptoms)
   - Connect performance gaps to their stated goals and challenges
   - Provide a clear narrative of where they are vs. where they want to be
   - Use specific numbers and percentages from the data
   - Be encouraging yet honest about the transformation needed

2. **Critical Insight** - The single most important finding that, if addressed, would have the biggest impact. Make it specific and actionable.

3. **Key Findings** - 4-5 data-driven observations that reveal patterns, not just individual scores. Examples:
   - "Your operational processes (29%) significantly outperform strategic planning (22%), suggesting execution capability exists but lacks direction"
   - "With 475 machines and ₹11Cr turnover, your revenue per machine (₹23L/year) is 40% below industry average, indicating utilization or pricing issues"

4. **Category Insights** - For EACH of the 7 categories, provide:
   - Current state: 2-3 sentences analyzing root causes, not just describing the score
   - Strengths: 2-3 specific capabilities they DO have (even if weak overall)
   - Weaknesses: 2-3 systemic gaps causing the low score
   - Recommendations: 3-4 specific, prioritized actions with expected outcomes
   - Priority: Critical/High/Medium/Low based on impact on their goals

5. **Quick Wins** - 5-7 high-impact, low-effort actions that can deliver results in 2-8 weeks. Each must:
   - Be ultra-specific ("Implement daily production tracking using Excel template" not "Improve tracking")
   - State expected impact ("Reduce defects by 20%" not "Improve quality")
   - Be realistic for their scale (475 machines, ₹11Cr revenue)
   - Address their actual weak areas from the assessment

6. **Strategic Roadmap** - 90-day action plan broken into:
   - Month 1: Foundation (quick wins, data collection, process documentation)
   - Month 2: System building (process improvements, training, tool implementation)
   - Month 3: Optimization (measurement, refinement, scaling successful pilots)

JSON Structure:
{
  "executive_summary": {
    "overview": "2-3 paragraph narrative analysis",
    "critical_insight": "The single most important finding",
    "key_findings": ["insight 1", "insight 2", "insight 3", "insight 4"]
  },
  "category_insights": {
    "Business Strategy & Vision": {
      "current_state": "Root cause analysis",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["gap 1", "gap 2", "gap 3"],
      "recommendations": ["action 1", "action 2", "action 3"],
      "priority_level": "Critical|High|Medium|Low"
    },
    ... (repeat for all 7 categories)
  },
  "quick_wins": [
    {
      "action": "Specific, implementable action",
      "expected_impact": "Quantified outcome",
      "impact": "High|Medium|Low",
      "effort": "Low|Medium|High",
      "timeline": "2 weeks|1 month|6 weeks|2 months"
    }
  ],
  "strategic_roadmap": {
    "month_1": ["action 1", "action 2", "action 3"],
    "month_2": ["action 1", "action 2", "action 3"],
    "month_3": ["action 1", "action 2", "action 3"]
  }
}

Remember: This should read like a ₹5 lakh McKinsey engagement, not a generic automated report. Be insightful, specific, and genuinely helpful.
`;
}

/**
 * Generate fallback insights when AI is unavailable
 */
function generateFallbackInsights(data) {
  const { assessmentData, businessContext } = data;

  return {
    executive_summary: {
      overview: `Your business scored ${parseFloat(assessmentData.percentage || 0).toFixed(1)}% overall, with strongest performance in ${getTopCategory(assessmentData.category_scores)} and opportunities for improvement in ${getWeakestCategory(assessmentData.category_scores)}.`,
      critical_insight: `Focus on strengthening ${getWeakestCategory(assessmentData.category_scores)} to achieve your stated goals.`,
      key_findings: [
        `Overall performance grade: ${assessmentData.grade}`,
        `${businessContext.sewing_machines} machines with ${businessContext.turnover_currency} ${parseInt(businessContext.annual_turnover).toLocaleString()} turnover`,
        `Primary challenges: ${businessContext.current_challenges}`
      ]
    },
    category_insights: generateFallbackCategoryInsights(assessmentData.category_scores),
    quick_wins: generateFallbackQuickWins(assessmentData.category_scores),
    strategic_roadmap: {
      month_1: ['Implement daily production tracking', 'Standardize quality control processes'],
      month_2: ['Optimize inventory management', 'Enhance customer communication'],
      month_3: ['Review and update business strategy', 'Train staff on new processes']
    }
  };
}

function getTopCategory(categoryScores) {
  let topCategory = '';
  let topPercentage = 0;

  Object.entries(categoryScores).forEach(([category, data]) => {
    if (data.percentage > topPercentage) {
      topPercentage = data.percentage;
      topCategory = category;
    }
  });

  return topCategory || 'Business Strategy';
}

function getWeakestCategory(categoryScores) {
  let weakestCategory = '';
  let lowestPercentage = 100;

  Object.entries(categoryScores).forEach(([category, data]) => {
    if (data.percentage < lowestPercentage) {
      lowestPercentage = data.percentage;
      weakestCategory = category;
    }
  });

  return weakestCategory || 'Operations';
}

function generateFallbackCategoryInsights(categoryScores) {
  const insights = {};

  Object.entries(categoryScores).forEach(([category, data]) => {
    const percentage = data.percentage;
    
    insights[category] = {
      current_state: `Your ${category.toLowerCase()} scored ${parseFloat(percentage || 0).toFixed(1)}%, indicating ${percentage >= 60 ? 'satisfactory' : 'significant room for'} performance.`,
      strengths: percentage >= 60 ? ['Established processes', 'Functional systems'] : [],
      weaknesses: percentage < 60 ? ['Needs systematic improvement', 'Requires attention'] : [],
      recommendations: [
        'Conduct detailed assessment',
        'Develop improvement plan',
        'Implement best practices'
      ],
      priority_level: percentage < 40 ? 'Critical' : percentage < 60 ? 'High' : 'Medium'
    };
  });

  return insights;
}

function generateFallbackQuickWins(categoryScores) {
  return [
    {
      action: 'Implement daily production tracking system',
      impact: 'High',
      effort: 'Low',
      timeline: '2 weeks'
    },
    {
      action: 'Standardize quality control processes',
      impact: 'High',
      effort: 'Medium',
      timeline: '1 month'
    },
    {
      action: 'Optimize material inventory management',
      impact: 'Medium',
      effort: 'Medium',
      timeline: '6 weeks'
    }
  ];
}

function generateFallbackReport(data) {
  return {
    assessment_summary: data.assessmentData,
    business_context: data.businessContext,
    ai_insights: generateFallbackInsights(data),
    question_analysis: [],
    heat_map: [],
    category_deep_dives: [],
    industry_benchmarks: getIndustryBenchmarks()
  };
}

/**
 * Get industry benchmarks for Tirupur garment manufacturing
 */
export function getIndustryBenchmarks() {
  return {
    industry_average: 68,
    top_performers: 85,
    category_averages: {
      'Business Strategy & Vision': 65,
      'Sales, Marketing & Customer Management': 70,
      'Operations & Production Management': 72,
      'Supply Chain & Vendor Management': 68,
      'Financial Management & Cost Control': 66,
      'Technology & Digitalisation': 58,
      'HR & Organisational Culture': 64
    }
  };
}

/**
 * Prepare radar chart data
 */
export function prepareRadarChartData(categoryScores) {
  const benchmarks = getIndustryBenchmarks();
  
  return Object.entries(categoryScores).map(([category, data]) => ({
    category: category.length > 30 ? category.substring(0, 27) + '...' : category,
    yourScore: parseFloat(parseFloat(data.percentage || 0).toFixed(1)),
    industryAverage: benchmarks.category_averages[category] || benchmarks.industry_average,
    topPerformers: benchmarks.top_performers
  }));
}


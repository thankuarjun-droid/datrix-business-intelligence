/**
 * Enhanced AI-Powered Report Generation Service
 * Integrates business context, goals, and challenges for personalized insights
 * Uses OpenAI API configured in environment variables
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

/**
 * Generate comprehensive AI-powered business report
 * @param {Object} params - Report generation parameters
 * @param {Object} params.assessmentData - Assessment scores and responses
 * @param {Object} params.businessContext - Business scale, goals, and challenges
 * @param {Array} params.questions - Assessment questions for detailed analysis
 * @returns {Promise<Object>} Comprehensive report with AI insights
 */
export async function generateEnhancedReport({ assessmentData, businessContext, questions }) {
  try {
    // Prepare data for AI analysis
    const categoryBreakdown = Object.entries(assessmentData.category_scores || {})
      .map(([category, data]) => {
        const percentage = parseFloat(data.percentage) || 0;
        return `${category}: ${percentage.toFixed(1)}% (${data.score}/${data.max_score} points)`;
      })
      .join('\n');

    // Build comprehensive prompt for OpenAI
    const prompt = `You are a senior management consultant from a top-tier consulting firm (McKinsey, BCG, Bain level) specializing in the garment manufacturing and textile export industry, particularly for businesses in Tirupur, India.

BUSINESS PROFILE:
- Operational Scale: ${businessContext.sewing_machines} sewing machines
- Annual Turnover: ${businessContext.turnover_currency} ${parseInt(businessContext.annual_turnover).toLocaleString()}
- Overall Assessment Score: ${assessmentData.percentage.toFixed(1)}% (Grade: ${assessmentData.overall_grade})

BUSINESS GOALS:
1-Year Goal: ${businessContext.goal_1_year}
3-Year Vision: ${businessContext.goal_3_year}

CURRENT CHALLENGES:
1. ${businessContext.challenge_1}
${businessContext.challenge_2 ? `2. ${businessContext.challenge_2}` : ''}
${businessContext.challenge_3 ? `3. ${businessContext.challenge_3}` : ''}

ASSESSMENT CATEGORY SCORES:
${categoryBreakdown}

Generate a comprehensive, actionable business intelligence report in JSON format with the following structure:

{
  "executive_summary": {
    "overview": "3-4 sentence executive summary highlighting current state, key findings, and strategic direction",
    "business_health_score": "A/B/C/D rating with brief justification",
    "critical_insight": "The single most important insight from this assessment"
  },
  "category_insights": {
    "Business Strategy & Vision": {
      "current_state": "Detailed analysis of current performance",
      "strengths": ["specific strength 1", "specific strength 2"],
      "weaknesses": ["specific weakness 1", "specific weakness 2"],
      "industry_benchmark": "Comparison with Tirupur garment industry standards",
      "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"],
      "priority_level": "Critical/High/Medium/Low",
      "estimated_impact": "Quantified business impact if recommendations are implemented"
    },
    // ... repeat for all 7 categories
  },
  "goal_alignment": {
    "one_year_roadmap": {
      "feasibility_assessment": "Analysis of 1-year goal achievability",
      "key_enablers": ["what will help achieve this", "..."],
      "potential_blockers": ["what might prevent success", "..."],
      "recommended_actions": ["specific action 1", "specific action 2", "specific action 3"],
      "success_metrics": ["KPI 1", "KPI 2", "KPI 3"]
    },
    "three_year_roadmap": {
      "strategic_pathway": "How to achieve the 3-year vision",
      "investment_areas": ["where to invest", "..."],
      "capability_gaps": ["skills/resources needed", "..."],
      "milestones": ["Year 1 milestone", "Year 2 milestone", "Year 3 milestone"]
    }
  },
  "challenge_solutions": {
    "challenge_1": {
      "root_cause_analysis": "Why this challenge exists",
      "immediate_actions": ["quick win 1", "quick win 2"],
      "medium_term_solutions": ["solution 1", "solution 2"],
      "long_term_strategy": "Sustainable solution approach",
      "estimated_timeline": "Time to resolve",
      "investment_required": "Estimated cost/resources needed"
    },
    // ... repeat for each challenge
  },
  "action_plan_90_days": {
    "days_1_30": {
      "focus": "Primary focus area",
      "actions": ["action 1", "action 2", "action 3"],
      "expected_outcomes": ["outcome 1", "outcome 2"],
      "resources_needed": ["resource 1", "resource 2"]
    },
    "days_31_60": {
      "focus": "Primary focus area",
      "actions": ["action 1", "action 2", "action 3"],
      "expected_outcomes": ["outcome 1", "outcome 2"],
      "resources_needed": ["resource 1", "resource 2"]
    },
    "days_61_90": {
      "focus": "Primary focus area",
      "actions": ["action 1", "action 2", "action 3"],
      "expected_outcomes": ["outcome 1", "outcome 2"],
      "resources_needed": ["resource 1", "resource 2"]
    }
  },
  "business_impact_projections": {
    "cost_optimization": {
      "potential_savings": "Estimated annual cost savings in ${businessContext.turnover_currency}",
      "key_areas": ["area 1", "area 2", "area 3"],
      "implementation_cost": "Investment required"
    },
    "revenue_growth": {
      "potential_increase": "Estimated revenue growth percentage",
      "growth_drivers": ["driver 1", "driver 2", "driver 3"],
      "market_opportunities": ["opportunity 1", "opportunity 2"]
    },
    "operational_efficiency": {
      "productivity_gains": "Expected productivity improvement percentage",
      "quality_improvements": "Expected quality metrics improvement",
      "capacity_utilization": "Expected capacity increase"
    },
    "competitive_positioning": {
      "current_position": "Where you stand in Tirupur market",
      "target_position": "Where you can reach in 1-3 years",
      "differentiation_strategy": "How to stand out from competitors"
    }
  },
  "quick_wins": [
    {
      "action": "Specific quick win",
      "impact": "Expected benefit",
      "effort": "Low/Medium/High",
      "timeline": "Days/weeks to implement"
    }
    // ... 5-7 quick wins
  ],
  "strategic_priorities": [
    {
      "priority": "Strategic initiative",
      "rationale": "Why this is important",
      "expected_roi": "Return on investment",
      "timeline": "Implementation timeline"
    }
    // ... 3-5 strategic priorities
  ],
  "consultation_value_proposition": {
    "why_consult": "Compelling reason why professional consultation will accelerate success",
    "expected_benefits": ["benefit 1", "benefit 2", "benefit 3"],
    "typical_outcomes": "What similar businesses achieved with consulting support",
    "investment_justification": "Why the consultation fee is worth it"
  }
}

IMPORTANT GUIDELINES:
1. Be extremely specific - use numbers, percentages, timelines
2. Tailor all recommendations to garment manufacturing in Tirupur
3. Consider the business scale (${businessContext.sewing_machines} machines, ${businessContext.turnover_currency} ${parseInt(businessContext.annual_turnover).toLocaleString()} turnover)
4. Align recommendations with stated goals and address stated challenges
5. Use industry benchmarks and best practices from successful Tirupur exporters
6. Include specific technology, process, and people recommendations
7. Make the consultation value proposition compelling but authentic
8. Focus on ROI and measurable outcomes
9. Use professional consulting language but keep it accessible
10. Provide category insights for ALL 7 categories from the assessment

Generate the complete JSON response now.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior management consultant specializing in garment manufacturing and textile exports, with expertise equivalent to McKinsey & Company. You provide data-driven, actionable insights tailored to the Tirupur garment industry in India.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API failed: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const aiInsights = JSON.parse(data.choices[0].message.content);

    // Compile complete report
    const report = {
      metadata: {
        generated_at: new Date().toISOString(),
        assessment_id: assessmentData.id,
        user_id: assessmentData.user_id,
        business_scale: {
          sewing_machines: parseInt(businessContext.sewing_machines),
          annual_turnover: parseInt(businessContext.annual_turnover),
          currency: businessContext.turnover_currency
        }
      },
      assessment_summary: {
        overall_score: assessmentData.total_score,
        max_score: assessmentData.max_score,
        percentage: parseFloat(assessmentData.percentage),
        grade: assessmentData.overall_grade,
        category_scores: assessmentData.category_scores
      },
      business_context: {
        goals: {
          one_year: businessContext.goal_1_year,
          three_year: businessContext.goal_3_year
        },
        challenges: [
          businessContext.challenge_1,
          businessContext.challenge_2,
          businessContext.challenge_3
        ].filter(Boolean)
      },
      ai_insights: aiInsights
    };

    return {
      success: true,
      report: report
    };

  } catch (error) {
    console.error('Error generating enhanced report:', error);
    
    // Return fallback report if AI fails
    return {
      success: false,
      error: error.message,
      report: generateFallbackReport(assessmentData, businessContext)
    };
  }
}

/**
 * Generate fallback report if AI is unavailable
 */
function generateFallbackReport(assessmentData, businessContext) {
  const categoryScores = assessmentData.category_scores || {};
  
  // Find strongest and weakest categories
  const categories = Object.entries(categoryScores)
    .map(([name, data]) => ({
      name,
      percentage: parseFloat(data.percentage) || 0
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const strongest = categories[0];
  const weakest = categories[categories.length - 1];

  return {
    metadata: {
      generated_at: new Date().toISOString(),
      assessment_id: assessmentData.id,
      user_id: assessmentData.user_id,
      business_scale: {
        sewing_machines: parseInt(businessContext.sewing_machines),
        annual_turnover: parseInt(businessContext.annual_turnover),
        currency: businessContext.turnover_currency
      },
      note: "This is a basic report. AI-powered insights are temporarily unavailable."
    },
    assessment_summary: {
      overall_score: assessmentData.total_score,
      max_score: assessmentData.max_score,
      percentage: parseFloat(assessmentData.percentage),
      grade: assessmentData.overall_grade,
      category_scores: assessmentData.category_scores
    },
    business_context: {
      goals: {
        one_year: businessContext.goal_1_year,
        three_year: businessContext.goal_3_year
      },
      challenges: [
        businessContext.challenge_1,
        businessContext.challenge_2,
        businessContext.challenge_3
      ].filter(Boolean)
    },
    ai_insights: {
      executive_summary: {
        overview: `Your business scored ${assessmentData.percentage.toFixed(1)}% overall, with strongest performance in ${strongest.name} (${strongest.percentage.toFixed(1)}%) and opportunities for improvement in ${weakest.name} (${weakest.percentage.toFixed(1)}%).`,
        business_health_score: `${assessmentData.overall_grade} - ${assessmentData.percentage >= 70 ? 'Good foundation with room for optimization' : 'Significant opportunities for improvement'}`,
        critical_insight: `Focus on strengthening ${weakest.name} to achieve your stated goals.`
      },
      quick_wins: [
        { action: "Implement daily production tracking", impact: "10-15% efficiency gain", effort: "Low", timeline: "2 weeks" },
        { action: "Standardize quality control processes", impact: "Reduce defects by 20%", effort: "Medium", timeline: "1 month" },
        { action: "Optimize material inventory", impact: "15% reduction in working capital", effort: "Medium", timeline: "6 weeks" }
      ],
      consultation_value_proposition: {
        why_consult: "Professional consulting can accelerate your improvement journey by 3-5x through proven frameworks, industry expertise, and hands-on implementation support.",
        expected_benefits: [
          "Customized action plans based on your specific context",
          "Access to industry best practices and benchmarks",
          "Implementation support to ensure results"
        ],
        typical_outcomes: "Similar businesses achieve 20-30% improvement in key metrics within 6 months",
        investment_justification: "ROI typically realized within 3-6 months through cost savings and revenue growth"
      }
    }
  };
}

/**
 * Calculate industry benchmarks for radar chart
 */
export function getIndustryBenchmarks() {
  return {
    "Business Strategy & Vision": 68,
    "Sales, Marketing & Customer Management": 65,
    "Operations & Production Management": 72,
    "Supply Chain & Vendor Management": 70,
    "Financial Management & Cost Control": 66,
    "Technology & Digitalisation": 58,
    "HR & Organisational Culture": 64
  };
}

/**
 * Prepare data for radar chart visualization
 */
export function prepareRadarChartData(categoryScores) {
  const benchmarks = getIndustryBenchmarks();
  
  return Object.entries(categoryScores).map(([category, data]) => ({
    category: category,
    yourScore: parseFloat(data.percentage) || 0,
    industryAverage: benchmarks[category] || 65,
    topPerformers: (benchmarks[category] || 65) + 20 // Top performers are ~20% above average
  }));
}


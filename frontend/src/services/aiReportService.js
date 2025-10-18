/**
 * AI-Powered Report Generation Service using OpenAI
 * Analyzes assessment responses and generates intelligent business recommendations
 * Adopts McKinsey-level consulting insights for garment manufacturing industry
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Calculate category scores from responses
 */
function calculateCategoryScores(responses, questions) {
  const categoryScores = {};
  const categoryMaxScores = {};
  
  questions.forEach(question => {
    const categoryName = question.assessment_categories?.name || 'General';
    const response = responses[question.id];
    
    if (response !== undefined) {
      if (!categoryScores[categoryName]) {
        categoryScores[categoryName] = 0;
        categoryMaxScores[categoryName] = 0;
      }
      
      categoryScores[categoryName] += response;
      categoryMaxScores[categoryName] += 4; // Max score per question is 4
    }
  });
  
  // Calculate percentages
  const categoryPercentages = {};
  Object.keys(categoryScores).forEach(category => {
    categoryPercentages[category] = {
      score: categoryScores[category],
      maxScore: categoryMaxScores[category],
      percentage: Math.round((categoryScores[category] / categoryMaxScores[category]) * 100),
    };
  });
  
  return categoryPercentages;
}

/**
 * Determine performance tier based on overall score
 */
function getPerformanceTier(overallPercentage) {
  if (overallPercentage >= 85) return { tier: 'Excellence', color: '#10b981', description: 'Industry Leading Performance' };
  if (overallPercentage >= 70) return { tier: 'Strong', color: '#3b82f6', description: 'Above Industry Average' };
  if (overallPercentage >= 55) return { tier: 'Developing', color: '#f59e0b', description: 'Meeting Basic Standards' };
  if (overallPercentage >= 40) return { tier: 'Emerging', color: '#ef4444', description: 'Significant Improvement Needed' };
  return { tier: 'Critical', color: '#991b1b', description: 'Urgent Intervention Required' };
}

/**
 * Generate AI-powered insights using OpenAI GPT
 */
async function generateAIInsights(categoryScores, companyName) {
  const prompt = `You are a senior business consultant specializing in garment manufacturing and textile industry, with expertise similar to McKinsey & Company. 

Analyze the following business intelligence assessment results for "${companyName}", a garment manufacturing company in Tirupur, India:

${Object.entries(categoryScores).map(([category, data]) => 
  `${category}: ${data.percentage}% (${data.score}/${data.maxScore})`
).join('\n')}

Provide a comprehensive analysis in JSON format with the following structure:
{
  "executiveSummary": "2-3 sentence overview of overall business health",
  "keyStrengths": ["strength 1", "strength 2", "strength 3"],
  "criticalGaps": ["gap 1", "gap 2", "gap 3"],
  "categoryInsights": {
    "CategoryName": {
      "analysis": "Detailed analysis of this category",
      "recommendations": ["specific recommendation 1", "specific recommendation 2"],
      "industryBenchmark": "How this compares to industry standards",
      "priority": "High/Medium/Low"
    }
  },
  "quickWins": ["immediate action 1", "immediate action 2", "immediate action 3"],
  "strategicInitiatives": ["long-term initiative 1", "long-term initiative 2"],
  "90DayRoadmap": {
    "month1": ["action 1", "action 2"],
    "month2": ["action 1", "action 2"],
    "month3": ["action 1", "action 2"]
  },
  "estimatedImpact": {
    "costSavings": "Estimated annual cost savings",
    "efficiencyGains": "Expected efficiency improvements",
    "revenueOpportunity": "Potential revenue increase"
  }
}

Focus on:
- Garment manufacturing best practices
- Industry 4.0 and automation opportunities
- Quality management and compliance
- Supply chain optimization
- Workforce productivity
- Cost reduction strategies
- Export competitiveness

Be specific, actionable, and data-driven. Use Indian textile industry context.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a senior business consultant specializing in garment manufacturing and textile industry with McKinsey-level expertise.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Parse JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Error generating AI insights:', error);
    // Return fallback insights if AI fails
    return generateFallbackInsights(categoryScores);
  }
}

/**
 * Generate fallback insights if AI is unavailable
 */
function generateFallbackInsights(categoryScores) {
  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1].percentage - a[1].percentage);
  
  const strengths = sortedCategories
    .filter(([_, data]) => data.percentage >= 70)
    .map(([category]) => `Strong performance in ${category}`)
    .slice(0, 3);
  
  const gaps = sortedCategories
    .filter(([_, data]) => data.percentage < 60)
    .map(([category]) => `Improvement needed in ${category}`)
    .slice(0, 3);
  
  return {
    executiveSummary: `Overall business performance shows ${sortedCategories[0][1].percentage}% strength in ${sortedCategories[0][0]}. Focus areas identified for improvement.`,
    keyStrengths: strengths.length > 0 ? strengths : ['Assessment completed successfully'],
    criticalGaps: gaps.length > 0 ? gaps : ['Continue monitoring all business areas'],
    categoryInsights: Object.fromEntries(
      Object.entries(categoryScores).map(([category, data]) => [
        category,
        {
          analysis: `Current performance at ${data.percentage}%`,
          recommendations: ['Implement best practices', 'Regular monitoring and review'],
          industryBenchmark: data.percentage >= 70 ? 'Above average' : 'Below industry standard',
          priority: data.percentage < 60 ? 'High' : data.percentage < 75 ? 'Medium' : 'Low'
        }
      ])
    ),
    quickWins: ['Process documentation', 'Team training', 'Performance tracking'],
    strategicInitiatives: ['Digital transformation', 'Quality management system'],
    90DayRoadmap: {
      month1: ['Assess current processes', 'Identify quick wins'],
      month2: ['Implement improvements', 'Train team'],
      month3: ['Review results', 'Scale successes']
    },
    estimatedImpact: {
      costSavings: '10-15% reduction in operational costs',
      efficiencyGains: '20-25% improvement in productivity',
      revenueOpportunity: '15-20% increase in capacity utilization'
    }
  };
}

/**
 * Generate comprehensive business intelligence report
 */
export async function generateBusinessReport({ responses, questions, companyName, userName }) {
  try {
    // Calculate scores
    const categoryScores = calculateCategoryScores(responses, questions);
    
    // Calculate overall score
    const totalScore = Object.values(categoryScores).reduce((sum, cat) => sum + cat.score, 0);
    const totalMaxScore = Object.values(categoryScores).reduce((sum, cat) => sum + cat.maxScore, 0);
    const overallPercentage = Math.round((totalScore / totalMaxScore) * 100);
    
    // Determine performance tier
    const performanceTier = getPerformanceTier(overallPercentage);
    
    // Generate AI insights
    const aiInsights = await generateAIInsights(categoryScores, companyName);
    
    // Compile full report
    const report = {
      metadata: {
        companyName,
        userName,
        assessmentDate: new Date().toISOString(),
        totalQuestions: questions.length,
        categoriesAnalyzed: Object.keys(categoryScores).length,
      },
      overallScore: {
        percentage: overallPercentage,
        score: totalScore,
        maxScore: totalMaxScore,
        performanceTier,
      },
      categoryScores,
      aiInsights,
      generatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      report,
    };
  } catch (error) {
    console.error('Error generating business report:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Generate executive summary for quick view
 */
export function generateExecutiveSummary(report) {
  const { overallScore, categoryScores, aiInsights } = report;
  
  return {
    overallPerformance: `${overallScore.percentage}% - ${overallScore.performanceTier.tier}`,
    topStrength: Object.entries(categoryScores)
      .sort((a, b) => b[1].percentage - a[1].percentage)[0][0],
    topPriority: Object.entries(categoryScores)
      .sort((a, b) => a[1].percentage - b[1].percentage)[0][0],
    keyRecommendation: aiInsights.quickWins[0],
    estimatedImpact: aiInsights.estimatedImpact.costSavings,
  };
}


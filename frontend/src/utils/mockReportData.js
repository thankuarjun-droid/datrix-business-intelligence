/**
 * Mock data generator for testing comprehensive report
 * This allows quick testing without completing the full 60-question assessment
 */

export function generateMockAssessmentData() {
  return {
    id: 'mock-assessment-123',
    user_id: 'mock-user-456',
    total_score: 52,
    max_score: 240,
    percentage: 21.67,
    overall_grade: 'D',
    grade: 'D', // Add this for compatibility
    category_scores: {
      'Business Strategy & Vision': {
        score: 7,
        max_score: 32,
        percentage: 21.88
      },
      'Sales, Marketing & Customer Management': {
        score: 5,
        max_score: 28,
        percentage: 17.86
      },
      'Operations & Production Management': {
        score: 14,
        max_score: 48,
        percentage: 29.17
      },
      'Supply Chain & Vendor Management': {
        score: 11,
        max_score: 32,
        percentage: 34.38
      },
      'Financial Management & Cost Control': {
        score: 7,
        max_score: 40,
        percentage: 17.50
      },
      'Technology & Digitalisation': {
        score: 6,
        max_score: 24,
        percentage: 25.00
      },
      'HR & Organisational Culture': {
        score: 9,
        max_score: 36,
        percentage: 25.00
      }
    },
    recommendations: [
      'Focus on strengthening Technology & Digitalisation',
      'Improve Financial Management & Cost Control',
      'Enhance Sales, Marketing & Customer Management'
    ],
    completed_at: new Date().toISOString()
  };
}

export function generateMockBusinessContext() {
  return {
    sewing_machines: 475,
    annual_turnover: 110000000,
    turnover_currency: 'INR',
    goal_1_year: 'Increase production efficiency by 25% and reduce defect rate to below 2%',
    goal_3_year: 'Expand to 750 machines, achieve ₹200 crore turnover, and become a top-tier supplier for international brands',
    one_year_goals: 'Increase production efficiency by 25% and reduce defect rate to below 2%',
    three_year_goals: 'Expand to 750 machines, achieve ₹200 crore turnover, and become a top-tier supplier for international brands',
    challenge_1: 'High absenteeism rate (25%) causing production delays',
    challenge_2: 'Quality control issues leading to customer complaints and rework',
    challenge_3: 'Lack of real-time production tracking and data-driven decision making',
    current_challenges: 'High absenteeism (25%), quality control issues, lack of real-time tracking'
  };
}

export function generateMockResponses() {
  // Generate 60 mock responses (0-4 scale for most questions)
  // Using actual question IDs format: q_categoryIndex_questionIndex
  const responses = {};
  
  // Business Strategy & Vision (8 questions) - Lower scores
  for (let i = 1; i <= 8; i++) {
    responses[`q_1_${i}`] = Math.floor(Math.random() * 2); // 0-1 (poor)
  }
  
  // Sales, Marketing & Customer Management (7 questions) - Low scores
  for (let i = 1; i <= 7; i++) {
    responses[`q_2_${i}`] = Math.floor(Math.random() * 2); // 0-1
  }
  
  // Operations & Production Management (12 questions) - Slightly better
  for (let i = 1; i <= 12; i++) {
    responses[`q_3_${i}`] = Math.floor(Math.random() * 3); // 0-2
  }
  
  // Supply Chain & Vendor Management (8 questions) - Better performance
  for (let i = 1; i <= 8; i++) {
    responses[`q_4_${i}`] = Math.floor(Math.random() * 3) + 1; // 1-3 (better)
  }
  
  // Financial Management & Cost Control (10 questions) - Poor
  for (let i = 1; i <= 10; i++) {
    responses[`q_5_${i}`] = Math.floor(Math.random() * 2); // 0-1
  }
  
  // Technology & Digitalisation (6 questions) - Low
  for (let i = 1; i <= 6; i++) {
    responses[`q_6_${i}`] = Math.floor(Math.random() * 2); // 0-1
  }
  
  // HR & Organisational Culture (9 questions) - Low
  for (let i = 1; i <= 9; i++) {
    responses[`q_7_${i}`] = Math.floor(Math.random() * 2); // 0-1
  }
  
  return responses;
}

/**
 * Generate comprehensive mock questions matching the response structure
 * This ensures heat map and category deep dives work properly
 */
export function generateMockQuestions() {
  const questions = [];
  
  // Category 1: Business Strategy & Vision (8 questions)
  const bsvQuestions = [
    'Does your company have a clear written vision and mission statement?',
    'Are your business goals documented and communicated to all employees?',
    'Do you conduct regular strategic planning sessions (at least annually)?',
    'Have you identified your key competitive advantages in the market?',
    'Do you have a documented 3-5 year business growth plan?',
    'Are you tracking progress against strategic objectives monthly?',
    'Do you have a clear understanding of your target customer segments?',
    'Have you conducted a SWOT analysis in the past year?'
  ];
  
  bsvQuestions.forEach((text, index) => {
    questions.push({
      id: `q_1_${index + 1}`,
      question_text: text,
      max_score: 4,
      assessment_categories: {
        name: 'Business Strategy & Vision',
        id: 'cat_1'
      },
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    });
  });
  
  // Category 2: Sales, Marketing & Customer Management (7 questions)
  const smcmQuestions = [
    'Do you have a documented sales process and pipeline management system?',
    'Are you tracking customer satisfaction scores regularly?',
    'Do you have a CRM system to manage customer relationships?',
    'Are marketing activities planned and budgeted annually?',
    'Do you measure marketing ROI for your campaigns?',
    'Is there a formal process for handling customer complaints?',
    'Do you conduct regular customer feedback surveys?'
  ];
  
  smcmQuestions.forEach((text, index) => {
    questions.push({
      id: `q_2_${index + 1}`,
      question_text: text,
      max_score: 4,
      assessment_categories: {
        name: 'Sales, Marketing & Customer Management',
        id: 'cat_2'
      },
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    });
  });
  
  // Category 3: Operations & Production Management (12 questions)
  const opmQuestions = [
    'Do you track daily production output per machine/operator?',
    'Is there a documented standard operating procedure (SOP) for each process?',
    'Do you measure Overall Equipment Effectiveness (OEE)?',
    'Are production targets set and communicated daily?',
    'Do you have a preventive maintenance schedule for all machines?',
    'Is there a system for tracking and reducing production defects?',
    'Do you conduct regular time and motion studies?',
    'Are production bottlenecks identified and addressed systematically?',
    'Do you have inline quality checkpoints in your production line?',
    'Is there a documented process for handling production emergencies?',
    'Do you track and analyze reasons for production downtime?',
    'Are operators cross-trained on multiple machines/processes?'
  ];
  
  opmQuestions.forEach((text, index) => {
    questions.push({
      id: `q_3_${index + 1}`,
      question_text: text,
      max_score: 4,
      assessment_categories: {
        name: 'Operations & Production Management',
        id: 'cat_3'
      },
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    });
  });
  
  // Category 4: Supply Chain & Vendor Management (8 questions)
  const scvmQuestions = [
    'Do you have a vendor evaluation and selection process?',
    'Is inventory tracked in real-time using a digital system?',
    'Do you maintain optimal stock levels to avoid stockouts?',
    'Are vendor performance metrics tracked regularly?',
    'Do you have backup suppliers for critical materials?',
    'Is there a documented procurement policy and approval process?',
    'Do you negotiate payment terms effectively with vendors?',
    'Are material quality checks conducted upon receipt?'
  ];
  
  scvmQuestions.forEach((text, index) => {
    questions.push({
      id: `q_4_${index + 1}`,
      question_text: text,
      max_score: 4,
      assessment_categories: {
        name: 'Supply Chain & Vendor Management',
        id: 'cat_4'
      },
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    });
  });
  
  // Category 5: Financial Management & Cost Control (10 questions)
  const fmccQuestions = [
    'Do you prepare monthly financial statements (P&L, Balance Sheet)?',
    'Are production costs tracked per order/style?',
    'Do you have a formal budgeting process for annual planning?',
    'Is there a system for tracking and controlling overhead costs?',
    'Do you analyze variance between budgeted and actual costs?',
    'Are cash flow projections prepared regularly?',
    'Do you track key financial ratios (margins, turnover, etc.)?',
    'Is there a formal approval process for capital expenditures?',
    'Do you conduct regular profitability analysis by customer/product?',
    'Are financial reports reviewed by management monthly?'
  ];
  
  fmccQuestions.forEach((text, index) => {
    questions.push({
      id: `q_5_${index + 1}`,
      question_text: text,
      max_score: 4,
      assessment_categories: {
        name: 'Financial Management & Cost Control',
        id: 'cat_5'
      },
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    });
  });
  
  // Category 6: Technology & Digitalisation (6 questions)
  const tdQuestions = [
    'Do you use ERP/MRP software for business management?',
    'Are production processes digitally monitored in real-time?',
    'Do you use data analytics for business decision-making?',
    'Is your business data backed up regularly and securely?',
    'Do you have a website and active social media presence?',
    'Are digital tools used for employee communication and collaboration?'
  ];
  
  tdQuestions.forEach((text, index) => {
    questions.push({
      id: `q_6_${index + 1}`,
      question_text: text,
      max_score: 4,
      assessment_categories: {
        name: 'Technology & Digitalisation',
        id: 'cat_6'
      },
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    });
  });
  
  // Category 7: HR & Organisational Culture (9 questions)
  const hrocQuestions = [
    'Do you have documented HR policies and employee handbook?',
    'Are job descriptions clearly defined for all positions?',
    'Do you conduct regular performance appraisals for employees?',
    'Is there a structured onboarding program for new employees?',
    'Do you provide regular training and skill development opportunities?',
    'Are employee grievances addressed through a formal process?',
    'Do you measure and track employee satisfaction/engagement?',
    'Is there a clear organizational structure with defined reporting lines?',
    'Do you have retention strategies to reduce employee turnover?'
  ];
  
  hrocQuestions.forEach((text, index) => {
    questions.push({
      id: `q_7_${index + 1}`,
      question_text: text,
      max_score: 4,
      assessment_categories: {
        name: 'HR & Organisational Culture',
        id: 'cat_7'
      },
      options: [
        { value: 0, label: 'Never' },
        { value: 1, label: 'Rarely' },
        { value: 2, label: 'Sometimes' },
        { value: 3, label: 'Often' },
        { value: 4, label: 'Always' }
      ]
    });
  });
  
  return questions;
}

export default { 
  generateMockAssessmentData, 
  generateMockBusinessContext, 
  generateMockResponses,
  generateMockQuestions 
};



/**
 * Generate complete mock report data including assessment, context, responses, and questions
 * This is the main function used by TestReport component
 */
export function generateMockReportData() {
  return {
    assessmentData: generateMockAssessmentData(),
    businessContext: generateMockBusinessContext(),
    responses: generateMockResponses(),
    questions: generateMockQuestions()
  };
}


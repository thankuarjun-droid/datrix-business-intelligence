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
    challenge_1: 'High absenteeism rate (25%) causing production delays',
    challenge_2: 'Quality control issues leading to customer complaints and rework',
    challenge_3: 'Lack of real-time production tracking and data-driven decision making'
  };
}

export function generateMockResponses() {
  // Generate 60 mock responses (0-4 scale for most questions)
  const responses = {};
  
  // Business Strategy & Vision (8 questions)
  for (let i = 1; i <= 8; i++) {
    responses[`bsv_${i}`] = Math.floor(Math.random() * 3); // 0-2 (lower scores)
  }
  
  // Sales, Marketing & Customer Management (7 questions)
  for (let i = 1; i <= 7; i++) {
    responses[`smcm_${i}`] = Math.floor(Math.random() * 3); // 0-2
  }
  
  // Operations & Production Management (12 questions)
  for (let i = 1; i <= 12; i++) {
    responses[`opm_${i}`] = Math.floor(Math.random() * 4); // 0-3
  }
  
  // Supply Chain & Vendor Management (8 questions)
  for (let i = 1; i <= 8; i++) {
    responses[`scvm_${i}`] = Math.floor(Math.random() * 4); // 0-3 (slightly better)
  }
  
  // Financial Management & Cost Control (10 questions)
  for (let i = 1; i <= 10; i++) {
    responses[`fmcc_${i}`] = Math.floor(Math.random() * 3); // 0-2
  }
  
  // Technology & Digitalisation (6 questions)
  for (let i = 1; i <= 6; i++) {
    responses[`td_${i}`] = Math.floor(Math.random() * 3); // 0-2
  }
  
  // HR & Organisational Culture (9 questions)
  for (let i = 1; i <= 9; i++) {
    responses[`hroc_${i}`] = Math.floor(Math.random() * 3); // 0-2
  }
  
  return responses;
}

export function generateMockQuestions() {
  const categories = [
    {
      id: 'cat_1',
      name: 'Business Strategy & Vision',
      description: 'Strategic planning and vision setting',
      questions: [
        'Does your company have a clear written vision and mission statement?',
        'Are your business goals documented and communicated to all employees?',
        'Do you conduct regular strategic planning sessions (at least annually)?',
        'Have you identified your key competitive advantages in the market?',
        'Do you have a documented 3-5 year business growth plan?',
        'Are you tracking progress against strategic objectives monthly?',
        'Do you have a clear understanding of your target customer segments?',
        'Have you conducted a SWOT analysis in the past year?'
      ]
    },
    {
      id: 'cat_2',
      name: 'Sales, Marketing & Customer Management',
      description: 'Customer acquisition and retention',
      questions: [
        'Do you have a documented sales process and pipeline management system?',
        'Are you tracking customer satisfaction scores regularly?',
        'Do you have a CRM system to manage customer relationships?',
        'Are marketing activities planned and budgeted annually?',
        'Do you measure marketing ROI for your campaigns?',
        'Is there a formal process for handling customer complaints?',
        'Do you conduct regular customer feedback surveys?'
      ]
    },
    {
      id: 'cat_3',
      name: 'Operations & Production Management',
      description: 'Manufacturing and production efficiency',
      questions: [
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
      ]
    },
    {
      id: 'cat_4',
      name: 'Supply Chain & Vendor Management',
      description: 'Procurement and inventory management',
      questions: [
        'Do you have a vendor evaluation and selection process?',
        'Is inventory tracked in real-time using a digital system?',
        'Do you maintain optimal stock levels to avoid stockouts?',
        'Are vendor performance metrics tracked regularly?',
        'Do you have backup suppliers for critical materials?',
        'Is there a documented procurement policy and approval process?',
        'Do you negotiate payment terms effectively with vendors?',
        'Are material quality checks conducted upon receipt?'
      ]
    },
    {
      id: 'cat_5',
      name: 'Financial Management & Cost Control',
      description: 'Financial planning and cost optimization',
      questions: [
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
      ]
    },
    {
      id: 'cat_6',
      name: 'Technology & Digitalisation',
      description: 'Technology adoption and digital transformation',
      questions: [
        'Do you use production management software/ERP system?',
        'Are production data captured digitally in real-time?',
        'Do you use data analytics for decision making?',
        'Is there a digital system for attendance and payroll?',
        'Do you have a website showcasing your capabilities?',
        'Are you exploring automation opportunities in production?'
      ]
    },
    {
      id: 'cat_7',
      name: 'HR & Organisational Culture',
      description: 'Human resource management and workplace culture',
      questions: [
        'Do you have a formal recruitment and onboarding process?',
        'Are job descriptions documented for all positions?',
        'Do you conduct regular performance appraisals?',
        'Is there a structured training program for employees?',
        'Do you track employee satisfaction and engagement?',
        'Are there clear policies for leave, attendance, and discipline?',
        'Do you have a succession plan for key positions?',
        'Is there a formal grievance redressal mechanism?',
        'Do you recognize and reward high-performing employees?'
      ]
    }
  ];

  const questions = [];
  let displayOrder = 1;

  categories.forEach((category, catIndex) => {
    category.questions.forEach((questionText, qIndex) => {
      questions.push({
        id: `q_${catIndex + 1}_${qIndex + 1}`,
        question_text: questionText,
        category_id: category.id,
        display_order: displayOrder++,
        max_score: 4,
        is_active: true,
        assessment_categories: {
          id: category.id,
          name: category.name,
          description: category.description
        }
      });
    });
  });

  return questions;
}

/**
 * Generate complete mock data package for testing
 */
export function generateMockReportData() {
  return {
    assessmentData: generateMockAssessmentData(),
    businessContext: generateMockBusinessContext(),
    responses: generateMockResponses(),
    questions: generateMockQuestions()
  };
}


-- =====================================================
-- UPDATE QUESTIONS WITH PROPER OPTIONS AND EXPLANATIONS
-- Separate answer options from question explanations
-- =====================================================

-- Step 1: Add explanation column if it doesn't exist
ALTER TABLE public.assessment_questions 
ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Step 2: Update the options field to JSONB array format
-- Step 3: Move current help_text to options, add proper explanations

-- ============================================================================
-- CATEGORY 1: FINANCIAL HEALTH (12 Questions)
-- ============================================================================

-- Question 1: Gross Profit Margin
UPDATE public.assessment_questions 
SET 
  options = '["Below 10%", "10-15%", "15-20%", "20-25%", "Above 25%"]'::jsonb,
  explanation = 'Gross profit margin is calculated as (Revenue - Cost of Goods Sold) / Revenue × 100. It indicates how efficiently you convert sales into profit before operating expenses. Higher margins suggest better pricing power and cost control.',
  help_text = NULL
WHERE question_text = 'What is your current gross profit margin range?';

-- Question 2: Production Cost Tracking
UPDATE public.assessment_questions 
SET 
  options = '["No tracking", "Basic manual tracking", "Spreadsheet-based", "Software-based", "Real-time ERP system"]'::jsonb,
  explanation = 'Production cost tracking involves monitoring all expenses related to manufacturing, including raw materials, labor, overheads, and utilities. Effective tracking helps identify cost-saving opportunities and improve profitability.',
  help_text = NULL
WHERE question_text = 'How well do you track and manage production costs?';

-- Question 3: Payment Collection Period
UPDATE public.assessment_questions 
SET 
  options = '["Over 90 days", "60-90 days", "45-60 days", "30-45 days", "Under 30 days"]'::jsonb,
  explanation = 'Payment collection period (Days Sales Outstanding) measures the average time taken to collect payment from buyers after delivery. Shorter periods improve cash flow and reduce working capital requirements.',
  help_text = NULL
WHERE question_text = 'What is your average payment collection period from buyers?';

-- Question 4: Working Capital Financing
UPDATE public.assessment_questions 
SET 
  options = '["No access", "Informal sources only", "Limited bank credit", "Good bank relationships", "Multiple financing options"]'::jsonb,
  explanation = 'Working capital financing provides funds to manage day-to-day operations, purchase raw materials, and bridge the gap between paying suppliers and receiving payment from buyers. Multiple financing options provide flexibility and better terms.',
  help_text = NULL
WHERE question_text = 'Do you have access to working capital financing?';

-- Question 5: Foreign Exchange Risk Management
UPDATE public.assessment_questions 
SET 
  options = '["No management", "Aware but no action", "Basic hedging occasionally", "Regular hedging", "Comprehensive FX strategy"]'::jsonb,
  explanation = 'Foreign exchange (FX) risk arises from currency fluctuations affecting export revenues and import costs. Hedging strategies like forward contracts protect against adverse currency movements and stabilize cash flows.',
  help_text = NULL
WHERE question_text = 'How do you manage foreign exchange risk?';

-- Question 6: Debt-to-Equity Ratio
UPDATE public.assessment_questions 
SET 
  options = '["Above 3:1", "2-3:1", "1.5-2:1", "1-1.5:1", "Below 1:1"]'::jsonb,
  explanation = 'Debt-to-equity ratio compares total debt to shareholder equity. It indicates financial leverage and risk. Lower ratios suggest less dependence on borrowed funds and stronger financial stability.',
  help_text = NULL
WHERE question_text = 'What is your debt-to-equity ratio?';

-- Question 7: Financial Statement Review Frequency
UPDATE public.assessment_questions 
SET 
  options = '["Annually", "Quarterly", "Monthly", "Bi-weekly", "Weekly with real-time dashboards"]'::jsonb,
  explanation = 'Regular financial statement review helps track performance, identify issues early, and make informed decisions. Real-time dashboards enable proactive management and quick responses to market changes.',
  help_text = NULL
WHERE question_text = 'How frequently do you review financial statements?';

-- Question 8: Cash Conversion Cycle
UPDATE public.assessment_questions 
SET 
  options = '["Over 120 days", "90-120 days", "60-90 days", "30-60 days", "Under 30 days"]'::jsonb,
  explanation = 'Cash conversion cycle measures the time between paying suppliers and receiving payment from customers. Shorter cycles mean faster cash turnover, reducing the need for external financing and improving liquidity.',
  help_text = NULL
WHERE question_text = 'What is your cash conversion cycle?';

-- Question 9: Export Credit Insurance
UPDATE public.assessment_questions 
SET 
  options = '["No insurance", "Considering", "Partial coverage", "Good coverage", "Comprehensive coverage"]'::jsonb,
  explanation = 'Export credit insurance protects against non-payment by foreign buyers due to commercial or political risks. It enables safer expansion into new markets and can improve access to financing.',
  help_text = NULL
WHERE question_text = 'Do you have export credit insurance?';

-- Question 10: ROI on New Machinery
UPDATE public.assessment_questions 
SET 
  options = '["No tracking", "Below 10%", "10-15%", "15-25%", "Above 25%"]'::jsonb,
  explanation = 'Return on Investment (ROI) for machinery measures the profitability of capital expenditures. It is calculated as (Net Profit from Investment / Cost of Investment) × 100. Higher ROI indicates better utilization of capital.',
  help_text = NULL
WHERE question_text = 'What is your return on investment (ROI) for new machinery?';

-- Question 11: Seasonal Cash Flow Management
UPDATE public.assessment_questions 
SET 
  options = '["No planning", "Basic reserves", "Credit lines", "Strategic planning", "Advanced forecasting with multiple options"]'::jsonb,
  explanation = 'Seasonal cash flow variations occur due to changes in demand, production cycles, and payment terms. Effective management through forecasting, reserves, and flexible financing ensures smooth operations year-round.',
  help_text = NULL
WHERE question_text = 'How do you manage seasonal cash flow variations?';

-- Question 12: Revenue Reinvestment
UPDATE public.assessment_questions 
SET 
  options = '["Below 5%", "5-10%", "10-15%", "15-20%", "Above 20%"]'::jsonb,
  explanation = 'Reinvesting revenue in business growth (new machinery, technology, training, market expansion) drives long-term competitiveness and profitability. Higher reinvestment rates indicate commitment to continuous improvement.',
  help_text = NULL
WHERE question_text = 'What percentage of revenue is reinvested in business growth?';

-- ============================================================================
-- CATEGORY 2: PRODUCTION EXCELLENCE (First 5 Questions as Example)
-- ============================================================================

-- Question 13: Capacity Utilization
UPDATE public.assessment_questions 
SET 
  options = '["Below 50%", "50-65%", "65-75%", "75-85%", "Above 85%"]'::jsonb,
  explanation = 'Capacity utilization measures the percentage of total production capacity being used. Higher utilization (75-85%) indicates efficient resource use, while very high utilization (>90%) may limit flexibility and increase breakdown risks.',
  help_text = NULL
WHERE question_text = 'What is your average production capacity utilization?';

-- Question 14: Defect Rate
UPDATE public.assessment_questions 
SET 
  options = '["Above 5%", "3-5%", "2-3%", "1-2%", "Below 1%"]'::jsonb,
  explanation = 'Defect rate (rejection percentage) measures the proportion of products that fail quality standards. Lower defect rates reduce waste, rework costs, and improve customer satisfaction. World-class manufacturers target below 1%.',
  help_text = NULL
WHERE question_text = 'What is your average defect rate (rejection percentage)?';

-- Question 15: Production Automation
UPDATE public.assessment_questions 
SET 
  options = '["Fully manual", "Some basic machines", "Semi-automated", "Mostly automated", "Fully automated with IoT"]'::jsonb,
  explanation = 'Automation reduces labor costs, improves consistency, increases speed, and enables 24/7 production. IoT-enabled automation provides real-time monitoring and predictive maintenance capabilities.',
  help_text = NULL
WHERE question_text = 'How automated is your production process?';

-- Question 16: Production Planning Software
UPDATE public.assessment_questions 
SET 
  options = '["No system", "Excel-based", "Basic software", "Integrated ERP", "Advanced ERP with AI"]'::jsonb,
  explanation = 'ERP (Enterprise Resource Planning) systems integrate production planning, inventory, procurement, and sales. They optimize resource allocation, reduce lead times, and improve coordination across departments.',
  help_text = NULL
WHERE question_text = 'Do you use production planning software/ERP?';

-- Question 17: Lead Time
UPDATE public.assessment_questions 
SET 
  options = '["Over 60 days", "45-60 days", "30-45 days", "20-30 days", "Under 20 days"]'::jsonb,
  explanation = 'Lead time is the total time from receiving an order to delivering finished goods. Shorter lead times improve customer satisfaction, enable faster response to market trends, and reduce inventory holding costs.',
  help_text = NULL
WHERE question_text = 'What is your average lead time from order to delivery?';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '✓ Questions updated with proper options and explanations';
    RAISE NOTICE '✓ Options field now contains JSONB array of answer choices';
    RAISE NOTICE '✓ Explanation field contains helpful context for each question';
    RAISE NOTICE '✓ Help_text field cleared (no longer needed)';
    RAISE NOTICE '⚠ NOTE: Only first 17 questions updated as example';
    RAISE NOTICE '⚠ Please update remaining 50 questions with similar format';
END $$;


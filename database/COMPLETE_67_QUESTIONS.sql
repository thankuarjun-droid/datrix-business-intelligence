-- COMPLETE DATRIX™ ASSESSMENT - 67 Professional Questions
-- Designed for Tirupur Garment Manufacturers & Exporters
-- Based on McKinsey & BCG Assessment Frameworks

-- First, ensure categories exist (run enhanced_schema.sql first if not done)

-- Clear existing questions to avoid duplicates
DELETE FROM public.assessment_questions;

-- ============================================================================
-- CATEGORY 1: FINANCIAL HEALTH (12 Questions)
-- ============================================================================

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your current gross profit margin range?', 'scale', 4, 1, 
'0: Below 10% | 1: 10-15% | 2: 15-20% | 3: 20-25% | 4: Above 25%'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How well do you track and manage production costs?', 'scale', 4, 2,
'0: No tracking | 1: Basic manual tracking | 2: Spreadsheet-based | 3: Software-based | 4: Real-time ERP system'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average payment collection period from buyers?', 'scale', 4, 3,
'0: Over 90 days | 1: 60-90 days | 2: 45-60 days | 3: 30-45 days | 4: Under 30 days'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have access to working capital financing?', 'scale', 4, 4,
'0: No access | 1: Informal sources only | 2: Limited bank credit | 3: Good bank relationships | 4: Multiple financing options'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you manage foreign exchange risk?', 'scale', 4, 5,
'0: No management | 1: Aware but no action | 2: Basic hedging occasionally | 3: Regular hedging | 4: Comprehensive FX strategy'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your debt-to-equity ratio?', 'scale', 4, 6,
'0: Above 3:1 | 1: 2-3:1 | 2: 1.5-2:1 | 3: 1-1.5:1 | 4: Below 1:1'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How frequently do you review financial statements?', 'scale', 4, 7,
'0: Annually | 1: Quarterly | 2: Monthly | 3: Bi-weekly | 4: Weekly with real-time dashboards'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your cash conversion cycle?', 'scale', 4, 8,
'0: Over 120 days | 1: 90-120 days | 2: 60-90 days | 3: 30-60 days | 4: Under 30 days'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have export credit insurance?', 'scale', 4, 9,
'0: No insurance | 1: Considering | 2: Partial coverage | 3: Good coverage | 4: Comprehensive coverage'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your return on investment (ROI) for new machinery?', 'scale', 4, 10,
'0: No tracking | 1: Below 10% | 2: 10-15% | 3: 15-25% | 4: Above 25%'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you manage seasonal cash flow variations?', 'scale', 4, 11,
'0: No planning | 1: Basic reserves | 2: Credit lines | 3: Strategic planning | 4: Advanced forecasting with multiple options'
FROM public.assessment_categories WHERE name = 'Financial Health';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What percentage of revenue is reinvested in business growth?', 'scale', 4, 12,
'0: Below 5% | 1: 5-10% | 2: 10-15% | 3: 15-20% | 4: Above 20%'
FROM public.assessment_categories WHERE name = 'Financial Health';

-- ============================================================================
-- CATEGORY 2: PRODUCTION EXCELLENCE (15 Questions)
-- ============================================================================

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average production capacity utilization?', 'scale', 4, 13,
'0: Below 50% | 1: 50-65% | 2: 65-75% | 3: 75-85% | 4: Above 85%'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average defect rate (rejection percentage)?', 'scale', 4, 14,
'0: Above 5% | 1: 3-5% | 2: 2-3% | 3: 1-2% | 4: Below 1%'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How automated is your production process?', 'scale', 4, 15,
'0: Fully manual | 1: Some basic machines | 2: Semi-automated | 3: Mostly automated | 4: Fully automated with IoT'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you use production planning software/ERP?', 'scale', 4, 16,
'0: No system | 1: Excel-based | 2: Basic software | 3: Integrated ERP | 4: Advanced ERP with AI'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average lead time from order to delivery?', 'scale', 4, 17,
'0: Over 60 days | 1: 45-60 days | 2: 30-45 days | 3: 20-30 days | 4: Under 20 days'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your on-time delivery performance?', 'scale', 4, 18,
'0: Below 70% | 1: 70-80% | 2: 80-90% | 3: 90-95% | 4: Above 95%'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have a quality management system (ISO 9001 or equivalent)?', 'scale', 4, 19,
'0: No system | 1: Basic procedures | 2: Documented system | 3: ISO certified | 4: ISO + continuous improvement'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average machine downtime percentage?', 'scale', 4, 20,
'0: Above 15% | 1: 10-15% | 2: 7-10% | 3: 4-7% | 4: Below 4%'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you implement lean manufacturing principles?', 'scale', 4, 21,
'0: Not aware | 1: Aware but not implemented | 2: Partial implementation | 3: Good implementation | 4: Fully integrated lean culture'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you track production efficiency (OEE - Overall Equipment Effectiveness)?', 'scale', 4, 22,
'0: No tracking | 1: Manual tracking | 2: Basic software | 3: Real-time monitoring | 4: AI-powered predictive analytics'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your sample approval rate on first submission?', 'scale', 4, 23,
'0: Below 50% | 1: 50-65% | 2: 65-80% | 3: 80-90% | 4: Above 90%'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have in-house testing facilities?', 'scale', 4, 24,
'0: No testing | 1: Basic visual inspection | 2: Some equipment | 3: Good lab facilities | 4: NABL accredited lab'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your fabric utilization efficiency?', 'scale', 4, 25,
'0: Below 80% | 1: 80-85% | 2: 85-88% | 3: 88-92% | 4: Above 92%'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you manage production planning for multiple orders?', 'scale', 4, 26,
'0: Ad-hoc | 1: Manual planning | 2: Spreadsheets | 3: Planning software | 4: AI-optimized scheduling'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have backup power systems for uninterrupted production?', 'scale', 4, 27,
'0: No backup | 1: Limited generators | 2: Adequate generators | 3: Full backup | 4: Renewable + backup systems'
FROM public.assessment_categories WHERE name = 'Production Excellence';

-- ============================================================================
-- CATEGORY 3: SUPPLY CHAIN (11 Questions)
-- ============================================================================

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How diversified is your supplier base for critical materials?', 'scale', 4, 28,
'0: Single supplier | 1: 2 suppliers | 2: 3-4 suppliers | 3: 5-7 suppliers | 4: 8+ suppliers with alternatives'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average inventory turnover ratio?', 'scale', 4, 29,
'0: Below 4 | 1: 4-6 | 2: 6-8 | 3: 8-10 | 4: Above 10'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have real-time visibility of your supply chain?', 'scale', 4, 30,
'0: No visibility | 1: Manual tracking | 2: Partial digital tracking | 3: Good digital visibility | 4: Complete real-time tracking'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you manage raw material procurement?', 'scale', 4, 31,
'0: Reactive buying | 1: Basic planning | 2: Forecasting | 3: Strategic sourcing | 4: Integrated demand planning'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your supplier quality rating system?', 'scale', 4, 32,
'0: No rating | 1: Informal assessment | 2: Basic scorecard | 3: Formal rating system | 4: Automated vendor management'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have backward integration (own fabric/yarn production)?', 'scale', 4, 33,
'0: No integration | 1: Planning | 2: Partial integration | 3: Good integration | 4: Full vertical integration'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you handle logistics and shipping?', 'scale', 4, 34,
'0: Ad-hoc arrangements | 1: Regular transporters | 2: Contract logistics | 3: Multiple 3PL partners | 4: Integrated logistics with tracking'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average inventory holding cost as % of sales?', 'scale', 4, 35,
'0: Above 25% | 1: 20-25% | 2: 15-20% | 3: 10-15% | 4: Below 10%'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you use just-in-time (JIT) inventory management?', 'scale', 4, 36,
'0: No JIT | 1: Aware of concept | 2: Partial implementation | 3: Good implementation | 4: Fully optimized JIT'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you manage supply chain disruptions?', 'scale', 4, 37,
'0: Reactive only | 1: Basic contingency | 2: Risk assessment | 3: Mitigation plans | 4: Comprehensive risk management'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have warehouse management systems?', 'scale', 4, 38,
'0: No system | 1: Manual records | 2: Spreadsheets | 3: Basic WMS | 4: Advanced WMS with automation'
FROM public.assessment_categories WHERE name = 'Supply Chain';

-- ============================================================================
-- CATEGORY 4: SALES & MARKETING (12 Questions)
-- ============================================================================

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How many active buyers/brands do you work with?', 'scale', 4, 39,
'0: 1-2 buyers | 1: 3-5 buyers | 2: 6-10 buyers | 3: 11-20 buyers | 4: 20+ buyers'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What percentage of revenue comes from your top client?', 'scale', 4, 40,
'0: Over 70% | 1: 50-70% | 2: 30-50% | 3: 20-30% | 4: Below 20%'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have a digital presence (website, social media)?', 'scale', 4, 41,
'0: No presence | 1: Basic website only | 2: Website + social media | 3: Active digital marketing | 4: Comprehensive digital strategy'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you acquire new customers?', 'scale', 4, 42,
'0: Referrals only | 1: Trade shows | 2: Multiple channels | 3: Digital marketing | 4: Integrated multi-channel strategy'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your customer retention rate?', 'scale', 4, 43,
'0: Below 50% | 1: 50-65% | 2: 65-80% | 3: 80-90% | 4: Above 90%'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have a dedicated sales and marketing team?', 'scale', 4, 44,
'0: Owner only | 1: 1 person | 2: 2-3 people | 3: Dedicated team | 4: Specialized teams by region/product'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you handle customer relationship management (CRM)?', 'scale', 4, 45,
'0: No system | 1: Email/phone only | 2: Spreadsheets | 3: CRM software | 4: Advanced CRM with analytics'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What markets do you export to?', 'scale', 4, 46,
'0: Domestic only | 1: 1 country | 2: 2-3 countries | 3: 4-6 countries | 4: 7+ countries across continents'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you participate in international trade shows/exhibitions?', 'scale', 4, 47,
'0: Never | 1: Rarely | 2: Occasionally | 3: Regularly | 4: Multiple shows annually with ROI tracking'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you differentiate from competitors?', 'scale', 4, 48,
'0: Price only | 1: Quality | 2: Quality + service | 3: Multiple factors | 4: Clear value proposition with brand'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average order value growth year-over-year?', 'scale', 4, 49,
'0: Declining | 1: Flat | 2: 0-10% growth | 3: 10-20% growth | 4: Above 20% growth'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have product development capabilities for new designs?', 'scale', 4, 50,
'0: No capability | 1: Basic modifications | 2: In-house designers | 3: Design team | 4: Innovation lab with trend forecasting'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

-- ============================================================================
-- CATEGORY 5: COMPLIANCE & SUSTAINABILITY (9 Questions)
-- ============================================================================

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Which certifications do you currently hold?', 'scale', 4, 51,
'0: None | 1: 1 certification | 2: 2-3 certifications | 3: 4-5 certifications | 4: 6+ certifications (GOTS, OEKO-TEX, WRAP, etc.)'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have water treatment and recycling systems?', 'scale', 4, 52,
'0: No system | 1: Basic treatment | 2: Treatment + partial recycling | 3: Advanced treatment + recycling | 4: Zero liquid discharge (ZLD)'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What percentage of your energy comes from renewable sources?', 'scale', 4, 53,
'0: 0% | 1: 1-20% | 2: 21-40% | 3: 41-60% | 4: Over 60%'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you conduct regular social compliance audits?', 'scale', 4, 54,
'0: Never | 1: When required | 2: Annually | 3: Bi-annually | 4: Continuous monitoring'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you manage chemical usage and safety?', 'scale', 4, 55,
'0: No management | 1: Basic awareness | 2: MSDS maintained | 3: ZDHC compliance | 4: Full chemical management system'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have a sustainability report or ESG framework?', 'scale', 4, 56,
'0: No reporting | 1: Considering | 2: Basic tracking | 3: Annual report | 4: Comprehensive ESG with targets'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your waste management and recycling rate?', 'scale', 4, 57,
'0: No recycling | 1: Below 20% | 2: 20-40% | 3: 40-60% | 4: Above 60%'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you use sustainable/organic materials?', 'scale', 4, 58,
'0: No | 1: Exploring | 2: 1-10% of production | 3: 10-30% | 4: Above 30%'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you ensure ethical labor practices?', 'scale', 4, 59,
'0: No policy | 1: Basic policy | 2: Written policy + training | 3: Regular audits | 4: Certified ethical workplace'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

-- ============================================================================
-- CATEGORY 6: HUMAN CAPITAL (8 Questions)
-- ============================================================================

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average employee retention rate?', 'scale', 4, 60,
'0: Below 60% | 1: 60-70% | 2: 70-80% | 3: 80-90% | 4: Above 90%'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you provide regular skill development training?', 'scale', 4, 61,
'0: No training | 1: Occasional training | 2: Annual training | 3: Quarterly training | 4: Continuous learning program'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your supervisor to worker ratio?', 'scale', 4, 62,
'0: 1:50+ | 1: 1:30-50 | 2: 1:20-30 | 3: 1:15-20 | 4: 1:10-15'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have employee welfare programs (health insurance, PF, etc.)?', 'scale', 4, 63,
'0: None | 1: Statutory only | 2: Basic benefits | 3: Good benefits | 4: Comprehensive welfare programs'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you measure employee productivity?', 'scale', 4, 64,
'0: No measurement | 1: Output tracking | 2: KPIs defined | 3: Regular monitoring | 4: Data-driven performance management'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average worker efficiency (SAM/hour)?', 'scale', 4, 65,
'0: Below 40 | 1: 40-50 | 2: 50-60 | 3: 60-70 | 4: Above 70'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have succession planning for key positions?', 'scale', 4, 66,
'0: No planning | 1: Informal | 2: For critical roles | 3: Documented plan | 4: Comprehensive talent pipeline'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How do you handle employee grievances and feedback?', 'scale', 4, 67,
'0: No system | 1: Open door policy | 2: Suggestion box | 3: Regular meetings | 4: Formal grievance system with tracking'
FROM public.assessment_categories WHERE name = 'Human Capital';

-- Verify question count
SELECT 
    c.name as category,
    COUNT(q.id) as question_count
FROM public.assessment_categories c
LEFT JOIN public.assessment_questions q ON c.id = q.category_id
GROUP BY c.name, c.display_order
ORDER BY c.display_order;

-- Show total
SELECT COUNT(*) as total_questions FROM public.assessment_questions;


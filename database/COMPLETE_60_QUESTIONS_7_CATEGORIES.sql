-- =====================================================
-- DATRIX COMPLETE 60-QUESTION ASSESSMENT FRAMEWORK
-- 7 Categories for Tirupur Garment Manufacturers
-- Designed with McKinsey/BCG Consulting Insights
-- =====================================================

-- Step 1: Clear existing data
DELETE FROM public.assessment_responses;
DELETE FROM public.assessment_questions;
DELETE FROM public.assessment_categories;

-- Step 2: Add explanation column if not exists
ALTER TABLE public.assessment_questions 
ADD COLUMN IF NOT EXISTS explanation TEXT;

-- =====================================================
-- CATEGORIES (7 Total)
-- =====================================================

INSERT INTO public.assessment_categories (name, description, weight, display_order, is_active) VALUES
('Business Strategy & Vision', 'Long-term direction, competitive positioning, and strategic decision-making', 100, 1, true),
('Sales, Marketing & Customer Management', 'Revenue generation, client relationships, and market presence', 100, 2, true),
('Operations & Production Management', 'Manufacturing efficiency, quality control, and production processes', 100, 3, true),
('Supply Chain & Vendor Management', 'Sourcing, inventory management, and supplier relationships', 100, 4, true),
('Financial Management & Cost Control', 'Profitability, cash flow, and financial discipline', 100, 5, true),
('Technology & Digitalisation', 'Technology adoption, data analytics, and digital systems', 100, 6, true),
('HR & Organisational Culture', 'People management, training, performance, and workplace culture', 100, 7, true);

-- =====================================================
-- CATEGORY 1: BUSINESS STRATEGY & VISION (8 Questions)
-- =====================================================

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id, 
  'How would you describe your company''s strategic planning and goal-setting process for the next 3-5 years?',
  '["Day-to-day focus, no formal plan", "Informal ideas among owners", "Annual budget, not linked to strategy", "3-year plan with targets, quarterly reviews", "Live strategic plan integrated with KPIs"]'::jsonb,
  'Strategic planning defines your company''s long-term direction and resource allocation. Formal strategic plans help anticipate market changes, set clear goals, and align your organization. Companies with documented plans are 12% more likely to achieve goals and show 30% higher profitability.',
  4, 1, true
FROM public.assessment_categories WHERE name = 'Business Strategy & Vision';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you differentiate your company from other manufacturers in Tirupur?',
  '["Compete on lowest price only", "Known for one product, no marketing", "Claim quality but no proof", "Clear USP with evidence", "Core differentiation with measurable data"]'::jsonb,
  'Competitive differentiation means having a unique value proposition. Competing solely on price leads to shrinking margins. Successful exporters differentiate through specialization, certifications, technology, or service. Differentiated companies achieve 15-25% higher margins.',
  4, 2, true
FROM public.assessment_categories WHERE name = 'Business Strategy & Vision';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What percentage of your total revenue comes from your top 3 customers?',
  '["Over 70%", "50-70%", "40-50%", "25-40%", "Less than 25% (diversified)"]'::jsonb,
  'Customer concentration risk measures dependency on few buyers. High concentration (>50% from top 3) makes you vulnerable to cancellations or price pressure. Best practice: keep no single customer above 20% of revenue to reduce risk and improve negotiating power.',
  4, 3, true
FROM public.assessment_categories WHERE name = 'Business Strategy & Vision';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What percentage of your exports goes to USA and EU markets combined?',
  '["Over 90%", "75-90%", "50-75%", "30-50%, exploring others", "Less than 30%, well-diversified"]'::jsonb,
  'Geographic diversification reduces exposure to regional downturns, trade policy changes, and currency fluctuations. Over-dependence on USA/EU exposes you to Brexit, tariffs, or recession risks. Companies exporting to 5+ countries show 40% less revenue volatility.',
  4, 4, true
FROM public.assessment_categories WHERE name = 'Business Strategy & Vision';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What percentage of your product portfolio is cotton knitwear vs man-made fiber (MMF) garments?',
  '["100% cotton, no MMF", "90-100% cotton, exploring MMF", "75-90% cotton, some MMF", "50-75% cotton, growing MMF", "Balanced or specialized in MMF"]'::jsonb,
  'Man-Made Fibers (polyester, nylon, spandex) represent 65% of global textile demand due to performance and cost. Tirupur''s cotton strength is becoming a limitation as buyers demand technical fabrics. Diversifying into MMF opens higher-margin sportswear and athleisure markets.',
  4, 5, true
FROM public.assessment_categories WHERE name = 'Business Strategy & Vision';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you gather and use market intelligence about fashion trends, competitor strategies, and buyer preferences?',
  '["Rely only on buyer inputs", "Occasional trade fairs, no system", "Industry publications, informal monitoring", "Dedicated person tracks trends", "Systematic intelligence with forecasting"]'::jsonb,
  'Market intelligence is systematic collection of market, competitor, and trend information. Being 6 months ahead of trends differentiates premium orders from leftovers. Effective intelligence includes fashion weeks, competitor analysis, and data analytics. Formal processes achieve 20-30% higher new product success rates.',
  4, 6, true
FROM public.assessment_categories WHERE name = 'Business Strategy & Vision';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Is your current business model capable of handling a 50% revenue increase in the next 2 years?',
  '["No, struggle with 20% growth", "Maybe, major firefighting needed", "Partially ready, some bottlenecks", "Mostly ready, minor adjustments", "Fully scalable with documented systems"]'::jsonb,
  'Scalability means growing revenue without proportionally increasing costs. Scalable businesses have standardized processes, documented systems, trained teams, and adequate infrastructure. Non-scalable businesses rely on owners and face chaos with growth. Scalable companies grow 2-3x faster.',
  4, 7, true
FROM public.assessment_categories WHERE name = 'Business Strategy & Vision';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you identify, assess, and manage key business risks (customer loss, price volatility, regulatory changes)?',
  '["React to problems, no planning", "Aware of risks, no mitigation", "Informal discussions, no documentation", "Documented risks with contingency plans", "Formal risk register, quarterly reviews"]'::jsonb,
  'Risk management systematically identifies threats and creates mitigation plans. Key risks: customer concentration, cotton prices, forex, power supply, labor, compliance. A risk register lists probability, impact, mitigation, and owners. Formal risk management reduces crisis probability by 50%.',
  4, 8, true
FROM public.assessment_categories WHERE name = 'Business Strategy & Vision';

-- =====================================================
-- CATEGORY 2: SALES, MARKETING & CUSTOMER MANAGEMENT (7 Questions)
-- =====================================================

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you manage customer relationships and track communication history?',
  '["No system, owner handles all", "Spreadsheets for basic tracking", "Email and phone, no central record", "Basic CRM for contacts and orders", "Full CRM with account management strategy"]'::jsonb,
  'Customer Relationship Management (CRM) systems organize client information, track interactions, and manage sales pipelines. CRM improves response times, prevents missed follow-ups, and enables data-driven decisions. Companies using CRM see 29% increase in sales and 34% improvement in customer satisfaction.',
  4, 9, true
FROM public.assessment_categories WHERE name = 'Sales, Marketing & Customer Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your process for generating new business leads and acquiring new customers?',
  '["Word-of-mouth and referrals only", "Occasional buying agent referrals", "Basic website, occasional trade shows", "Dedicated sales person, multiple channels", "Structured marketing strategy with lead funnel"]'::jsonb,
  'Lead generation is the process of attracting potential customers. Relying only on referrals limits growth. Effective strategies include digital marketing (LinkedIn, Google), trade shows, direct outreach, and content marketing. Companies with structured lead generation grow 50% faster than those relying on referrals alone.',
  4, 10, true
FROM public.assessment_categories WHERE name = 'Sales, Marketing & Customer Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you determine pricing for your products?',
  '["Quote what buyer might accept", "Simple cost-plus on estimates", "Standard costing, incomplete overheads", "Detailed activity-based costing", "Dynamic pricing with capacity and value analysis"]'::jsonb,
  'Pricing strategy determines profitability. Simple cost-plus often underestimates true costs, leading to losses. Activity-Based Costing (ABC) accurately captures all direct, indirect, and overhead costs. Dynamic pricing considers costs, client value, capacity, and positioning. Accurate costing improves margins by 8-15%.',
  4, 11, true
FROM public.assessment_categories WHERE name = 'Sales, Marketing & Customer Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you handle customer feedback and complaints?',
  '["Only when buyer rejects shipment", "Case-by-case discounts", "Log complaints, no analysis", "Structured process with root cause analysis", "Proactive feedback with continuous improvement"]'::jsonb,
  'Customer feedback management turns complaints into improvement opportunities. Root Cause Analysis (RCA) prevents recurring issues. Proactive feedback through surveys shows commitment to quality. Companies with structured feedback systems reduce repeat defects by 40% and improve customer retention by 25%.',
  4, 12, true
FROM public.assessment_categories WHERE name = 'Sales, Marketing & Customer Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How effectively do you manage the merchandising team and sampling process?',
  '["Chaotic, owner involved in all", "Each merchandiser works independently", "Excel T&A calendar, not updated", "Centralized system with T&A tracking", "Fully digitized with real-time visibility"]'::jsonb,
  'Merchandising coordinates between buyers, production, and suppliers. Time & Action (T&A) calendars track critical milestones from sampling to shipment. Effective merchandising reduces delays, improves first-time-right sampling, and ensures on-time delivery. Digital systems improve on-time delivery by 30%.',
  4, 13, true
FROM public.assessment_categories WHERE name = 'Sales, Marketing & Customer Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Do you export as a job worker for brands or have your own brand presence?',
  '["100% job work for other brands", "Mostly job work, exploring branding", "Mix of job work and own brand", "Growing own brand with investments", "Established brand with direct market presence"]'::jsonb,
  'Brand building creates pricing power and customer loyalty. Job work offers volume but thin margins and buyer dependency. Own brands require investment in design, marketing, and distribution but yield 30-50% higher margins. Direct-to-consumer (D2C) channels offer even greater control and profitability.',
  4, 14, true
FROM public.assessment_categories WHERE name = 'Sales, Marketing & Customer Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you track and measure sales performance and customer profitability?',
  '["No tracking, only final P&L", "Basic revenue tracking by customer", "Track revenue and gross margin", "Detailed profitability by customer and order", "Real-time dashboards with lifetime value analysis"]'::jsonb,
  'Customer profitability analysis reveals which clients are truly profitable after accounting for all costs (production, sampling, logistics, delays). Some high-volume customers may be unprofitable due to low prices or high service costs. Tracking Customer Lifetime Value (CLV) guides strategic account management.',
  4, 15, true
FROM public.assessment_categories WHERE name = 'Sales, Marketing & Customer Management';

-- =====================================================
-- CATEGORY 3: OPERATIONS & PRODUCTION MANAGEMENT (12 Questions)
-- =====================================================

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How is production floor performance monitored in real-time?',
  '["Supervisor verbal reports end-of-day", "Manual logbooks, compiled daily", "Daily targets, manual Excel entry", "Basic ERP with hourly tracking", "Real-time RFID/QR system with live dashboards"]'::jsonb,
  'Real-time production monitoring enables immediate problem-solving. Live dashboards show efficiency, defects, and bottlenecks by line and operator. RFID/QR systems track each garment through production stages. Real-time visibility reduces downtime by 20% and improves efficiency by 15-25%.',
  4, 16, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your average production capacity utilization over the last 12 months?',
  '["Below 50%", "50-65%", "65-75%", "75-85%", "Above 85%"]'::jsonb,
  'Capacity utilization measures percentage of total production capacity being used. Higher utilization (75-85%) indicates efficient resource use and strong demand. Very high utilization (>90%) limits flexibility and increases breakdown risks. Low utilization (<60%) suggests excess capacity or weak order book.',
  4, 17, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your average lead time from order confirmation to shipment?',
  '["Over 60 days", "45-60 days", "30-45 days", "20-30 days", "Under 20 days"]'::jsonb,
  'Lead time is total time from order to delivery. Shorter lead times improve customer satisfaction, enable faster trend response, and reduce inventory costs. Fast fashion brands demand 15-30 day lead times. Reducing lead time by 20% can increase order volume by 15-25%.',
  4, 18, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your average defect rate (rejection percentage) at final inspection?',
  '["Above 5%", "3-5%", "2-3%", "1-2%", "Below 1%"]'::jsonb,
  'Defect rate measures proportion of products failing quality standards. Lower defect rates reduce waste, rework costs, and improve customer satisfaction. World-class manufacturers target below 1%. Each 1% reduction in defect rate can improve profitability by 2-3%.',
  4, 19, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you approach production planning and control (PPC)?',
  '["Weekly planning with firefighting", "Monthly plan, poor coordination", "Dedicated PPC in Excel", "Systematic PPC with capacity balancing", "Integrated ERP with dynamic planning"]'::jsonb,
  'Production Planning & Control (PPC) balances capacity, materials, and delivery dates. Effective PPC minimizes changeovers, optimizes machine utilization, and ensures on-time delivery. ERP-integrated PPC provides real-time visibility and dynamic adjustments. Good PPC improves on-time delivery by 25-40%.',
  4, 20, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your system for managing quality control?',
  '["Final inspection only", "End-of-line checkers", "Defined checkpoints, not standardized", "Statistical Quality Control (SQC) with AQL", "Right-first-time culture with root cause analysis"]'::jsonb,
  'Quality control prevents defects from reaching customers. Statistical Quality Control (SQC) uses sampling and Acceptable Quality Limits (AQL) at each stage. Root Cause Analysis (5-Why, Kaizen) prevents recurring defects. Building quality into the process reduces inspection costs and improves reputation.',
  4, 21, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you measure and manage manufacturing wastages (fabric, thread, energy, rework)?',
  '["No tracking, only final P&L", "General idea of fabric wastage", "Track major wastages manually", "Systematic tracking in monthly MIS", "Real-time tracking with benchmarks and targets"]'::jsonb,
  'Wastage management directly impacts profitability. Key wastages: fabric (cut-to-ship ratio), thread, energy, rework. Tracking wastage by order and line identifies improvement opportunities. Reducing fabric wastage by 2% can improve margins by 3-5%. Real-time tracking enables immediate corrective action.',
  4, 22, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How is machine maintenance planned and executed?',
  '["Fix only when broken", "In-house mechanic for repairs", "Basic preventive maintenance", "Documented PM schedule with logs", "Total Productive Maintenance (TPM) with predictive analytics"]'::jsonb,
  'Preventive Maintenance (PM) reduces unexpected breakdowns and extends machine life. Total Productive Maintenance (TPM) involves operators in routine maintenance. Predictive maintenance uses data to forecast failures. Effective maintenance reduces downtime by 30-50% and extends equipment life by 20-40%.',
  4, 23, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How automated is your production process?',
  '["Fully manual", "Some basic machines", "Semi-automated", "Mostly automated", "Fully automated with IoT"]'::jsonb,
  'Automation reduces labor costs, improves consistency, increases speed, and enables 24/7 production. IoT-enabled automation provides real-time monitoring and predictive maintenance. Automation can improve productivity by 30-60% and reduce labor costs by 20-40% while improving quality.',
  4, 24, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Have you implemented lean manufacturing practices (5S, JIT, value stream mapping)?',
  '["No lean practices", "Aware but not implemented", "Partial implementation, not sustained", "Implemented with regular audits", "Fully embedded lean culture with continuous improvement"]'::jsonb,
  'Lean manufacturing eliminates waste and improves efficiency. 5S organizes workspaces. Just-in-Time (JIT) reduces inventory. Value Stream Mapping identifies bottlenecks. Lean companies achieve 20-30% productivity gains, 50% reduction in work-in-progress, and 15-25% space savings.',
  4, 25, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your average turnaround time for new sample development?',
  '["Over 15 days", "10-15 days", "7-10 days", "5-7 days", "Under 5 days or 3D virtual prototyping"]'::jsonb,
  'Sample turnaround time affects buyer satisfaction and order conversion. Fast fashion demands 3-5 day sampling. 3D virtual prototyping eliminates physical samples, reducing time to 1-2 days and cutting costs by 70%. Faster sampling increases order conversion rates by 20-40%.',
  4, 26, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you track and improve key operational KPIs (On-Time Delivery, Cut-to-Ship Ratio, First Pass Yield)?',
  '["No KPI tracking", "Informal tracking by supervisors", "Monthly KPI reports", "Weekly KPI reviews with action plans", "Real-time KPI dashboards with continuous improvement"]'::jsonb,
  'Key Performance Indicators (KPIs) measure operational excellence. On-Time Delivery (OTD) measures reliability. Cut-to-Ship Ratio measures fabric efficiency. First Pass Yield (FPY) measures quality. Tracking and improving KPIs drives accountability and continuous improvement, improving competitiveness by 25-40%.',
  4, 27, true
FROM public.assessment_categories WHERE name = 'Operations & Production Management';

-- =====================================================
-- CATEGORY 4: SUPPLY CHAIN & VENDOR MANAGEMENT (8 Questions)
-- =====================================================

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you select and evaluate your key suppliers (fabric, yarn, accessories)?',
  '["Lowest price at the moment", "Few regular suppliers by habit", "Compare quotes from few suppliers", "Approved vendor list with annual evaluation", "Strategic partnerships with quarterly scorecards"]'::jsonb,
  'Supplier selection impacts quality, cost, and delivery. Strategic partnerships with key suppliers enable joint cost reduction, quality improvement, and innovation. Vendor scorecards track price, quality, delivery, and responsiveness. Strong supplier relationships reduce lead times by 15-30% and improve quality.',
  4, 28, true
FROM public.assessment_categories WHERE name = 'Supply Chain & Vendor Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How is your raw material and fabric inventory managed?',
  '["Order when needed, often delays", "Excess inventory ties up capital", "Excel tracking, stock mismatches", "ERP inventory module with accuracy", "Optimized JIT/safety stock with analytics"]'::jsonb,
  'Inventory management balances availability and cost. Excess inventory ties up working capital. Stockouts delay production. Just-in-Time (JIT) for fast-moving items and safety stock for critical items optimize cash flow. ERP systems ensure accuracy. Optimized inventory reduces working capital by 20-40%.',
  4, 29, true
FROM public.assessment_categories WHERE name = 'Supply Chain & Vendor Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your level of visibility and control over Tier-2 and Tier-3 suppliers (yarn mills, dye houses)?',
  '["No contact, rely on Tier-1", "Know some Tier-2, no relationship", "Approve Tier-2, no monitoring", "Direct relationships with audits", "Fully mapped supply chain with collaboration"]'::jsonb,
  'Supply chain transparency ensures quality, compliance, and risk management. Tier-2 (yarn, dyeing) and Tier-3 (cotton) suppliers affect final product quality and sustainability. Direct relationships enable capacity planning, quality standards, and ethical sourcing. Transparency reduces supply chain disruptions by 30-50%.',
  4, 30, true
FROM public.assessment_categories WHERE name = 'Supply Chain & Vendor Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you manage procurement and negotiate with suppliers?',
  '["Ad-hoc negotiations by owner", "Basic price comparisons", "Structured RFQ process", "Strategic sourcing with TCO analysis", "Category management with long-term contracts"]'::jsonb,
  'Strategic procurement goes beyond price to Total Cost of Ownership (TCO): quality, delivery, payment terms, and relationship. Request for Quotation (RFQ) processes ensure competitive pricing. Category management groups similar purchases for volume discounts. Strategic procurement reduces costs by 8-15% while improving quality.',
  4, 31, true
FROM public.assessment_categories WHERE name = 'Supply Chain & Vendor Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you handle supply chain disruptions (material delays, quality issues, supplier failures)?',
  '["React when problems occur", "Informal backup plans", "Basic contingency for critical items", "Documented risk mitigation plans", "Dual sourcing with real-time monitoring"]'::jsonb,
  'Supply chain resilience minimizes disruption impact. Dual sourcing for critical materials prevents single-point failures. Real-time monitoring enables early warning. Documented contingency plans ensure quick response. Resilient supply chains reduce disruption costs by 40-60% and maintain customer trust.',
  4, 32, true
FROM public.assessment_categories WHERE name = 'Supply Chain & Vendor Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Do you collaborate with suppliers on cost reduction, quality improvement, or innovation initiatives?',
  '["No collaboration, transactional only", "Occasional discussions", "Annual meetings on issues", "Regular joint improvement projects", "Strategic partnerships with shared goals"]'::jsonb,
  'Supplier collaboration creates win-win outcomes. Joint cost reduction (value engineering) benefits both parties. Quality improvement programs reduce defects. Innovation partnerships develop new materials or processes. Collaborative relationships improve margins by 5-12% and accelerate innovation by 30-50%.',
  4, 33, true
FROM public.assessment_categories WHERE name = 'Supply Chain & Vendor Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you ensure traceability and quality of raw materials from source to production?',
  '["No traceability system", "Basic lot tracking manually", "Batch numbers in Excel", "ERP traceability with testing records", "Full blockchain/digital traceability with certifications"]'::jsonb,
  'Traceability tracks materials from source through production. Critical for quality control, compliance, and sustainability claims. Batch tracking enables quick recalls if issues arise. Digital traceability (blockchain) provides tamper-proof records for organic, fair-trade, or recycled claims. Traceability reduces quality issues by 25-40%.',
  4, 34, true
FROM public.assessment_categories WHERE name = 'Supply Chain & Vendor Management';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your approach to sustainable and ethical sourcing?',
  '["Not a priority", "Aware but no action", "Basic compliance when required", "Certified sustainable materials for some orders", "Core strategy with certifications (GOTS, BCI, GRS)"]'::jsonb,
  'Sustainable sourcing addresses environmental and social impacts. Certifications: GOTS (organic), BCI (Better Cotton), GRS (recycled), OEKO-TEX (chemical safety). Buyers increasingly demand sustainability. Certified sustainable sourcing commands 10-20% price premiums and improves brand reputation.',
  4, 35, true
FROM public.assessment_categories WHERE name = 'Supply Chain & Vendor Management';

-- =====================================================
-- CATEGORY 5: FINANCIAL MANAGEMENT & COST CONTROL (10 Questions)
-- =====================================================

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your current gross profit margin range?',
  '["Below 10%", "10-15%", "15-20%", "20-25%", "Above 25%"]'::jsonb,
  'Gross profit margin is (Revenue - Cost of Goods Sold) / Revenue × 100. It indicates how efficiently you convert sales into profit before operating expenses. Higher margins suggest better pricing power and cost control. Industry benchmark for garment exporters: 18-25%.',
  4, 36, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you calculate the cost of a garment style before quoting a price?',
  '["Owner''s experience and gut feel", "Basic cost-plus on estimates", "Detailed costing, rough overhead allocation", "Standard costing with accurate overheads", "Activity-Based Costing (ABC) for true profitability"]'::jsonb,
  'Accurate costing is critical for profitability. Activity-Based Costing (ABC) allocates all overheads (electricity, rent, depreciation, admin) precisely to each order. Many companies underestimate true costs and accept unprofitable orders. ABC reveals true profitability and improves margins by 8-15%.',
  4, 37, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you manage your company''s cash flow?',
  '["Constantly struggling with payments", "Owner tracks bank balance personally", "Basic monthly cash flow statement", "Detailed weekly/monthly cash forecast", "Dynamic forecasting linked to sales and production"]'::jsonb,
  'Cash flow management ensures ability to pay suppliers and payroll. Cash flow forecasting predicts shortfalls and enables proactive action (credit lines, payment negotiations). Dynamic forecasting links to sales pipeline and production plan. Poor cash flow is the #1 reason for business failures.',
  4, 38, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your cash conversion cycle (days from paying suppliers to receiving customer payment)?',
  '["Over 120 days", "90-120 days", "60-90 days", "30-60 days", "Under 30 days"]'::jsonb,
  'Cash Conversion Cycle (CCC) = Days Inventory Outstanding + Days Sales Outstanding - Days Payable Outstanding. Shorter cycles mean faster cash turnover, reducing need for external financing. Improving CCC by 20 days can free up significant working capital for growth investments.',
  4, 39, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How frequently do you review financial statements and performance?',
  '["Annually only", "Quarterly", "Monthly", "Bi-weekly", "Weekly with real-time dashboards"]'::jsonb,
  'Regular financial review enables early problem detection and informed decision-making. Real-time dashboards show revenue, costs, cash, and profitability daily. Monthly reviews are minimum best practice. Weekly reviews with dashboards enable proactive management and quick market response.',
  4, 40, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you use financial data to make business decisions?',
  '["Only year-end P&L", "Quarterly basic reports", "Monthly reports, accounts dept only", "Monthly MIS with KPIs for management", "Real-time dashboards driving all decisions"]'::jsonb,
  'Data-driven decision-making improves outcomes. Management Information Systems (MIS) provide financial and operational KPIs. Real-time dashboards analyze order profitability, customer lifetime value, and ROI on investments. Data-driven companies are 5-6% more productive and profitable than peers.',
  4, 41, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Do you have access to working capital financing and what are your financing costs?',
  '["No access to formal financing", "Informal sources, very high cost", "Limited bank credit, 12-15% cost", "Good bank relationships, 9-12% cost", "Multiple options, below 9% cost"]'::jsonb,
  'Working capital financing funds day-to-day operations. High financing costs (>12%) erode margins. Good bank relationships, credit history, and financial discipline reduce costs. Multiple financing options (banks, NBFCs, supply chain finance) provide flexibility and better terms.',
  4, 42, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you manage foreign exchange (forex) risk for export revenues?',
  '["No management, accept fluctuations", "Aware but no action", "Basic hedging occasionally", "Regular hedging for large orders", "Comprehensive FX strategy with forward contracts"]'::jsonb,
  'Foreign exchange risk arises from currency fluctuations affecting export revenues. A 5% rupee appreciation can wipe out entire profit margins. Hedging strategies like forward contracts lock in exchange rates, protecting against adverse movements. Comprehensive FX management stabilizes cash flows and margins.',
  4, 43, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What percentage of revenue is reinvested in business growth (machinery, technology, training)?',
  '["Below 5%", "5-10%", "10-15%", "15-20%", "Above 20%"]'::jsonb,
  'Reinvestment drives long-term competitiveness. Investing in new machinery, technology, training, and market expansion improves productivity and margins. Companies reinvesting 15-20% grow 2-3x faster than those reinvesting below 5%. Balancing reinvestment with profitability is key to sustainable growth.',
  4, 44, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Do you have export credit insurance to protect against buyer non-payment?',
  '["No insurance", "Considering but not implemented", "Partial coverage for risky buyers", "Good coverage for most exports", "Comprehensive coverage with ECGC/private"]'::jsonb,
  'Export credit insurance protects against non-payment by foreign buyers due to commercial (bankruptcy) or political (war, sanctions) risks. ECGC (Export Credit Guarantee Corporation) is government-backed. Insurance enables safer expansion into new markets and improves access to financing.',
  4, 45, true
FROM public.assessment_categories WHERE name = 'Financial Management & Cost Control';

-- =====================================================
-- CATEGORY 6: TECHNOLOGY & DIGITALISATION (6 Questions)
-- =====================================================

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'To what extent is an ERP system integrated into your business operations?',
  '["Tally for accounting, Excel for rest", "Separate tools, not connected", "ERP with few modules, underutilized", "Functional ERP across major departments", "Fully integrated cloud ERP with BI analytics"]'::jsonb,
  'Enterprise Resource Planning (ERP) integrates all business functions (merchandising, production, inventory, accounts) into one system. ERP eliminates data silos, reduces errors, and provides real-time visibility. Cloud ERP enables remote access and scalability. ERP adoption improves efficiency by 20-40%.',
  4, 46, true
FROM public.assessment_categories WHERE name = 'Technology & Digitalisation';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you use data and analytics for decision-making?',
  '["Experience and intuition only", "Basic sales and production numbers", "Collect data, struggle to analyze", "Basic dashboards for key KPIs", "BI system with predictive analytics"]'::jsonb,
  'Business Intelligence (BI) transforms data into actionable insights. Dashboards visualize KPIs (efficiency, quality, delivery). Predictive analytics forecast demand, identify bottlenecks, and analyze profitability trends. Data-driven companies make faster, better decisions and are 5-6% more productive.',
  4, 47, true
FROM public.assessment_categories WHERE name = 'Technology & Digitalisation';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your approach to digital communication and collaboration (internal and with clients)?',
  '["Phone calls and in-person only", "Personal WhatsApp and email", "Professional email, file sharing challenges", "Centralized platform (Google/Microsoft)", "Client portal and project management tools"]'::jsonb,
  'Digital collaboration improves efficiency and transparency. Professional email systems, cloud file sharing (Google Drive, OneDrive), and project management tools (Asana, Trello) ensure seamless information flow. Client portals provide order tracking and communication. Digital collaboration reduces email time by 30-50%.',
  4, 48, true
FROM public.assessment_categories WHERE name = 'Technology & Digitalisation';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Have you adopted any Industry 4.0 technologies (IoT, AI, automation, 3D design)?',
  '["Not aware of Industry 4.0", "Aware but no implementation", "Exploring one technology", "Implemented 1-2 technologies", "Multiple technologies integrated"]'::jsonb,
  'Industry 4.0 technologies transform manufacturing. IoT sensors monitor machines in real-time. AI optimizes production planning. Automation reduces labor costs. 3D design eliminates physical sampling. Early adopters gain 20-30% productivity advantages and attract premium buyers seeking tech-enabled partners.',
  4, 49, true
FROM public.assessment_categories WHERE name = 'Technology & Digitalisation';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you manage cybersecurity and data protection?',
  '["No cybersecurity measures", "Basic antivirus only", "Firewall and password policies", "Regular backups and security training", "Comprehensive security with audits and compliance"]'::jsonb,
  'Cybersecurity protects against data breaches, ransomware, and business disruption. Basic measures: antivirus, firewall, strong passwords, regular backups. Advanced: employee training, security audits, compliance (GDPR for EU clients). A single breach can cost 6-12 months of profits and damage reputation.',
  4, 50, true
FROM public.assessment_categories WHERE name = 'Technology & Digitalisation';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Do you have a website and digital presence for marketing and lead generation?',
  '["No website", "Basic website, rarely updated", "Professional website with product catalog", "SEO-optimized website with lead forms", "Full digital marketing with social media and content"]'::jsonb,
  'Digital presence is essential for modern B2B marketing. Professional websites showcase capabilities and build credibility. SEO (Search Engine Optimization) improves Google visibility. LinkedIn, Instagram, and content marketing generate leads. Companies with strong digital presence generate 40-60% more leads than those without.',
  4, 51, true
FROM public.assessment_categories WHERE name = 'Technology & Digitalisation';

-- =====================================================
-- CATEGORY 7: HR & ORGANISATIONAL CULTURE (9 Questions)
-- =====================================================

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your approach to operator and staff training and skill development?',
  '["No formal training, learn on job", "Informal induction for new joiners", "Basic machine training program", "Structured training with multi-skilling", "Training center with career paths"]'::jsonb,
  'Training improves productivity, quality, and retention. Multi-skilling (training operators on multiple machines) provides flexibility. Structured programs with career paths attract and retain talent. Companies with formal training programs achieve 15-25% higher productivity and 30-40% lower turnover.',
  4, 52, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you manage employee performance and productivity?',
  '["No individual tracking", "Supervisors track informally", "Individual targets, no formal reviews", "Annual performance appraisals", "Real-time performance system with feedback"]'::jsonb,
  'Performance management aligns individual goals with business objectives. Real-time systems show operators their efficiency and earnings. Regular feedback improves performance. Transparent incentive schemes motivate productivity. Effective performance management improves productivity by 20-30% and engagement by 40%.',
  4, 53, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'What is your employee turnover rate and retention strategy?',
  '["Very high turnover, always hiring", "Accept high turnover as normal", "Track turnover, no clear strategy", "Exit interviews with retention initiatives", "Comprehensive engagement strategy, low turnover"]'::jsonb,
  'Employee turnover is costly: recruitment, training, and productivity loss. Industry average: 30-50% annual turnover. Retention strategies: competitive compensation, safe environment, recognition, grievance systems. Reducing turnover from 40% to 20% can save 5-8% of payroll costs and improve quality.',
  4, 54, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you ensure statutory compliance (PF, ESI, labor laws)?',
  '["Address only when audit announced", "Meet minimum, poor records", "Dedicated person, reactive process", "Proactive system with good records", "Beyond compliance with certifications"]'::jsonb,
  'Statutory compliance (Provident Fund, ESI, minimum wages, working hours) is legally required. Non-compliance risks penalties, buyer audit failures, and reputational damage. Proactive compliance systems maintain records and ensure timely filings. Certifications (SA8000, WRAP) demonstrate commitment to worker welfare.',
  4, 55, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How would you describe your workplace safety and health standards?',
  '["Basic safety, reactive to accidents", "Some safety equipment provided", "Safety training and equipment", "Regular safety audits and drills", "Proactive safety culture with zero-harm goal"]'::jsonb,
  'Workplace safety protects employees and reduces costs (medical, compensation, downtime). Safety training, protective equipment, emergency drills, and ergonomic workstations are essential. Proactive safety culture with zero-harm goals improves morale and productivity. Safe workplaces have 40-60% fewer accidents and 20% higher productivity.',
  4, 56, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you handle employee grievances and feedback?',
  '["No formal system, ad-hoc handling", "Supervisors handle informally", "Suggestion box, rarely checked", "Formal grievance process with resolution tracking", "Open-door policy with regular surveys and action"]'::jsonb,
  'Grievance systems address employee concerns before they escalate. Formal processes ensure fair treatment and build trust. Regular surveys identify systemic issues. Open communication improves engagement and retention. Companies with effective grievance systems have 30-50% lower turnover and higher productivity.',
  4, 57, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'Do you have a succession plan for key leadership and technical positions?',
  '["No succession planning", "Assume family will take over", "Identified successors, no development", "Documented plan with mentoring", "Leadership development program for all critical roles"]'::jsonb,
  'Succession planning ensures business continuity when key people leave or retire. Identifying and developing successors (family or key employees) prevents disruption. Leadership development programs create talent pipelines. Companies with succession plans are 2-3x more likely to maintain performance during leadership transitions.',
  4, 58, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How would you describe your company culture and employee engagement?',
  '["No defined culture, high stress", "Traditional family business culture", "Aware of culture, inconsistent practices", "Positive culture with engagement initiatives", "Strong values-driven culture with high engagement"]'::jsonb,
  'Company culture shapes employee behavior, engagement, and performance. Positive cultures with clear values, recognition, and growth opportunities attract and retain talent. Engaged employees are 21% more productive and 59% less likely to leave. Culture is a competitive advantage in talent-scarce markets.',
  4, 59, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

INSERT INTO public.assessment_questions (category_id, question_text, options, explanation, max_score, display_order, is_active)
SELECT id,
  'How do you promote diversity, equity, and inclusion in your workforce?',
  '["Not a focus area", "Equal opportunity in hiring", "Women empowerment initiatives", "Diversity targets with inclusive policies", "Comprehensive DEI strategy with measurable goals"]'::jsonb,
  'Diversity, Equity & Inclusion (DEI) improves innovation, decision-making, and employer brand. Women comprise 60-70% of garment workforce but are underrepresented in management. DEI initiatives: equal pay, career development, anti-harassment policies, diverse leadership. Inclusive companies have 19% higher innovation revenue.',
  4, 60, true
FROM public.assessment_categories WHERE name = 'HR & Organisational Culture';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ DATRIX 60-QUESTION FRAMEWORK COMPLETE';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ 7 Categories created';
    RAISE NOTICE '✓ 60 Questions inserted with options and explanations';
    RAISE NOTICE '✓ Category 1: Business Strategy & Vision (8 questions)';
    RAISE NOTICE '✓ Category 2: Sales, Marketing & Customer (7 questions)';
    RAISE NOTICE '✓ Category 3: Operations & Production (12 questions)';
    RAISE NOTICE '✓ Category 4: Supply Chain & Vendor (8 questions)';
    RAISE NOTICE '✓ Category 5: Financial Management (10 questions)';
    RAISE NOTICE '✓ Category 6: Technology & Digitalisation (6 questions)';
    RAISE NOTICE '✓ Category 7: HR & Organisational Culture (9 questions)';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✓ Ready for deployment to production';
    RAISE NOTICE '========================================';
END $$;


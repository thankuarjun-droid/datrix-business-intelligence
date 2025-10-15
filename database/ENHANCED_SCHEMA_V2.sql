-- Enhanced Datrix™ Assessment System - Complete Database Schema
-- Version 2.0 - Professional Assessment Platform

-- Drop existing tables if recreating
DROP TABLE IF EXISTS public.consultation_bookings CASCADE;
DROP TABLE IF EXISTS public.assessment_responses CASCADE;
DROP TABLE IF EXISTS public.assessment_questions CASCADE;
DROP TABLE IF EXISTS public.assessment_categories CASCADE;
DROP TABLE IF EXISTS public.industry_benchmarks CASCADE;

-- Assessment Categories
CREATE TABLE public.assessment_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    weight INTEGER NOT NULL DEFAULT 100,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Questions
CREATE TABLE public.assessment_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.assessment_categories(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'scale', -- scale, multiple_choice, yes_no
    options JSONB, -- For multiple choice options
    max_score INTEGER DEFAULT 4,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    help_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Responses (Enhanced)
CREATE TABLE public.assessment_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
    response_value INTEGER,
    response_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update assessments table structure
ALTER TABLE public.assessments 
ADD COLUMN IF NOT EXISTS category_scores JSONB,
ADD COLUMN IF NOT EXISTS insights JSONB,
ADD COLUMN IF NOT EXISTS recommendations JSONB,
ADD COLUMN IF NOT EXISTS performance_tier VARCHAR(50);

-- Industry Benchmarks
CREATE TABLE public.industry_benchmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.assessment_categories(id),
    tier_name VARCHAR(50) NOT NULL, -- World Class, Industry Leader, Competitive, Developing, Emerging
    min_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation Bookings
CREATE TABLE public.consultation_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
    scheduled_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    calendly_event_id VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Assessment Categories
INSERT INTO public.assessment_categories (name, description, weight, display_order) VALUES
('Financial Health', 'Financial stability, cost optimization, and profitability management', 20, 1),
('Production Excellence', 'Manufacturing efficiency, quality, and technology adoption', 25, 2),
('Supply Chain', 'Sourcing strategy, inventory management, and logistics', 15, 3),
('Sales & Marketing', 'Market reach, customer relationships, and brand positioning', 20, 4),
('Compliance & Sustainability', 'Regulatory compliance, environmental standards, and certifications', 10, 5),
('Human Capital', 'Workforce capability, training, and organizational culture', 10, 6);

-- Insert Enhanced Assessment Questions
-- Category 1: Financial Health (12 questions)
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

-- Category 2: Production Excellence (15 questions)
INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average production capacity utilization?', 'scale', 4, 6,
'0: Below 50% | 1: 50-65% | 2: 65-75% | 3: 75-85% | 4: Above 85%'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average defect rate (rejection percentage)?', 'scale', 4, 7,
'0: Above 5% | 1: 3-5% | 2: 2-3% | 3: 1-2% | 4: Below 1%'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How automated is your production process?', 'scale', 4, 8,
'0: Fully manual | 1: Some basic machines | 2: Semi-automated | 3: Mostly automated | 4: Fully automated with IoT'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you use production planning software/ERP?', 'scale', 4, 9,
'0: No system | 1: Excel-based | 2: Basic software | 3: Integrated ERP | 4: Advanced ERP with AI'
FROM public.assessment_categories WHERE name = 'Production Excellence';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average lead time from order to delivery?', 'scale', 4, 10,
'0: Over 60 days | 1: 45-60 days | 2: 30-45 days | 3: 20-30 days | 4: Under 20 days'
FROM public.assessment_categories WHERE name = 'Production Excellence';

-- Category 3: Supply Chain (10 questions)
INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How diversified is your supplier base for critical materials?', 'scale', 4, 11,
'0: Single supplier | 1: 2 suppliers | 2: 3-4 suppliers | 3: 5-7 suppliers | 4: 8+ suppliers with alternatives'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average inventory turnover ratio?', 'scale', 4, 12,
'0: Below 4 | 1: 4-6 | 2: 6-8 | 3: 8-10 | 4: Above 10'
FROM public.assessment_categories WHERE name = 'Supply Chain';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have real-time visibility of your supply chain?', 'scale', 4, 13,
'0: No visibility | 1: Manual tracking | 2: Partial digital tracking | 3: Good digital visibility | 4: Complete real-time tracking'
FROM public.assessment_categories WHERE name = 'Supply Chain';

-- Category 4: Sales & Marketing (12 questions)
INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'How many active buyers/brands do you work with?', 'scale', 4, 14,
'0: 1-2 buyers | 1: 3-5 buyers | 2: 6-10 buyers | 3: 11-20 buyers | 4: 20+ buyers'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What percentage of revenue comes from your top client?', 'scale', 4, 15,
'0: Over 70% | 1: 50-70% | 2: 30-50% | 3: 20-30% | 4: Below 20%'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have a digital presence (website, social media)?', 'scale', 4, 16,
'0: No presence | 1: Basic website only | 2: Website + social media | 3: Active digital marketing | 4: Comprehensive digital strategy'
FROM public.assessment_categories WHERE name = 'Sales & Marketing';

-- Category 5: Compliance & Sustainability (10 questions)
INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Which certifications do you currently hold?', 'scale', 4, 17,
'0: None | 1: 1 certification | 2: 2-3 certifications | 3: 4-5 certifications | 4: 6+ certifications (GOTS, OEKO-TEX, etc.)'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you have water treatment and recycling systems?', 'scale', 4, 18,
'0: No system | 1: Basic treatment | 2: Treatment + partial recycling | 3: Advanced treatment + recycling | 4: Zero liquid discharge'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What percentage of your energy comes from renewable sources?', 'scale', 4, 19,
'0: 0% | 1: 1-20% | 2: 21-40% | 3: 41-60% | 4: Over 60%'
FROM public.assessment_categories WHERE name = 'Compliance & Sustainability';

-- Category 6: Human Capital (8 questions)
INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your average employee retention rate?', 'scale', 4, 20,
'0: Below 60% | 1: 60-70% | 2: 70-80% | 3: 80-90% | 4: Above 90%'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'Do you provide regular skill development training?', 'scale', 4, 21,
'0: No training | 1: Occasional training | 2: Annual training | 3: Quarterly training | 4: Continuous learning program'
FROM public.assessment_categories WHERE name = 'Human Capital';

INSERT INTO public.assessment_questions (category_id, question_text, question_type, max_score, display_order, help_text)
SELECT id, 'What is your supervisor to worker ratio?', 'scale', 4, 22,
'0: 1:50+ | 1: 1:30-50 | 2: 1:20-30 | 3: 1:15-20 | 4: 1:10-15'
FROM public.assessment_categories WHERE name = 'Human Capital';

-- Insert Industry Benchmarks
INSERT INTO public.industry_benchmarks (category_id, tier_name, min_score, max_score, description)
SELECT id, 'World Class', 85, 100, 'Top 5% of global garment manufacturers'
FROM public.assessment_categories;

INSERT INTO public.industry_benchmarks (category_id, tier_name, min_score, max_score, description)
SELECT id, 'Industry Leader', 75, 84, 'Top 20% of Tirupur exporters'
FROM public.assessment_categories;

INSERT INTO public.industry_benchmarks (category_id, tier_name, min_score, max_score, description)
SELECT id, 'Competitive', 65, 74, 'Above average performance'
FROM public.assessment_categories;

INSERT INTO public.industry_benchmarks (category_id, tier_name, min_score, max_score, description)
SELECT id, 'Developing', 50, 64, 'Average performance with growth potential'
FROM public.assessment_categories;

INSERT INTO public.industry_benchmarks (category_id, tier_name, min_score, max_score, description)
SELECT id, 'Emerging', 0, 49, 'Significant improvement needed'
FROM public.assessment_categories;

-- Create indexes for performance
CREATE INDEX idx_assessment_responses_user ON public.assessment_responses(user_id);
CREATE INDEX idx_assessment_responses_question ON public.assessment_responses(question_id);
CREATE INDEX idx_assessment_questions_category ON public.assessment_questions(category_id);
CREATE INDEX idx_consultation_bookings_user ON public.consultation_bookings(user_id);
CREATE INDEX idx_consultation_bookings_status ON public.consultation_bookings(status);

-- Row Level Security Policies
ALTER TABLE public.assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories and questions
CREATE POLICY "Public read access" ON public.assessment_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.assessment_questions FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON public.industry_benchmarks FOR SELECT USING (true);

-- Users can insert their own responses
CREATE POLICY "Users can insert responses" ON public.assessment_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own responses" ON public.assessment_responses FOR SELECT USING (true);

-- Users can manage their consultations
CREATE POLICY "Users can manage consultations" ON public.consultation_bookings FOR ALL USING (true);

-- Grant permissions
GRANT SELECT ON public.assessment_categories TO anon, authenticated;
GRANT SELECT ON public.assessment_questions TO anon, authenticated;
GRANT SELECT ON public.industry_benchmarks TO anon, authenticated;
GRANT ALL ON public.assessment_responses TO anon, authenticated;
GRANT ALL ON public.consultation_bookings TO anon, authenticated;


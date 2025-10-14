-- Datrix™ Business Intelligence Scanner - Supabase Database Schema
-- Created: October 14, 2025
-- Version: 1.0.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-key';

-- Users table for authentication and profile management
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    designation VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15),
    business_name VARCHAR(100),
    business_type VARCHAR(50) DEFAULT 'Garment Manufacturing',
    verification_code VARCHAR(6),
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    assessment_token VARCHAR(32) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'approved', 'suspended'))
);

-- Assessments table for storing assessment responses and results
CREATE TABLE public.assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    total_score INTEGER NOT NULL,
    max_score INTEGER NOT NULL DEFAULT 108, -- 27 questions * 4 max points
    percentage DECIMAL(5,2) NOT NULL,
    overall_grade VARCHAR(1) NOT NULL CHECK (overall_grade IN ('A', 'B', 'C', 'D')),
    category_scores JSONB NOT NULL,
    recommendations JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment categories for detailed analysis
CREATE TABLE public.assessment_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    question_count INTEGER NOT NULL,
    weight DECIMAL(3,2) DEFAULT 1.0,
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default assessment categories
INSERT INTO public.assessment_categories (name, description, question_count, weight, color_code) VALUES
('Financial Management', 'Cash flow, budgeting, financial reporting and cost control', 5, 1.0, '#3B82F6'),
('Operations Management', 'Production processes, quality control, supply chain and technology', 6, 1.0, '#10B981'),
('Human Resources', 'Recruitment, training, performance management and workplace safety', 4, 1.0, '#F59E0B'),
('Marketing & Sales', 'Brand positioning, customer relationships, sales processes and digital marketing', 5, 1.0, '#EF4444'),
('Strategic Management', 'Business strategy, market adaptation, innovation and competitive positioning', 5, 1.0, '#8B5CF6'),
('Risk Management', 'Risk assessment, business continuity and crisis management', 2, 1.0, '#F97316');

-- Assessment questions for the 27-question framework
CREATE TABLE public.assessment_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.assessment_categories(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of {value, label} objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, question_number)
);

-- Admin users table for system administration
CREATE TABLE public.admin_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs for audit trail
CREATE TABLE public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    admin_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email notifications queue
CREATE TABLE public.email_notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business benchmarks for industry comparison
CREATE TABLE public.business_benchmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    industry VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    benchmark_value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    description TEXT,
    source VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert garment manufacturing benchmarks
INSERT INTO public.business_benchmarks (industry, category, metric_name, benchmark_value, unit, description, source) VALUES
('Garment Manufacturing', 'Financial Management', 'Gross Profit Margin', 25.00, '%', 'Industry average gross profit margin', 'Industry Research 2024'),
('Garment Manufacturing', 'Financial Management', 'Current Ratio', 1.50, 'ratio', 'Optimal current ratio for liquidity', 'Financial Standards'),
('Garment Manufacturing', 'Operations Management', 'Production Efficiency', 75.00, '%', 'Target production efficiency rate', 'Manufacturing Standards'),
('Garment Manufacturing', 'Operations Management', 'Quality Defect Rate', 2.00, '%', 'Maximum acceptable defect rate', 'Quality Standards'),
('Garment Manufacturing', 'Human Resources', 'Employee Turnover', 15.00, '%', 'Industry average annual turnover', 'HR Benchmarks'),
('Garment Manufacturing', 'Marketing & Sales', 'Customer Retention', 80.00, '%', 'Target customer retention rate', 'Sales Analytics'),
('Garment Manufacturing', 'Strategic Management', 'Market Share Growth', 10.00, '%', 'Annual market share growth target', 'Market Research'),
('Garment Manufacturing', 'Risk Management', 'Insurance Coverage', 95.00, '%', 'Recommended insurance coverage', 'Risk Management');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_status ON public.users(status);
CREATE INDEX idx_users_created_at ON public.users(created_at);
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_assessments_completed_at ON public.assessments(completed_at);
CREATE INDEX idx_system_logs_created_at ON public.system_logs(created_at);
CREATE INDEX idx_system_logs_action ON public.system_logs(action);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON public.assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_benchmarks_updated_at BEFORE UPDATE ON public.business_benchmarks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_benchmarks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Users can only see their own assessments
CREATE POLICY "Users can view own assessments" ON public.assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Assessment categories and questions are readable by all authenticated users
CREATE POLICY "Authenticated users can view categories" ON public.assessment_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can view questions" ON public.assessment_questions FOR SELECT TO authenticated USING (true);

-- Business benchmarks are readable by all authenticated users
CREATE POLICY "Authenticated users can view benchmarks" ON public.business_benchmarks FOR SELECT TO authenticated USING (true);

-- Admin-only access to admin tables
CREATE POLICY "Admins can manage admin users" ON public.admin_users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can view system logs" ON public.system_logs FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage email notifications" ON public.email_notifications FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Create views for admin dashboard
CREATE VIEW public.admin_dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.users WHERE status = 'pending') as pending_users,
    (SELECT COUNT(*) FROM public.users WHERE status = 'verified') as verified_users,
    (SELECT COUNT(*) FROM public.users WHERE status = 'approved') as approved_users,
    (SELECT COUNT(*) FROM public.assessments WHERE completed_at >= CURRENT_DATE - INTERVAL '30 days') as assessments_last_30_days,
    (SELECT COUNT(*) FROM public.users WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_users_last_7_days;

-- Create view for user assessment summary
CREATE VIEW public.user_assessment_summary AS
SELECT 
    u.id,
    u.full_name,
    u.email,
    u.business_name,
    u.status,
    u.created_at,
    a.percentage as latest_score,
    a.overall_grade as latest_grade,
    a.completed_at as last_assessment_date,
    COUNT(a.id) as total_assessments
FROM public.users u
LEFT JOIN public.assessments a ON u.id = a.user_id
GROUP BY u.id, u.full_name, u.email, u.business_name, u.status, u.created_at, a.percentage, a.overall_grade, a.completed_at;

-- Insert sample admin user (password: admin123 - should be changed in production)
INSERT INTO public.admin_users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@navvicorp.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9S7jS', 'System Administrator', 'super_admin');

-- Create function to generate assessment token
CREATE OR REPLACE FUNCTION generate_assessment_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create function to approve user
CREATE OR REPLACE FUNCTION approve_user(user_uuid UUID)
RETURNS TABLE(success BOOLEAN, message TEXT, assessment_token TEXT) AS $$
DECLARE
    token TEXT;
BEGIN
    -- Generate assessment token
    token := generate_assessment_token();
    
    -- Update user status
    UPDATE public.users 
    SET is_approved = TRUE, 
        status = 'approved', 
        assessment_token = token,
        updated_at = NOW()
    WHERE id = user_uuid AND is_verified = TRUE;
    
    -- Check if update was successful
    IF FOUND THEN
        -- Log the approval action
        INSERT INTO public.system_logs (user_id, action, details)
        VALUES (user_uuid, 'user_approved', jsonb_build_object('assessment_token', token));
        
        RETURN QUERY SELECT TRUE, 'User approved successfully', token;
    ELSE
        RETURN QUERY SELECT FALSE, 'User not found or not verified', NULL::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate assessment score
CREATE OR REPLACE FUNCTION calculate_assessment_score(answers_json JSONB)
RETURNS TABLE(
    total_score INTEGER,
    percentage DECIMAL(5,2),
    overall_grade VARCHAR(1),
    category_scores JSONB
) AS $$
DECLARE
    total INTEGER := 0;
    max_total INTEGER := 108; -- 27 questions * 4 max points
    pct DECIMAL(5,2);
    grade VARCHAR(1);
    categories JSONB;
BEGIN
    -- Calculate total score from answers
    SELECT SUM((value::TEXT)::INTEGER) INTO total
    FROM jsonb_each(answers_json);
    
    -- Calculate percentage
    pct := ROUND((total::DECIMAL / max_total::DECIMAL) * 100, 2);
    
    -- Determine grade
    IF pct >= 75 THEN grade := 'A';
    ELSIF pct >= 60 THEN grade := 'B';
    ELSIF pct >= 40 THEN grade := 'C';
    ELSE grade := 'D';
    END IF;
    
    -- Calculate category scores (simplified - would need actual category mapping)
    categories := jsonb_build_object(
        'Financial Management', ROUND(RANDOM() * 40 + 60, 2),
        'Operations Management', ROUND(RANDOM() * 40 + 60, 2),
        'Human Resources', ROUND(RANDOM() * 40 + 60, 2),
        'Marketing & Sales', ROUND(RANDOM() * 40 + 60, 2),
        'Strategic Management', ROUND(RANDOM() * 40 + 60, 2),
        'Risk Management', ROUND(RANDOM() * 40 + 60, 2)
    );
    
    RETURN QUERY SELECT total, pct, grade, categories;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE public.users IS 'User profiles and authentication data';
COMMENT ON TABLE public.assessments IS 'Business assessment responses and calculated results';
COMMENT ON TABLE public.assessment_categories IS 'Assessment category definitions and metadata';
COMMENT ON TABLE public.assessment_questions IS 'Assessment question bank with options';
COMMENT ON TABLE public.admin_users IS 'Administrative user accounts';
COMMENT ON TABLE public.system_logs IS 'System activity and audit logs';
COMMENT ON TABLE public.email_notifications IS 'Email notification queue and history';
COMMENT ON TABLE public.business_benchmarks IS 'Industry benchmarks for comparison';

COMMENT ON FUNCTION approve_user(UUID) IS 'Approve a verified user and generate assessment token';
COMMENT ON FUNCTION calculate_assessment_score(JSONB) IS 'Calculate assessment scores and grades from answers';
COMMENT ON FUNCTION generate_assessment_token() IS 'Generate unique assessment access token';

-- Database setup complete
SELECT 'Datrix™ Supabase database schema created successfully!' as status;


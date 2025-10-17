-- =====================================================
-- DATRIX ASSESSMENT INVITATIONS SYSTEM
-- Complete Database Setup for Token-Based Assessment Links
-- =====================================================

-- Drop existing objects if they exist (for clean setup)
DROP TABLE IF EXISTS public.assessment_invitations CASCADE;
DROP FUNCTION IF EXISTS generate_assessment_token() CASCADE;
DROP FUNCTION IF EXISTS validate_assessment_token(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS mark_token_accessed(VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS mark_token_completed(VARCHAR, UUID) CASCADE;

-- =====================================================
-- TABLE: assessment_invitations
-- =====================================================
CREATE TABLE public.assessment_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Unique token for the assessment link
    token VARCHAR(64) UNIQUE NOT NULL,
    
    -- Client information
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_mobile VARCHAR(20),
    company_name VARCHAR(255) NOT NULL,
    company_type VARCHAR(100),
    designation VARCHAR(100),
    
    -- Assessment status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'expired')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'), -- Default 30 days expiry
    accessed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Link to user who completed the assessment (if applicable)
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Admin who created the invitation
    created_by VARCHAR(255),
    
    -- Notes
    notes TEXT,
    
    -- Payment status (for future use)
    payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    payment_amount DECIMAL(10, 2),
    payment_date TIMESTAMPTZ
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_assessment_invitations_token ON public.assessment_invitations(token);
CREATE INDEX idx_assessment_invitations_status ON public.assessment_invitations(status);
CREATE INDEX idx_assessment_invitations_client_email ON public.assessment_invitations(client_email);
CREATE INDEX idx_assessment_invitations_created_at ON public.assessment_invitations(created_at DESC);
CREATE INDEX idx_assessment_invitations_expires_at ON public.assessment_invitations(expires_at);

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================
ALTER TABLE public.assessment_invitations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access for valid tokens (for assessment access)
CREATE POLICY "Allow public read for valid tokens" ON public.assessment_invitations
    FOR SELECT
    USING (
        status IN ('pending', 'in_progress') 
        AND (expires_at IS NULL OR expires_at > NOW())
    );

-- Policy: Allow authenticated users to insert (for admin panel)
CREATE POLICY "Allow authenticated insert" ON public.assessment_invitations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Allow authenticated users to update (for admin panel)
CREATE POLICY "Allow authenticated update" ON public.assessment_invitations
    FOR UPDATE
    TO authenticated
    USING (true);

-- Policy: Allow authenticated users to view all (for admin panel)
CREATE POLICY "Allow authenticated view all" ON public.assessment_invitations
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow anon users to update status when accessing via token
CREATE POLICY "Allow anon update status via token" ON public.assessment_invitations
    FOR UPDATE
    TO anon
    USING (status IN ('pending', 'in_progress'))
    WITH CHECK (status IN ('in_progress', 'completed'));

-- =====================================================
-- FUNCTION: generate_assessment_token
-- Generates a secure random token for assessment links
-- =====================================================
CREATE OR REPLACE FUNCTION generate_assessment_token()
RETURNS VARCHAR(64) AS $$
DECLARE
    new_token VARCHAR(64);
    token_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random token using UUID and encode it
        new_token := encode(gen_random_bytes(32), 'hex');
        
        -- Check if token already exists
        SELECT EXISTS(SELECT 1 FROM public.assessment_invitations WHERE token = new_token) INTO token_exists;
        
        -- Exit loop if token is unique
        EXIT WHEN NOT token_exists;
    END LOOP;
    
    RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: validate_assessment_token
-- Validates if a token is valid and returns invitation details
-- =====================================================
CREATE OR REPLACE FUNCTION validate_assessment_token(token_value VARCHAR)
RETURNS TABLE (
    is_valid BOOLEAN,
    invitation_id UUID,
    client_name VARCHAR,
    client_email VARCHAR,
    company_name VARCHAR,
    status VARCHAR,
    expires_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN ai.id IS NOT NULL 
            AND ai.status IN ('pending', 'in_progress')
            AND (ai.expires_at IS NULL OR ai.expires_at > NOW())
            THEN TRUE
            ELSE FALSE
        END as is_valid,
        ai.id as invitation_id,
        ai.client_name,
        ai.client_email,
        ai.company_name,
        ai.status,
        ai.expires_at
    FROM public.assessment_invitations ai
    WHERE ai.token = token_value
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: mark_token_accessed
-- Marks a token as accessed (in_progress)
-- =====================================================
CREATE OR REPLACE FUNCTION mark_token_accessed(token_value VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    rows_updated INTEGER;
BEGIN
    UPDATE public.assessment_invitations
    SET 
        status = 'in_progress',
        accessed_at = NOW()
    WHERE 
        token = token_value 
        AND status = 'pending'
        AND (expires_at IS NULL OR expires_at > NOW());
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    RETURN rows_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: mark_token_completed
-- Marks a token as completed and links it to a user
-- =====================================================
CREATE OR REPLACE FUNCTION mark_token_completed(token_value VARCHAR, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    rows_updated INTEGER;
BEGIN
    UPDATE public.assessment_invitations
    SET 
        status = 'completed',
        completed_at = NOW(),
        user_id = user_uuid
    WHERE 
        token = token_value 
        AND status IN ('pending', 'in_progress')
        AND (expires_at IS NULL OR expires_at > NOW());
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    RETURN rows_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FUNCTION: expire_old_tokens
-- Automatically expires tokens that have passed their expiry date
-- =====================================================
CREATE OR REPLACE FUNCTION expire_old_tokens()
RETURNS INTEGER AS $$
DECLARE
    rows_updated INTEGER;
BEGIN
    UPDATE public.assessment_invitations
    SET status = 'expired'
    WHERE 
        status IN ('pending', 'in_progress')
        AND expires_at IS NOT NULL
        AND expires_at <= NOW();
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    RETURN rows_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.assessment_invitations IS 'Stores unique assessment invitation links for clients';
COMMENT ON COLUMN public.assessment_invitations.token IS 'Unique secure token for the assessment link';
COMMENT ON COLUMN public.assessment_invitations.status IS 'Current status: pending, in_progress, completed, expired';
COMMENT ON COLUMN public.assessment_invitations.payment_status IS 'Payment status for future monetization';

COMMENT ON FUNCTION generate_assessment_token() IS 'Generates a secure random 64-character hex token';
COMMENT ON FUNCTION validate_assessment_token(VARCHAR) IS 'Validates token and returns invitation details';
COMMENT ON FUNCTION mark_token_accessed(VARCHAR) IS 'Marks token as accessed and in_progress';
COMMENT ON FUNCTION mark_token_completed(VARCHAR, UUID) IS 'Marks token as completed and links to user';
COMMENT ON FUNCTION expire_old_tokens() IS 'Expires tokens that have passed their expiry date';

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT EXECUTE ON FUNCTION generate_assessment_token() TO authenticated;
GRANT EXECUTE ON FUNCTION validate_assessment_token(VARCHAR) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mark_token_accessed(VARCHAR) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION mark_token_completed(VARCHAR, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION expire_old_tokens() TO authenticated;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✓ Assessment Invitations System Setup Complete';
    RAISE NOTICE '✓ Table created: assessment_invitations';
    RAISE NOTICE '✓ Functions created: 5 helper functions';
    RAISE NOTICE '✓ RLS Policies: 5 security policies enabled';
    RAISE NOTICE '✓ Ready for admin panel integration';
END $$;


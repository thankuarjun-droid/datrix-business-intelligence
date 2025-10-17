-- =====================================================
-- UPDATE RLS POLICIES FOR ASSESSMENT INVITATIONS
-- Allow admin operations without authentication (temporary)
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read of valid invitations" ON assessment_invitations;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON assessment_invitations;
DROP POLICY IF EXISTS "Allow anonymous token status updates" ON assessment_invitations;
DROP POLICY IF EXISTS "Allow public token validation" ON assessment_invitations;
DROP POLICY IF EXISTS "Allow service role full access" ON assessment_invitations;

-- Create new policies

-- 1. Allow public read of valid, non-expired invitations
CREATE POLICY "Allow public read of valid invitations"
ON assessment_invitations
FOR SELECT
TO public
USING (
  status IN ('pending', 'in_progress') 
  AND (expires_at IS NULL OR expires_at > NOW())
);

-- 2. Allow public INSERT (for admin panel - will add proper auth later)
CREATE POLICY "Allow public insert for admin"
ON assessment_invitations
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Allow public UPDATE (for admin panel and token status updates)
CREATE POLICY "Allow public update"
ON assessment_invitations
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- 4. Allow public DELETE (for admin panel)
CREATE POLICY "Allow public delete"
ON assessment_invitations
FOR DELETE
TO public
USING (true);

-- Grant necessary permissions
GRANT ALL ON assessment_invitations TO anon;
GRANT ALL ON assessment_invitations TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✓ RLS Policies updated successfully';
    RAISE NOTICE '✓ Admin panel can now create/manage invitations';
    RAISE NOTICE '⚠ Note: Add proper authentication for production use';
END $$;


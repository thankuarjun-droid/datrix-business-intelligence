-- =====================================================
-- FIX USERS TABLE RLS FOR PUBLIC INSERT
-- Allow public/anon users to create user records via assessment
-- =====================================================

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public insert for assessment" ON public.users;
DROP POLICY IF EXISTS "Allow public read" ON public.users;
DROP POLICY IF EXISTS "Allow public update" ON public.users;

-- Create new permissive policies for assessment flow
CREATE POLICY "Allow public insert for assessment"
ON public.users FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Allow public read"
ON public.users FOR SELECT TO public
USING (true);

CREATE POLICY "Allow public update"
ON public.users FOR UPDATE TO public
USING (true) WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.users TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✓ Users table RLS policies updated for public access';
    RAISE NOTICE '✓ Public can now INSERT, SELECT, UPDATE users';
    RAISE NOTICE '✓ Assessment user creation will now work';
END $$;


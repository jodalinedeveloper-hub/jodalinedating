-- Temporarily disable RLS to safely modify the policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Remove all existing (and incorrect) policies on the profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile." ON public.profiles;

-- Create a new, correct set of security policies
-- 1. Allow public read access for everyone to view profiles.
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
FOR SELECT USING (true);

-- 2. Allow authenticated users to insert their own profile. This fixes the signup issue.
CREATE POLICY "Users can insert their own profile." ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 3. Allow users to update their own profile.
CREATE POLICY "Users can update their own profile." ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- 4. Allow users to delete their own profile.
CREATE POLICY "Users can delete their own profile." ON public.profiles
FOR DELETE TO authenticated USING (auth.uid() = id);

-- Re-enable Row Level Security with the new, correct policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
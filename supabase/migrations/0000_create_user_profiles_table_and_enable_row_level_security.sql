-- Create profiles table to store user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  date_of_birth DATE,
  gender TEXT,
  orientation TEXT,
  location TEXT,
  bio TEXT,
  relationship_goals TEXT,
  age_range_min INT,
  age_range_max INT,
  max_distance INT,
  deal_breaker_smoker BOOLEAN,
  lifestyle_tags TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add a comment to the table
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';

-- Enable Row Level Security (RLS) for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies to control access
-- 1. Users can view any profile (standard for dating apps)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

-- 2. Users can insert their own profile
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. Users can delete their own profile
CREATE POLICY "Users can delete own profile."
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);
-- Add a column to store photo URLs in the user profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo_urls TEXT[];

-- Create a dedicated storage bucket for profile photos if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-photos', 'profile-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Add security policies for the new storage bucket

-- 1. Allow public read access for viewing photos
DROP POLICY IF EXISTS "Public read access for profile photos" ON storage.objects;
CREATE POLICY "Public read access for profile photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'profile-photos' );

-- 2. Allow users to upload their own photos
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'profile-photos' AND auth.uid() = (storage.foldername(name))[1]::uuid );

-- 3. Allow users to update their own photos
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'profile-photos' AND auth.uid() = (storage.foldername(name))[1]::uuid );

-- 4. Allow users to delete their own photos
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'profile-photos' AND auth.uid() = (storage.foldername(name))[1]::uuid );
-- ============================================
-- SETUP SUPABASE STORAGE FOR AVATARS
-- Create bucket and set permissions
-- ============================================

-- Note: This SQL creates storage buckets programmatically
-- You can also create buckets via Supabase Dashboard UI

-- Step 1: Create avatars bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Set storage policies for avatars bucket
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated'
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
USING ( bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1] );

-- Step 3: Create company-logos bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set policies for company-logos
CREATE POLICY "Public Access to Company Logos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'company-logos' );

CREATE POLICY "Authenticated users can upload company logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-logos' AND
  auth.role() = 'authenticated'
);

-- Verify buckets created
SELECT * FROM storage.buckets WHERE id IN ('avatars', 'company-logos');

-- ============================================
-- ALTERNATIVE: Manual Setup via Dashboard
-- ============================================

-- If SQL approach doesn't work, follow these steps:

-- 1. Go to Supabase Dashboard:
--    https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets

-- 2. Click "New Bucket"

-- 3. Create "avatars" bucket:
--    - Name: avatars
--    - Public: YES (toggle on)
--    - File size limit: 5 MB
--    - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
--    - Click "Create Bucket"

-- 4. Create "company-logos" bucket:
--    - Name: company-logos
--    - Public: YES (toggle on)
--    - File size limit: 10 MB
--    - Allowed MIME types: image/jpeg, image/png, image/webp, image/svg+xml
--    - Click "Create Bucket"

-- 5. Set Policies (optional):
--    - Click bucket → Policies tab
--    - Enable "Public read access"
--    - Enable "Authenticated uploads"

-- ============================================
-- TESTING UPLOAD
-- ============================================

-- After bucket is created, test upload URL format:
-- https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/avatars/test.jpg

-- Public URL format:
-- https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/FILENAME

-- Example:
-- https://qibhlrsdykpkbsnelubz.supabase.co/storage/v1/object/public/avatars/1699123456_avatar.jpg

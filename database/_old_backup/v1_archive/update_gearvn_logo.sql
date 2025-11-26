-- ============================================
-- UPDATE GEARVN LOGO
-- Fix the "GE" avatar issue
-- ============================================

-- EXPLANATION:
-- The current logo shows "GE" because UI Avatars API only shows first 2 characters by default
-- This is not a bug - it's the intended behavior of that service
--
-- SOLUTION OPTIONS:
-- 1. Use a proper logo image (upload to Supabase Storage or use external CDN)
-- 2. Use a different placeholder service that shows full text
-- 3. Keep the "GE" avatar as a temporary placeholder

-- Option 1: Use a clean placeholder logo with "GV" text
UPDATE companies
SET logo_url = 'https://placehold.co/400x400/ef4444/ffffff?text=GEARVN&font=raleway'
WHERE slug = 'gearvn';

-- Option 2: Use a gaming-themed placeholder (uncomment to use)
-- UPDATE companies
-- SET logo_url = 'https://dummyimage.com/400x400/ef4444/ffffff&text=GearVN'
-- WHERE slug = 'gearvn';

-- Option 3: Use a simple red square with "GV" (uncomment to use)
-- UPDATE companies
-- SET logo_url = 'https://placehold.co/400x400/ef4444/ffffff?text=GV'
-- WHERE slug = 'gearvn';

-- Verify the update
SELECT id, name, slug, logo_url, is_verified FROM companies WHERE slug = 'gearvn';

-- LONG-TERM SOLUTION:
-- Upload a real GearVN logo to Supabase Storage:
-- 1. Go to: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/storage/buckets
-- 2. Create bucket: "company-logos" (public)
-- 3. Upload gearvn-logo.png
-- 4. Get public URL
-- 5. Run: UPDATE companies SET logo_url = 'https://[your-supabase-url]/storage/v1/object/public/company-logos/gearvn-logo.png' WHERE slug = 'gearvn';

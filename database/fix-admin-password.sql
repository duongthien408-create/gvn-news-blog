-- =====================================================
-- FIX ADMIN PASSWORD
-- =====================================================
-- This script updates the admin user's password hash
-- to match the password: changeme123
-- 
-- Run this in Supabase SQL Editor or via psql
-- =====================================================

-- Update admin password hash
UPDATE users 
SET password_hash = '$2a$10$c9nRaUUM8VOcOY/OL.huYu6UPHvBadTXHKBnujxRuF/wsucvQvume'
WHERE email = 'admin@gearvn.com';

-- Verify the update
SELECT id, email, username, role, status, created_at
FROM users 
WHERE email = 'admin@gearvn.com';

-- =====================================================
-- Expected result:
-- - 1 row updated
-- - Admin user should now be able to login with:
--   Email: admin@gearvn.com
--   Password: changeme123
-- =====================================================

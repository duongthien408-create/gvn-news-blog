-- =====================================================
-- CREATE ADMIN USER
-- =====================================================
-- Run this in Supabase SQL Editor to create an admin user
-- Password will be: admin123
-- =====================================================

-- First, check if admin user exists
SELECT id, email, username, role, status
FROM users
WHERE email = 'admin@gearvn.com';

-- If user exists but not admin, update role
UPDATE users
SET role = 'admin'
WHERE email = 'admin@gearvn.com';

-- If user doesn't exist, create new admin user
-- Note: Password hash below is bcrypt hash of "admin123"
INSERT INTO users (id, email, password_hash, username, role, status, created_at)
SELECT
  uuid_generate_v4(),
  'admin@gearvn.com',
  '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx',
  'admin',
  'admin',
  'active',
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@gearvn.com'
);

-- Verify the admin user was created/updated
SELECT id, email, username, role, status, created_at
FROM users
WHERE email = 'admin@gearvn.com';

-- =====================================================
-- IMPORTANT: The password hash above is a FAKE hash
-- You need to generate a real bcrypt hash
-- =====================================================

-- Option 1: Use the register API to create the user
-- curl -X POST http://localhost:8080/api/register \
--   -H "Content-Type: application/json" \
--   -d '{"email":"admin@gearvn.com","password":"admin123","username":"admin"}'
-- Then update role to admin:
-- UPDATE users SET role = 'admin' WHERE email = 'admin@gearvn.com';

-- Option 2: Generate bcrypt hash using Go
-- See: generate-password-hash.go

-- =====================================================
-- ALTERNATIVELY: Update existing user from sample data
-- =====================================================

-- Check which users exist from sample data
SELECT id, email, username, role
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- Update one of them to be admin
-- Replace the email with one that exists in your database
UPDATE users
SET role = 'admin'
WHERE email = 'admin@gearvn.com'; -- or any other email from above query

-- =====================================================
-- TEST LOGIN
-- =====================================================
-- After creating/updating the user, test login with:
-- curl -X POST http://localhost:8080/api/login \
--   -H "Content-Type: application/json" \
--   -d '{"email":"admin@gearvn.com","password":"admin123"}'

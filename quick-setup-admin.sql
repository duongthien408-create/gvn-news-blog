-- =====================================================
-- QUICK SETUP ADMIN USER
-- =====================================================
-- Copy và paste vào Supabase SQL Editor
-- Password: admin123
-- =====================================================

-- Step 1: Check if admin user exists
DO $$
BEGIN
    -- Try to update existing user to admin
    UPDATE users
    SET role = 'admin'
    WHERE email = 'admin@gearvn.com';

    -- If no user was updated, create new one
    IF NOT FOUND THEN
        INSERT INTO users (id, email, password_hash, username, role, status, created_at)
        VALUES (
            uuid_generate_v4(),
            'admin@gearvn.com',
            '$2a$10$ox9yJi4o4RHHf5285.ccQ.uk5igSnvUW78g7jZ6Jd8z7HGq88EXsS',
            'admin',
            'admin',
            'active',
            NOW()
        );

        RAISE NOTICE 'Created new admin user: admin@gearvn.com';
    ELSE
        RAISE NOTICE 'Updated existing user to admin role';
    END IF;
END $$;

-- Step 2: Verify admin user
SELECT
    id,
    email,
    username,
    role,
    status,
    created_at
FROM users
WHERE email = 'admin@gearvn.com';

-- =====================================================
-- TEST LOGIN
-- =====================================================
-- Open terminal and run:
-- curl -X POST http://localhost:8080/api/login -H "Content-Type: application/json" -d '{"email":"admin@gearvn.com","password":"admin123"}'
--
-- Or open browser:
-- http://localhost:8080/admin/login.html
-- Email: admin@gearvn.com
-- Password: admin123
-- =====================================================

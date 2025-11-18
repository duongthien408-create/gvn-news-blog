-- =====================================================
-- CLEAN ALL DATA - Reset Database with CASCADE DELETE
-- Database v2.0 - GearVN News Blog
-- =====================================================
-- This script removes all data from all tables using DELETE CASCADE
-- More compatible with Supabase connection pooling than TRUNCATE
-- =====================================================

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Delete from parent tables - CASCADE will handle children automatically
DELETE FROM users;
DELETE FROM creators;
DELETE FROM posts;
DELETE FROM tags;
DELETE FROM products;
DELETE FROM squads;
DELETE FROM achievements;
DELETE FROM sources;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Verify cleanup
DO $$
DECLARE
    user_count INTEGER;
    post_count INTEGER;
    creator_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO post_count FROM posts;
    SELECT COUNT(*) INTO creator_count FROM creators;

    RAISE NOTICE 'Users remaining: %', user_count;
    RAISE NOTICE 'Posts remaining: %', post_count;
    RAISE NOTICE 'Creators remaining: %', creator_count;

    IF user_count = 0 AND post_count = 0 AND creator_count = 0 THEN
        RAISE NOTICE '✅ DATABASE CLEANED SUCCESSFULLY';
    ELSE
        RAISE WARNING '⚠️ Some data still remains!';
    END IF;
END $$;

-- =====================================================
-- ✅ DATABASE CLEANED
-- =====================================================
-- All data has been removed
-- You can now import sample data from 04-full-sample-data.sql
-- =====================================================

-- =====================================================
-- CLEAN ALL DATA - Reset Database
-- Database v2.0 - GearVN News Blog
-- =====================================================
-- This script removes all data from all tables
-- =====================================================

-- Disable triggers temporarily (if needed)
SET session_replication_role = 'replica';

-- Delete in correct order (child tables first)
DELETE FROM votes;
DELETE FROM comment_votes;
DELETE FROM bookmarks;
DELETE FROM follows;
DELETE FROM squad_members;
DELETE FROM user_achievements;
DELETE FROM comments;
DELETE FROM post_products;
DELETE FROM post_tags;
DELETE FROM post_creators;
DELETE FROM posts;
DELETE FROM products;
DELETE FROM tags;
DELETE FROM squad_posts;
DELETE FROM squads;
DELETE FROM sources;
DELETE FROM creator_socials;
DELETE FROM creators;
DELETE FROM streaks;
DELETE FROM user_levels;
DELETE FROM user_preferences;
DELETE FROM user_profiles;
DELETE FROM users;
DELETE FROM achievements;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- =====================================================
-- ✅ DATABASE CLEANED
-- =====================================================
-- All data has been removed
-- You can now import sample data from 04-full-sample-data.sql
-- =====================================================

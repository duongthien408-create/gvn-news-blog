-- ============================================
-- CLEANUP OLD SCHEMA
-- CẢNH BÁO: Script này sẽ XÓA TẤT CẢ dữ liệu hiện tại!
-- Chỉ chạy nếu bạn muốn bắt đầu lại từ đầu
-- ============================================

-- Xóa các bảng mới (nếu có)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS user_points CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS user_levels CASCADE;
DROP TABLE IF EXISTS streaks CASCADE;
DROP TABLE IF EXISTS squad_posts CASCADE;
DROP TABLE IF EXISTS squad_members CASCADE;
DROP TABLE IF EXISTS squads CASCADE;
DROP TABLE IF EXISTS follows CASCADE;
DROP TABLE IF EXISTS views CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS comment_votes CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS post_creators CASCADE;
DROP TABLE IF EXISTS post_products CASCADE;
DROP TABLE IF EXISTS post_tags CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS post_media CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS product_categories CASCADE;
DROP TABLE IF EXISTS creator_socials CASCADE;
DROP TABLE IF EXISTS creators CASCADE;
DROP TABLE IF EXISTS sources CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Xóa các bảng cũ (từ schema cũ)
DROP TABLE IF EXISTS user_upvotes CASCADE;
DROP TABLE IF EXISTS user_saved_posts CASCADE;
DROP TABLE IF EXISTS company_followers CASCADE;
DROP TABLE IF EXISTS user_followers CASCADE;
DROP TABLE IF EXISTS hashtags CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Xóa các functions và triggers cũ
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS update_user_followers_count CASCADE;
DROP FUNCTION IF EXISTS update_company_followers_count CASCADE;
DROP FUNCTION IF EXISTS update_post_upvotes_count CASCADE;
DROP FUNCTION IF EXISTS update_post_comments_count CASCADE;
DROP FUNCTION IF EXISTS update_post_vote_counts CASCADE;
DROP FUNCTION IF EXISTS update_comment_vote_counts CASCADE;
DROP FUNCTION IF EXISTS update_post_comment_count CASCADE;
DROP FUNCTION IF EXISTS update_post_bookmark_count CASCADE;
DROP FUNCTION IF EXISTS update_creator_followers_count CASCADE;
DROP FUNCTION IF EXISTS update_squad_member_count CASCADE;
DROP FUNCTION IF EXISTS update_squad_post_count CASCADE;
DROP FUNCTION IF EXISTS update_tag_post_count CASCADE;
DROP FUNCTION IF EXISTS create_user_profile_and_preferences CASCADE;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Cleanup completed successfully!';
    RAISE NOTICE 'All old tables and functions have been dropped.';
    RAISE NOTICE 'You can now run 02-new-complete-schema.sql';
    RAISE NOTICE '============================================';
END $$;

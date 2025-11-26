-- ============================================
-- STEP 1: CLEANUP & CREATE TABLES
-- ============================================

-- Drop all old tables
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

-- Drop old functions
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS update_post_vote_counts CASCADE;
DROP FUNCTION IF EXISTS update_comment_vote_counts CASCADE;
DROP FUNCTION IF EXISTS update_post_comment_count CASCADE;
DROP FUNCTION IF EXISTS update_post_bookmark_count CASCADE;
DROP FUNCTION IF EXISTS update_creator_followers_count CASCADE;
DROP FUNCTION IF EXISTS update_squad_member_count CASCADE;
DROP FUNCTION IF EXISTS update_squad_post_count CASCADE;
DROP FUNCTION IF EXISTS update_tag_post_count CASCADE;
DROP FUNCTION IF EXISTS create_user_profile_and_preferences CASCADE;

-- Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CREATORS
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    channel_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TAGS
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. POSTS
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('news', 'review')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'public')),
    title VARCHAR(500) NOT NULL,
    title_vi VARCHAR(500),
    summary TEXT,
    summary_vi TEXT,
    source_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP
);

-- 4. POST_TAGS
CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, tag_id)
);

-- INDEXES
CREATE INDEX idx_creators_slug ON creators(slug);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_posts_creator ON posts(creator_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX idx_posts_public ON posts(published_at DESC) WHERE status = 'public';

-- ============================================
-- GEARVN CONTENT HUB - NEW COMPLETE DATABASE SCHEMA
-- Version: 2.0
-- Description: Complete schema based on ERD diagram with all new features
-- Features: Gamification, Products Integration, Community (Squads), Advanced Analytics
-- ============================================

-- ============================================
-- EXTENSION SETUP
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search

-- ============================================
-- CLEANUP (OPTIONAL - Uncomment to rebuild from scratch)
-- ============================================
/*
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
*/

-- ============================================
-- 1. USERS & AUTHENTICATION
-- ============================================

-- Users table (core authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'banned', 'pending')),
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles (extended user information)
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    avatar_url TEXT,
    bio TEXT,
    website VARCHAR(500),
    location VARCHAR(255),
    total_upvotes_received INTEGER DEFAULT 0,
    total_posts_created INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User preferences (settings)
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
    language VARCHAR(10) DEFAULT 'vi',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. CREATORS
-- ============================================

CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    website VARCHAR(500),
    verified BOOLEAN DEFAULT false,
    total_followers INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Creator social media accounts
CREATE TABLE creator_socials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('youtube', 'facebook', 'tiktok', 'instagram', 'twitter')),
    url VARCHAR(500) NOT NULL,
    follower_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(creator_id, platform)
);

-- ============================================
-- 3. CONTENT SOURCES
-- ============================================

CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    url TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    type VARCHAR(20) DEFAULT 'rss' CHECK (type IN ('rss', 'api', 'manual')),
    active BOOLEAN DEFAULT true,
    last_fetched_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. POSTS & CONTENT
-- ============================================

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
    type VARCHAR(20) DEFAULT 'article' CHECK (type IN ('article', 'video', 'review', 'news')),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    external_url TEXT,
    thumbnail_url TEXT,
    published_at TIMESTAMP,
    read_time_minutes INTEGER,
    watch_time_minutes INTEGER,
    view_count INTEGER DEFAULT 0,
    upvote_count INTEGER DEFAULT 0,
    downvote_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Post media (images, videos)
CREATE TABLE post_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,
    caption TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Post creators (many-to-many relationship)
CREATE TABLE post_creators (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES creators(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'author' CHECK (role IN ('author', 'collaborator', 'guest')),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, creator_id)
);

-- ============================================
-- 5. TAGS
-- ============================================

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Post tags (many-to-many)
CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, tag_id)
);

-- ============================================
-- 6. PRODUCTS (GEARVN INTEGRATION)
-- ============================================

CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    parent_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    name VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    price DECIMAL(12, 2),
    image_url TEXT,
    gearvn_url TEXT,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock', 'discontinued')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Post products (products mentioned in posts)
CREATE TABLE post_products (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    mention_type VARCHAR(50) DEFAULT 'mention' CHECK (mention_type IN ('review', 'comparison', 'mention')),
    affiliate_link TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (post_id, product_id)
);

-- ============================================
-- 7. ENGAGEMENT
-- ============================================

-- Votes (upvote/downvote for posts)
CREATE TABLE votes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    vote_type SMALLINT NOT NULL CHECK (vote_type IN (1, -1)), -- 1=upvote, -1=downvote
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- Comments
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    upvote_count INTEGER DEFAULT 0,
    downvote_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'deleted', 'hidden')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Comment votes
CREATE TABLE comment_votes (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    vote_type SMALLINT NOT NULL CHECK (vote_type IN (1, -1)),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, comment_id)
);

-- Bookmarks (saved posts)
CREATE TABLE bookmarks (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    folder_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- Views (analytics)
CREATE TABLE views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. FOLLOWS
-- ============================================

CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id UUID REFERENCES users(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    CHECK ((followee_id IS NOT NULL AND creator_id IS NULL) OR (followee_id IS NULL AND creator_id IS NOT NULL)),
    UNIQUE(follower_id, followee_id),
    UNIQUE(follower_id, creator_id)
);

-- ============================================
-- 9. SQUADS (COMMUNITIES)
-- ============================================

CREATE TABLE squads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    type VARCHAR(20) DEFAULT 'public' CHECK (type IN ('public', 'private')),
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    member_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE squad_members (
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (squad_id, user_id)
);

CREATE TABLE squad_posts (
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (squad_id, post_id)
);

-- ============================================
-- 10. GAMIFICATION
-- ============================================

-- Streaks
CREATE TABLE streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    points_reward INTEGER DEFAULT 0,
    type VARCHAR(50) CHECK (type IN ('streak', 'engagement', 'contribution')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, achievement_id)
);

-- User levels
CREATE TABLE user_levels (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    total_points INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User points (history)
CREATE TABLE user_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    reference_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 11. NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('comment', 'upvote', 'follow', 'mention', 'squad_invite')),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    reference_type VARCHAR(50),
    reference_id UUID,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Creators
CREATE INDEX idx_creators_slug ON creators(slug);
CREATE INDEX idx_creators_verified ON creators(verified);
CREATE INDEX idx_creator_socials_creator ON creator_socials(creator_id);

-- Sources
CREATE INDEX idx_sources_active ON sources(active);
CREATE INDEX idx_sources_type ON sources(type);

-- Posts
CREATE INDEX idx_posts_source ON posts(source_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_featured ON posts(featured);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_title_trgm ON posts USING gin(title gin_trgm_ops);

-- Post media
CREATE INDEX idx_post_media_post ON post_media(post_id);

-- Post creators
CREATE INDEX idx_post_creators_post ON post_creators(post_id);
CREATE INDEX idx_post_creators_creator ON post_creators(creator_id);

-- Tags
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_post_count ON tags(post_count DESC);

-- Post tags
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);

-- Products
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_status ON products(status);

-- Post products
CREATE INDEX idx_post_products_post ON post_products(post_id);
CREATE INDEX idx_post_products_product ON post_products(product_id);

-- Votes
CREATE INDEX idx_votes_post ON votes(post_id);
CREATE INDEX idx_votes_user ON votes(user_id);

-- Comments
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Comment votes
CREATE INDEX idx_comment_votes_comment ON comment_votes(comment_id);
CREATE INDEX idx_comment_votes_user ON comment_votes(user_id);

-- Bookmarks
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post ON bookmarks(post_id);

-- Views
CREATE INDEX idx_views_post ON views(post_id);
CREATE INDEX idx_views_user ON views(user_id);
CREATE INDEX idx_views_created_at ON views(created_at DESC);

-- Follows
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_followee ON follows(followee_id) WHERE followee_id IS NOT NULL;
CREATE INDEX idx_follows_creator ON follows(creator_id) WHERE creator_id IS NOT NULL;

-- Squads
CREATE INDEX idx_squads_slug ON squads(slug);
CREATE INDEX idx_squads_creator ON squads(creator_id);
CREATE INDEX idx_squads_type ON squads(type);

-- Squad members
CREATE INDEX idx_squad_members_squad ON squad_members(squad_id);
CREATE INDEX idx_squad_members_user ON squad_members(user_id);

-- Squad posts
CREATE INDEX idx_squad_posts_squad ON squad_posts(squad_id);
CREATE INDEX idx_squad_posts_post ON squad_posts(post_id);

-- Gamification
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_user_points_user ON user_points(user_id);
CREATE INDEX idx_user_points_created_at ON user_points(created_at DESC);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- TRIGGERS AND FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_creators_updated_at
    BEFORE UPDATE ON creators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_creator_socials_updated_at
    BEFORE UPDATE ON creator_socials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_sources_updated_at
    BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_squads_updated_at
    BEFORE UPDATE ON squads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update post vote counts
CREATE OR REPLACE FUNCTION update_post_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 1 THEN
            UPDATE posts SET upvote_count = upvote_count + 1 WHERE id = NEW.post_id;
        ELSE
            UPDATE posts SET downvote_count = downvote_count + 1 WHERE id = NEW.post_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.vote_type = 1 AND NEW.vote_type = -1 THEN
            UPDATE posts SET upvote_count = GREATEST(0, upvote_count - 1), downvote_count = downvote_count + 1 WHERE id = NEW.post_id;
        ELSIF OLD.vote_type = -1 AND NEW.vote_type = 1 THEN
            UPDATE posts SET downvote_count = GREATEST(0, downvote_count - 1), upvote_count = upvote_count + 1 WHERE id = NEW.post_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 1 THEN
            UPDATE posts SET upvote_count = GREATEST(0, upvote_count - 1) WHERE id = OLD.post_id;
        ELSE
            UPDATE posts SET downvote_count = GREATEST(0, downvote_count - 1) WHERE id = OLD.post_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_vote_counts
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_post_vote_counts();

-- Function to update comment vote counts
CREATE OR REPLACE FUNCTION update_comment_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 1 THEN
            UPDATE comments SET upvote_count = upvote_count + 1 WHERE id = NEW.comment_id;
        ELSE
            UPDATE comments SET downvote_count = downvote_count + 1 WHERE id = NEW.comment_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.vote_type = 1 AND NEW.vote_type = -1 THEN
            UPDATE comments SET upvote_count = GREATEST(0, upvote_count - 1), downvote_count = downvote_count + 1 WHERE id = NEW.comment_id;
        ELSIF OLD.vote_type = -1 AND NEW.vote_type = 1 THEN
            UPDATE comments SET downvote_count = GREATEST(0, downvote_count - 1), upvote_count = upvote_count + 1 WHERE id = NEW.comment_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 1 THEN
            UPDATE comments SET upvote_count = GREATEST(0, upvote_count - 1) WHERE id = OLD.comment_id;
        ELSE
            UPDATE comments SET downvote_count = GREATEST(0, downvote_count - 1) WHERE id = OLD.comment_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_vote_counts
    AFTER INSERT OR UPDATE OR DELETE ON comment_votes
    FOR EACH ROW EXECUTE FUNCTION update_comment_vote_counts();

-- Function to update comment count on posts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = GREATEST(0, comment_count - 1) WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comment_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Function to update bookmark count on posts
CREATE OR REPLACE FUNCTION update_post_bookmark_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET bookmark_count = bookmark_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET bookmark_count = GREATEST(0, bookmark_count - 1) WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_bookmark_count
    AFTER INSERT OR DELETE ON bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_post_bookmark_count();

-- Function to update creator followers count
CREATE OR REPLACE FUNCTION update_creator_followers_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.creator_id IS NOT NULL THEN
        UPDATE creators SET total_followers = total_followers + 1 WHERE id = NEW.creator_id;
    ELSIF TG_OP = 'DELETE' AND OLD.creator_id IS NOT NULL THEN
        UPDATE creators SET total_followers = GREATEST(0, total_followers - 1) WHERE id = OLD.creator_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_creator_followers_count
    AFTER INSERT OR DELETE ON follows
    FOR EACH ROW EXECUTE FUNCTION update_creator_followers_count();

-- Function to update squad member count
CREATE OR REPLACE FUNCTION update_squad_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE squads SET member_count = member_count + 1 WHERE id = NEW.squad_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE squads SET member_count = GREATEST(0, member_count - 1) WHERE id = OLD.squad_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_squad_member_count
    AFTER INSERT OR DELETE ON squad_members
    FOR EACH ROW EXECUTE FUNCTION update_squad_member_count();

-- Function to update squad post count
CREATE OR REPLACE FUNCTION update_squad_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE squads SET post_count = post_count + 1 WHERE id = NEW.squad_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE squads SET post_count = GREATEST(0, post_count - 1) WHERE id = OLD.squad_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_squad_post_count
    AFTER INSERT OR DELETE ON squad_posts
    FOR EACH ROW EXECUTE FUNCTION update_squad_post_count();

-- Function to update tag post count
CREATE OR REPLACE FUNCTION update_tag_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET post_count = post_count + 1 WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET post_count = GREATEST(0, post_count - 1) WHERE id = OLD.tag_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_tag_post_count
    AFTER INSERT OR DELETE ON post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_post_count();

-- Function to automatically create user profile and preferences
CREATE OR REPLACE FUNCTION create_user_profile_and_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (user_id) VALUES (NEW.id);
    INSERT INTO user_preferences (user_id) VALUES (NEW.id);
    INSERT INTO user_levels (user_id) VALUES (NEW.id);
    INSERT INTO streaks (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_user_profile_and_preferences
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile_and_preferences();

-- ============================================
-- COMPLETE! New database schema is ready
-- ============================================

-- Summary statistics query
DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'GearVN Content Hub - Database Schema Created';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Total Tables: 25+';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '  - Users & Authentication (3 tables)';
    RAISE NOTICE '  - Creators & Content (5 tables)';
    RAISE NOTICE '  - Products Integration (3 tables)';
    RAISE NOTICE '  - Engagement (5 tables)';
    RAISE NOTICE '  - Community/Squads (3 tables)';
    RAISE NOTICE '  - Gamification (5 tables)';
    RAISE NOTICE '  - Notifications (1 table)';
    RAISE NOTICE '============================================';
END $$;

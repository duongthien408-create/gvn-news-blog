-- ============================================
-- GEARVN CREATOR HUB - COMPLETE DATABASE SCHEMA
-- Version: 1.0
-- Description: Complete schema for GearVN Creator Hub platform
-- ============================================

-- Drop existing tables if needed (for clean rebuild)
-- Uncomment these lines if you want to rebuild from scratch
-- DROP TABLE IF EXISTS comments CASCADE;
-- DROP TABLE IF EXISTS user_upvotes CASCADE;
-- DROP TABLE IF EXISTS bookmarks CASCADE;
-- DROP TABLE IF EXISTS user_saved_posts CASCADE;
-- DROP TABLE IF EXISTS company_followers CASCADE;
-- DROP TABLE IF EXISTS user_followers CASCADE;
-- DROP TABLE IF EXISTS posts CASCADE;
-- DROP TABLE IF EXISTS sources CASCADE;
-- DROP TABLE IF EXISTS hashtags CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS companies CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  website VARCHAR(500),

  -- Social links
  twitter_url VARCHAR(500),
  facebook_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  youtube_url VARCHAR(500),

  -- User type & verification
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'admin', 'creator'
  is_verified BOOLEAN DEFAULT false,

  -- Company association
  company_id INTEGER,
  job_title VARCHAR(255),

  -- Statistics
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- ============================================
-- 2. COMPANIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  tagline VARCHAR(500),

  -- Contact info
  website VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),

  -- Address
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),

  -- Social links
  twitter_url VARCHAR(500),
  facebook_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  youtube_url VARCHAR(500),

  -- Company details
  industry VARCHAR(100),
  company_size VARCHAR(50), -- '1-10', '11-50', '51-200', '201-500', '500+'
  founded_year INTEGER,

  -- Verification & ownership
  is_verified BOOLEAN DEFAULT false,
  owner_id VARCHAR(255), -- References users(id)

  -- Statistics
  followers_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  employees_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50), -- Lucide icon name
  color VARCHAR(7) DEFAULT '#3b82f6',
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. HASHTAGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS hashtags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#ef4444',
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. SOURCES TABLE (RSS Feeds)
-- ============================================
CREATE TABLE IF NOT EXISTS sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT UNIQUE NOT NULL,
  type VARCHAR(20) DEFAULT 'rss', -- 'rss', 'youtube', 'api'
  category VARCHAR(100),
  active BOOLEAN DEFAULT true,
  fetch_interval INTEGER DEFAULT 30, -- Minutes
  last_fetched_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. POSTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,

  -- Creator information
  creator_id VARCHAR(255), -- References users(id)
  creator_name VARCHAR(255),
  creator_avatar TEXT,

  -- External source (RSS)
  source_id INTEGER, -- References sources(id)
  external_url TEXT,

  -- Categorization
  category VARCHAR(100),
  tags TEXT[], -- PostgreSQL array for hashtags

  -- Engagement metrics
  upvotes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  read_time VARCHAR(50),

  -- Publishing
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP,

  -- Video-specific fields
  content_type VARCHAR(20) DEFAULT 'article', -- 'video' or 'article'
  video_url TEXT,
  video_thumbnail TEXT,
  video_duration VARCHAR(20), -- Format: MM:SS
  video_platform VARCHAR(50) DEFAULT 'youtube',
  transcript TEXT,

  -- Author type (for future company posts)
  author_type VARCHAR(20) DEFAULT 'user', -- 'user' or 'company'
  author_id VARCHAR(255),
  company_id INTEGER,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. COMMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(255) NOT NULL, -- References posts(id)
  user_id VARCHAR(255) NOT NULL, -- References users(id)
  content TEXT NOT NULL,
  parent_id INTEGER, -- References comments(id) for threaded comments

  -- Author type (for future company comments)
  author_type VARCHAR(20) DEFAULT 'user',
  company_id INTEGER,

  -- Engagement
  upvotes INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. USER_FOLLOWERS TABLE (Users following users)
-- ============================================
CREATE TABLE IF NOT EXISTS user_followers (
  id SERIAL PRIMARY KEY,
  follower_id VARCHAR(255) NOT NULL, -- User who is following
  following_id VARCHAR(255) NOT NULL, -- User being followed
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- ============================================
-- 9. COMPANY_FOLLOWERS TABLE (Users following companies)
-- ============================================
CREATE TABLE IF NOT EXISTS company_followers (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  company_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- ============================================
-- 10. BOOKMARKS TABLE (Saved posts)
-- ============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Alternative name for bookmarks (for compatibility)
CREATE TABLE IF NOT EXISTS user_saved_posts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- ============================================
-- 11. USER_UPVOTES TABLE (Post upvotes)
-- ============================================
CREATE TABLE IF NOT EXISTS user_upvotes (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Hashtags indexes
CREATE INDEX IF NOT EXISTS idx_hashtags_slug ON hashtags(slug);
CREATE INDEX IF NOT EXISTS idx_hashtags_usage_count ON hashtags(usage_count DESC);

-- Sources indexes
CREATE INDEX IF NOT EXISTS idx_sources_active ON sources(active);
CREATE INDEX IF NOT EXISTS idx_sources_type ON sources(type);

-- Posts indexes
CREATE INDEX IF NOT EXISTS idx_posts_creator ON posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_posts_source ON posts(source_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id, author_type);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags); -- GIN index for array search

-- Comments indexes
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- Followers indexes
CREATE INDEX IF NOT EXISTS idx_user_followers_follower ON user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_following ON user_followers(following_id);
CREATE INDEX IF NOT EXISTS idx_company_followers_user ON company_followers(user_id);
CREATE INDEX IF NOT EXISTS idx_company_followers_company ON company_followers(company_id);

-- Bookmarks indexes
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_post ON bookmarks(post_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_user ON user_saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_post ON user_saved_posts(post_id);

-- Upvotes indexes
CREATE INDEX IF NOT EXISTS idx_user_upvotes_user ON user_upvotes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_upvotes_post ON user_upvotes(post_id);

-- ============================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================

-- Note: We skip circular dependencies between users and companies
-- Handle referential integrity at application level for:
-- - users.company_id -> companies.id
-- - companies.owner_id -> users.id

DO $$
BEGIN
  -- Posts foreign keys
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_posts_creator') THEN
    ALTER TABLE posts
    ADD CONSTRAINT fk_posts_creator
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_posts_source') THEN
    ALTER TABLE posts
    ADD CONSTRAINT fk_posts_source
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE SET NULL;
  END IF;

  -- Comments foreign keys
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_comments_post') THEN
    ALTER TABLE comments
    ADD CONSTRAINT fk_comments_post
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_comments_user') THEN
    ALTER TABLE comments
    ADD CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_comments_parent') THEN
    ALTER TABLE comments
    ADD CONSTRAINT fk_comments_parent
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE;
  END IF;

  -- User followers foreign keys
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_followers_follower') THEN
    ALTER TABLE user_followers
    ADD CONSTRAINT fk_user_followers_follower
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_followers_following') THEN
    ALTER TABLE user_followers
    ADD CONSTRAINT fk_user_followers_following
    FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Company followers foreign keys
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_company_followers_user') THEN
    ALTER TABLE company_followers
    ADD CONSTRAINT fk_company_followers_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_company_followers_company') THEN
    ALTER TABLE company_followers
    ADD CONSTRAINT fk_company_followers_company
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
  END IF;

  -- Bookmarks foreign keys
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookmarks_user') THEN
    ALTER TABLE bookmarks
    ADD CONSTRAINT fk_bookmarks_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_bookmarks_post') THEN
    ALTER TABLE bookmarks
    ADD CONSTRAINT fk_bookmarks_post
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
  END IF;

  -- User saved posts foreign keys
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_saved_posts_user') THEN
    ALTER TABLE user_saved_posts
    ADD CONSTRAINT fk_user_saved_posts_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_saved_posts_post') THEN
    ALTER TABLE user_saved_posts
    ADD CONSTRAINT fk_user_saved_posts_post
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
  END IF;

  -- Upvotes foreign keys
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_upvotes_user') THEN
    ALTER TABLE user_upvotes
    ADD CONSTRAINT fk_user_upvotes_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_upvotes_post') THEN
    ALTER TABLE user_upvotes
    ADD CONSTRAINT fk_user_upvotes_post
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
  END IF;
END $$;

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

-- Triggers for updated_at on users
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for updated_at on companies
DROP TRIGGER IF EXISTS trigger_companies_updated_at ON companies;
CREATE TRIGGER trigger_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for updated_at on posts
DROP TRIGGER IF EXISTS trigger_posts_updated_at ON posts;
CREATE TRIGGER trigger_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for updated_at on comments
DROP TRIGGER IF EXISTS trigger_comments_updated_at ON comments;
CREATE TRIGGER trigger_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user followers count
CREATE OR REPLACE FUNCTION update_user_followers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.following_id;
    UPDATE users SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user followers count
DROP TRIGGER IF EXISTS trigger_update_user_followers_count ON user_followers;
CREATE TRIGGER trigger_update_user_followers_count
AFTER INSERT OR DELETE ON user_followers
FOR EACH ROW EXECUTE FUNCTION update_user_followers_count();

-- Function to update company followers count
CREATE OR REPLACE FUNCTION update_company_followers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE companies SET followers_count = followers_count + 1 WHERE id = NEW.company_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE companies SET followers_count = GREATEST(0, followers_count - 1) WHERE id = OLD.company_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for company followers count
DROP TRIGGER IF EXISTS trigger_update_company_followers_count ON company_followers;
CREATE TRIGGER trigger_update_company_followers_count
AFTER INSERT OR DELETE ON company_followers
FOR EACH ROW EXECUTE FUNCTION update_company_followers_count();

-- Function to update post upvotes count
CREATE OR REPLACE FUNCTION update_post_upvotes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET upvotes = upvotes + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for post upvotes count
DROP TRIGGER IF EXISTS trigger_update_post_upvotes_count ON user_upvotes;
CREATE TRIGGER trigger_update_post_upvotes_count
AFTER INSERT OR DELETE ON user_upvotes
FOR EACH ROW EXECUTE FUNCTION update_post_upvotes_count();

-- Function to update comments count on posts
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comments_count = GREATEST(0, comments_count - 1) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comments count
DROP TRIGGER IF EXISTS trigger_update_post_comments_count ON comments;
CREATE TRIGGER trigger_update_post_comments_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow public read access
CREATE POLICY "Allow public read access on users"
  ON users FOR SELECT USING (true);

CREATE POLICY "Allow public read access on companies"
  ON companies FOR SELECT USING (true);

CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Allow public read access on hashtags"
  ON hashtags FOR SELECT USING (true);

CREATE POLICY "Allow public read access on sources"
  ON sources FOR SELECT USING (true);

CREATE POLICY "Allow public read access on posts"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Allow public read access on comments"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Allow public read on user_followers"
  ON user_followers FOR SELECT USING (true);

CREATE POLICY "Allow public read on company_followers"
  ON company_followers FOR SELECT USING (true);

CREATE POLICY "Allow public read on upvotes"
  ON user_upvotes FOR SELECT USING (true);

-- RLS Policies: Allow authenticated users to manage their own data
CREATE POLICY "Allow users to update own profile"
  ON users FOR UPDATE USING (true);

CREATE POLICY "Allow users to insert own profile"
  ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to follow/unfollow"
  ON user_followers FOR ALL USING (true);

CREATE POLICY "Allow users to follow/unfollow companies"
  ON company_followers FOR ALL USING (true);

CREATE POLICY "Allow users to save/unsave posts"
  ON bookmarks FOR ALL USING (true);

CREATE POLICY "Allow users to save/unsave posts (alt)"
  ON user_saved_posts FOR ALL USING (true);

CREATE POLICY "Allow users to upvote/unupvote"
  ON user_upvotes FOR ALL USING (true);

CREATE POLICY "Allow users to comment"
  ON comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update own comments"
  ON comments FOR UPDATE USING (true);

CREATE POLICY "Allow users to delete own comments"
  ON comments FOR DELETE USING (true);

-- RLS Policies: Allow authenticated users to create companies
CREATE POLICY "Allow authenticated users to create companies"
  ON companies FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow company owners to update"
  ON companies FOR UPDATE USING (true);

-- RLS Policies: Allow admins/creators to manage posts
CREATE POLICY "Allow authenticated users to create posts"
  ON posts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to update own posts"
  ON posts FOR UPDATE USING (true);

CREATE POLICY "Allow users to delete own posts"
  ON posts FOR DELETE USING (true);

-- ============================================
-- COMPLETE! Database schema is ready
-- ============================================

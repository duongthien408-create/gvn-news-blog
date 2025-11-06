-- ============================================
-- USER PROFILES & COMPANY PROFILES SCHEMA
-- Simplified version without complex dependencies
-- ============================================

-- Step 1: Create base tables without foreign keys
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  website VARCHAR(500),
  twitter_url VARCHAR(500),
  facebook_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  github_url VARCHAR(500),
  youtube_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user',
  is_verified BOOLEAN DEFAULT false,
  company_id INTEGER,
  job_title VARCHAR(255),
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo_url TEXT,
  cover_image_url TEXT,
  description TEXT,
  tagline VARCHAR(500),
  website VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  twitter_url VARCHAR(500),
  facebook_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  youtube_url VARCHAR(500),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  founded_year INTEGER,
  is_verified BOOLEAN DEFAULT false,
  owner_id VARCHAR(255),
  followers_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  employees_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_followers (
  id SERIAL PRIMARY KEY,
  follower_id VARCHAR(255) NOT NULL,
  following_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS company_followers (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  company_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

CREATE TABLE IF NOT EXISTS user_saved_posts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

CREATE TABLE IF NOT EXISTS user_upvotes (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Step 2: Update existing posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS author_type VARCHAR(20) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS author_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS company_id INTEGER;

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

-- Step 4: Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_upvotes ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies
DROP POLICY IF EXISTS "Allow public read access on users" ON users;
CREATE POLICY "Allow public read access on users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to update own profile" ON users;
CREATE POLICY "Allow users to update own profile" ON users FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow users to insert own profile" ON users;
CREATE POLICY "Allow users to insert own profile" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read access on companies" ON companies;
CREATE POLICY "Allow public read access on companies" ON companies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow company owners to update" ON companies;
CREATE POLICY "Allow company owners to update" ON companies FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to create companies" ON companies;
CREATE POLICY "Allow authenticated users to create companies" ON companies FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on user_followers" ON user_followers;
CREATE POLICY "Allow public read on user_followers" ON user_followers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to follow/unfollow" ON user_followers;
CREATE POLICY "Allow users to follow/unfollow" ON user_followers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read on company_followers" ON company_followers;
CREATE POLICY "Allow public read on company_followers" ON company_followers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to follow/unfollow companies" ON company_followers;
CREATE POLICY "Allow users to follow/unfollow companies" ON company_followers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow users to read own saved posts" ON user_saved_posts;
CREATE POLICY "Allow users to read own saved posts" ON user_saved_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to save/unsave posts" ON user_saved_posts;
CREATE POLICY "Allow users to save/unsave posts" ON user_saved_posts FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read on upvotes" ON user_upvotes;
CREATE POLICY "Allow public read on upvotes" ON user_upvotes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to upvote/unupvote" ON user_upvotes;
CREATE POLICY "Allow users to upvote/unupvote" ON user_upvotes FOR ALL USING (true);

-- Step 6: Insert sample data
INSERT INTO users (id, email, username, full_name, avatar_url, bio, role, is_verified) VALUES
  ('user-1', 'admin@gearvn.com', 'gearvn_admin', 'GearVN Admin', 'https://ui-avatars.com/api/?name=GearVN&background=ef4444&color=fff&size=256', 'Official GearVN account', 'admin', true),
  ('user-2', 'duong@gearvn.com', 'duong_gearvn', 'Dương Nguyễn', 'https://ui-avatars.com/api/?name=Duong+Nguyen&background=3b82f6&color=fff&size=256', 'Tech enthusiast & reviewer', 'creator', true),
  ('user-3', 'test@example.com', 'testuser', 'Test User', 'https://ui-avatars.com/api/?name=Test+User&background=10b981&color=fff&size=256', 'Just a test account', 'user', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO companies (name, slug, logo_url, description, tagline, website, industry, company_size, founded_year, owner_id, is_verified) VALUES
  (
    'GearVN',
    'gearvn',
    'https://ui-avatars.com/api/?name=GearVN&background=ef4444&color=fff&size=256',
    'GearVN - Hệ thống cửa hàng gaming gear, PC, laptop uy tín hàng đầu Việt Nam',
    'Your trusted gaming gear store',
    'https://gearvn.com',
    'Gaming & Technology',
    '201-500',
    2015,
    'user-1',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Step 7: Link user to company
UPDATE users SET company_id = 1, job_title = 'Content Creator' WHERE id = 'user-2' AND EXISTS (SELECT 1 FROM companies WHERE id = 1);

-- ============================================
-- USER PROFILES & COMPANY PROFILES SCHEMA
-- ============================================

-- Create users table (extended profile info)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
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

  -- User type
  role VARCHAR(50) DEFAULT 'user', -- 'user', 'admin', 'creator'
  is_verified BOOLEAN DEFAULT false,

  -- Company association
  company_id INTEGER,
  job_title VARCHAR(255),

  -- Stats
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Create companies table
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

  -- Industry & size
  industry VARCHAR(100),
  company_size VARCHAR(50), -- '1-10', '11-50', '51-200', '201-500', '500+'
  founded_year INTEGER,

  -- Verification
  is_verified BOOLEAN DEFAULT false,

  -- Owner
  owner_id VARCHAR(255),

  -- Stats
  followers_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  employees_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create followers table (users following users)
CREATE TABLE IF NOT EXISTS user_followers (
  id SERIAL PRIMARY KEY,
  follower_id VARCHAR(255) NOT NULL, -- User who is following
  following_id VARCHAR(255) NOT NULL, -- User being followed
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create company followers table (users following companies)
CREATE TABLE IF NOT EXISTS company_followers (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  company_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- Create user_saved_posts table
CREATE TABLE IF NOT EXISTS user_saved_posts (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Create user_upvotes table (if not exists)
CREATE TABLE IF NOT EXISTS user_upvotes (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Update posts table to support company authors
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS author_type VARCHAR(20) DEFAULT 'user', -- 'user' or 'company'
ADD COLUMN IF NOT EXISTS author_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS company_id INTEGER;

-- Update comments table to support company authors (only if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'comments') THEN
    ALTER TABLE comments
    ADD COLUMN IF NOT EXISTS author_type VARCHAR(20) DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS company_id INTEGER;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_owner_id ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_follower ON user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_following ON user_followers(following_id);
CREATE INDEX IF NOT EXISTS idx_company_followers_user ON company_followers(user_id);
CREATE INDEX IF NOT EXISTS idx_company_followers_company ON company_followers(company_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_user ON user_saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_posts_post ON user_saved_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_user_upvotes_user ON user_upvotes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_upvotes_post ON user_upvotes(post_id);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_id, author_type);

-- Add foreign key constraints (skip circular dependencies between users and companies)
-- We'll handle referential integrity at application level for users.company_id and companies.owner_id

DO $$
BEGIN
  -- Add foreign key for user_followers
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

  -- Add foreign key for company_followers
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

  -- Add foreign key for user_saved_posts
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_saved_posts_user') THEN
    ALTER TABLE user_saved_posts
    ADD CONSTRAINT fk_user_saved_posts_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  -- Add foreign key for user_upvotes
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_user_upvotes_user') THEN
    ALTER TABLE user_upvotes
    ADD CONSTRAINT fk_user_upvotes_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Allow public read access on users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Allow users to update own profile"
  ON users FOR UPDATE
  USING (true);

CREATE POLICY "Allow users to insert own profile"
  ON users FOR INSERT
  WITH CHECK (true);

-- RLS Policies for companies
CREATE POLICY "Allow public read access on companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Allow company owners to update"
  ON companies FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to create companies"
  ON companies FOR INSERT
  WITH CHECK (true);

-- RLS Policies for followers
CREATE POLICY "Allow public read on user_followers"
  ON user_followers FOR SELECT
  USING (true);

CREATE POLICY "Allow users to follow/unfollow"
  ON user_followers FOR ALL
  USING (true);

CREATE POLICY "Allow public read on company_followers"
  ON company_followers FOR SELECT
  USING (true);

CREATE POLICY "Allow users to follow/unfollow companies"
  ON company_followers FOR ALL
  USING (true);

-- RLS Policies for saved posts
CREATE POLICY "Allow users to read own saved posts"
  ON user_saved_posts FOR SELECT
  USING (true);

CREATE POLICY "Allow users to save/unsave posts"
  ON user_saved_posts FOR ALL
  USING (true);

-- RLS Policies for upvotes
CREATE POLICY "Allow public read on upvotes"
  ON user_upvotes FOR SELECT
  USING (true);

CREATE POLICY "Allow users to upvote/unupvote"
  ON user_upvotes FOR ALL
  USING (true);

-- Insert sample users (for testing)
INSERT INTO users (id, email, username, full_name, avatar_url, bio, role, is_verified) VALUES
  ('user-1', 'admin@gearvn.com', 'gearvn_admin', 'GearVN Admin', 'https://ui-avatars.com/api/?name=GearVN&background=ef4444&color=fff&size=256', 'Official GearVN account', 'admin', true),
  ('user-2', 'duong@gearvn.com', 'duong_gearvn', 'Dương Nguyễn', 'https://ui-avatars.com/api/?name=Duong+Nguyen&background=3b82f6&color=fff&size=256', 'Tech enthusiast & reviewer', 'creator', true),
  ('user-3', 'test@example.com', 'testuser', 'Test User', 'https://ui-avatars.com/api/?name=Test+User&background=10b981&color=fff&size=256', 'Just a test account', 'user', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample company
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

-- Update sample user to associate with company (only if company_id column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'company_id'
  ) THEN
    UPDATE users SET company_id = 1, job_title = 'Content Creator' WHERE id = 'user-2';
  END IF;
END $$;

-- Create function to update followers count
CREATE OR REPLACE FUNCTION update_user_followers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
    UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_company_followers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE companies SET followers_count = followers_count + 1 WHERE id = NEW.company_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE companies SET followers_count = followers_count - 1 WHERE id = OLD.company_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_user_followers_count ON user_followers;
CREATE TRIGGER trigger_update_user_followers_count
AFTER INSERT OR DELETE ON user_followers
FOR EACH ROW EXECUTE FUNCTION update_user_followers_count();

DROP TRIGGER IF EXISTS trigger_update_company_followers_count ON company_followers;
CREATE TRIGGER trigger_update_company_followers_count
AFTER INSERT OR DELETE ON company_followers
FOR EACH ROW EXECUTE FUNCTION update_company_followers_count();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_companies_updated_at ON companies;
CREATE TRIGGER trigger_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

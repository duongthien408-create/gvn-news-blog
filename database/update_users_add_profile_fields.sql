-- ============================================
-- UPDATE EXISTING USERS TABLE
-- Add profile fields to existing users table
-- ============================================

-- Step 1: Add new columns to existing users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(500),
ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS github_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS youtube_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS company_id INTEGER,
ADD COLUMN IF NOT EXISTS job_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS posts_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;

-- Step 2: Create companies table
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
  owner_id INTEGER,
  followers_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  employees_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 3: Create new relationship tables
CREATE TABLE IF NOT EXISTS user_followers (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL,
  following_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

CREATE TABLE IF NOT EXISTS company_followers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

CREATE TABLE IF NOT EXISTS user_saved_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Note: upvotes table already exists, renamed to user_upvotes for clarity
-- But we'll keep using the existing 'upvotes' table

-- Step 4: Update posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS author_type VARCHAR(20) DEFAULT 'user',
ADD COLUMN IF NOT EXISTS author_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS author_user_id INTEGER,
ADD COLUMN IF NOT EXISTS company_id INTEGER;

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username_new ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email_new ON users(email);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_user_followers_follower ON user_followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_followers_following ON user_followers(following_id);
CREATE INDEX IF NOT EXISTS idx_company_followers_user ON company_followers(user_id);
CREATE INDEX IF NOT EXISTS idx_company_followers_company ON company_followers(company_id);

-- Step 6: Enable RLS on new tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_posts ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies for companies
DROP POLICY IF EXISTS "Allow public read access on companies" ON companies;
CREATE POLICY "Allow public read access on companies" ON companies FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow company owners to update" ON companies;
CREATE POLICY "Allow company owners to update" ON companies FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow users to create companies" ON companies;
CREATE POLICY "Allow users to create companies" ON companies FOR INSERT WITH CHECK (true);

-- Step 8: Create RLS policies for user_followers
DROP POLICY IF EXISTS "Allow public read on user_followers" ON user_followers;
CREATE POLICY "Allow public read on user_followers" ON user_followers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to follow/unfollow" ON user_followers;
CREATE POLICY "Allow users to follow/unfollow" ON user_followers FOR ALL USING (true);

-- Step 9: Create RLS policies for company_followers
DROP POLICY IF EXISTS "Allow public read on company_followers" ON company_followers;
CREATE POLICY "Allow public read on company_followers" ON company_followers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to follow companies" ON company_followers;
CREATE POLICY "Allow users to follow companies" ON company_followers FOR ALL USING (true);

-- Step 10: Create RLS policies for user_saved_posts
DROP POLICY IF EXISTS "Allow users to read saved posts" ON user_saved_posts;
CREATE POLICY "Allow users to read saved posts" ON user_saved_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to save posts" ON user_saved_posts;
CREATE POLICY "Allow users to save posts" ON user_saved_posts FOR ALL USING (true);

-- Step 11: Insert sample company
INSERT INTO companies (name, slug, logo_url, description, tagline, website, industry, company_size, founded_year, is_verified) VALUES
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
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Step 12: Create triggers for auto-update followers count
CREATE OR REPLACE FUNCTION update_user_followers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = OLD.following_id;
    UPDATE users SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
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
    UPDATE companies SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = OLD.company_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_user_followers_count ON user_followers;
CREATE TRIGGER trigger_update_user_followers_count
AFTER INSERT OR DELETE ON user_followers
FOR EACH ROW EXECUTE FUNCTION update_user_followers_count();

DROP TRIGGER IF EXISTS trigger_update_company_followers_count ON company_followers;
CREATE TRIGGER trigger_update_company_followers_count
AFTER INSERT OR DELETE ON company_followers
FOR EACH ROW EXECUTE FUNCTION update_company_followers_count();

-- Done!
-- Now you have:
-- - Extended users table with profile fields
-- - companies table for company profiles
-- - user_followers for user-to-user follows
-- - company_followers for user-to-company follows
-- - user_saved_posts for bookmarking posts

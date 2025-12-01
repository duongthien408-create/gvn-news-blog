-- =============================================
-- PHASE 2: COMMUNITY SUBMIT - Alter posts table
-- =============================================

-- Thêm columns cho community submit
ALTER TABLE posts ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'auto';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS platform VARCHAR(20);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES profiles(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS auto_approved BOOLEAN DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_source ON posts(source);
CREATE INDEX IF NOT EXISTS idx_posts_submitted_by ON posts(submitted_by);

-- Update RLS policies cho posts
DROP POLICY IF EXISTS "Public posts viewable" ON posts;
DROP POLICY IF EXISTS "Users can submit posts" ON posts;
DROP POLICY IF EXISTS "Users can update own pending posts" ON posts;

-- Anyone can view public/approved posts
CREATE POLICY "Public posts viewable"
  ON posts FOR SELECT
  USING (
    status IN ('public', 'approved')
    OR submitted_by = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
  );

-- Authenticated users can submit posts
CREATE POLICY "Users can submit posts"
  ON posts FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND submitted_by = auth.uid()
    AND source = 'community'
  );

-- Users can update their own pending posts
CREATE POLICY "Users can update own pending posts"
  ON posts FOR UPDATE
  USING (
    submitted_by = auth.uid()
    AND status = 'pending'
  )
  WITH CHECK (
    submitted_by = auth.uid()
    AND status = 'pending'
  );

-- Users can delete their own pending posts
CREATE POLICY "Users can delete own pending posts"
  ON posts FOR DELETE
  USING (
    submitted_by = auth.uid()
    AND status = 'pending'
  );

-- =============================================
-- TRUSTED DOMAINS (auto-approve)
-- =============================================

CREATE TABLE IF NOT EXISTS trusted_domains (
  domain VARCHAR(255) PRIMARY KEY,
  auto_approve BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO trusted_domains (domain) VALUES
  ('youtube.com'),
  ('youtu.be'),
  ('tiktok.com'),
  ('facebook.com'),
  ('twitter.com'),
  ('x.com'),
  ('theverge.com'),
  ('techcrunch.com'),
  ('arstechnica.com'),
  ('wired.com')
ON CONFLICT (domain) DO NOTHING;

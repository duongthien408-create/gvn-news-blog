-- Create articles table for AI-generated content from video transcripts
-- Run this SQL in Supabase SQL Editor

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES creators(id) ON DELETE SET NULL,
  source_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,  -- Link to original video post

  -- URL slug for SEO-friendly URLs
  slug TEXT UNIQUE NOT NULL,

  -- Content
  title TEXT NOT NULL,
  excerpt TEXT,  -- Short summary (200-300 chars)
  content TEXT,  -- Full article content (markdown supported)

  -- Media
  thumbnail_url TEXT,

  -- Metadata
  source_url TEXT,  -- Link to original YouTube video
  source_video_title TEXT,  -- Original video title for reference

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'public', 'archived')),

  -- AI metadata
  ai_model TEXT,  -- Which AI model generated this
  ai_prompt_version TEXT,  -- Version of prompt used

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Article tags junction table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_creator_id ON articles(creator_id);
CREATE INDEX IF NOT EXISTS idx_articles_source_post_id ON articles(source_post_id);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag_id ON article_tags(tag_id);

-- Enable RLS (Row Level Security)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles
-- Public can read published articles
CREATE POLICY "Public can view public articles"
  ON articles FOR SELECT
  USING (status = 'public');

-- Authenticated users can create articles (for n8n/AI workflow)
CREATE POLICY "Service role can insert articles"
  ON articles FOR INSERT
  WITH CHECK (true);

-- Service role can update articles
CREATE POLICY "Service role can update articles"
  ON articles FOR UPDATE
  USING (true);

-- RLS Policies for article_tags
CREATE POLICY "Public can view article tags"
  ON article_tags FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage article tags"
  ON article_tags FOR ALL
  USING (true);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS articles_updated_at ON articles;
CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_articles_updated_at();

-- Grant permissions (adjust as needed)
GRANT SELECT ON articles TO anon;
GRANT SELECT ON article_tags TO anon;
GRANT ALL ON articles TO authenticated;
GRANT ALL ON article_tags TO authenticated;

-- Comments
COMMENT ON TABLE articles IS 'AI-generated articles from video transcripts';
COMMENT ON TABLE article_tags IS 'Many-to-many relationship between articles and tags';
COMMENT ON COLUMN articles.source_post_id IS 'Reference to the original video post this article was generated from';
COMMENT ON COLUMN articles.ai_model IS 'The AI model used to generate this article (e.g., gpt-4, claude-3)';

-- ============================================================
-- Add article_id column to posts table (run AFTER creating articles table)
-- This links a video post to its generated article
-- ============================================================
ALTER TABLE posts ADD COLUMN IF NOT EXISTS article_id UUID REFERENCES articles(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_posts_article_id ON posts(article_id);
COMMENT ON COLUMN posts.article_id IS 'Reference to AI-generated article from this video transcript';

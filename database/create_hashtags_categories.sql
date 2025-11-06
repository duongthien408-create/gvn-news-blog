-- Create hashtags table
CREATE TABLE IF NOT EXISTS hashtags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#ef4444', -- Default red color
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7) DEFAULT '#3b82f6', -- Default blue color
  post_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Peripherals', 'peripherals', 'Gaming peripherals: keyboards, mice, headsets', 'headphones', '#ef4444'),
  ('Hardware', 'hardware', 'PC hardware: GPU, CPU, RAM, SSD', 'cpu', '#3b82f6'),
  ('Gaming', 'gaming', 'Gaming news and reviews', 'gamepad-2', '#8b5cf6'),
  ('Tech News', 'tech-news', 'Technology news and updates', 'newspaper', '#f59e0b')
ON CONFLICT (slug) DO NOTHING;

-- Insert default hashtags
INSERT INTO hashtags (name, slug, description, color) VALUES
  ('Review', 'review', 'Product reviews', '#ef4444'),
  ('Gearvn', 'gearvn', 'Gearvn channel content', '#dc2626'),
  ('YouTube', 'youtube', 'YouTube videos', '#dc2626'),
  ('Windows', 'windows', 'Windows OS related', '#0ea5e9'),
  ('Windows 11', 'windows-11', 'Windows 11 features', '#0284c7'),
  ('Battery', 'battery', 'Battery tips and tricks', '#10b981'),
  ('Tips', 'tips', 'Tips and tricks', '#f59e0b'),
  ('HyperX', 'hyperx', 'HyperX products', '#b91c1c'),
  ('Gaming', 'gaming', 'Gaming related', '#8b5cf6'),
  ('Tech News', 'tech-news', 'Technology news', '#f59e0b')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hashtags_slug ON hashtags(slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Add RLS (Row Level Security) policies
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on hashtags"
  ON hashtags FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on categories"
  ON categories FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert on hashtags"
  ON hashtags FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on hashtags"
  ON hashtags FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete on hashtags"
  ON hashtags FOR DELETE
  USING (true);

CREATE POLICY "Allow authenticated insert on categories"
  ON categories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on categories"
  ON categories FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete on categories"
  ON categories FOR DELETE
  USING (true);

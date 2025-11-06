-- ============================================
-- MIGRATION: Add Video Fields to Posts Table
-- Date: 2025-11-06
-- Description: Thêm các trường cần thiết cho video content
-- ============================================

-- Bước 1: Thêm các cột mới cho video
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_thumbnail TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_duration VARCHAR(20);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS video_platform VARCHAR(50) DEFAULT 'youtube';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS transcript TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_type VARCHAR(20) DEFAULT 'article';

-- Bước 2: Tạo indexes để tìm kiếm nhanh hơn
CREATE INDEX IF NOT EXISTS idx_posts_content_type ON posts(content_type);
CREATE INDEX IF NOT EXISTS idx_posts_video_platform ON posts(video_platform);

-- Bước 3: Verify các cột đã được tạo
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'posts'
  AND column_name IN (
    'video_url',
    'video_thumbnail',
    'video_duration',
    'video_platform',
    'transcript',
    'content_type'
  )
ORDER BY ordinal_position;

-- ============================================
-- DONE! Tiếp theo chạy file 02-insert-sample-videos.sql
-- ============================================

-- ============================================
-- QUICK UPDATE POST CREATORS
-- Fast version using CASE statement
-- Date: 2025-11-06
-- ============================================

-- Update all posts with creators using modulo for even distribution
WITH numbered_posts AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM posts
)
UPDATE posts
SET creator_id = CASE
  WHEN (numbered_posts.rn % 5) = 1 THEN '1'  -- Thuận Nguyễn
  WHEN (numbered_posts.rn % 5) = 2 THEN '2'  -- Bình Bear
  WHEN (numbered_posts.rn % 5) = 3 THEN '3'  -- Tài Xài Tech
  WHEN (numbered_posts.rn % 5) = 4 THEN '4'  -- Ngọc Sang
  ELSE '5'                                    -- Dương Thiện
END
FROM numbered_posts
WHERE posts.id = numbered_posts.id;

-- Verify distribution
SELECT
  u.full_name,
  COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.creator_id::INTEGER = u.id
WHERE u.id IN (1, 2, 3, 4, 5)
GROUP BY u.id, u.full_name
ORDER BY u.id;

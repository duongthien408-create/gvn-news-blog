-- ============================================
-- UPDATE POST CREATORS
-- Assign all posts to 5 test users evenly
-- Date: 2025-11-06
-- ============================================

-- User IDs:
-- 1 = Thuận Nguyễn (thuan_nguyen)
-- 2 = Bình Bear (binh_bear)
-- 3 = Tài Xài Tech (tai_xai_tech)
-- 4 = Ngọc Sang (ngoc_sang)
-- 5 = Dương Thiện (duong_thien)

-- Strategy: Assign posts by row number modulo 5
-- This ensures even distribution across all 5 users

-- Create temporary sequence for post assignment
DO $$
DECLARE
  post_record RECORD;
  user_ids INTEGER[] := ARRAY[1, 2, 3, 4, 5];
  counter INTEGER := 0;
  assigned_user_id INTEGER;
BEGIN
  -- Loop through all posts and assign creators
  FOR post_record IN
    SELECT id FROM posts ORDER BY created_at
  LOOP
    -- Calculate which user to assign (round-robin)
    assigned_user_id := user_ids[(counter % 5) + 1];

    -- Update the post
    UPDATE posts
    SET creator_id = assigned_user_id
    WHERE id = post_record.id;

    -- Increment counter
    counter := counter + 1;
  END LOOP;

  RAISE NOTICE 'Updated % posts with creators', counter;
END $$;

-- Verify the distribution
SELECT
  u.id,
  u.full_name,
  u.username,
  COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON p.creator_id::INTEGER = u.id
WHERE u.id IN (1, 2, 3, 4, 5)
GROUP BY u.id, u.full_name, u.username
ORDER BY u.id;

-- Check sample posts per user
SELECT
  u.full_name as creator,
  p.title,
  p.created_at
FROM posts p
JOIN users u ON u.id = p.creator_id::INTEGER
WHERE u.id IN (1, 2, 3, 4, 5)
ORDER BY u.id, p.created_at DESC
LIMIT 20;

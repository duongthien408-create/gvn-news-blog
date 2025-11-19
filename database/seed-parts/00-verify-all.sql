-- =====================================================
-- VERIFY ALL DATA - Kiểm tra toàn bộ database
-- =====================================================
-- Chạy file này sau khi đã chạy xong tất cả các parts để verify

-- Count all records
SELECT
  'SUMMARY' as category,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM user_profiles) as profiles,
  (SELECT COUNT(*) FROM creators) as creators,
  (SELECT COUNT(*) FROM tags) as tags,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM posts) as posts,
  (SELECT COUNT(*) FROM comments) as comments,
  (SELECT COUNT(*) FROM votes) as votes,
  (SELECT COUNT(*) FROM bookmarks) as bookmarks,
  (SELECT COUNT(*) FROM follows) as follows,
  (SELECT COUNT(*) FROM squads) as squads,
  (SELECT COUNT(*) FROM achievements) as achievements;

-- Expected results:
-- users: 10
-- profiles: 10
-- creators: 5
-- tags: 15
-- products: 10
-- posts: 10
-- comments: 20
-- votes: ~40
-- bookmarks: ~15
-- follows: ~20
-- squads: 5
-- achievements: 7

-- =====================================================
-- DETAILED VERIFICATION
-- =====================================================

-- 1. Users with levels and streaks
SELECT
  u.username,
  up.display_name,
  ul.level,
  ul.total_points,
  s.current_streak,
  COUNT(ua.achievement_id) as achievements
FROM users u
JOIN user_profiles up ON u.id = up.user_id
JOIN user_levels ul ON u.id = ul.user_id
JOIN streaks s ON u.id = s.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.username, up.display_name, ul.level, ul.total_points, s.current_streak
ORDER BY ul.level DESC;

-- 2. Creators with followers
SELECT
  c.name,
  c.verified,
  c.total_followers as total_subs,
  COUNT(f.follower_id) as platform_followers,
  COUNT(cs.platform) as social_platforms
FROM creators c
LEFT JOIN follows f ON c.id = f.creator_id
LEFT JOIN creator_socials cs ON c.id = cs.creator_id
GROUP BY c.id, c.name, c.verified, c.total_followers
ORDER BY c.total_followers DESC;

-- 3. Posts with engagement
SELECT
  p.title,
  c.name as creator,
  p.view_count,
  p.upvote_count,
  p.comment_count,
  COUNT(DISTINCT pt.tag_id) as tags,
  COUNT(DISTINCT pp.product_id) as products
FROM posts p
LEFT JOIN post_creators pc ON p.id = pc.post_id
LEFT JOIN creators c ON pc.creator_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN post_products pp ON p.id = pp.post_id
GROUP BY p.id, p.title, c.name, p.view_count, p.upvote_count, p.comment_count
ORDER BY p.view_count DESC;

-- 4. Popular tags
SELECT
  t.name,
  t.slug,
  COUNT(pt.post_id) as post_count
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id
GROUP BY t.id, t.name, t.slug
ORDER BY post_count DESC, t.name;

-- 5. Products by category
SELECT
  pc.name as category,
  COUNT(p.id) as product_count,
  MIN(p.price) as min_price,
  MAX(p.price) as max_price
FROM product_categories pc
LEFT JOIN products p ON pc.id = p.category_id
GROUP BY pc.id, pc.name
ORDER BY pc.name;

-- 6. Comments with replies
SELECT
  'Top-level comments' as type,
  COUNT(*) as count
FROM comments
WHERE parent_id IS NULL
UNION ALL
SELECT
  'Replies' as type,
  COUNT(*) as count
FROM comments
WHERE parent_id IS NOT NULL;

-- 7. Squads activity
SELECT
  s.name,
  s.member_count,
  COUNT(DISTINCT sm.user_id) as actual_members,
  COUNT(DISTINCT sp.post_id) as posts
FROM squads s
LEFT JOIN squad_members sm ON s.id = sm.squad_id
LEFT JOIN squad_posts sp ON s.id = sp.squad_id
GROUP BY s.id, s.name, s.member_count
ORDER BY s.member_count DESC;

-- 8. Most active users
SELECT
  u.username,
  COUNT(DISTINCT c.id) as comments,
  COUNT(DISTINCT v.post_id) as votes,
  COUNT(DISTINCT b.post_id) as bookmarks,
  COUNT(DISTINCT f.creator_id) as follows
FROM users u
LEFT JOIN comments c ON u.id = c.user_id
LEFT JOIN votes v ON u.id = v.user_id
LEFT JOIN bookmarks b ON u.id = b.user_id
LEFT JOIN follows f ON u.id = f.follower_id
GROUP BY u.id, u.username
ORDER BY comments DESC, votes DESC
LIMIT 10;

-- 9. Achievement completion
SELECT
  a.name,
  a.points_reward,
  COUNT(ua.user_id) as unlocked_by,
  ROUND(COUNT(ua.user_id) * 100.0 / (SELECT COUNT(*) FROM users), 1) as completion_rate
FROM achievements a
LEFT JOIN user_achievements ua ON a.id = ua.achievement_id
GROUP BY a.id, a.name, a.points_reward
ORDER BY completion_rate DESC;

-- 10. Data integrity check
SELECT
  'Posts without creators' as issue,
  COUNT(*) as count
FROM posts p
LEFT JOIN post_creators pc ON p.id = pc.post_id
WHERE pc.creator_id IS NULL
UNION ALL
SELECT
  'Posts without tags' as issue,
  COUNT(*) as count
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
WHERE pt.tag_id IS NULL
UNION ALL
SELECT
  'Users without profiles' as issue,
  COUNT(*) as count
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE up.user_id IS NULL
UNION ALL
SELECT
  'Users without levels' as issue,
  COUNT(*) as count
FROM users u
LEFT JOIN user_levels ul ON u.id = ul.user_id
WHERE ul.user_id IS NULL;

-- Expected: All counts should be 0 (no data integrity issues)

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT
  '✅ Database verification complete!' as status,
  'All seed data loaded successfully' as message;

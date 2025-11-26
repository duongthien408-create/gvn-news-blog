-- =====================================================
-- PART 9: GAMIFICATION (Achievements & User Progress)
-- =====================================================

-- Achievements
INSERT INTO achievements (id, name, slug, description, icon_name, requirement_type, requirement_value, points_reward, created_at) VALUES
('d50e8400-e29b-41d4-a716-446655440001',
 'First Steps',
 'first-steps',
 'Create your first comment on any post',
 'message-circle',
 'comments', 1, 10,
 NOW() - INTERVAL '1 year'),

('d50e8400-e29b-41d4-a716-446655440002',
 'Conversation Starter',
 'conversation-starter',
 'Post 10 comments',
 'message-square',
 'comments', 10, 50,
 NOW() - INTERVAL '1 year'),

('d50e8400-e29b-41d4-a716-446655440003',
 'Bookworm',
 'bookworm',
 'Bookmark 5 posts to read later',
 'bookmark',
 'bookmarks', 5, 25,
 NOW() - INTERVAL '1 year'),

('d50e8400-e29b-41d4-a716-446655440004',
 'Dedicated Reader',
 'dedicated-reader',
 'Read 50 posts',
 'book-open',
 'post_views', 50, 100,
 NOW() - INTERVAL '1 year'),

('d50e8400-e29b-41d4-a716-446655440005',
 'Community Builder',
 'community-builder',
 'Join 3 squads',
 'users',
 'squad_joins', 3, 75,
 NOW() - INTERVAL '1 year'),

('d50e8400-e29b-41d4-a716-446655440006',
 'Streak Master',
 'streak-master',
 'Maintain a 7-day login streak',
 'flame',
 'login_streak', 7, 150,
 NOW() - INTERVAL '1 year'),

('d50e8400-e29b-41d4-a716-446655440007',
 'Tech Influencer',
 'tech-influencer',
 'Follow 5 creators',
 'user-plus',
 'creator_follows', 5, 50,
 NOW() - INTERVAL '1 year');

-- User Achievements (who unlocked what)
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES
-- Admin unlocked all achievements
('550e8400-e29b-41d4-a716-446655440001', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '11 months'),
('550e8400-e29b-41d4-a716-446655440001', 'd50e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '10 months'),
('550e8400-e29b-41d4-a716-446655440001', 'd50e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '9 months'),
('550e8400-e29b-41d4-a716-446655440001', 'd50e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '8 months'),
('550e8400-e29b-41d4-a716-446655440001', 'd50e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '7 months'),
('550e8400-e29b-41d4-a716-446655440001', 'd50e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440001', 'd50e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '5 months'),

-- Tech Guru achievements
('550e8400-e29b-41d4-a716-446655440002', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '9 months'),
('550e8400-e29b-41d4-a716-446655440002', 'd50e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '8 months'),
('550e8400-e29b-41d4-a716-446655440002', 'd50e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '7 months'),
('550e8400-e29b-41d4-a716-446655440002', 'd50e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440002', 'd50e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '5 months'),
('550e8400-e29b-41d4-a716-446655440002', 'd50e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '4 months'),

-- Gamer Pro achievements
('550e8400-e29b-41d4-a716-446655440003', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '8 months'),
('550e8400-e29b-41d4-a716-446655440003', 'd50e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '7 months'),
('550e8400-e29b-41d4-a716-446655440003', 'd50e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440003', 'd50e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '5 months'),
('550e8400-e29b-41d4-a716-446655440003', 'd50e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '4 months'),

-- PC Builder achievements
('550e8400-e29b-41d4-a716-446655440004', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '7 months'),
('550e8400-e29b-41d4-a716-446655440004', 'd50e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440004', 'd50e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '5 months'),
('550e8400-e29b-41d4-a716-446655440004', 'd50e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440004', 'd50e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '3 months'),

-- Hardware Fan achievements
('550e8400-e29b-41d4-a716-446655440005', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440005', 'd50e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '5 months'),
('550e8400-e29b-41d4-a716-446655440005', 'd50e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '4 months'),

-- Review Master achievements
('550e8400-e29b-41d4-a716-446655440006', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 months'),
('550e8400-e29b-41d4-a716-446655440006', 'd50e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440006', 'd50e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '3 months'),
('550e8400-e29b-41d4-a716-446655440006', 'd50e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440006', 'd50e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '1 month'),

-- Newbie achievements (fewer)
('550e8400-e29b-41d4-a716-446655440007', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 months'),
('550e8400-e29b-41d4-a716-446655440007', 'd50e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '2 months'),

-- Tech Enthusiast achievements
('550e8400-e29b-41d4-a716-446655440008', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440008', 'd50e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 months'),
('550e8400-e29b-41d4-a716-446655440008', 'd50e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440008', 'd50e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '1 month'),

-- Veteran Gamer achievements
('550e8400-e29b-41d4-a716-446655440009', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '10 months'),
('550e8400-e29b-41d4-a716-446655440009', 'd50e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '9 months'),
('550e8400-e29b-41d4-a716-446655440009', 'd50e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '8 months'),
('550e8400-e29b-41d4-a716-446655440009', 'd50e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '7 months'),

-- Tech Explorer achievements (newest user, fewer achievements)
('550e8400-e29b-41d4-a716-446655440010', 'd50e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 months');

-- Update user levels based on achievements
UPDATE user_levels SET
  level = 10,
  total_points = 560,
  level_progress = 60
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'; -- Admin

UPDATE user_levels SET
  level = 8,
  total_points = 410,
  level_progress = 10
WHERE user_id = '550e8400-e29b-41d4-a716-446655440002'; -- Tech Guru

UPDATE user_levels SET
  level = 7,
  total_points = 285,
  level_progress = 85
WHERE user_id = '550e8400-e29b-41d4-a716-446655440003'; -- Gamer Pro

UPDATE user_levels SET
  level = 6,
  total_points = 260,
  level_progress = 60
WHERE user_id = '550e8400-e29b-41d4-a716-446655440004'; -- PC Builder

UPDATE user_levels SET
  level = 5,
  total_points = 135,
  level_progress = 35
WHERE user_id = '550e8400-e29b-41d4-a716-446655440005'; -- Hardware Fan

UPDATE user_levels SET
  level = 6,
  total_points = 210,
  level_progress = 10
WHERE user_id = '550e8400-e29b-41d4-a716-446655440006'; -- Review Master

UPDATE user_levels SET
  level = 2,
  total_points = 35,
  level_progress = 35
WHERE user_id = '550e8400-e29b-41d4-a716-446655440007'; -- Newbie

UPDATE user_levels SET
  level = 4,
  total_points = 135,
  level_progress = 35
WHERE user_id = '550e8400-e29b-41d4-a716-446655440008'; -- Tech Enthusiast

UPDATE user_levels SET
  level = 7,
  total_points = 320,
  level_progress = 20
WHERE user_id = '550e8400-e29b-41d4-a716-446655440009'; -- Veteran Gamer

UPDATE user_levels SET
  level = 1,
  total_points = 10,
  level_progress = 10
WHERE user_id = '550e8400-e29b-41d4-a716-446655440010'; -- Tech Explorer

-- Update streaks
UPDATE streaks SET
  current_streak = 15,
  longest_streak = 30
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001'; -- Admin

UPDATE streaks SET
  current_streak = 12,
  longest_streak = 25
WHERE user_id = '550e8400-e29b-41d4-a716-446655440002'; -- Tech Guru

UPDATE streaks SET
  current_streak = 8,
  longest_streak = 18
WHERE user_id = '550e8400-e29b-41d4-a716-446655440003'; -- Gamer Pro

UPDATE streaks SET
  current_streak = 10,
  longest_streak = 22
WHERE user_id = '550e8400-e29b-41d4-a716-446655440004'; -- PC Builder

UPDATE streaks SET
  current_streak = 5,
  longest_streak = 12
WHERE user_id = '550e8400-e29b-41d4-a716-446655440005'; -- Hardware Fan

UPDATE streaks SET
  current_streak = 7,
  longest_streak = 15
WHERE user_id = '550e8400-e29b-41d4-a716-446655440006'; -- Review Master

UPDATE streaks SET
  current_streak = 2,
  longest_streak = 5
WHERE user_id = '550e8400-e29b-41d4-a716-446655440007'; -- Newbie

UPDATE streaks SET
  current_streak = 6,
  longest_streak = 14
WHERE user_id = '550e8400-e29b-41d4-a716-446655440008'; -- Tech Enthusiast

UPDATE streaks SET
  current_streak = 20,
  longest_streak = 45
WHERE user_id = '550e8400-e29b-41d4-a716-446655440009'; -- Veteran Gamer

UPDATE streaks SET
  current_streak = 1,
  longest_streak = 3
WHERE user_id = '550e8400-e29b-41d4-a716-446655440010'; -- Tech Explorer

-- Verify achievements
SELECT
  a.name as achievement,
  a.description,
  a.points_reward,
  COUNT(ua.user_id) as unlocked_by
FROM achievements a
LEFT JOIN user_achievements ua ON a.id = ua.achievement_id
GROUP BY a.id, a.name, a.description, a.points_reward
ORDER BY a.created_at;

-- Verify user progress
SELECT
  u.username,
  ul.level,
  ul.total_points,
  s.current_streak,
  s.longest_streak,
  COUNT(ua.achievement_id) as achievements_unlocked
FROM users u
JOIN user_levels ul ON u.id = ul.user_id
JOIN streaks s ON u.id = s.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.username, ul.level, ul.total_points, s.current_streak, s.longest_streak
ORDER BY ul.level DESC, ul.total_points DESC;

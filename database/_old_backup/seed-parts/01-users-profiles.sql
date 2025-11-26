-- =====================================================
-- PART 1: USER PROFILES
-- =====================================================
-- Populate user profile details
-- Run this AFTER the main schema has created users

-- User 1: Admin
UPDATE user_profiles SET
  display_name = 'Admin GearVN',
  bio = 'Administrator của GearVN Blog - Nơi chia sẻ đam mê công nghệ',
  avatar_url = 'https://i.pravatar.cc/150?u=admin'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';

-- User 2: Tech Guru
UPDATE user_profiles SET
  display_name = 'Tech Guru',
  bio = 'Đam mê công nghệ và gaming. Luôn cập nhật xu hướng mới nhất!',
  avatar_url = 'https://i.pravatar.cc/150?u=user1'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';

-- User 3: Gamer Pro
UPDATE user_profiles SET
  display_name = 'Gamer Pro',
  bio = 'Chuyên gia về gaming gear và esports',
  avatar_url = 'https://i.pravatar.cc/150?u=user2'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440003';

-- User 4: PC Builder
UPDATE user_profiles SET
  display_name = 'PC Builder',
  bio = 'Build PC là đam mê. Tư vấn cấu hình miễn phí!',
  avatar_url = 'https://i.pravatar.cc/150?u=user3'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440004';

-- User 5: Hardware Fan
UPDATE user_profiles SET
  display_name = 'Hardware Fan',
  bio = 'Yêu thích nghiên cứu về phần cứng máy tính',
  avatar_url = 'https://i.pravatar.cc/150?u=user4'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440005';

-- User 6: Review Master
UPDATE user_profiles SET
  display_name = 'Review Master',
  bio = 'Reviewer chuyên nghiệp, đánh giá khách quan',
  avatar_url = 'https://i.pravatar.cc/150?u=user5'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440006';

-- User 7: Newbie
UPDATE user_profiles SET
  display_name = 'Newbie',
  bio = 'Người mới bắt đầu tìm hiểu về PC gaming',
  avatar_url = 'https://i.pravatar.cc/150?u=user6'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440007';

-- User 8: Tech Enthusiast
UPDATE user_profiles SET
  display_name = 'Tech Enthusiast',
  bio = 'Người đam mê công nghệ, thích thử nghiệm',
  avatar_url = 'https://i.pravatar.cc/150?u=user7'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440008';

-- User 9: Veteran Gamer
UPDATE user_profiles SET
  display_name = 'Veteran Gamer',
  bio = 'Lão làng trong làng game, 10 năm kinh nghiệm',
  avatar_url = 'https://i.pravatar.cc/150?u=user8'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440009';

-- User 10: Tech Explorer
UPDATE user_profiles SET
  display_name = 'Tech Explorer',
  bio = 'Khám phá công nghệ mới mỗi ngày',
  avatar_url = 'https://i.pravatar.cc/150?u=user9'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440010';

-- Verify
SELECT u.id, u.username, up.display_name, up.bio
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
ORDER BY u.created_at
LIMIT 10;

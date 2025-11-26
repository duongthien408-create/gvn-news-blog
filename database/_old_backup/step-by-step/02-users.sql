-- BƯỚC 2: Insert Users
INSERT INTO users (id, email, password_hash, username, role, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@gearvn.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'admin', 'active', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'user1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'techguru', 'user', 'active', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'user2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gamerpro', 'user', 'active', NOW());

-- User profiles tự động tạo bởi trigger, giờ update thông tin
UPDATE user_profiles SET
  display_name = 'Admin GearVN',
  bio = 'Administrator',
  avatar_url = 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE user_profiles SET
  display_name = 'Tech Guru',
  bio = 'Tech enthusiast',
  avatar_url = 'https://ui-avatars.com/api/?name=Tech+Guru&background=7C3AED&color=fff'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE user_profiles SET
  display_name = 'Gamer Pro',
  bio = 'Pro gamer',
  avatar_url = 'https://ui-avatars.com/api/?name=Gamer+Pro&background=DC2626&color=fff'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440003';

-- Kiểm tra
SELECT u.username, up.display_name FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id;

-- ============================================
-- SIMPLE IMPORT DATA - Fix lỗi import
-- Chạy file này trong Supabase SQL Editor
-- ============================================

-- BƯỚC 1: Clean data cũ
DELETE FROM votes;
DELETE FROM comment_votes;
DELETE FROM bookmarks;
DELETE FROM follows;
DELETE FROM squad_members;
DELETE FROM squad_posts;
DELETE FROM user_achievements;
DELETE FROM comments;
DELETE FROM post_products;
DELETE FROM post_tags;
DELETE FROM post_creators;
DELETE FROM post_media;
DELETE FROM posts;
DELETE FROM products;
DELETE FROM tags;
DELETE FROM squads;
DELETE FROM sources;
DELETE FROM creator_socials;
DELETE FROM creators;
DELETE FROM achievements;
DELETE FROM brands;
DELETE FROM product_categories;
DELETE FROM streaks;
DELETE FROM user_levels;
DELETE FROM user_preferences;
DELETE FROM user_profiles;
DELETE FROM users;

-- BƯỚC 2: Insert Users
INSERT INTO users (id, email, password_hash, username, role, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@gearvn.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'admin', 'active', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'user1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'techguru', 'user', 'active', NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'user2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'gamerpro', 'user', 'active', NOW());

-- User profiles sẽ tự động tạo bởi trigger
UPDATE user_profiles SET display_name = 'Admin GearVN', bio = 'Administrator', avatar_url = 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff' WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE user_profiles SET display_name = 'Tech Guru', bio = 'Tech enthusiast', avatar_url = 'https://ui-avatars.com/api/?name=Tech+Guru&background=7C3AED&color=fff' WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE user_profiles SET display_name = 'Gamer Pro', bio = 'Pro gamer', avatar_url = 'https://ui-avatars.com/api/?name=Gamer+Pro&background=DC2626&color=fff' WHERE user_id = '550e8400-e29b-41d4-a716-446655440003';

-- BƯỚC 3: Insert Creators
INSERT INTO creators (id, name, slug, bio, avatar_url, verified, website, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Scrapshut', 'scrapshut', 'Kênh YouTube review công nghệ hàng đầu Việt Nam', 'https://ui-avatars.com/api/?name=Scrapshut&background=FF0000&color=fff', true, 'https://www.youtube.com/@scrapshut', NOW()),
('650e8400-e29b-41d4-a716-446655440002', 'Linus Tech Tips', 'linus-tech-tips', 'Tech reviews and PC building', 'https://ui-avatars.com/api/?name=LTT&background=FF6B00&color=fff', true, 'https://www.youtube.com/@LinusTechTips', NOW()),
('650e8400-e29b-41d4-a716-446655440003', 'Gamers Nexus', 'gamers-nexus', 'In-depth hardware analysis', 'https://ui-avatars.com/api/?name=GN&background=1E40AF&color=fff', true, 'https://www.gamersnexus.net', NOW());

-- BƯỚC 4: Insert Tags
INSERT INTO tags (id, name, slug, icon_name) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Gaming', 'gaming', 'gamepad-2'),
('850e8400-e29b-41d4-a716-446655440002', 'PC Build', 'pc-build', 'cpu'),
('850e8400-e29b-41d4-a716-446655440003', 'Laptop', 'laptop', 'laptop'),
('850e8400-e29b-41d4-a716-446655440004', 'GPU', 'gpu', 'box'),
('850e8400-e29b-41d4-a716-446655440005', 'CPU', 'cpu', 'cpu'),
('850e8400-e29b-41d4-a716-446655440006', 'Mouse', 'mouse', 'mouse'),
('850e8400-e29b-41d4-a716-446655440007', 'Keyboard', 'keyboard', 'keyboard');

-- BƯỚC 5: Insert Sources
INSERT INTO sources (id, name, type, url, active) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Scrapshut YouTube', 'api', 'https://www.youtube.com/@scrapshut', true),
('750e8400-e29b-41d4-a716-446655440002', 'Linus Tech Tips', 'api', 'https://www.youtube.com/@LinusTechTips', true);

-- BƯỚC 6: Insert Posts với hình ảnh thật
INSERT INTO posts (id, title, slug, description, thumbnail_url, type, status, featured, source_id, upvote_count, comment_count, view_count, published_at, created_at) VALUES
('post-001', 'Đánh giá ASUS ROG Strix G15: Laptop gaming đỉnh cao', 'danh-gia-asus-rog-strix-g15', 'Review toàn diện laptop gaming ASUS ROG Strix G15 với RTX 4060', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800', 'review', 'published', true, '750e8400-e29b-41d4-a716-446655440001', 42, 5, 1250, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

('post-002', 'Top 5 chuột gaming tốt nhất 2024', 'top-5-chuot-gaming-2024', 'Tổng hợp 5 con chuột gaming đáng mua nhất năm 2024', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', 'video', 'published', true, '750e8400-e29b-41d4-a716-446655440001', 38, 8, 2100, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

('post-003', 'Hướng dẫn build PC gaming 30 triệu', 'build-pc-gaming-30-trieu', 'Hướng dẫn chi tiết cách build PC gaming với ngân sách 30 triệu', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440001', 56, 12, 3400, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

('post-004', 'RTX 4090 vs RTX 4080: So sánh chi tiết', 'rtx-4090-vs-rtx-4080', 'So sánh hiệu năng gaming giữa RTX 4090 và RTX 4080', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800', 'review', 'published', true, '750e8400-e29b-41d4-a716-446655440002', 67, 15, 4500, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

('post-005', 'AMD Ryzen 9 7950X: CPU mạnh nhất 2024', 'amd-ryzen-9-7950x-review', 'Đánh giá chi tiết AMD Ryzen 9 7950X', 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=800', 'review', 'published', true, '750e8400-e29b-41d4-a716-446655440002', 51, 9, 3200, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

('post-006', 'Bàn phím cơ cho người mới: A-Z', 'ban-phim-co-cho-nguoi-moi', 'Hướng dẫn chọn bàn phím cơ từ A đến Z', 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440001', 29, 6, 1800, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

('post-007', 'Màn hình 4K 144Hz: Có đáng mua?', 'man-hinh-4k-144hz-review', 'Phân tích về màn hình 4K 144Hz', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440002', 33, 7, 2200, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

('post-008', 'SSD NVMe Gen 4 vs Gen 3', 'ssd-gen4-vs-gen3', 'So sánh hiệu năng SSD Gen 4 và Gen 3', 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440001', 24, 4, 1500, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

('post-009', 'Tản nhiệt nước vs Tản nhiệt khí', 'tan-nhiet-nuoc-vs-khi', 'Phân tích ưu nhược điểm', 'https://images.unsplash.com/photo-1580982324337-babc29f9fc70?w=800', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440002', 41, 10, 2700, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

('post-010', 'Tai nghe gaming không dây 2024', 'tai-nghe-gaming-2024', 'Top tai nghe gaming wireless', 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800', 'video', 'published', true, '750e8400-e29b-41d4-a716-446655440001', 47, 11, 3100, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- BƯỚC 7: Link Posts với Creators
INSERT INTO post_creators (post_id, creator_id) VALUES
('post-001', '650e8400-e29b-41d4-a716-446655440001'),
('post-002', '650e8400-e29b-41d4-a716-446655440001'),
('post-003', '650e8400-e29b-41d4-a716-446655440001'),
('post-004', '650e8400-e29b-41d4-a716-446655440002'),
('post-005', '650e8400-e29b-41d4-a716-446655440002'),
('post-006', '650e8400-e29b-41d4-a716-446655440001'),
('post-007', '650e8400-e29b-41d4-a716-446655440002'),
('post-008', '650e8400-e29b-41d4-a716-446655440001'),
('post-009', '650e8400-e29b-41d4-a716-446655440002'),
('post-010', '650e8400-e29b-41d4-a716-446655440001');

-- BƯỚC 8: Link Posts với Tags
INSERT INTO post_tags (post_id, tag_id) VALUES
('post-001', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming
('post-001', '850e8400-e29b-41d4-a716-446655440003'), -- Laptop
('post-002', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming
('post-002', '850e8400-e29b-41d4-a716-446655440006'), -- Mouse
('post-003', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build
('post-004', '850e8400-e29b-41d4-a716-446655440004'), -- GPU
('post-005', '850e8400-e29b-41d4-a716-446655440005'), -- CPU
('post-006', '850e8400-e29b-41d4-a716-446655440007'), -- Keyboard
('post-007', '850e8400-e29b-41d4-a716-446655440003'), -- Monitor (dùng lại Laptop icon)
('post-008', '850e8400-e29b-41d4-a716-446655440002'), -- Storage (dùng PC Build icon)
('post-009', '850e8400-e29b-41d4-a716-446655440002'), -- Cooling (dùng PC Build icon)
('post-010', '850e8400-e29b-41d4-a716-446655440001'); -- Audio (dùng Gaming icon)

-- BƯỚC 9: Insert một vài comments
INSERT INTO comments (id, post_id, user_id, content, upvote_count, created_at) VALUES
('comment-001', 'post-001', '550e8400-e29b-41d4-a716-446655440002', 'Laptop này mình đang dùng, hiệu năng rất tốt!', 5, NOW() - INTERVAL '4 days'),
('comment-002', 'post-001', '550e8400-e29b-41d4-a716-446655440003', 'Pin có trụ được bao lâu khi chơi game?', 2, NOW() - INTERVAL '4 days'),
('comment-003', 'post-002', '550e8400-e29b-41d4-a716-446655440002', 'G Pro Superlight xứng đáng top 1!', 8, NOW() - INTERVAL '3 days'),
('comment-004', 'post-003', '550e8400-e29b-41d4-a716-446655440003', 'Cảm ơn bài hướng dẫn chi tiết!', 6, NOW() - INTERVAL '2 days'),
('comment-005', 'post-004', '550e8400-e29b-41d4-a716-446655440002', 'RTX 4080 vẫn ngon cho gaming 4K', 12, NOW() - INTERVAL '6 days');

-- Update tag post_count
UPDATE tags SET post_count = (SELECT COUNT(*) FROM post_tags WHERE post_tags.tag_id = tags.id);

-- Update creator total_posts
UPDATE creators SET total_posts = (SELECT COUNT(*) FROM post_creators WHERE post_creators.creator_id = creators.id);

-- ============================================
-- DONE! Kiểm tra kết quả
-- ============================================
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'creators', COUNT(*) FROM creators
UNION ALL SELECT 'posts', COUNT(*) FROM posts
UNION ALL SELECT 'tags', COUNT(*) FROM tags
UNION ALL SELECT 'comments', COUNT(*) FROM comments;

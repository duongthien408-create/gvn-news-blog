-- ============================================
-- GEARVN CREATOR HUB - SEED DATA
-- Version: 1.0
-- Description: Initial seed data for development and testing
-- ============================================

-- ============================================
-- 1. SEED CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Peripherals', 'peripherals', 'Gaming peripherals: keyboards, mice, headsets, monitors', 'headphones', '#ef4444'),
  ('Hardware', 'hardware', 'PC hardware: GPU, CPU, RAM, SSD, motherboards', 'cpu', '#3b82f6'),
  ('Gaming', 'gaming', 'Gaming news, game reviews, and gaming culture', 'gamepad-2', '#8b5cf6'),
  ('Tech News', 'tech-news', 'Latest technology news and industry updates', 'newspaper', '#f59e0b'),
  ('Laptops', 'laptops', 'Laptop reviews and recommendations', 'laptop', '#10b981'),
  ('Software', 'software', 'Software reviews, tips, and tutorials', 'code', '#06b6d4')
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color;

-- ============================================
-- 2. SEED HASHTAGS
-- ============================================
INSERT INTO hashtags (name, slug, description, color) VALUES
  ('Review', 'review', 'Product reviews and hands-on experiences', '#ef4444'),
  ('GearVN', 'gearvn', 'GearVN channel content and store updates', '#dc2626'),
  ('YouTube', 'youtube', 'YouTube video content', '#dc2626'),
  ('Windows', 'windows', 'Windows OS related content', '#0ea5e9'),
  ('Windows 11', 'windows-11', 'Windows 11 features and updates', '#0284c7'),
  ('Battery', 'battery', 'Battery life tips and optimization', '#10b981'),
  ('Tips', 'tips', 'Tips, tricks, and tutorials', '#f59e0b'),
  ('HyperX', 'hyperx', 'HyperX gaming products', '#b91c1c'),
  ('Gaming', 'gaming', 'Gaming related content', '#8b5cf6'),
  ('Tech News', 'tech-news', 'Technology news and updates', '#f59e0b'),
  ('Tutorial', 'tutorial', 'Step-by-step guides and tutorials', '#06b6d4'),
  ('Unboxing', 'unboxing', 'Product unboxing videos and posts', '#ec4899'),
  ('Benchmark', 'benchmark', 'Performance benchmarks and tests', '#8b5cf6'),
  ('Build Guide', 'build-guide', 'PC building guides and tips', '#3b82f6'),
  ('Deal', 'deal', 'Special deals and promotions', '#10b981')
ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  color = EXCLUDED.color;

-- ============================================
-- 3. SEED USERS
-- ============================================
-- Note: Password for all test users is "password123" (hashed with bcrypt)
-- Hash: $2a$10$rBV2wKFVhRcqKz7q5tZcAO5hJZp.Jx1VqVvW5X7J5Z4Hq3Z5vW5fK
INSERT INTO users (id, email, password_hash, username, full_name, avatar_url, bio, role, is_verified, youtube_url) VALUES
  (
    'user-1',
    'admin@gearvn.com',
    '$2a$10$rBV2wKFVhRcqKz7q5tZcAO5hJZp.Jx1VqVvW5X7J5Z4Hq3Z5vW5fK',
    'gearvn_admin',
    'GearVN Admin',
    'https://yt3.googleusercontent.com/ytc/AIdro_ljpMG-qW1QZWO8gHdvvQ6FMBDDy8CYdcFb2eJP=s160-c-k-c0x00ffffff-no-rj',
    'Official GearVN account - Your trusted gaming gear store',
    'admin',
    true,
    'https://www.youtube.com/@gearvn'
  ),
  (
    'user-2',
    'duong@gearvn.com',
    '$2a$10$rBV2wKFVhRcqKz7q5tZcAO5hJZp.Jx1VqVvW5X7J5Z4Hq3Z5vW5fK',
    'duong_gearvn',
    'Dương Nguyễn',
    'https://ui-avatars.com/api/?name=Duong+Nguyen&background=3b82f6&color=fff&size=256',
    'Tech enthusiast & content creator at GearVN',
    'creator',
    true,
    'https://www.youtube.com/@gearvn'
  ),
  (
    'user-3',
    'reviewer@gearvn.com',
    '$2a$10$rBV2wKFVhRcqKz7q5tZcAO5hJZp.Jx1VqVvW5X7J5Z4Hq3Z5vW5fK',
    'tech_reviewer',
    'Tech Reviewer',
    'https://ui-avatars.com/api/?name=Tech+Reviewer&background=ef4444&color=fff&size=256',
    'Professional tech reviewer specializing in gaming hardware',
    'creator',
    true,
    NULL
  ),
  (
    'user-4',
    'test@example.com',
    '$2a$10$rBV2wKFVhRcqKz7q5tZcAO5hJZp.Jx1VqVvW5X7J5Z4Hq3Z5vW5fK',
    'testuser',
    'Test User',
    'https://ui-avatars.com/api/?name=Test+User&background=10b981&color=fff&size=256',
    'Just a test account for development',
    'user',
    false,
    NULL
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  role = EXCLUDED.role,
  is_verified = EXCLUDED.is_verified,
  youtube_url = EXCLUDED.youtube_url;

-- ============================================
-- 4. SEED COMPANIES
-- ============================================
INSERT INTO companies (name, slug, logo_url, cover_image_url, description, tagline, website, industry, company_size, founded_year, owner_id, is_verified) VALUES
  (
    'GearVN',
    'gearvn',
    'https://yt3.googleusercontent.com/ytc/AIdro_ljpMG-qW1QZWO8gHdvvQ6FMBDDy8CYdcFb2eJP=s160-c-k-c0x00ffffff-no-rj',
    'https://gearvn.com/cdn/shop/files/gearvn-banner.jpg',
    'GearVN - Hệ thống cửa hàng gaming gear, PC, laptop uy tín hàng đầu Việt Nam. Chuyên cung cấp các sản phẩm gaming gear chính hãng, build PC theo yêu cầu, và tư vấn chuyên nghiệp.',
    'Your Trusted Gaming Gear Store',
    'https://gearvn.com',
    'Gaming & Technology',
    '201-500',
    2015,
    'user-1',
    true
  ),
  (
    'HyperX',
    'hyperx',
    'https://ui-avatars.com/api/?name=HyperX&background=b91c1c&color=fff&size=256',
    NULL,
    'HyperX is a leading gaming brand known for high-quality gaming peripherals including keyboards, mice, headsets, and memory.',
    'We''re All Gamers',
    'https://www.hyperx.com',
    'Gaming Peripherals',
    '500+',
    2002,
    NULL,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  logo_url = EXCLUDED.logo_url,
  description = EXCLUDED.description,
  tagline = EXCLUDED.tagline,
  website = EXCLUDED.website,
  industry = EXCLUDED.industry,
  company_size = EXCLUDED.company_size,
  founded_year = EXCLUDED.founded_year,
  is_verified = EXCLUDED.is_verified;

-- ============================================
-- 5. UPDATE USERS WITH COMPANY ASSOCIATION
-- ============================================
UPDATE users SET
  company_id = (SELECT id FROM companies WHERE slug = 'gearvn'),
  job_title = 'Content Creator'
WHERE id IN ('user-2', 'user-3');

-- ============================================
-- 6. SEED RSS SOURCES
-- ============================================
INSERT INTO sources (name, url, type, category, active, fetch_interval) VALUES
  ('GearVN YouTube Channel', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCWOKwbSMcelrq87KNyxRzlQ', 'youtube', 'Tech News', true, 60),
  ('Linus Tech Tips', 'https://www.youtube.com/feeds/videos.xml?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw', 'youtube', 'Hardware', true, 60),
  ('The Verge', 'https://www.theverge.com/rss/index.xml', 'rss', 'Tech News', true, 30),
  ('Tom''s Hardware', 'https://www.tomshardware.com/feeds/all', 'rss', 'Hardware', true, 30)
ON CONFLICT (url) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  category = EXCLUDED.category,
  active = EXCLUDED.active;

-- ============================================
-- 7. SEED SAMPLE POSTS (Articles)
-- ============================================
INSERT INTO posts (id, title, excerpt, content, cover_image, creator_id, creator_name, creator_avatar, category, tags, upvotes, comments_count, read_time, published, published_at, content_type) VALUES
  (
    'post-1',
    'Top 5 Gaming Keyboards Under $100 in 2024',
    'Looking for an affordable gaming keyboard? We''ve tested dozens of keyboards to bring you the best options under $100.',
    '# Top 5 Gaming Keyboards Under $100 in 2024

## Introduction
Finding the perfect gaming keyboard doesn''t have to break the bank. We''ve tested dozens of keyboards to bring you the best options under $100.

## 1. HyperX Alloy Origins Core
Mechanical switches, TKL design, and RGB lighting make this a solid choice.

## 2. Corsair K70 RGB
Full-size keyboard with Cherry MX switches and excellent build quality.

[Continue reading for full review...]',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    'user-2',
    'Dương Nguyễn',
    'https://ui-avatars.com/api/?name=Duong+Nguyen&background=3b82f6&color=fff&size=256',
    'Peripherals',
    ARRAY['Review', 'Gaming', 'Peripherals'],
    42,
    8,
    '5 min',
    true,
    NOW() - INTERVAL '2 days',
    'article'
  ),
  (
    'post-2',
    'RTX 4090 vs RTX 4080: Which One Should You Buy?',
    'A comprehensive comparison between NVIDIA''s flagship GPUs. We test gaming performance, ray tracing, and value for money.',
    '# RTX 4090 vs RTX 4080: Which One Should You Buy?

## Performance Comparison
The RTX 4090 offers 20-30% better performance in most games, but at a significant price premium.

## Ray Tracing Performance
Both cards excel at ray tracing, but the 4090 maintains higher frame rates at 4K.

[Continue reading for benchmark results...]',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800',
    'user-3',
    'Tech Reviewer',
    'https://ui-avatars.com/api/?name=Tech+Reviewer&background=ef4444&color=fff&size=256',
    'Hardware',
    ARRAY['Review', 'Benchmark', 'Hardware'],
    156,
    23,
    '8 min',
    true,
    NOW() - INTERVAL '1 day',
    'article'
  ),
  (
    'post-3',
    'How to Build Your First Gaming PC: Complete Guide',
    'Step-by-step guide for first-time PC builders. Learn how to choose components and assemble your dream gaming rig.',
    '# How to Build Your First Gaming PC: Complete Guide

## Choosing Your Components
1. **CPU**: AMD Ryzen or Intel Core?
2. **GPU**: The most important component for gaming
3. **RAM**: 16GB minimum for modern games
4. **Storage**: SSD for OS, HDD for games

## Assembly Steps
Follow these steps carefully to build your PC safely...

[Continue reading for full guide...]',
    'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800',
    'user-2',
    'Dương Nguyễn',
    'https://ui-avatars.com/api/?name=Duong+Nguyen&background=3b82f6&color=fff&size=256',
    'Hardware',
    ARRAY['Tutorial', 'Build Guide', 'Hardware'],
    98,
    34,
    '15 min',
    true,
    NOW() - INTERVAL '3 days',
    'article'
  ),
  (
    'post-4',
    'Windows 11 Tips: Optimize Your PC for Gaming',
    '10 essential Windows 11 tweaks to improve gaming performance and reduce input lag.',
    '# Windows 11 Tips: Optimize Your PC for Gaming

## 1. Disable Game Bar
While useful for some, Game Bar can impact performance.

## 2. Enable Hardware Accelerated GPU Scheduling
This can reduce latency and improve frame times.

## 3. Optimize Power Settings
Set your power plan to High Performance mode.

[Continue reading for all 10 tips...]',
    'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=800',
    'user-2',
    'Dương Nguyễn',
    'https://ui-avatars.com/api/?name=Duong+Nguyen&background=3b82f6&color=fff&size=256',
    'Software',
    ARRAY['Windows 11', 'Tips', 'Gaming'],
    67,
    12,
    '6 min',
    true,
    NOW() - INTERVAL '5 days',
    'article'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  cover_image = EXCLUDED.cover_image,
  upvotes = EXCLUDED.upvotes,
  comments_count = EXCLUDED.comments_count;

-- ============================================
-- 8. SEED SAMPLE POSTS (Videos)
-- ============================================
INSERT INTO posts (id, title, excerpt, cover_image, creator_id, creator_name, creator_avatar, category, tags, upvotes, comments_count, published, published_at, content_type, video_url, video_thumbnail, video_duration, video_platform) VALUES
  (
    'post-video-1',
    'HyperX Cloud III Wireless - Tai Nghe Gaming Không Dây Đáng Mua Nhất 2024?',
    'Review chi tiết tai nghe gaming HyperX Cloud III Wireless - thiết kế mới, âm thanh cải tiến, pin 120 giờ đỉnh cao!',
    'https://i.ytimg.com/vi/E7C_8dG_Hxs/maxresdefault.jpg',
    'user-1',
    'GearVN Admin',
    'https://yt3.googleusercontent.com/ytc/AIdro_ljpMG-qW1QZWO8gHdvvQ6FMBDDy8CYdcFb2eJP=s160-c-k-c0x00ffffff-no-rj',
    'Peripherals',
    ARRAY['Review', 'HyperX', 'GearVN', 'YouTube'],
    89,
    15,
    true,
    NOW() - INTERVAL '1 day',
    'video',
    'https://www.youtube.com/watch?v=E7C_8dG_Hxs',
    'https://i.ytimg.com/vi/E7C_8dG_Hxs/maxresdefault.jpg',
    '12:34',
    'youtube'
  ),
  (
    'post-video-2',
    'Tiết Kiệm Pin Laptop Hiệu Quả - Tăng Gấp Đôi Thời Lượng Pin!',
    'Hướng dẫn chi tiết cách tiết kiệm pin laptop trên Windows 11. Áp dụng ngay để tăng gấp đôi thời lượng sử dụng!',
    'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    'user-1',
    'GearVN Admin',
    'https://yt3.googleusercontent.com/ytc/AIdro_ljpMG-qW1QZWO8gHdvvQ6FMBDDy8CYdcFb2eJP=s160-c-k-c0x00ffffff-no-rj',
    'Software',
    ARRAY['Tips', 'Windows 11', 'Battery', 'GearVN'],
    64,
    9,
    true,
    NOW() - INTERVAL '3 days',
    'video',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    '08:42',
    'youtube'
  ),
  (
    'post-video-3',
    'Build PC Gaming 20 Triệu 2024 - Chiến Mượt Mọi Game AAA!',
    'Build PC gaming tầm 20 triệu hiệu năng khủng: RTX 4060 Ti + Ryzen 5 7600X. Test game thực tế Cyberpunk, Elden Ring!',
    'https://i.ytimg.com/vi/abc123/maxresdefault.jpg',
    'user-2',
    'Dương Nguyễn',
    'https://ui-avatars.com/api/?name=Duong+Nguyen&background=3b82f6&color=fff&size=256',
    'Hardware',
    ARRAY['Build Guide', 'Gaming', 'Benchmark'],
    134,
    28,
    true,
    NOW() - INTERVAL '2 days',
    'video',
    'https://www.youtube.com/watch?v=abc123',
    'https://i.ytimg.com/vi/abc123/maxresdefault.jpg',
    '18:26',
    'youtube'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  upvotes = EXCLUDED.upvotes,
  comments_count = EXCLUDED.comments_count;

-- ============================================
-- 9. SEED COMMENTS
-- ============================================
INSERT INTO comments (post_id, user_id, content, parent_id) VALUES
  ('post-1', 'user-3', 'Great review! I just bought the HyperX Alloy Origins Core and it''s amazing!', NULL),
  ('post-1', 'user-2', 'Thanks! Glad you liked it. The build quality on that keyboard is excellent.', 1),
  ('post-1', 'user-4', 'What about the Razer BlackWidow? Is it worth the extra cost?', NULL),
  ('post-2', 'user-4', 'Still rocking my RTX 3080. Is the 4090 worth the upgrade?', NULL),
  ('post-2', 'user-3', 'If you''re gaming at 4K and want max settings, yes. Otherwise, 3080 is still solid.', 4),
  ('post-3', 'user-4', 'This guide helped me build my first PC! Thank you!', NULL),
  ('post-video-1', 'user-3', 'Tai nghe này pin cực trâu, dùng cả tuần không cần sạc!', NULL),
  ('post-video-2', 'user-4', 'Áp dụng được 5/10 tips và pin laptop tăng từ 4h lên 6h rồi!', NULL);

-- ============================================
-- 10. SEED USER INTERACTIONS
-- ============================================

-- User follows
INSERT INTO user_followers (follower_id, following_id) VALUES
  ('user-4', 'user-1'),
  ('user-4', 'user-2'),
  ('user-3', 'user-2'),
  ('user-2', 'user-1')
ON CONFLICT (follower_id, following_id) DO NOTHING;

-- Company follows
INSERT INTO company_followers (user_id, company_id) VALUES
  ('user-2', (SELECT id FROM companies WHERE slug = 'gearvn')),
  ('user-3', (SELECT id FROM companies WHERE slug = 'gearvn')),
  ('user-4', (SELECT id FROM companies WHERE slug = 'gearvn')),
  ('user-4', (SELECT id FROM companies WHERE slug = 'hyperx'))
ON CONFLICT (user_id, company_id) DO NOTHING;

-- Bookmarks
INSERT INTO bookmarks (user_id, post_id) VALUES
  ('user-4', 'post-1'),
  ('user-4', 'post-3'),
  ('user-3', 'post-2'),
  ('user-2', 'post-video-1')
ON CONFLICT (user_id, post_id) DO NOTHING;

-- Also insert into user_saved_posts for compatibility
INSERT INTO user_saved_posts (user_id, post_id) VALUES
  ('user-4', 'post-1'),
  ('user-4', 'post-3'),
  ('user-3', 'post-2'),
  ('user-2', 'post-video-1')
ON CONFLICT (user_id, post_id) DO NOTHING;

-- Upvotes (sample - real upvotes count will be updated by triggers)
INSERT INTO user_upvotes (user_id, post_id) VALUES
  ('user-2', 'post-1'),
  ('user-3', 'post-1'),
  ('user-4', 'post-1'),
  ('user-4', 'post-2'),
  ('user-3', 'post-2'),
  ('user-2', 'post-3'),
  ('user-4', 'post-3'),
  ('user-4', 'post-video-1'),
  ('user-3', 'post-video-1'),
  ('user-2', 'post-video-2')
ON CONFLICT (user_id, post_id) DO NOTHING;

-- ============================================
-- 11. UPDATE STATISTICS
-- ============================================

-- Update category post counts
UPDATE categories c SET post_count = (
  SELECT COUNT(*) FROM posts p
  WHERE p.category = c.slug AND p.published = true
);

-- Update hashtag usage counts
UPDATE hashtags h SET usage_count = (
  SELECT COUNT(*) FROM posts p
  WHERE h.slug = ANY(p.tags)
);

-- Update user posts counts
UPDATE users u SET posts_count = (
  SELECT COUNT(*) FROM posts p
  WHERE p.creator_id = u.id AND p.published = true
);

-- ============================================
-- SEED DATA COMPLETE!
-- ============================================

-- Verify seed data
SELECT 'Users: ' || COUNT(*) as count FROM users
UNION ALL
SELECT 'Companies: ' || COUNT(*) FROM companies
UNION ALL
SELECT 'Categories: ' || COUNT(*) FROM categories
UNION ALL
SELECT 'Hashtags: ' || COUNT(*) FROM hashtags
UNION ALL
SELECT 'Sources: ' || COUNT(*) FROM sources
UNION ALL
SELECT 'Posts: ' || COUNT(*) FROM posts
UNION ALL
SELECT 'Comments: ' || COUNT(*) FROM comments
UNION ALL
SELECT 'User Followers: ' || COUNT(*) FROM user_followers
UNION ALL
SELECT 'Company Followers: ' || COUNT(*) FROM company_followers
UNION ALL
SELECT 'Bookmarks: ' || COUNT(*) FROM bookmarks
UNION ALL
SELECT 'Upvotes: ' || COUNT(*) FROM user_upvotes;

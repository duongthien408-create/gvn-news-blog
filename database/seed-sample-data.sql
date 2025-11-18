-- =====================================================
-- SAMPLE DATA - GearVN News Blog Database v2.0
-- =====================================================
-- This file contains realistic sample data for testing
-- Run AFTER creating schema with 02-new-complete-schema.sql
--
-- IMPORTANT: Clean data first if re-running:
-- See database/00-clean-data.sql or run:
--
-- TRUNCATE TABLE votes, comment_votes, bookmarks, follows,
--   squad_members, user_achievements, comments, post_products,
--   post_tags, post_creators, posts, products, tags, squad_posts,
--   squads, sources, creator_socials, creators, streaks,
--   user_levels, user_preferences, user_profiles, users, achievements,
--   brands, product_categories
-- RESTART IDENTITY CASCADE;
-- =====================================================

-- =====================================================
-- 1. USERS & PROFILES
-- =====================================================

-- Insert Users (10 users)
INSERT INTO users (id, email, password_hash, username, role, status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@gearvn.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'admin', 'admin', 'active', NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440002', 'techguru@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'techguru', 'user', 'active', NOW() - INTERVAL '5 months'),
('550e8400-e29b-41d4-a716-446655440003', 'gamerpro@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'gamerpro', 'user', 'active', NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440004', 'pcbuilder@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'pcbuilder', 'user', 'active', NOW() - INTERVAL '3 months'),
('550e8400-e29b-41d4-a716-446655440005', 'hwfan@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'hardwarefan', 'user', 'active', NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440006', 'reviewer@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'reviewmaster', 'user', 'active', NOW() - INTERVAL '1 month'),
('550e8400-e29b-41d4-a716-446655440007', 'newbie@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'newbie123', 'user', 'active', NOW() - INTERVAL '15 days'),
('550e8400-e29b-41d4-a716-446655440008', 'enthusiast@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'enthusiast', 'user', 'active', NOW() - INTERVAL '7 days'),
('550e8400-e29b-41d4-a716-446655440009', 'veteran@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'veteran', 'user', 'active', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440010', 'explorer@example.com', '$2a$10$rF8YvH0x7xKx9ZxKx9ZxKuO8ZxKx9ZxKx9ZxKx9ZxKx9ZxKx9ZxKx', 'explorer', 'user', 'active', NOW() - INTERVAL '1 day');

-- User Profiles (auto-created by trigger, but we populate details)
UPDATE user_profiles SET
  display_name = 'Admin GearVN',
  bio = 'Administrator của GearVN Blog - Nơi chia sẻ đam mê công nghệ',
  avatar_url = 'https://i.pravatar.cc/150?u=admin'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';

UPDATE user_profiles SET
  display_name = 'Tech Guru',
  bio = 'Đam mê công nghệ và gaming. Luôn cập nhật xu hướng mới nhất!',
  avatar_url = 'https://i.pravatar.cc/150?u=user1'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';

UPDATE user_profiles SET
  display_name = 'Gamer Pro',
  bio = 'Chuyên gia về gaming gear và esports',
  avatar_url = 'https://i.pravatar.cc/150?u=user2'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440003';

UPDATE user_profiles SET
  display_name = 'PC Builder',
  bio = 'Build PC là đam mê. Tư vấn cấu hình miễn phí!',
  avatar_url = 'https://i.pravatar.cc/150?u=user3'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440004';

UPDATE user_profiles SET
  display_name = 'Hardware Fan',
  bio = 'Yêu thích nghiên cứu về phần cứng máy tính',
  avatar_url = 'https://i.pravatar.cc/150?u=user4'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440005';

UPDATE user_profiles SET
  display_name = 'Review Master',
  bio = 'Reviewer chuyên nghiệp, đánh giá khách quan',
  avatar_url = 'https://i.pravatar.cc/150?u=user5'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440006';

UPDATE user_profiles SET
  display_name = 'Newbie',
  bio = 'Người mới bắt đầu tìm hiểu về PC gaming',
  avatar_url = 'https://i.pravatar.cc/150?u=user6'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440007';

UPDATE user_profiles SET
  display_name = 'Tech Enthusiast',
  bio = 'Người đam mê công nghệ, thích thử nghiệm',
  avatar_url = 'https://i.pravatar.cc/150?u=user7'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440008';

UPDATE user_profiles SET
  display_name = 'Veteran Gamer',
  bio = 'Lão làng trong làng game, 10 năm kinh nghiệm',
  avatar_url = 'https://i.pravatar.cc/150?u=user8'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440009';

UPDATE user_profiles SET
  display_name = 'Tech Explorer',
  bio = 'Khám phá công nghệ mới mỗi ngày',
  avatar_url = 'https://i.pravatar.cc/150?u=user9'
WHERE user_id = '550e8400-e29b-41d4-a716-446655440010';

-- Update User Preferences
UPDATE user_preferences SET theme = 'dark' WHERE user_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440010');
UPDATE user_preferences SET theme = 'light' WHERE user_id IN ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440009');

-- Update User Levels
UPDATE user_levels SET level = 10, total_points = 5000 WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE user_levels SET level = 8, total_points = 3200 WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE user_levels SET level = 7, total_points = 2500 WHERE user_id = '550e8400-e29b-41d4-a716-446655440003';
UPDATE user_levels SET level = 6, total_points = 1800 WHERE user_id = '550e8400-e29b-41d4-a716-446655440004';
UPDATE user_levels SET level = 5, total_points = 1200 WHERE user_id = '550e8400-e29b-41d4-a716-446655440005';
UPDATE user_levels SET level = 4, total_points = 800 WHERE user_id = '550e8400-e29b-41d4-a716-446655440006';
UPDATE user_levels SET level = 2, total_points = 300 WHERE user_id = '550e8400-e29b-41d4-a716-446655440007';
UPDATE user_levels SET level = 3, total_points = 500 WHERE user_id = '550e8400-e29b-41d4-a716-446655440008';
UPDATE user_levels SET level = 5, total_points = 1000 WHERE user_id = '550e8400-e29b-41d4-a716-446655440009';
UPDATE user_levels SET level = 1, total_points = 100 WHERE user_id = '550e8400-e29b-41d4-a716-446655440010';

-- Update Streaks
UPDATE streaks SET current_streak = 30, longest_streak = 45, last_activity_date = CURRENT_DATE WHERE user_id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE streaks SET current_streak = 15, longest_streak = 20, last_activity_date = CURRENT_DATE WHERE user_id = '550e8400-e29b-41d4-a716-446655440002';
UPDATE streaks SET current_streak = 10, longest_streak = 15, last_activity_date = CURRENT_DATE - 1 WHERE user_id = '550e8400-e29b-41d4-a716-446655440003';
UPDATE streaks SET current_streak = 7, longest_streak = 10, last_activity_date = CURRENT_DATE WHERE user_id = '550e8400-e29b-41d4-a716-446655440004';
UPDATE streaks SET current_streak = 5, longest_streak = 8, last_activity_date = CURRENT_DATE WHERE user_id = '550e8400-e29b-41d4-a716-446655440005';

-- =====================================================
-- 2. CREATORS
-- =====================================================

INSERT INTO creators (id, name, slug, bio, avatar_url, verified, website, total_followers, created_at) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Scrapshut', 'scrapshut', 'Kênh YouTube review công nghệ hàng đầu Việt Nam với hơn 150K subscribers', 'https://yt3.googleusercontent.com/ytc/scrapshut', true, 'https://www.youtube.com/@scrapshut', 150000, NOW() - INTERVAL '2 years'),
('650e8400-e29b-41d4-a716-446655440002', 'Linus Tech Tips', 'linus-tech-tips', 'Tech reviews, PC builds, and tech news from Linus Sebastian', 'https://yt3.googleusercontent.com/ytc/ltt', true, 'https://www.youtube.com/@LinusTechTips', 15000000, NOW() - INTERVAL '5 years'),
('650e8400-e29b-41d4-a716-446655440003', 'Gamers Nexus', 'gamers-nexus', 'In-depth hardware analysis, reviews, and PC building guides', 'https://yt3.googleusercontent.com/ytc/gn', true, 'https://www.gamersnexus.net', 2000000, NOW() - INTERVAL '4 years'),
('650e8400-e29b-41d4-a716-446655440004', 'JayzTwoCents', 'jayztwocents', 'PC building, custom water cooling, and tech reviews', 'https://yt3.googleusercontent.com/ytc/jay', true, 'https://www.youtube.com/@JayzTwoCents', 3500000, NOW() - INTERVAL '3 years'),
('650e8400-e29b-41d4-a716-446655440005', 'Hardware Unboxed', 'hardware-unboxed', 'Honest GPU and CPU reviews with detailed benchmarks', 'https://yt3.googleusercontent.com/ytc/hwu', true, 'https://www.youtube.com/@HardwareUnboxed', 1800000, NOW() - INTERVAL '3 years');

-- Creator Socials
INSERT INTO creator_socials (creator_id, platform, url, follower_count) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'youtube', 'https://www.youtube.com/@scrapshut', 150000),
('650e8400-e29b-41d4-a716-446655440001', 'facebook', 'https://www.facebook.com/scrapshut', 50000),
('650e8400-e29b-41d4-a716-446655440002', 'youtube', 'https://www.youtube.com/@LinusTechTips', 15000000),
('650e8400-e29b-41d4-a716-446655440002', 'twitter', 'https://twitter.com/linustech', 2000000),
('650e8400-e29b-41d4-a716-446655440003', 'youtube', 'https://www.youtube.com/@GamersNexus', 2000000),
('650e8400-e29b-41d4-a716-446655440003', 'twitter', 'https://twitter.com/gamersnexus', 150000),
('650e8400-e29b-41d4-a716-446655440004', 'youtube', 'https://www.youtube.com/@JayzTwoCents', 3500000),
('650e8400-e29b-41d4-a716-446655440004', 'twitter', 'https://twitter.com/jayztwocents', 400000),
('650e8400-e29b-41d4-a716-446655440005', 'youtube', 'https://www.youtube.com/@HardwareUnboxed', 1800000);

-- =====================================================
-- 3. TAGS
-- =====================================================

INSERT INTO tags (id, name, slug, description, icon_name, post_count) VALUES
('850e8400-e29b-41d4-a716-446655440001', 'Gaming', 'gaming', 'Gaming hardware and accessories', 'gamepad-2', 0),
('850e8400-e29b-41d4-a716-446655440002', 'PC Build', 'pc-build', 'PC building guides and tips', 'cpu', 0),
('850e8400-e29b-41d4-a716-446655440003', 'Laptop', 'laptop', 'Laptop reviews and comparisons', 'laptop', 0),
('850e8400-e29b-41d4-a716-446655440004', 'GPU', 'gpu', 'Graphics cards reviews', 'box', 0),
('850e8400-e29b-41d4-a716-446655440005', 'CPU', 'cpu', 'Processor reviews and benchmarks', 'cpu', 0),
('850e8400-e29b-41d4-a716-446655440006', 'Mouse', 'mouse', 'Gaming mouse reviews', 'mouse', 0),
('850e8400-e29b-41d4-a716-446655440007', 'Keyboard', 'keyboard', 'Mechanical keyboard reviews', 'keyboard', 0),
('850e8400-e29b-41d4-a716-446655440008', 'Monitor', 'monitor', 'Monitor reviews and guides', 'monitor', 0),
('850e8400-e29b-41d4-a716-446655440009', 'Storage', 'storage', 'SSD and HDD reviews', 'hard-drive', 0),
('850e8400-e29b-41d4-a716-446655440010', 'RAM', 'ram', 'Memory reviews', 'microchip', 0),
('850e8400-e29b-41d4-a716-446655440011', 'Cooling', 'cooling', 'PC cooling solutions', 'wind', 0),
('850e8400-e29b-41d4-a716-446655440012', 'Case', 'case', 'PC case reviews', 'box', 0),
('850e8400-e29b-41d4-a716-446655440013', 'PSU', 'psu', 'Power supply reviews', 'zap', 0),
('850e8400-e29b-41d4-a716-446655440014', 'Audio', 'audio', 'Headsets and speakers', 'headphones', 0),
('850e8400-e29b-41d4-a716-446655440015', 'Tutorial', 'tutorial', 'How-to guides', 'book-open', 0);

-- =====================================================
-- 4. PRODUCTS
-- =====================================================

-- Product Categories
INSERT INTO product_categories (id, name, slug) VALUES
('a50e8400-e29b-41d4-a716-446655440001', 'Laptop', 'laptop'),
('a50e8400-e29b-41d4-a716-446655440002', 'PC Components', 'pc-components'),
('a50e8400-e29b-41d4-a716-446655440003', 'Peripherals', 'peripherals'),
('a50e8400-e29b-41d4-a716-446655440004', 'Cooling', 'cooling'),
('a50e8400-e29b-41d4-a716-446655440005', 'Audio', 'audio');

-- Brands
INSERT INTO brands (id, name, slug, logo_url) VALUES
('c50e8400-e29b-41d4-a716-446655440001', 'ASUS', 'asus', 'https://gearvn.com/brands/asus.png'),
('c50e8400-e29b-41d4-a716-446655440002', 'Logitech', 'logitech', 'https://gearvn.com/brands/logitech.png'),
('c50e8400-e29b-41d4-a716-446655440003', 'Razer', 'razer', 'https://gearvn.com/brands/razer.png'),
('c50e8400-e29b-41d4-a716-446655440004', 'NVIDIA', 'nvidia', 'https://gearvn.com/brands/nvidia.png'),
('c50e8400-e29b-41d4-a716-446655440005', 'AMD', 'amd', 'https://gearvn.com/brands/amd.png'),
('c50e8400-e29b-41d4-a716-446655440006', 'Samsung', 'samsung', 'https://gearvn.com/brands/samsung.png'),
('c50e8400-e29b-41d4-a716-446655440007', 'Corsair', 'corsair', 'https://gearvn.com/brands/corsair.png'),
('c50e8400-e29b-41d4-a716-446655440008', 'LG', 'lg', 'https://gearvn.com/brands/lg.png'),
('c50e8400-e29b-41d4-a716-446655440009', 'NZXT', 'nzxt', 'https://gearvn.com/brands/nzxt.png'),
('c50e8400-e29b-41d4-a716-446655440010', 'HyperX', 'hyperx', 'https://gearvn.com/brands/hyperx.png');

-- Products
INSERT INTO products (id, category_id, brand_id, name, slug, price, image_url, gearvn_url, status) VALUES
('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', 'c50e8400-e29b-41d4-a716-446655440001', 'ASUS ROG Strix G15 Gaming Laptop', 'asus-rog-strix-g15', 35990000, 'https://product.hstatic.net/200000722513/product/gearvn-laptop-asus-rog-strix-g15_c0b8e4c8e9e34518bee79848d5c2a571.png', 'https://gearvn.com/products/laptop-asus-rog-strix-g15', 'available'),
('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440002', 'Logitech G Pro X Superlight', 'logitech-g-pro-x-superlight', 3290000, 'https://product.hstatic.net/200000722513/product/chuot-logitech-g-pro-x-superlight_88d64f4c85d84f5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/chuot-logitech-g-pro-x-superlight', 'available'),
('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440003', 'Razer BlackWidow V4 Pro', 'razer-blackwidow-v4-pro', 5990000, 'https://product.hstatic.net/200000722513/product/razer-blackwidow-v4-pro_5f4e8c5d8e7f4e5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/razer-blackwidow-v4-pro', 'available'),
('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440004', 'NVIDIA GeForce RTX 4090', 'nvidia-rtx-4090', 45990000, 'https://product.hstatic.net/200000722513/product/nvidia-rtx-4090_5f4e8c5d8e7f4e5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/nvidia-rtx-4090', 'available'),
('b50e8400-e29b-41d4-a716-446655440005', 'a50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440005', 'AMD Ryzen 9 7950X', 'amd-ryzen-9-7950x', 15990000, 'https://product.hstatic.net/200000722513/product/amd-ryzen-9-7950x_5f4e8c5d8e7f4e5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/amd-ryzen-9-7950x', 'available'),
('b50e8400-e29b-41d4-a716-446655440006', 'a50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440006', 'Samsung 990 PRO 2TB', 'samsung-990-pro-2tb', 5490000, 'https://product.hstatic.net/200000722513/product/samsung-990-pro_5f4e8c5d8e7f4e5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/samsung-990-pro-2tb', 'available'),
('b50e8400-e29b-41d4-a716-446655440007', 'a50e8400-e29b-41d4-a716-446655440002', 'c50e8400-e29b-41d4-a716-446655440007', 'Corsair Dominator Platinum RGB 32GB', 'corsair-dominator-32gb', 4290000, 'https://product.hstatic.net/200000722513/product/corsair-dominator_5f4e8c5d8e7f4e5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/corsair-dominator-32gb', 'available'),
('b50e8400-e29b-41d4-a716-446655440008', 'a50e8400-e29b-41d4-a716-446655440003', 'c50e8400-e29b-41d4-a716-446655440008', 'LG UltraGear 27GN950', 'lg-ultragear-27gn950', 12990000, 'https://product.hstatic.net/200000722513/product/lg-ultragear_5f4e8c5d8e7f4e5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/lg-ultragear-27gn950', 'available'),
('b50e8400-e29b-41d4-a716-446655440009', 'a50e8400-e29b-41d4-a716-446655440004', 'c50e8400-e29b-41d4-a716-446655440009', 'NZXT Kraken X73', 'nzxt-kraken-x73', 4990000, 'https://product.hstatic.net/200000722513/product/nzxt-kraken_5f4e8c5d8e7f4e5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/nzxt-kraken-x73', 'available'),
('b50e8400-e29b-41d4-a716-446655440010', 'a50e8400-e29b-41d4-a716-446655440005', 'c50e8400-e29b-41d4-a716-446655440010', 'HyperX Cloud Alpha Wireless', 'hyperx-cloud-alpha', 4590000, 'https://product.hstatic.net/200000722513/product/hyperx-cloud-alpha_5f4e8c5d8e7f4e5880ad8e8d5f5c8e2c.png', 'https://gearvn.com/products/hyperx-cloud-alpha-wireless', 'available');

-- =====================================================
-- 5. SOURCES
-- =====================================================

INSERT INTO sources (id, name, type, url, active) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'Scrapshut YouTube', 'youtube', 'https://www.youtube.com/@scrapshut', true),
('750e8400-e29b-41d4-a716-446655440002', 'Linus Tech Tips YouTube', 'youtube', 'https://www.youtube.com/@LinusTechTips', true),
('750e8400-e29b-41d4-a716-446655440003', 'Gamers Nexus YouTube', 'youtube', 'https://www.youtube.com/@GamersNexus', true),
('750e8400-e29b-41d4-a716-446655440004', 'Tom''s Hardware RSS', 'rss', 'https://www.tomshardware.com/feeds/all', true),
('750e8400-e29b-41d4-a716-446655440005', 'AnandTech RSS', 'rss', 'https://www.anandtech.com/rss/', true);

-- =====================================================
-- 6. POSTS
-- =====================================================

INSERT INTO posts (id, title, slug, description, content, thumbnail_url, type, status, featured, source_id, upvote_count, downvote_count, comment_count, view_count, created_at, published_at) VALUES
('p01', 'Đánh giá chi tiết ASUS ROG Strix G15: Laptop gaming đáng đồng tiền bát gạo', 'danh-gia-asus-rog-strix-g15', 'Review toàn diện về laptop gaming ASUS ROG Strix G15 với RTX 4060, AMD Ryzen 9 7940HS', '<h2>Thiết kế và xây dựng</h2><p>ASUS ROG Strix G15 có thiết kế gaming đặc trưng với các đường nét sắc cạnh và hệ thống đèn LED RGB Aura Sync bắt mắt.</p><h2>Hiệu năng</h2><p>Với chip AMD Ryzen 9 7940HS kết hợp cùng RTX 4060, laptop mang lại hiệu năng vượt trội trong mọi tác vụ.</p>', 'https://product.hstatic.net/200000722513/product/gearvn-laptop-asus-rog-strix-g15.png', 'review', 'published', true, '750e8400-e29b-41d4-a716-446655440001', 25, 2, 0, 1250, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

('p02', 'Top 5 chuột gaming tốt nhất 2024: Lựa chọn hoàn hảo cho game thủ', 'top-5-chuot-gaming-2024', 'Tổng hợp 5 con chuột gaming đáng mua nhất năm 2024 với nhiều phân khúc giá', '<h2>1. Logitech G Pro X Superlight</h2><p>Chuột gaming không dây nhẹ nhất thế giới chỉ 63g</p><h2>2. Razer DeathAdder V3 Pro</h2><p>Thiết kế ergonomic hoàn hảo cho cầm nắm</p>', 'https://product.hstatic.net/200000722513/product/chuot-gaming-top5.png', 'video', 'published', true, '750e8400-e29b-41d4-a716-446655440001', 42, 1, 0, 3200, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),

('p03', 'Hướng dẫn build PC gaming 30 triệu: Cấu hình tối ưu nhất', 'build-pc-gaming-30-trieu', 'Hướng dẫn chi tiết cách build PC gaming với ngân sách 30 triệu VNĐ', '<h2>Linh kiện gợi ý</h2><ul><li>CPU: AMD Ryzen 5 7600X - 7tr</li><li>GPU: RTX 4060 - 10tr</li><li>RAM: 16GB DDR5 - 2tr5</li><li>SSD: 512GB NVMe - 1tr5</li><li>PSU: 650W - 2tr</li></ul>', 'https://product.hstatic.net/200000722513/product/pc-build-30m.png', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440001', 38, 3, 0, 2800, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

('p04', 'RTX 4090 vs RTX 4080: So sánh hiệu năng chi tiết', 'rtx-4090-vs-rtx-4080', 'So sánh chi tiết hiệu năng gaming và rendering giữa RTX 4090 và RTX 4080', '<h2>Benchmark Gaming 4K</h2><p>RTX 4090 nhanh hơn 25-30% so với RTX 4080 ở độ phân giải 4K với max settings.</p><h2>Kết luận</h2><p>RTX 4080 đã quá đủ cho 4K gaming, RTX 4090 dành cho enthusiast.</p>', 'https://product.hstatic.net/200000722513/product/rtx-comparison.png', 'review', 'published', true, '750e8400-e29b-41d4-a716-446655440002', 56, 4, 0, 4500, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),

('p05', 'AMD Ryzen 9 7950X: Bá chủ CPU năm 2024', 'amd-ryzen-9-7950x-review', 'Đánh giá chi tiết AMD Ryzen 9 7950X - CPU 16 nhân 32 luồng mạnh mẽ', '<h2>Hiệu năng đa nhiệm</h2><p>Với 16 nhân 32 luồng, 7950X là lựa chọn hoàn hảo cho content creator và streamer.</p><h2>Gaming Performance</h2><p>Hiệu năng gaming ngang bằng Intel 13900K.</p>', 'https://product.hstatic.net/200000722513/product/amd-ryzen-9-7950x.png', 'review', 'published', true, '750e8400-e29b-41d4-a716-446655440003', 48, 2, 0, 3800, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),

('p06', 'Bàn phím cơ cho người mới: Hướng dẫn chọn mua từ A-Z', 'ban-phim-co-cho-nguoi-moi', 'Tất cả những gì bạn cần biết về bàn phím cơ trước khi mua', '<h2>Các loại switch phổ biến</h2><ul><li>Cherry MX Red: Linear, nhẹ, phù hợp gaming</li><li>Cherry MX Brown: Tactile, cân bằng</li><li>Cherry MX Blue: Clicky, gõ văn bản</li></ul>', 'https://product.hstatic.net/200000722513/product/mechanical-keyboard.png', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440001', 31, 1, 0, 1900, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

('p07', 'Màn hình gaming 4K 144Hz: Có đáng để đầu tư?', 'man-hinh-4k-144hz-review', 'Phân tích chi tiết về màn hình 4K 144Hz và lời khuyên cho game thủ', '<h2>Ưu điểm</h2><p>Độ phân giải cao, hình ảnh sắc nét đến từng chi tiết.</p><h2>Nhược điểm</h2><p>Yêu cầu GPU mạnh, giá thành cao.</p><h2>Kết luận</h2><p>Chỉ nên đầu tư nếu có GPU RTX 4080 trở lên.</p>', 'https://product.hstatic.net/200000722513/product/4k-monitor.png', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440002', 29, 5, 0, 2100, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

('p08', 'SSD NVMe Gen 4 vs Gen 3: Có khác biệt trong gaming?', 'ssd-gen4-vs-gen3', 'So sánh tốc độ và hiệu năng gaming giữa SSD Gen 4 và Gen 3', '<h2>Tốc độ đọc/ghi</h2><p>Gen 4 nhanh gấp đôi Gen 3 về mặt lý thuyết (7000MB/s vs 3500MB/s)</p><h2>Gaming Performance</h2><p>Trong gaming thực tế, khác biệt không đáng kể (1-2 giây loading).</p>', 'https://product.hstatic.net/200000722513/product/ssd-comparison.png', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440003', 22, 2, 0, 1600, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

('p09', 'Tản nhiệt nước vs Tản nhiệt khí: Nên chọn loại nào?', 'tan-nhiet-nuoc-vs-khi', 'Phân tích ưu nhược điểm giữa tản nhiệt nước AIO và tản nhiệt khí', '<h2>Tản nhiệt khí</h2><p>Ưu điểm: Bền, rẻ, không rò rỉ<br>Nhược điểm: To, nặng, ồn</p><h2>Tản nhiệt nước AIO</h2><p>Ưu điểm: Gọn, đẹp, hiệu quả<br>Nhược điểm: Đắt, nguy cơ rò rỉ</p>', 'https://product.hstatic.net/200000722513/product/cooling-comparison.png', 'article', 'published', false, '750e8400-e29b-41d4-a716-446655440004', 35, 3, 0, 2400, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),

('p10', 'Tai nghe gaming không dây tốt nhất 2024', 'tai-nghe-gaming-khong-day-2024', 'Top tai nghe gaming wireless đáng mua với chất lượng âm thanh tuyệt vời', '<h2>1. HyperX Cloud Alpha Wireless</h2><p>Pin 300 giờ, âm thanh DTS Headphone:X</p><h2>2. SteelSeries Arctis Nova Pro Wireless</h2><p>Hỗ trợ đa nền tảng, chất âm chuẩn</p>', 'https://product.hstatic.net/200000722513/product/wireless-headset.png', 'video', 'published', true, '750e8400-e29b-41d4-a716-446655440001', 41, 2, 0, 3100, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days');

-- =====================================================
-- 7. POST RELATIONSHIPS
-- =====================================================

-- Post-Creators
INSERT INTO post_creators (post_id, creator_id) VALUES
('p01', '650e8400-e29b-41d4-a716-446655440001'),
('p02', '650e8400-e29b-41d4-a716-446655440001'),
('p03', '650e8400-e29b-41d4-a716-446655440001'),
('p04', '650e8400-e29b-41d4-a716-446655440002'),
('p05', '650e8400-e29b-41d4-a716-446655440003'),
('p06', '650e8400-e29b-41d4-a716-446655440001'),
('p07', '650e8400-e29b-41d4-a716-446655440002'),
('p08', '650e8400-e29b-41d4-a716-446655440003'),
('p09', '650e8400-e29b-41d4-a716-446655440004'),
('p10', '650e8400-e29b-41d4-a716-446655440001');

-- Post-Tags
INSERT INTO post_tags (post_id, tag_id) VALUES
('p01', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming
('p01', '850e8400-e29b-41d4-a716-446655440003'), -- Laptop
('p02', '850e8400-e29b-41d4-a716-446655440001'), -- Gaming
('p02', '850e8400-e29b-41d4-a716-446655440006'), -- Mouse
('p03', '850e8400-e29b-41d4-a716-446655440002'), -- PC Build
('p03', '850e8400-e29b-41d4-a716-446655440015'), -- Tutorial
('p04', '850e8400-e29b-41d4-a716-446655440004'), -- GPU
('p05', '850e8400-e29b-41d4-a716-446655440005'), -- CPU
('p06', '850e8400-e29b-41d4-a716-446655440007'), -- Keyboard
('p06', '850e8400-e29b-41d4-a716-446655440015'), -- Tutorial
('p07', '850e8400-e29b-41d4-a716-446655440008'), -- Monitor
('p08', '850e8400-e29b-41d4-a716-446655440009'), -- Storage
('p09', '850e8400-e29b-41d4-a716-446655440011'), -- Cooling
('p10', '850e8400-e29b-41d4-a716-446655440014'); -- Audio

-- Post-Products
INSERT INTO post_products (post_id, product_id) VALUES
('p01', 'b50e8400-e29b-41d4-a716-446655440001'),
('p02', 'b50e8400-e29b-41d4-a716-446655440002'),
('p04', 'b50e8400-e29b-41d4-a716-446655440004'),
('p05', 'b50e8400-e29b-41d4-a716-446655440005'),
('p06', 'b50e8400-e29b-41d4-a716-446655440003'),
('p07', 'b50e8400-e29b-41d4-a716-446655440008'),
('p08', 'b50e8400-e29b-41d4-a716-446655440006'),
('p09', 'b50e8400-e29b-41d4-a716-446655440009'),
('p10', 'b50e8400-e29b-41d4-a716-446655440010');

-- Update tag post_count
UPDATE tags SET post_count = (
    SELECT COUNT(*) FROM post_tags WHERE post_tags.tag_id = tags.id
);

-- =====================================================
-- 8. COMMENTS
-- =====================================================

INSERT INTO comments (id, post_id, user_id, content, upvote_count, created_at) VALUES
-- Post 1 comments
('c01', 'p01', '550e8400-e29b-41d4-a716-446655440002', 'Laptop này mình đang dùng, hiệu năng rất tốt cho gaming và render!', 5, NOW() - INTERVAL '4 days'),
('c02', 'p01', '550e8400-e29b-41d4-a716-446655440003', 'Pin có trụ được bao lâu khi chơi game không bạn?', 2, NOW() - INTERVAL '4 days'),
('c03', 'p01', '550e8400-e29b-41d4-a716-446655440004', 'Nhiệt độ khi chơi game nặng thế nào?', 3, NOW() - INTERVAL '3 days'),

-- Post 2 comments
('c04', 'p02', '550e8400-e29b-41d4-a716-446655440005', 'G Pro Superlight thật sự xứng đáng top 1!', 8, NOW() - INTERVAL '3 days'),
('c05', 'p02', '550e8400-e29b-41d4-a716-446655440006', 'Mình thích Razer Viper hơn, nhẹ hơn một chút', 4, NOW() - INTERVAL '3 days'),

-- Post 3 comments
('c06', 'p03', '550e8400-e29b-41d4-a716-446655440007', 'Build này có chạy được Cyberpunk 2077 max setting không?', 1, NOW() - INTERVAL '2 days'),
('c07', 'p03', '550e8400-e29b-41d4-a716-446655440008', 'Cảm ơn bài hướng dẫn chi tiết!', 6, NOW() - INTERVAL '2 days'),

-- Post 4 comments
('c08', 'p04', '550e8400-e29b-41d4-a716-446655440009', 'RTX 4090 quá đắt, 4080 vẫn ngon cho gaming 4K', 12, NOW() - INTERVAL '6 days'),
('c09', 'p04', '550e8400-e29b-41d4-a716-446655440010', 'Benchmark rất chi tiết, thanks!', 7, NOW() - INTERVAL '6 days'),

-- Post 5 comments
('c10', 'p05', '550e8400-e29b-41d4-a716-446655440002', '7950X vs Intel 13900K thì nên chọn cái nào?', 9, NOW() - INTERVAL '5 days');

-- Nested replies
INSERT INTO comments (id, post_id, user_id, parent_id, content, upvote_count, created_at) VALUES
('c11', 'p01', '550e8400-e29b-41d4-a716-446655440003', 'c02', 'Khoảng 3-4 giờ thôi bạn, chơi game nặng thì nên cắm sạc', 4, NOW() - INTERVAL '4 days'),
('c12', 'p01', '550e8400-e29b-41d4-a716-446655440002', 'c03', 'Nhiệt độ khoảng 75-80°C, khá mát cho laptop gaming', 3, NOW() - INTERVAL '3 days'),
('c13', 'p02', '550e8400-e29b-41d4-a716-446655440007', 'c05', 'Razer Viper cũng tốt nhưng pin không bằng G Pro', 2, NOW() - INTERVAL '3 days'),
('c14', 'p03', '550e8400-e29b-41d4-a716-446655440004', 'c06', 'Chạy high được, ultra thì hơi lag một chút', 2, NOW() - INTERVAL '2 days'),
('c15', 'p04', '550e8400-e29b-41d4-a716-446655440003', 'c08', 'Đúng rồi, 4080 đã quá đủ cho 4K gaming', 5, NOW() - INTERVAL '6 days'),
('c16', 'p05', '550e8400-e29b-41d4-a716-446655440005', 'c10', 'Nếu chơi game thì Intel, còn render/stream thì AMD', 8, NOW() - INTERVAL '5 days');

-- Update comment counts
UPDATE posts SET comment_count = (
    SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id
);

-- =====================================================
-- 9. USER INTERACTIONS
-- =====================================================

-- Votes
INSERT INTO votes (user_id, post_id, vote_type) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'p01', 1),
('550e8400-e29b-41d4-a716-446655440002', 'p02', 1),
('550e8400-e29b-41d4-a716-446655440002', 'p04', 1),
('550e8400-e29b-41d4-a716-446655440003', 'p02', 1),
('550e8400-e29b-41d4-a716-446655440003', 'p05', 1),
('550e8400-e29b-41d4-a716-446655440004', 'p03', 1),
('550e8400-e29b-41d4-a716-446655440004', 'p04', 1),
('550e8400-e29b-41d4-a716-446655440005', 'p01', 1),
('550e8400-e29b-41d4-a716-446655440005', 'p10', 1);

-- Comment Votes
INSERT INTO comment_votes (user_id, comment_id, vote_type) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'c01', 1),
('550e8400-e29b-41d4-a716-446655440003', 'c04', 1),
('550e8400-e29b-41d4-a716-446655440004', 'c08', 1),
('550e8400-e29b-41d4-a716-446655440005', 'c10', 1);

-- Bookmarks
INSERT INTO bookmarks (user_id, post_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'p03'),
('550e8400-e29b-41d4-a716-446655440002', 'p04'),
('550e8400-e29b-41d4-a716-446655440003', 'p01'),
('550e8400-e29b-41d4-a716-446655440003', 'p05'),
('550e8400-e29b-41d4-a716-446655440004', 'p03');

-- Follows (following creators)
INSERT INTO follows (follower_id, creator_id) VALUES
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440001');

-- =====================================================
-- 10. SQUADS (Communities)
-- =====================================================

INSERT INTO squads (id, name, slug, description, avatar_url, type, creator_id, member_count, post_count, created_at) VALUES
('sq01', 'PC Builders Vietnam', 'pc-builders-vn', 'Cộng đồng những người đam mê build PC tại Việt Nam', 'https://i.pravatar.cc/150?u=squad1', 'public', '550e8400-e29b-41d4-a716-446655440002', 3, 0, NOW() - INTERVAL '3 months'),
('sq02', 'Gaming Gear Reviews', 'gaming-gear-reviews', 'Review gaming gear từ cộng đồng, chia sẻ kinh nghiệm', 'https://i.pravatar.cc/150?u=squad2', 'public', '550e8400-e29b-41d4-a716-446655440003', 3, 0, NOW() - INTERVAL '4 months'),
('sq03', 'Laptop Gaming Club', 'laptop-gaming-club', 'Câu lạc bộ dành cho người dùng laptop gaming', 'https://i.pravatar.cc/150?u=squad3', 'public', '550e8400-e29b-41d4-a716-446655440004', 2, 0, NOW() - INTERVAL '2 months'),
('sq04', 'Overclockers VN', 'overclockers-vn', 'Cộng đồng ép xung PC tại Việt Nam', 'https://i.pravatar.cc/150?u=squad4', 'public', '550e8400-e29b-41d4-a716-446655440005', 2, 0, NOW() - INTERVAL '1 month'),
('sq05', 'Budget PC Builds', 'budget-pc-builds', 'Build PC giá rẻ hiệu năng cao', 'https://i.pravatar.cc/150?u=squad5', 'public', '550e8400-e29b-41d4-a716-446655440006', 3, 0, NOW() - INTERVAL '5 months');

-- Squad Members
INSERT INTO squad_members (squad_id, user_id, role) VALUES
-- PC Builders VN
('sq01', '550e8400-e29b-41d4-a716-446655440002', 'admin'),
('sq01', '550e8400-e29b-41d4-a716-446655440003', 'member'),
('sq01', '550e8400-e29b-41d4-a716-446655440004', 'member'),

-- Gaming Gear Reviews
('sq02', '550e8400-e29b-41d4-a716-446655440003', 'admin'),
('sq02', '550e8400-e29b-41d4-a716-446655440005', 'moderator'),
('sq02', '550e8400-e29b-41d4-a716-446655440006', 'member'),

-- Laptop Gaming Club
('sq03', '550e8400-e29b-41d4-a716-446655440004', 'admin'),
('sq03', '550e8400-e29b-41d4-a716-446655440007', 'member'),

-- Overclockers VN
('sq04', '550e8400-e29b-41d4-a716-446655440005', 'admin'),
('sq04', '550e8400-e29b-41d4-a716-446655440008', 'member'),

-- Budget PC Builds
('sq05', '550e8400-e29b-41d4-a716-446655440006', 'admin'),
('sq05', '550e8400-e29b-41d4-a716-446655440009', 'member'),
('sq05', '550e8400-e29b-41d4-a716-446655440010', 'member');

-- =====================================================
-- 11. GAMIFICATION
-- =====================================================

-- Achievements
INSERT INTO achievements (id, name, description, icon_name, points_reward, type) VALUES
('ach01', 'First Post', 'Tạo bài viết đầu tiên', 'file-plus', 100, 'contribution'),
('ach02', '10 Posts', 'Tạo 10 bài viết', 'files', 500, 'contribution'),
('ach03', 'First Comment', 'Comment đầu tiên', 'message-circle', 50, 'engagement'),
('ach04', 'Helpful', 'Nhận 50 upvotes', 'thumbs-up', 300, 'engagement'),
('ach05', 'Popular', 'Nhận 100 upvotes', 'trending-up', 800, 'engagement'),
('ach06', '7 Day Streak', 'Hoạt động 7 ngày liên tiếp', 'flame', 200, 'streak'),
('ach07', '30 Day Streak', 'Hoạt động 30 ngày liên tiếp', 'zap', 1000, 'streak');

-- User Achievements
INSERT INTO user_achievements (user_id, achievement_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ach01'),
('550e8400-e29b-41d4-a716-446655440001', 'ach07'),
('550e8400-e29b-41d4-a716-446655440002', 'ach01'),
('550e8400-e29b-41d4-a716-446655440002', 'ach03'),
('550e8400-e29b-41d4-a716-446655440002', 'ach06'),
('550e8400-e29b-41d4-a716-446655440003', 'ach01'),
('550e8400-e29b-41d4-a716-446655440003', 'ach04');

-- =====================================================
-- ✅ SAMPLE DATA COMPLETE
-- =====================================================
-- Summary:
-- ✅ 10 Users with full profiles
-- ✅ 5 Creators (YouTubers)
-- ✅ 15 Tags
-- ✅ 10 Products (with categories & brands)
-- ✅ 5 Sources
-- ✅ 10 Posts (reviews, videos, articles)
-- ✅ 16 Comments (with nested replies)
-- ✅ 5 Squads with 13 members
-- ✅ Votes, Bookmarks, Follows
-- ✅ 7 Achievements
-- ✅ All relationships properly set up
-- =====================================================
